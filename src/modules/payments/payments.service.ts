import { Injectable, NotFoundException } from '@nestjs/common';
import { SupabaseService } from '../supabase/supabase.service';
import { CreatePaymentDto } from './dto/create-payment.dto';

@Injectable()
export class PaymentsService {
  constructor(private supabaseService: SupabaseService) {}

  async createPayment(userId: string, dto: CreatePaymentDto) {
    const { data, error } = await this.supabaseService.db
      .from('payments')
      .insert({
        user_id: userId,
        course_id: dto.course_id,
        amount: dto.amount,
        reference: dto.reference,
        proof_image_url: dto.proof_image_url ?? null,
        status: 'pending',
      })
      .select()
      .single();

    if (error) throw new NotFoundException('Failed to create payment');
    return data;
  }

  async getMyPayments(userId: string) {
    const { data, error } = await this.supabaseService.db
      .from('payments')
      .select('*, courses(title)')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw new NotFoundException('Failed to fetch payments');
    return data;
  }
}