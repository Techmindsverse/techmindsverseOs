import { Injectable, NotFoundException } from '@nestjs/common';
import { SupabaseService } from '../supabase/supabase.service';

@Injectable()
export class ClientsService {
  constructor(private supabaseService: SupabaseService) {}

  async getProfile(userId: string) {
    const { data, error } = await this.supabaseService.clientRef
      .from('clients')
      .select('*, users(email, status, role)')
      .eq('user_id', userId)
      .single();

    if (error || !data) throw new NotFoundException('Client profile not found');
    return data;
  }
}