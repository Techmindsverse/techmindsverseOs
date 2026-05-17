import { Injectable, NotFoundException } from '@nestjs/common';
import { SupabaseService } from '../supabase/supabase.service';

@Injectable()
export class StudentsService {
  constructor(private supabaseService: SupabaseService) {}

  async getProfile(userId: string) {
    const { data, error } = await this.supabaseService.clientRef
      .from('students')
      .select('*, users(email, status, role), projects(title, status), complaints(subject, status)')
      .eq('user_id', userId)
      .single();

    if (error || !data) throw new NotFoundException('Student profile not found');
    return data;
  }

  async getById(id: string) {
    const { data, error } = await this.supabaseService.clientRef
      .from('students')
      .select('*, users(email, status, role)')
      .eq('id', id)
      .single();

    if (error || !data) throw new NotFoundException('Student not found');
    return data;
  }
}