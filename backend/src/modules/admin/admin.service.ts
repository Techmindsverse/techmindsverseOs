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

  async getMetrics() {
    const [users, students, payments, builds, complaints, projects] = await Promise.all([
      this.supabaseService.clientRef.from('users').select('id, role, status', { count: 'exact' }),
      this.supabaseService.clientRef.from('students').select('id', { count: 'exact' }),
      this.supabaseService.clientRef.from('payments').select('id, status, amount'),
      this.supabaseService.clientRef.from('builds').select('id, status'),
      this.supabaseService.clientRef.from('complaints').select('id, status', { count: 'exact' }),
      this.supabaseService.clientRef.from('projects').select('id', { count: 'exact' }),
    ]);

    const p = payments.data || [];
    const b = builds.data || [];
    const c = complaints.data || [];

    return {
      total_users: users.count || 0,
      active_students: students.count || 0,
      pending_payments: p.filter(x => x.status === 'pending').length,
      approved_payments: p.filter(x => x.status === 'approved').length,
      total_revenue: p
        .filter(x => x.status === 'approved')
        .reduce((acc, x) => acc + (Number(x.amount) || 0), 0),
      active_builds: b.filter(x => ['accepted', 'in_progress'].includes(x.status)).length,
      completed_builds: b.filter(x => x.status === 'completed').length,
      pending_builds: b.filter(x => x.status === 'pending').length,
      open_complaints: c.filter(x => x.status === 'pending').length,
      total_projects: projects.count || 0,
    };
  }

  async getActivity(page = 1, limit = 20) {
    const from = (page - 1) * limit;
    const to = from + limit - 1;

    const { data, error, count } = await this.supabaseService.clientRef
      .from('user_activities')
      .select('*, users(email)', { count: 'exact' })
      .order('created_at', { ascending: false })
      .range(from, to);

    if (error) throw new NotFoundException('Failed to fetch activity');
    return { data, total: count, page, limit };
  }

  async getAllPayments(page = 1, limit = 20) {
    const from = (page - 1) * limit;
    const to = from + limit - 1;

    const { data, error, count } = await this.supabaseService.clientRef
      .from('payments')
      .select('*, users(id, email, role, status), courses(title)', { count: 'exact' })
      .order('created_at', { ascending: false })
      .range(from, to);

    if (error) throw new NotFoundException('Failed to fetch payments');
    return { data, total: count, page, limit };
  }

  async approvePayment(paymentId: string, dto: AdminNoteDto) {
    const { data: payment, error } = await this.supabaseService.clientRef
      .from('payments')
      .select('*, users(id, email, status, role)')
      .eq('id', paymentId)
      .single();

    if (error || !payment) throw new NotFoundException('Payment not found');

    // Admin exemption — skip activation flow
    if (payment.users.role === 'admin') {
      await this.supabaseService.clientRef
        .from('payments')
        .update({ status: 'approved', admin_note: 'Admin account exempted' })
        .eq('id', paymentId);

      return { message: 'Admin account exempted from activation flow.' };
    }

    // Approve payment
    await this.supabaseService.clientRef
      .from('payments')
      .update({ status: 'approved', admin_note: dto.admin_note ?? null })
      .eq('id', paymentId);

    // Generate activation token
    const { rawToken, hashedToken, expiresAt } = this.authService.generateActivationToken();

    // Update user
    await this.supabaseService.clientRef
      .from('users')
      .update({
        activation_token: hashedToken,
        activation_token_expires_at: expiresAt,
        status: 'pending_activation',
        access_granted: true,
      })
      .eq('id', payment.user_id);

    // Send activation email
    await this.mailService.sendActivationEmail(payment.users.email, rawToken);

    // Log activity
    await this.supabaseService.clientRef
      .from('user_activities')
      .insert({
        user_id: payment.user_id,
        action: 'PAYMENT_APPROVED',
        metadata: { payment_id: paymentId },
      });

    return { message: 'Payment approved. Activation email sent.' };
  }

  async rejectPayment(paymentId: string, dto: AdminNoteDto) {
    const { error } = await this.supabaseService.clientRef
      .from('payments')
      .update({ status: 'rejected', admin_note: dto.admin_note ?? null })
      .eq('id', paymentId);

    if (error) throw new BadRequestException('Failed to reject payment');
    return { message: 'Payment rejected.' };
  }

  async getAllStudents(page = 1, limit = 20) {
    const from = (page - 1) * limit;
    const to = from + limit - 1;

    const { data, error, count } = await this.supabaseService.clientRef
      .from('students')
      .select('*, users(email, status, role)', { count: 'exact' })
      .order('created_at', { ascending: false })
      .range(from, to);

    if (error) throw new NotFoundException('Failed to fetch students');
    return { data, total: count, page, limit };
  }

  async getAllProjects(page = 1, limit = 20) {
    const from = (page - 1) * limit;
    const to = from + limit - 1;

    const { data, error, count } = await this.supabaseService.clientRef
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

    const { data, error, count } = await this.supabaseService.clientRef
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

    const { data, error, count } = await this.supabaseService.clientRef
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

    const { data, error, count } = await this.supabaseService.clientRef
      .from('builds')
      .select('*', { count: 'exact' })
      .order('created_at', { ascending: false })
      .range(from, to);

    if (error) throw new NotFoundException('Failed to fetch builds');
    return { data, total: count, page, limit };
  }
}