import { Injectable, UnauthorizedException, BadRequestException, NotFoundException, ConflictException } from '@nestjs/common';
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

  async register(email: string, password: string, fullName: string) {
    // Check if user exists
    const { data: existing } = await this.supabaseService.clientRef
      .from('users')
      .select('id, status')
      .eq('email', email)
      .single();

    if (existing && existing.status === 'active') {
      throw new ConflictException('An account with this email already exists');
    }

    const password_hash = await bcrypt.hash(password, 12);
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpiry = new Date();
    otpExpiry.setMinutes(otpExpiry.getMinutes() + 15);

    if (existing) {
      // Resend OTP for existing unverified account
      await this.supabaseService.clientRef
        .from('users')
        .update({ otp_code: otp, otp_expires_at: otpExpiry, password_hash })
        .eq('id', existing.id);
    } else {
      // Create new user
      const { error } = await this.supabaseService.clientRef
        .from('users')
        .insert({
          email,
          password_hash,
          role: 'student',
          status: 'pending',
          otp_code: otp,
          otp_expires_at: otpExpiry,
          otp_verified: false,
        });

      if (error) throw new BadRequestException('Failed to create account');

      // Get the new user id
      const { data: newUser } = await this.supabaseService.clientRef
        .from('users')
        .select('id')
        .eq('email', email)
        .single();

      if (newUser && fullName) {
        await this.supabaseService.clientRef
          .from('students')
          .insert({ user_id: newUser.id, full_name: fullName });
      }
    }

    await this.mailService.sendOtpEmail(email, otp, fullName);

    return { message: 'Account created. Check your email for the verification code.' };
  }

  async verifyOtp(email: string, otp: string) {
    const { data: user, error } = await this.supabaseService.clientRef
      .from('users')
      .select('*')
      .eq('email', email)
      .single();

    if (error || !user) throw new NotFoundException('User not found');
    if (user.otp_code !== otp) throw new BadRequestException('Invalid verification code');

    const now = new Date();
    if (now > new Date(user.otp_expires_at)) {
      throw new BadRequestException('Verification code has expired. Please register again.');
    }

    await this.supabaseService.clientRef
      .from('users')
      .update({
        status: 'active',
        otp_code: null,
        otp_expires_at: null,
        otp_verified: true,
      })
      .eq('id', user.id);

    await this.supabaseService.clientRef
      .from('user_activities')
      .insert({ user_id: user.id, action: 'ACCOUNT_VERIFIED' });

    const payload = { sub: user.id, email: user.email, role: user.role };
    const token = this.jwtService.sign(payload);

    return {
      access_token: token,
      role: user.role,
      user: { id: user.id, email: user.email, role: user.role },
      message: 'Email verified. Welcome to TechMindsVerse.',
    };
  }

  async login(email: string, password: string) {
    const { data: user, error } = await this.supabaseService.clientRef
      .from('users')
      .select('*')
      .eq('email', email)
      .single();

    if (error || !user) throw new UnauthorizedException('Invalid credentials');

    if (user.status !== 'active') {
      throw new UnauthorizedException('Account is not active. Please verify your email.');
    }

    const passwordMatch = await bcrypt.compare(password, user.password_hash);
    if (!passwordMatch) throw new UnauthorizedException('Invalid credentials');

    await this.supabaseService.clientRef
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
    const { data, error } = await this.supabaseService.clientRef
      .from('users')
      .select('id, email, role, status')
      .eq('id', userId)
      .single();

    if (error || !data) throw new NotFoundException('User not found');
    return data;
  }

  async validateActivationToken(token: string) {
    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

    const { data, error } = await this.supabaseService.clientRef
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

    const { data, error } = await this.supabaseService.clientRef
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

    const { error: updateError } = await this.supabaseService.clientRef
      .from('users')
      .update({
        password_hash,
        status: 'active',
        activation_token: null,
        activation_token_expires_at: null,
      })
      .eq('id', data.id);

    if (updateError) throw new BadRequestException('Failed to activate account');

    await this.supabaseService.clientRef
      .from('user_activities')
      .insert({ user_id: data.id, action: 'ACCOUNT_ACTIVATED' });

    return { message: 'Account activated successfully. You can now log in.' };
  }

  async forgotPassword(email: string) {
    const { data: user } = await this.supabaseService.clientRef
      .from('users')
      .select('id, email, status')
      .eq('email', email)
      .single();

    if (!user || user.status !== 'active') {
      return { message: 'If this email exists, a reset link has been sent.' };
    }

    const rawToken = crypto.randomBytes(32).toString('hex');
    const hashedToken = crypto.createHash('sha256').update(rawToken).digest('hex');
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 1);

    await this.supabaseService.clientRef
      .from('users')
      .update({ reset_token: hashedToken, reset_token_expires_at: expiresAt })
      .eq('id', user.id);

    await this.mailService.sendPasswordResetEmail(user.email, rawToken);

    return { message: 'If this email exists, a reset link has been sent.' };
  }

  async resetPassword(token: string, password: string) {
    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

    const { data, error } = await this.supabaseService.clientRef
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

    await this.supabaseService.clientRef
      .from('users')
      .update({ password_hash, reset_token: null, reset_token_expires_at: null })
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