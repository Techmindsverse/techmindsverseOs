import {
  Injectable,
  UnauthorizedException,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { SupabaseService } from '../supabase/supabase.service';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private supabaseService: SupabaseService,
  ) {}

  // =========================
  // LOGIN
  // =========================
  async login(email: string, password: string) {
    const { data: user, error } = await this.supabaseService.db
      .from('users')
      .select('*')
      .eq('email', email)
      .single();

    if (error || !user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    if (user.status !== 'active') {
      throw new UnauthorizedException(
        'Account is not active. Please activate your account.',
      );
    }

    if (!user.password_hash) {
      throw new UnauthorizedException('Account not activated yet');
    }

    const passwordMatch = await bcrypt.compare(password, user.password_hash);

    if (!passwordMatch) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload = {
      sub: user.id,
      email: user.email,
      role: user.role,
    };

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

  // =========================
  // OPTIONAL TOKEN CHECK (UI ONLY)
  // =========================
  async validateActivationToken(token: string) {
    const { data, error } = await this.supabaseService.db
      .from('users')
      .select('id, email, status, activation_token_expires_at')
      .eq('activation_token', token)
      .single();

    if (error || !data) {
      throw new NotFoundException('Invalid activation token');
    }

    if (data.status === 'active') {
      throw new BadRequestException('Account already activated');
    }

    const now = new Date();
    const expiry = new Date(data.activation_token_expires_at);

    if (now > expiry) {
      throw new BadRequestException('Activation token has expired');
    }

    return {
      valid: true,
      email: data.email.replace(/(.{2}).*(@.*)/, '$1***$2'),
    };
  }

  // =========================
  // ACTIVATION (HARDENED - SINGLE SOURCE OF TRUTH)
  // =========================
  async activateAccount(token: string, password: string) {
    const { data: user, error } = await this.supabaseService.db
      .from('users')
      .select('*')
      .eq('activation_token', token)
      .single();

    if (error || !user) {
      throw new NotFoundException('Invalid activation token');
    }

    if (user.status === 'active') {
      throw new BadRequestException('Account already activated');
    }

    const now = new Date();
    const expiry = new Date(user.activation_token_expires_at);

    if (now > expiry) {
      throw new BadRequestException('Activation token has expired');
    }

    if (!password || password.length < 6) {
      throw new BadRequestException('Password must be at least 6 characters');
    }

    const password_hash = await bcrypt.hash(password, 12);

    const { error: updateError } = await this.supabaseService.db
      .from('users')
      .update({
        password_hash,
        status: 'active',
        activation_token: null,
        activation_token_expires_at: null,
        activated_at: new Date(),
      })
      .eq('id', user.id);

    if (updateError) {
      throw new BadRequestException('Failed to activate account');
    }

    return {
      message: 'Account activated successfully. You can now log in.',
    };
  }

  // =========================
  // TOKEN GENERATION
  // =========================
  generateActivationToken(): { token: string; expiresAt: Date } {
    const token = crypto.randomBytes(32).toString('hex');

    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 48);

    return { token, expiresAt };
  }
}