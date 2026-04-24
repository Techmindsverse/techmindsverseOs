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
exports.PaymentsService = void 0;
const common_1 = require("@nestjs/common");
const supabase_service_1 = require("../supabase/supabase.service");
let PaymentsService = class PaymentsService {
    constructor(supabaseService) {
        this.supabaseService = supabaseService;
    }
    async createPayment(userId, dto) {
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
        if (error)
            throw new common_1.NotFoundException('Failed to create payment');
        return data;
    }
    async getMyPayments(userId) {
        const { data, error } = await this.supabaseService.db
            .from('payments')
            .select('*, courses(title)')
            .eq('user_id', userId)
            .order('created_at', { ascending: false });
        if (error)
            throw new common_1.NotFoundException('Failed to fetch payments');
        return data;
    }
};
exports.PaymentsService = PaymentsService;
exports.PaymentsService = PaymentsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [supabase_service_1.SupabaseService])
], PaymentsService);
//# sourceMappingURL=payments.service.js.map