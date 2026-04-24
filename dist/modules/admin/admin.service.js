"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminService = void 0;
const common_1 = require("@nestjs/common");
const supabase_service_1 = require("../supabase/supabase.service");
const mail_service_1 = require("../mail/mail.service");
const auth_service_1 = require("../auth/auth.service");
let AdminService = class AdminService {
    constructor(supabaseService, mailService, authService) {
        this.supabaseService = supabaseService;
        this.mailService = mailService;
        this.authService = authService;
    }
    async getAllPayments(page = 1, limit = 20) {
        const from = (page - 1) * limit;
        const to = from + limit - 1;
        const { data, error, count } = await this.supabaseService.db
            .from('payments')
            .select('*, users(email), courses(title)', { count: 'exact' })
            .order('created_at', { ascending: false })
            .range(from, to);
        if (error)
            throw new common_1.NotFoundException('Failed to fetch payments');
        return { data, total: count, page, limit };
    }
    async approvePayment(paymentId, dto) {
        const { data: payment, error } = await this.supabaseService.db
            .from('payments')
            .select('*, users(email, status)')
            .eq('id', paymentId)
            .single();
        if (error || !payment)
            throw new common_1.NotFoundException('Payment not found');
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
    async rejectPayment(paymentId, dto) {
        const { error } = await this.supabaseService.db
            .from('payments')
            .update({ status: 'rejected', admin_note: dto.admin_note ?? null })
            .eq('id', paymentId);
        if (error)
            throw new common_1.BadRequestException('Failed to reject payment');
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
        if (error)
            throw new common_1.NotFoundException('Failed to fetch students');
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
        if (error)
            throw new common_1.NotFoundException('Failed to fetch projects');
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
        if (error)
            throw new common_1.NotFoundException('Failed to fetch complaints');
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
        if (error)
            throw new common_1.NotFoundException('Failed to fetch contacts');
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
        if (error)
            throw new common_1.NotFoundException('Failed to fetch builds');
        return { data, total: count, page, limit };
    }
};
exports.AdminService = AdminService;
exports.AdminService = AdminService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [supabase_service_1.SupabaseService,
        mail_service_1.MailService,
        auth_service_1.AuthService])
], AdminService);
//# sourceMappingURL=admin.service.js.map