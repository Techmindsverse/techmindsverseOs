import { Injectable, BadRequestException } from '@nestjs/common';
import { SupabaseService } from '../supabase/supabase.service';

@Injectable()
export class BuildLogsService {
  constructor(private readonly supabaseService: SupabaseService) {}

  async log(
    build_id: string,
    action: string,
    message?: string,
    metadata?: any,
    created_by?: string,
  ) {
    const { error } = await this.supabaseService.db
      .from('build_logs')
      .insert({
        build_id,
        action,
        message,
        metadata,
        created_by,
      });

    if (error) {
      throw new BadRequestException('Failed to log build activity');
    }
  }

  async findByBuildId(build_id: string) {
    const { data, error } = await this.supabaseService.db
      .from('build_logs')
      .select('*')
      .eq('build_id', build_id)
      .order('created_at', { ascending: true });

    if (error) {
      throw new BadRequestException('Failed to fetch logs');
    }

    return data;
  }
}