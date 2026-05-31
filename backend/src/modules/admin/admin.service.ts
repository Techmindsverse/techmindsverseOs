import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { SupabaseService } from '../supabase/supabase.service';
import { MailService } from '../mail/mail.service';
import { AuthService } from '../auth/auth.service';
import { AdminNoteDto } from './dto/admin-note.dto';

@Injectable()
export class AdminService {
  constructor(
    private readonly supabaseService: SupabaseService,
    private readonly mailService: MailService,
    private readonly authService: AuthService,
  ) {}

  // ─────────────────────────────────────────
  // METRICS
  // ─────────────────────────────────────────
  async getMetrics() {
    const [users, students, payments, builds, complaints, projects] =
      await Promise.all([
        this.supabaseService.clientRef
          .from('users')
          .select('id, role, status', { count: 'exact' }),
        this.supabaseService.clientRef
          .from('students')
          .select('id', { count: 'exact' }),
        this.supabaseService.clientRef
          .from('payments')
          .select('id, status, amount'),
        this.supabaseService.clientRef
          .from('builds')
          .select('id, status'),
        this.supabaseService.clientRef
          .from('complaints')
          .select('id, status', { count: 'exact' }),
        this.supabaseService.clientRef
          .from('projects')
          .select('id', { count: 'exact' }),
      ]);

    const p = payments.data || [];
    const b = builds.data || [];

    return {
      total_users: users.count || 0,
      active_students: students.count || 0,
      pending_payments: p.filter((x) => x.status === 'pending').length,
      approved_payments: p.filter((x) => x.status === 'approved').length,
      total_revenue: p
        .filter((x) => x.status === 'approved')
        .reduce((acc, x) => acc + (Number(x.amount) || 0), 0),
      active_builds: b.filter((x) =>
        ['reviewing', 'planning', 'in_progress', 'testing'].includes(x.status),
      ).length,
      completed_builds: b.filter((x) =>
        ['completed', 'delivered'].includes(x.status),
      ).length,
      pending_builds: b.filter((x) => x.status === 'submitted').length,
      open_complaints: complaints.count || 0,
      total_projects: projects.count || 0,
    };
  }

  // ─────────────────────────────────────────
  // PUBLIC STATS
  // ─────────────────────────────────────────
  async getPublicStats() {
    const [users, students, builds, completedBuilds] = await Promise.all([
      this.supabaseService.clientRef
        .from('users')
        .select('id', { count: 'exact' })
        .eq('status', 'active'),
      this.supabaseService.clientRef
        .from('students')
        .select('id', { count: 'exact' }),
      this.supabaseService.clientRef
        .from('builds')
        .select('id', { count: 'exact' }),
      this.supabaseService.clientRef
        .from('builds')
        .select('id', { count: 'exact' })
        .in('status', ['completed', 'delivered']),
    ]);

    return {
      active_users: users.count || 0,
      total_students: students.count || 0,
      total_builds: builds.count || 0,
      completed_builds: completedBuilds.count || 0,
    };
  }

  // ─────────────────────────────────────────
  // ACTIVITY
  // ─────────────────────────────────────────
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

