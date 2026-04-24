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
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const supabase_service_1 = require("../supabase/supabase.service");
const bcrypt = require("bcrypt");
const crypto = require("crypto");
let AuthService = class AuthService {
    constructor(jwtService, supabaseService) {
        this.jwtService = jwtService;
        this.supabaseService = supabaseService;
    }
    async login(email, password) {
        const { data: user, error } = await this.supabaseService.db
            .from('users')
            .select('*')
            .eq('email', email)
            .single();
        if (error || !user) {
            throw new common_1.UnauthorizedException('Invalid credentials');
        }
        if (user.status !== 'active') {
            throw new common_1.UnauthorizedException('Account is not active. Please check your email to activate your account.');
        }
        const passwordMatch = await bcrypt.compare(password, user.password_hash);
        if (!passwordMatch) {
            throw new common_1.UnauthorizedException('Invalid credentials');
        }
        const payload = { sub: user.id, email: user.email, role: user.role };
        const token = this.jwtService.sign(payload);
        return {
            access_token: token,
            role: user.role,
            user: {
                id: user.id,
                email: user.email,
                role: user.role,
            },
        };
    }
    async getMe(userId) {
        const { data, error } = await this.supabaseService.db
            .from('users')
            .select('id, email, role, status')
            .eq('id', userId)
            .single();
        if (error || !data)
            throw new common_1.NotFoundException('User not found');
        return data;
    }
    async validateActivationToken(token) {
        const hashedToken = crypto.createHash('sha256').update(token).digest('hex');
        const { data, error } = await this.supabaseService.db
            .from('users')
            .select('id, email, status, activation_token_expires_at')
            .eq('activation_token', hashedToken)
            .single();
        if (error || !data) {
            throw new common_1.NotFoundException('Invalid activation token');
        }
        if (data.status === 'active') {
            throw new common_1.BadRequestException('Account already activated');
        }
        const now = new Date();
        const expiry = new Date(data.activation_token_expires_at);
        if (now > expiry) {
            throw new common_1.BadRequestException('Activation token has expired');
        }
        return {
            valid: true,
            email: data.email.replace(/(.{2}).*(@.*)/, '$1***$2'),
        };
    }
    async activateAccount(token, password) {
        const hashedToken = crypto.createHash('sha256').update(token).digest('hex');
        const { data, error } = await this.supabaseService.db
            .from('users')
            .select('*')
            .eq('activation_token', hashedToken)
            .single();
        if (error || !data) {
            throw new common_1.NotFoundException('Invalid activation token');
        }
        if (data.status === 'active') {
            throw new common_1.BadRequestException('Account already activated');
        }
        const now = new Date();
        const expiry = new Date(data.activation_token_expires_at);
        if (now > expiry) {
            throw new common_1.BadRequestException('Activation token has expired');
        }
        const password_hash = await bcrypt.hash(password, 12);
        const { error: updateError } = await this.supabaseService.db
            .from('users')
            .update({
            password_hash,
            status: 'active',
            activation_token: null,
            activation_token_expires_at: null,
        })
            .eq('id', data.id);
        if (updateError) {
            throw new common_1.BadRequestException('Failed to activate account');
        }
        return { message: 'Account activated successfully. You can now log in.' };
    }
    generateActivationToken() {
        const rawToken = crypto.randomBytes(32).toString('hex');
        const hashedToken = crypto.createHash('sha256').update(rawToken).digest('hex');
        const expiresAt = new Date();
        expiresAt.setHours(expiresAt.getHours() + 48);
        return { rawToken, hashedToken, expiresAt };
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [jwt_1.JwtService,
        supabase_service_1.SupabaseService])
], AuthService);
//# sourceMappingURL=auth.service.js.map