import {
  Injectable,
  BadRequestException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { SupabaseService } from '../supabase/supabase.service';
import { CreateBuildDto } from './dto/create-build.dto';
import { MailService } from '../mail/mail.service';
import { BuildStatus } from './types/build-status.type';
import { BuildLogsService } from './build-logs.service';
import { BuildGateway } from './gateway/build.gateway';

@Injectable()
export class BuildService {
  private readonly logger = new Logger(BuildService.name);

  constructor(
    private readonly supabaseService: SupabaseService,
    private readonly mailService: MailService,
    private readonly buildLogsService: BuildLogsService,
    private readonly buildGateway: BuildGateway,
  ) {}

  // ==========================
  // CREATE BUILD (SAFE + STRUCTURED)
  // ==========================
  async submit(dto: CreateBuildDto, clientIp?: string) {
    try {
      // 🧠 normalize budget (extract numbers if possible)
      const normalizedBudget = this.normalizeBudget(dto.budget);

      // 🚀 insert build
      const { data, error } = await this.supabaseService.clientRef
        .from('builds')
        .insert({
  ...dto,
  budget: normalizedBudget?.raw ?? null,
  budget_min: normalizedBudget?.min ?? null,
  budget_max: normalizedBudget?.max ?? null,
  status: 'submitted',
  priority: 'normal',
  payment_status: 'unpaid',
  progress: 0,
})
        .select()
        .single();

      if (error || !data) {
        throw new BadRequestException('Failed to submit build request');
      }

      // 🔥 async email (do NOT block request)
      this.safeEmailNotify(dto).catch((err) =>
        this.logger.error('Email failed', err),
      );

      // 🪵 safe logging (never break request)
      await this.safeLog(data.id, 'CREATED', 'Build submitted', {
        ip: clientIp,
      });

      return {
        message: 'Build request submitted successfully',
        build: data,
      };
    } catch (error) {
      this.logger.error('BUILD SUBMIT ERROR:', error);

      throw new BadRequestException(
        (error instanceof Error ? error.message : String(error)) || 'Failed to submit build request',
      );
    }
  }

  // ==========================
  // STATUS UPDATE (with timeline support)
  // ==========================
  async updateStatus(id: string, status: BuildStatus, admin_note?: string) {
    const { data, error } = await this.supabaseService.clientRef
      .from('builds')
      .update({
        status,
        admin_note,
      })
      .eq('id', id)
      .select()
      .single();

    if (error || !data) {
      throw new BadRequestException('Failed to update build status');
    }

    await this.safeLog(id, 'STATUS_UPDATED', `Status → ${status}`, {
      status,
      admin_note,
    });

    return {
      message: 'Build updated successfully',
      build: data,
    };
  }

  // ==========================
  // ASSIGN BUILDER
  // ==========================
  async assignBuilder(id: string, assigned_to: string) {
    const { data, error } = await this.supabaseService.clientRef
      .from('builds')
      .update({
        assigned_to,
        status: 'accepted',
      })
      .eq('id', id)
      .select()
      .single();

    if (error || !data) {
      throw new BadRequestException('Failed to assign builder');
    }

    await this.safeLog(id, 'ASSIGNED', 'Builder assigned', {
      assigned_to,
    });

    return {
      message: 'Builder assigned successfully',
      build: data,
    };
  }

  // ==========================
  // UPDATE PROGRESS
  // ==========================
  async updateProgress(id: string, progress: number) {
    if (progress < 0 || progress > 100) {
      throw new BadRequestException('Progress must be 0–100');
    }

    const { data, error } = await this.supabaseService.clientRef
      .from('builds')
      .update({ progress })
      .eq('id', id)
      .select()
      .single();

    if (error || !data) {
      throw new BadRequestException('Failed to update progress');
    }

    await this.safeLog(id, 'PROGRESS', `Progress → ${progress}%`, {
      progress,
    });

    return {
      message: 'Progress updated',
      build: data,
    };
  }
   
  async getMyBuilds(email: string) {
  const { data, error } = await this.supabaseService.clientRef
    .from('builds')
    .select('*')
    .eq('email', email)
    .order('created_at', { ascending: false });

  if (error) throw new NotFoundException('Failed to fetch builds');
  return data;
}

  // ==========================
  // FIND ALL
  // ==========================
  async findAll() {
    const { data, error } = await this.supabaseService.clientRef
      .from('builds')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      throw new BadRequestException('Failed to fetch builds');
    }

    return data;
  }

  // ==========================
  // ADMIN ANALYTICS (NEW 🔥)
  // ==========================
  async getDailyAnalytics(date?: string) {
    const targetDate = date || new Date().toISOString().split('T')[0];

    const { data, error } = await this.supabaseService.clientRef
      .from('builds')
      .select('*')
      .gte('created_at', `${targetDate}T00:00:00`)
      .lte('created_at', `${targetDate}T23:59:59`);

    if (error) {
      throw new BadRequestException('Failed to fetch analytics');
    }

    return {
      date: targetDate,
      total: data.length,
      pending: data.filter((b) => b.status === 'pending').length,
      in_progress: data.filter((b) => b.status === 'in_progress').length,
      completed: data.filter((b) => b.status === 'completed').length,
    };
  }

  // ==========================
  // SAFE LOGGING (FIXES YOUR BUG)
  // ==========================
  private async safeLog(
    build_id: string,
    action: string,
    message?: string,
    metadata?: any,
    user?: string,
  ) {
    try {
      await this.buildLogsService.log({
  build_id: build_id,
  action,
  message,
  metadata,
  created_by: user,
});
    } catch (err) {
      this.logger.warn('Build log failed (non-blocking)');
    }
  }

  // ==========================
  // EMAIL SAFE QUEUE (SIMPLIFIED)
  // ==========================
  private async safeEmailNotify(dto: CreateBuildDto) {
    try {
      await this.mailService.sendBuildRequestEmail({
  name: dto.name,
  email: dto.email,
  category: dto.category,
  description: dto.description,
  budget: dto.budget,
  mode: dto.mode,
});
    } catch (err) {
      this.logger.error('Email send failed', err);
    }
  }

  // ==========================
  // BUDGET NORMALIZER (NEW 🔥)
  // ==========================
  private normalizeBudget(budget?: string) {
    if (!budget) return null;

    const numbers = budget.match(/\d+/g);

    if (!numbers) {
      return { raw: budget, min: null, max: null };
    }

    return {
      raw: budget,
      min: Number(numbers[0]),
      max: numbers[1] ? Number(numbers[1]) : Number(numbers[0]),
    };
  }
}