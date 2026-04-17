import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { SupabaseService } from '../supabase/supabase.service';
import { MailService } from '../mail/mail.service';
import { AuthService } from '../auth/auth.service';
import { AdminNoteDto } from './dto/admin-note.dto';

@Injectable()
export class AdminService {
  constructor(
    private supabaseService: SupabaseService,
    private mailService: MailService,
    private authService: AuthService,
  ) {}

  async getAllPayments() {
    const { data, error } = await this.supabaseService.db
      .from('payments')
      .select('*, users(email), courses(title)')
      .order('created_at', { ascending: false });

    if (error) throw new NotFoundException('Failed to fetch payments');
    return data;
  }

  async approvePayment(paymentId: string, dto: AdminNoteDto) {
    const { data: payment, error } = await this.supabaseService.db
      .from('payments')
      .select('*, users(email, status)')
      .eq('id', paymentId)
      .single();

    if (error || !payment) throw new NotFoundException('Payment not found');

    // Update payment status
    await this.supabaseService.db
      .from('payments')
      .update({ status: 'approved', admin_note: dto.admin_note ?? null })
      .eq('id', paymentId);

    // Generate activation token
    const { token, expiresAt } = this.authService.generateActivationToken();

    // Update user with token
    await this.supabaseService.db
      .from('users')
      .update({
        activation_token: token,
        activation_token_expires_at: expiresAt,
        status: 'pending',
      })
      .eq('id', payment.user_id);

    // Send activation email
    await this.mailService.sendActivationEmail(payment.users.email, token);

    return { message: 'Payment approved. Activation email sent.' };
  }

  async rejectPayment(paymentId: string, dto: AdminNoteDto) {
    const { error } = await this.supabaseService.db
      .from('payments')
      .update({ status: 'rejected', admin_note: dto.admin_note ?? null })
      .eq('id', paymentId);

    if (error) throw new BadRequestException('Failed to reject payment');
    return { message: 'Payment rejected.' };
  }

  async getAllStudents() {
    const { data, error } = await this.supabaseService.db
      .from('students')
      .select('*, users(email, status)')
      .order('created_at', { ascending: false });

    if (error) throw new NotFoundException('Failed to fetch students');
    return data;
  }

  async getAllProjects() {
    const { data, error } = await this.supabaseService.db
      .from('projects')
      .select('*, students(full_name)')
      .order('created_at', { ascending: false });

    if (error) throw new NotFoundException('Failed to fetch projects');
    return data;
  }

  async getAllComplaints() {
    const { data, error } = await this.supabaseService.db
      .from('complaints')
      .select('*, users(email)')
      .order('created_at', { ascending: false });

    if (error) throw new NotFoundException('Failed to fetch complaints');
    return data;
  }

  async getAllContacts() {
    const { data, error } = await this.supabaseService.db
      .from('contacts')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw new NotFoundException('Failed to fetch contacts');
    return data;
  }

  async getAllBuilds() {
  const { data, error } = await this.supabaseService.db
    .from('builds').select('*').order('created_at', { ascending: false });
  if (error) throw new NotFoundException('Failed to fetch builds');
  return data;
}
}