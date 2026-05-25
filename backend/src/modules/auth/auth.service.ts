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

    async register(dto: {
  email: string;
  password: string;
  fullName: string;
  username: string;
  role: string;
  phone?: string;
  avatar_url?: string;
}) {
  // Check email exists
  const { data: existingEmail } = await this.supabaseService.clientRef
    .from('users')
    .select('id, status')
    .eq('email', dto.email)
    .single();

  if (existingEmail && existingEmail.status === 'active') {
    throw new ConflictException('An account with this email already exists');
  }

  // Check username taken
  const { data: existingUsername } = await this.supabaseService.clientRef
    .from('users')
    .select('id')
    .eq('username', dto.username)
    .single();

  if (existingUsername) {
    throw new ConflictException('Username is already taken');
  }

  const password_hash = await bcrypt.hash(dto.password, 12);
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  const otpExpiry = new Date();
  otpExpiry.setMinutes(otpExpiry.getMinutes() + 15);

  let userId: string;

  if (existingEmail) {
    userId = existingEmail.id;
    await this.supabaseService.clientRef
      .from('users')
      .update({
        password_hash,
        username: dto.username,
        otp_code: otp,
        otp_expires_at: otpExpiry,
      })
      .eq('id', existingEmail.id);
  } else {
    const { data: newUser, error } = await this.supabaseService.clientRef
      .from('users')
      .insert({
        email: dto.email,
        password_hash,
        username: dto.username,
        role: dto.role,
        status: 'pending',
        otp_code: otp,
        otp_expires_at: otpExpiry,
        otp_verified: false,
        avatar_url: dto.avatar_url || null,
      })
      .select('id')
      .single();

    if (error || !newUser) throw new BadRequestException('Failed to create account');
    userId = newUser.id;

    // Create profile based on role
    if (dto.role === 'student') {
      await this.supabaseService.clientRef
        .from('students')
        .insert({
          user_id: userId,
          full_name: dto.fullName,
          phone: dto.phone || null,
          avatar_url: dto.avatar_url || null,
        });
    } else if (dto.role === 'client') {
      await this.supabaseService.clientRef
        .from('clients')
        .insert({
          user_id: userId,
          full_name: dto.fullName,
          phone: dto.phone || null,
          avatar_url: dto.avatar_url || null,
        });
    }
  }

  await this.mailService.sendOtpEmail(dto.email, otp, dto.fullName);

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