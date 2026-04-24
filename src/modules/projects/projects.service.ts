import { Injectable, NotFoundException } from '@nestjs/common';
import { SupabaseService } from '../supabase/supabase.service';
import { CreateProjectDto } from './dto/create-project.dto';

@Injectable()
export class ProjectsService {
  constructor(private supabaseService: SupabaseService) {}

  async submit(userId: string, dto: CreateProjectDto) {
    const { data: student } = await this.supabaseService.db
      .from('students').select('id').eq('user_id', userId).single();
    if (!student) throw new NotFoundException('Student profile not found');

    const { data, error } = await this.supabaseService.db
      .from('projects')
      .insert({ student_id: student.id, ...dto, status: 'submitted' })
      .select().single();
    if (error) throw new NotFoundException('Failed to submit project');
    return data;
  }
}