import { Injectable, BadRequestException } from '@nestjs/common';
import { SupabaseService } from '../supabase/supabase.service';
import { CreateBuildDto } from './dto/create-build.dto';
import { MailService } from '../mail/mail.service';
import { BuildStatus } from './types/build-status.type';
import { BuildLogsService } from './build-logs.service';

@Injectable()
export class BuildService {
  constructor(
    private readonly supabaseService: SupabaseService,
    private readonly mailService: MailService,
    private readonly buildLogsService: BuildLogsService,
  ) {}

  // ==========================
  // CREATE BUILD
  // ==========================
  async submit(dto: CreateBuildDto) {
    const { data, error } = await this.supabaseService.db
      .from('builds')
      .insert({
        ...dto,
        status: 'pending',
        priority: 'normal',
        payment_status: 'unpaid',
        progress: 0,
      })
      .select()
      .single();

    if (error || !data) {
      throw new BadRequestException('Failed to submit build request');
    }

    // notify admin
    await this.mailService.sendContactEmail({
      name: dto.name,
      email: dto.email,
      subject: 'New Build Request',
      message: dto.description,
    });

    // log
    await this.buildLogsService.log(
      data.id,
      'CREATED',
      'Build request submitted',
      { status: 'pending' },
    );

    return {
      message: 'Build request submitted successfully',
      build: data,
    };
  }

  // ==========================
  // UPDATE STATUS
  // ==========================
  async updateStatus(
    id: string,
    status: BuildStatus,
    admin_note?: string,
  ) {
    const { data, error } = await this.supabaseService.db
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

    // notify client
    await this.mailService.sendContactEmail({
      name: data.name,
      email: data.email,
      subject: `Build Status Updated: ${status}`,
      message: admin_note || 'Your build status has been updated.',
    });

    // log
    await this.buildLogsService.log(
      id,
      'STATUS_UPDATED',
      `Status changed to ${status}`,
      { status, admin_note },
    );

    return {
      message: 'Build updated successfully',
      build: data,
    };
  }

  // ==========================
  // ASSIGN BUILDER
  // ==========================
  async assignBuilder(id: string, assigned_to: string) {
    const { data, error } = await this.supabaseService.db
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

    await this.buildLogsService.log(
      id,
      'BUILDER_ASSIGNED',
      `Builder assigned`,
      { assigned_to },
    );

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
      throw new BadRequestException('Progress must be between 0 and 100');
    }

    const { data, error } = await this.supabaseService.db
      .from('builds')
      .update({ progress })
      .eq('id', id)
      .select()
      .single();

    if (error || !data) {
      throw new BadRequestException('Failed to update progress');
    }

    await this.buildLogsService.log(
      id,
      'PROGRESS_UPDATED',
      `Progress updated to ${progress}%`,
      { progress },
    );

    return {
      message: 'Progress updated',
      build: data,
    };
  }

  // ==========================
  // GET ALL BUILDS
  // ==========================
  async findAll() {
    const { data, error } = await this.supabaseService.db
      .from('builds')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      throw new BadRequestException('Failed to fetch builds');
    }

    return data;
  }

  // ==========================
  // GET SINGLE BUILD
  // ==========================
  async findOne(id: string) {
    const { data, error } = await this.supabaseService.db
      .from('builds')
      .select('*')
      .eq('id', id)
      .single();

    if (error || !data) {
      throw new BadRequestException('Build not found');
    }

    return data;
  }

  // ==========================
  // METRICS
  // ==========================
  async getMetrics() {
    const { data, error } = await this.supabaseService.db
      .from('builds')
      .select('*');

    if (error) {
      throw new BadRequestException('Failed to fetch metrics');
    }

    const safeNumber = (value: any) => Number(value) || 0;

    return {
      total_builds: data.length,
      pending: data.filter((b) => b.status === 'pending').length,
      reviewed: data.filter((b) => b.status === 'reviewed').length,
      accepted: data.filter((b) => b.status === 'accepted').length,
      in_progress: data.filter((b) => b.status === 'in_progress').length,
      completed: data.filter((b) => b.status === 'completed').length,
      rejected: data.filter((b) => b.status === 'rejected').length,
      unpaid: data.filter((b) => b.payment_status === 'unpaid').length,

      // ✅ FIXED (handles string/null safely)
      revenue_estimate: data
        .filter((b) => b.payment_status === 'paid')
        .reduce((acc, b) => acc + safeNumber(b.budget), 0),
    };
  }

  // ==========================
  // PIPELINE
  // ==========================
  async getPipeline() {
    const { data, error } = await this.supabaseService.db
      .from('builds')
      .select('*');

    if (error) {
      throw new BadRequestException('Failed to fetch pipeline');
    }

    const group = (status: string) =>
      data.filter((b) => b.status === status);

    return {
      pending: group('pending'),
      reviewed: group('reviewed'),
      accepted: group('accepted'),
      in_progress: group('in_progress'),
      completed: group('completed'),
      rejected: group('rejected'),
    };
  }
}