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

  async getAllPayments(page = 1, limit = 20) {
    const from = (page - 1) * limit;
    const to = from + limit - 1;
    const { data, error, count } = await this.supabaseService.db
      .from('payments')
      .select('*, users(email), courses(title)', { count: 'exact' })
      .order('created_at', { ascending: false })
      .range(from, to);
    if (error) throw new NotFoundException('Failed to fetch payments');
    return { data, total: count, page, limit };
  }

  async approvePayment(paymentId: string, dto: AdminNoteDto) {
    const { data: payment, error } = await this.supabaseService.db
      .from('payments')
      .select('*, users(email, status)')
      .eq('id', paymentId)
      .single();

    if (error || !payment) throw new NotFoundException('Payment not found');

    await this.supabaseService.db
      .from('payments')
      .update({ status: 'approved', admin_note: dto.admin_note ?? null })
      .eq('id', paymentId);

    const { rawToken, hashedToken, expiresAt } = this.authService.generateActivationToken();

    await this.supabaseService.db
      .from('users')
      .update({
        activation_token: hashedToken,
        activation_token_expires_at: expiresAt,
        status: 'pending',
      })
      .eq('id', payment.user_id);

    await this.mailService.sendActivationEmail(payment.users.email, rawToken);

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

  async getAllStudents(page = 1, limit = 20) {
    const from = (page - 1) * limit;
    const to = from + limit - 1;
    const { data, error, count } = await this.supabaseService.db
      .from('students')
      .select('*, users(email, status)', { count: 'exact' })
      .order('created_at', { ascending: false })
      .range(from, to);
    if (error) throw new NotFoundException('Failed to fetch students');
    return { data, total: count, page, limit };
  }

  async getAllProjects(page = 1, limit = 20) {
    const from = (page - 1) * limit;
    const to = from + limit - 1;
    const { data, error, count } = await this.supabaseService.db
      .from('projects')
      .select('*, students(full_name)', { count: 'exact' })
      .order('created_at', { ascending: false })
      .range(from, to);
    if (error) throw new NotFoundException('Failed to fetch projects');
    return { data, total: count, page, limit };
  }

  async getAllComplaints(page = 1, limit = 20) {
    const from = (page - 1) * limit;
    const to = from + limit - 1;
    const { data, error, count } = await this.supabaseService.db
      .from('complaints')
      .select('*, users(email)', { count: 'exact' })
      .order('created_at', { ascending: false })
      .range(from, to);
    if (error) throw new NotFoundException('Failed to fetch complaints');
    return { data, total: count, page, limit };
  }

  async getAllContacts(page = 1, limit = 20) {
    const from = (page - 1) * limit;
    const to = from + limit - 1;
    const { data, error, count } = await this.supabaseService.db
      .from('contacts')
      .select('*', { count: 'exact' })
      .order('created_at', { ascending: false })
      .range(from, to);
    if (error) throw new NotFoundException('Failed to fetch contacts');
    return { data, total: count, page, limit };
  }

  async getAllBuilds(page = 1, limit = 20) {
    const from = (page - 1) * limit;
    const to = from + limit - 1;
    const { data, error, count } = await this.supabaseService.db
      .from('builds')
      .select('*', { count: 'exact' })
      .order('created_at', { ascending: false })
      .range(from, to);
    if (error) throw new NotFoundException('Failed to fetch builds');
    return { data, total: count, page, limit };
  }
}