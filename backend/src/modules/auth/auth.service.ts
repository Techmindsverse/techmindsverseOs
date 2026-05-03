import { Injectable, UnauthorizedException, BadRequestException, NotFoundException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { SupabaseService } from '../supabase/supabase.service';
import { MailService } from '../mail/mail.service';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private supabaseService: SupabaseService,
    private mailService: MailService,
  ) {}

  async login(email: string, password: string) {
    const { data: user, error } = await this.supabaseService.db
      .from('users')
      .select('*')
      .eq('email', email)
      .single();

    if (error || !user) throw new UnauthorizedException('Invalid credentials');

    if (user.status !== 'active') {
      throw new UnauthorizedException('Account is not active. Please check your email to activate your account.');
    }

    const passwordMatch = await bcrypt.compare(password, user.password_hash);
    if (!passwordMatch) throw new UnauthorizedException('Invalid credentials');

    await this.supabaseService.db
      .from('user_activities')
      .insert({ user_id: user.id, action: 'LOGIN' });

    const payload = { sub: user.id, email: user.email, role: user.role };
    const token = this.jwtService.sign(payload);

    return {
      access_token: token,
      role: user.role,
      user: { id: user.id, email: user.email, role: user.role },
    };
  }

  async getMe(userId: string) {
    const { data, error } = await this.supabaseService.db
      .from('users')
      .select('id, email, role, status')
      .eq('id', userId)
      .single();

    if (error || !data) throw new NotFoundException('User not found');
    return data;
  }

  async validateActivationToken(token: string) {
    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

    const { data, error } = await this.supabaseService.db
      .from('users')
      .select('id, email, status, activation_token_expires_at')
      .eq('activation_token', hashedToken)
      .single();

    if (error || !data) throw new NotFoundException('Invalid activation token');
    if (data.status === 'active') throw new BadRequestException('Account already activated');

    const now = new Date();
    if (now > new Date(data.activation_token_expires_at)) {
      throw new BadRequestException('Activation token has expired');
    }

    return {
      valid: true,
      email: data.email.replace(/(.{2}).*(@.*)/, '$1***$2'),
    };
  }

  async activateAccount(token: string, password: string) {
    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

    const { data, error } = await this.supabaseService.db
      .from('users')
      .select('*')
      .eq('activation_token', hashedToken)
      .single();

    if (error || !data) throw new NotFoundException('Invalid activation token');
    if (data.status === 'active') throw new BadRequestException('Account already activated');

    const now = new Date();
    if (now > new Date(data.activation_token_expires_at)) {
      throw new BadRequestException('Activation token has expired');
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

    if (updateError) throw new BadRequestException('Failed to activate account');

    return { message: 'Account activated successfully. You can now log in.' };
  }

  async forgotPassword(email: string) {
    const { data: user } = await this.supabaseService.db
      .from('users')
      .select('id, email, status')
      .eq('email', email)
      .single();

    // Always return success to prevent email enumeration
    if (!user || user.status !== 'active') {
      return { message: 'If this email exists, a reset link has been sent.' };
    }

    const rawToken = crypto.randomBytes(32).toString('hex');
    const hashedToken = crypto.createHash('sha256').update(rawToken).digest('hex');
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 1);

    await this.supabaseService.db
      .from('users')
      .update({
        reset_token: hashedToken,
        reset_token_expires_at: expiresAt,
      })
      .eq('id', user.id);

    await this.mailService.sendPasswordResetEmail(user.email, rawToken);

    return { message: 'If this email exists, a reset link has been sent.' };
  }

  async resetPassword(token: string, password: string) {
    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

    const { data, error } = await this.supabaseService.db
      .from('users')
      .select('*')
      .eq('reset_token', hashedToken)
      .single();

    if (error || !data) throw new NotFoundException('Invalid or expired reset token');

    const now = new Date();
    if (now > new Date(data.reset_token_expires_at)) {
      throw new BadRequestException('Reset token has expired');
    }

    const password_hash = await bcrypt.hash(password, 12);

    await this.supabaseService.db
      .from('users')
      .update({
        password_hash,
        reset_token: null,
        reset_token_expires_at: null,
      })
      .eq('id', data.id);

    return { message: 'Password reset successfully. You can now log in.' };
  }

  generateActivationToken(): { rawToken: string; hashedToken: string; expiresAt: Date } {
    const rawToken = crypto.randomBytes(32).toString('hex');
    const hashedToken = crypto.createHash('sha256').update(rawToken).digest('hex');
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 48);
    return { rawToken, hashedToken, expiresAt };
  }
}