  // ─────────────────────────────────────────
  // PAYMENTS
  // ─────────────────────────────────────────
  async getAllPayments(page = 1, limit = 20) {
    const from = (page - 1) * limit;
    const to = from + limit - 1;

    const { data, error, count } = await this.supabaseService.clientRef
      .from('payments')
      .select('*, users(id, email, role, status), courses(title)', {
        count: 'exact',
      })
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

    if (payment.users.role === 'admin') {
      await this.supabaseService.clientRef
        .from('payments')
        .update({ status: 'approved', admin_note: 'Admin account exempted' })
        .eq('id', paymentId);
      return { message: 'Admin account exempted from activation flow.' };
    }

    await this.supabaseService.clientRef
      .from('payments')
      .update({ status: 'approved', admin_note: dto.admin_note ?? null })
      .eq('id', paymentId);

    const { rawToken, hashedToken, expiresAt } =
      this.authService.generateActivationToken();

    await this.supabaseService.clientRef
      .from('users')
      .update({
        activation_token: hashedToken,
        activation_token_expires_at: expiresAt,
        status: 'pending_activation',
        access_granted: true,
      })
      .eq('id', payment.user_id);

    await this.mailService.sendActivationEmail(payment.users.email, rawToken);

    await this.supabaseService.clientRef.from('user_activities').insert({
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

  // ─────────────────────────────────────────
  // STUDENTS
  // ─────────────────────────────────────────
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

  // ─────────────────────────────────────────
  // PROJECTS
  // ─────────────────────────────────────────
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

  // ─────────────────────────────────────────
  // COMPLAINTS
  // ─────────────────────────────────────────
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

  // ─────────────────────────────────────────
  // CONTACTS
  // ─────────────────────────────────────────
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

  // ─────────────────────────────────────────
  // BUILDS
  // ─────────────────────────────────────────
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

  // ─────────────────────────────────────────
  // ANNOUNCEMENTS
  // ─────────────────────────────────────────
  async getAnnouncements(limit = 10) {
    const { data } = await this.supabaseService.clientRef
      .from('announcements')
      .select('*')
      .eq('status', 'active')
      .order('pinned', { ascending: false })
      .order('created_at', { ascending: false })
      .limit(limit);

    return data || [];
  }

  async createAnnouncement(
    dto: {
      title: string;
      content: string;
      type: string;
      pinned?: boolean;
    },
    adminId: string,
  ) {
    const { data, error } = await this.supabaseService.clientRef
      .from('announcements')
      .insert({
        title: dto.title,
        content: dto.content,
        type: dto.type,
        pinned: dto.pinned || false,
        status: 'active',
        author_id: adminId,
      })
      .select()
      .single();

    if (error) throw new BadRequestException('Failed to create announcement');
    return data;
  }

  // ─────────────────────────────────────────
  // TESTIMONIALS
  // ─────────────────────────────────────────
  async getTestimonials() {
    const { data } = await this.supabaseService.clientRef
      .from('testimonials')
      .select('*')
      .eq('is_active', true)
      .order('order_index', { ascending: true });

    return data || [];
  }

  async manageTestimonial(dto: {
    id?: string;
    name: string;
    role: string;
    text: string;
    avatar_initial?: string;
    is_active?: boolean;
    order_index?: number;
  }) {
    if (dto.id) {
      const { data, error } = await this.supabaseService.clientRef
        .from('testimonials')
        .update({
          name: dto.name,
          role: dto.role,
          text: dto.text,
          avatar_initial: dto.avatar_initial,
          is_active: dto.is_active !== undefined ? dto.is_active : true,
          order_index: dto.order_index || 0,
        })
        .eq('id', dto.id)
        .select()
        .single();

      if (error) throw new BadRequestException('Failed to update testimonial');
      return data;
    }

    const { data, error } = await this.supabaseService.clientRef
      .from('testimonials')
      .insert({
        name: dto.name,
        role: dto.role,
        text: dto.text,
        avatar_initial: dto.avatar_initial || dto.name[0],
        is_active: true,
        order_index: dto.order_index || 0,
      })
      .select()
      .single();

    if (error) throw new BadRequestException('Failed to create testimonial');
    return data;
  }

  // ─────────────────────────────────────────
  // PLATFORM STATS
  // ─────────────────────────────────────────
  async getPlatformStats() {
    const { data } = await this.supabaseService.clientRef
      .from('platform_stats')
      .select('*')
      .order('key');

    return data || [];
  }

  async updatePlatformStat(key: string, value: string, label: string) {
    const { data, error } = await this.supabaseService.clientRef
      .from('platform_stats')
      .upsert(
        { key, value, label, updated_at: new Date().toISOString() },
        { onConflict: 'key' },
      )
      .select()
      .single();

    if (error) throw new BadRequestException('Failed to update stat');
    return data;
  }
}