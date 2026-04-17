import { Injectable } from '@nestjs/common';
import { SupabaseService } from '../supabase/supabase.service';
import { CreateComplaintDto } from './dto/create-complaint.dto';

@Injectable()
export class ComplaintsService {
  constructor(private supabaseService: SupabaseService) {}

  async create(userId: string, dto: CreateComplaintDto) {
    const { error } = await this.supabaseService.db
      .from('complaints')
      .insert({ user_id: userId, ...dto, status: 'pending' });
    if (error) throw new Error('Failed to create complaint');
    return { message: 'Complaint submitted successfully' };
  }
}