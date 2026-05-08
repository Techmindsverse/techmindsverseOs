import { Injectable, BadRequestException } from '@nestjs/common';
import { SupabaseService } from '../supabase/supabase.service';

@Injectable()
export class BuildLogsService {
  constructor(private readonly supabaseService: SupabaseService) {}

  async log(data: {
    build_id: string;
    action: string;
    message?: string;
    metadata?: any;
    created_by?: string;
  }) {
    const { data: inserted, error } = await this.supabaseService.clientRef
      .from('build_logs')
      .insert({
        build_id: data.build_id,
        action: data.action,
        message: data.message,
        metadata: data.metadata,
        created_by: data.created_by,
      })
      .select()
      .single();

    if (error) {
      throw new BadRequestException(error.message);
    }

    return inserted;
  }

  async findByBuildId(build_id: string) {
    const { data, error } = await this.supabaseService.clientRef
      .from('build_logs')
      .select('*')
      .eq('build_id', build_id)
      .order('created_at', { ascending: true });

    if (error) {
      throw new BadRequestException(error.message);
    }

    return data;
  }
}