import { Injectable } from '@nestjs/common';
import { SupabaseService } from '../supabase/supabase.service';
import { CreateBuildDto } from './dto/create-build.dto';

@Injectable()
export class BuildService {
  constructor(private supabaseService: SupabaseService) {}

  async submit(dto: CreateBuildDto) {
    const { error } = await this.supabaseService.db
      .from('builds').insert({ ...dto, status: 'pending' });
    if (error) throw new Error('Failed to submit build request');
    return { message: 'Build request submitted successfully' };
  }
}