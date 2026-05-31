import {
  Injectable,
  UnauthorizedException,
  BadRequestException,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { SupabaseService } from '../supabase/supabase.service';
import { MailService } from '../mail/mail.service';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';
import { RolesService } from '../roles/roles.service';

@Injectable()
export class AuthService {
  constructor(
  private jwtService: JwtService,
  private supabaseService: SupabaseService,
  private mailService: MailService,
  private rolesService: RolesService,  
) {}

  // ─────────────────────────────────────────
  // REGISTER
  // ─────────────────────────────────────────
  async register(dto: {
    email: string;
    password: string;
    fullName: string;
    username: string;
    role: string;
    phone?: string;
    avatar_url?: string;
  }) {
    const email = dto.email.toLowerCase().trim();

    // Check existing user
    const { data: existing } = await this.supabaseService.clientRef
      .from('users')
      .select('id, status, otp_code, otp_expires_at, created_at')
      .eq('email', email)
      .single();

    if (existing) {
      if (existing.status === 'active') {
        throw new ConflictException('An account with this email already exists. Please sign in.');
      }
    const { RolesService } = await import('../roles/roles.service');
      // Rate limit OTP resends — max 3 per day
      const { count: otpCount } = await this.supabaseService.clientRef
        .from('user_activities')
        .select('id', { count: 'exact' })
        .eq('user_id', existing.id)
        .eq('action', 'OTP_SENT')
        .gte('created_at', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString());

      if ((otpCount || 0) >= 3) {
        throw new BadRequestException('Too many verification attempts. Please try again after 24 hours.');
      }
    }

    // Check username uniqueness
    if (dto.username) {
      const { data: usernameExists } = await this.supabaseService.clientRef
        .from('users')
        .select('id')
        .eq('username', dto.username.toLowerCase().trim())
        .single();

      if (usernameExists) {
        throw new ConflictException('Username is already taken. Please choose another.');
      }
    }

    const password_hash = await bcrypt.hash(dto.password, 12);
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpiry = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes

    if (existing) {
      // Update existing pending account
      await this.supabaseService.clientRef
        .from('users')
        .update({
          password_hash,
          username: dto.username?.toLowerCase().trim() || null,
          otp_code: otp,
          otp_expires_at: otpExpiry,
          otp_attempts: 0,
        })
        .eq('id', existing.id);

      await this.supabaseService.clientRef
     .from('user_activities')
     .insert({ user_id: newUser.id, action: 'OTP_SENT' });
    } else {
      // Create new user
      const { data: newUser, error } = await this.supabaseService.clientRef
        .from('users')
        .insert({
          email,
          password_hash,
          username: dto.username?.toLowerCase().trim() || null,
          role: dto.role || 'student',
          status: 'pending',
          otp_code: otp,
          otp_expires_at: otpExpiry,
          otp_verified: false,
          otp_attempts: 0,
          avatar_url: dto.avatar_url || null,
        })
        .select('id')
        .single();

      if (error || !newUser) {
        throw new BadRequestException('Failed to create account. Please try again.');
      }

      // Create role-specific profile
      if (dto.role === 'student') {
        await this.supabaseService.clientRef
          .from('students')
          .insert({
            user_id: newUser.id,
            full_name: dto.fullName,
            phone: dto.phone || null,
            avatar_url: dto.avatar_url || null,
          });
      } else if (dto.role === 'client') {
        await this.supabaseService.clientRef
          .from('clients')
          .insert({
            user_id: newUser.id,
            full_name: dto.fullName,
            phone: dto.phone || null,
            avatar_url: dto.avatar_url || null,
          });
      }

      await this.supabaseService.clientRef
        .from('user_activities')
        .insert({ user_id: newUser.id, action: 'OTP_SENT' });
    }

    await this.mailService.sendOtpEmail(email, otp, dto.fullName);

    return { message: 'Account created. Check your email for the verification code.' };
  }

  // ─────────────────────────────────────────
  // VERIFY OTP
  // ─────────────────────────────────────────
  async verifyOtp(email: string, otp: string) {
    const { data: user } = await this.supabaseService.clientRef
      .from('users')
      .select('*')
      .eq('email', email.toLowerCase().trim())
      .single();

    if (!user) throw new NotFoundException('Account not found.');

    if (user.status === 'active') {
      throw new BadRequestException('Account is already verified. Please sign in.');
    }

    // OTP attempt limit
    if ((user.otp_attempts || 0) >= 5) {
      throw new BadRequestException('Too many attempts. Please register again to get a new code.');
    }

    if (user.otp_code !== otp) {
      await this.supabaseService.clientRef
        .from('users')
        .update({ otp_attempts: (user.otp_attempts || 0) + 1 })
        .eq('id', user.id);
      const remaining = 4 - (user.otp_attempts || 0);
      throw new BadRequestException(`Invalid code. ${remaining} attempts remaining.`);
    }

    const now = new Date();
    if (now > new Date(user.otp_expires_at)) {
      throw new BadRequestException('Code has expired. Please register again to get a new code.');
    }

    await this.supabaseService.clientRef
      .from('users')
      .update({
        status: 'active',
        otp_code: null,
        otp_expires_at: null,
        otp_verified: true,
        otp_attempts: 0,
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
    };
  }

  // ─────────────────────────────────────────
  // LOGIN
  // ─────────────────────────────────────────
  async login(email: string, password: string) {
    const { data: user } = await this.supabaseService.clientRef
      .from('users')
      .select('*')
      .eq('email', email.toLowerCase().trim())
      .single();

    // Generic error to prevent email enumeration
    if (!user) throw new UnauthorizedException('Invalid credentials');

    // Account lockout — 5 failures → 15min lock
    if ((user.failed_login_attempts || 0) >= 5) {
      const lockUntil = new Date(user.last_failed_login);
      lockUntil.setMinutes(lockUntil.getMinutes() + 15);
      if (new Date() < lockUntil) {
        const minutesLeft = Math.ceil((lockUntil.getTime() - Date.now()) / 60000);
        throw new UnauthorizedException(`Account temporarily locked. Try again in ${minutesLeft} minute${minutesLeft !== 1 ? 's' : ''}.`);
      }
      // Lockout expired — reset
      await this.supabaseService.clientRef
        .from('users')
        .update({ failed_login_attempts: 0 })
        .eq('id', user.id);
    }

    // Admin bypasses active check
    if (user.role !== 'admin' && user.status !== 'active') {
      throw new UnauthorizedException('Account is not active. Please verify your email or contact support.');
    }

    const passwordMatch = await bcrypt.compare(password, user.password_hash);

    if (!passwordMatch) {
      await this.supabaseService.clientRef
        .from('users')
        .update({
          failed_login_attempts: (user.failed_login_attempts || 0) + 1,
          last_failed_login: new Date().toISOString(),
        })
        .eq('id', user.id);
      throw new UnauthorizedException('Invalid credentials');
    }

    // Successful login — reset counters
    await this.supabaseService.clientRef
      .from('users')
      .update({ failed_login_attempts: 0, last_login: new Date().toISOString() })
      .eq('id', user.id);

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

  // ─────────────────────────────────────────
  // GET ME
  // ─────────────────────────────────────────
  async getMe(userId: string) {
    const { data, error } = await this.supabaseService.clientRef
      .from('users')
      .select('id, email, role, status, username, avatar_url')
      .eq('id', userId)
      .single();

    if (error || !data) throw new NotFoundException('User not found');
    return data;
  }

  // ─────────────────────────────────────────
  // ACTIVATE (admin-sent link flow)
  // ─────────────────────────────────────────
  async validateActivationToken(token: string) {
    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

    const { data, error } = await this.supabaseService.clientRef
      .from('users')
      .select('id, email, status, activation_token_expires_at')
      .eq('activation_token', hashedToken)
      .single();

    if (error || !data) throw new NotFoundException('Invalid activation link');
    if (data.status === 'active') throw new BadRequestException('Account is already activated');

    const now = new Date();
    if (now > new Date(data.activation_token_expires_at)) {
      throw new BadRequestException('Activation link has expired. Please contact support.');
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

    if (error || !data) throw new NotFoundException('Invalid activation link');
    if (data.status === 'active') throw new BadRequestException('Account already activated');

    const now = new Date();
    if (now > new Date(data.activation_token_expires_at)) {
      throw new BadRequestException('Activation link has expired.');
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

    return { message: 'Account activated successfully. You can now sign in.' };
  }

  // ─────────────────────────────────────────
  // FORGOT / RESET PASSWORD
  // ─────────────────────────────────────────
  async forgotPassword(email: string) {
    const { data: user } = await this.supabaseService.clientRef
      .from('users')
      .select('id, email, status')
      .eq('email', email.toLowerCase().trim())
      .single();

    // Always return success — prevent email enumeration
    if (!user || user.status !== 'active') {
      return { message: 'If this email is registered, a reset link has been sent.' };
    }

    const rawToken = crypto.randomBytes(32).toString('hex');
    const hashedToken = crypto.createHash('sha256').update(rawToken).digest('hex');
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

    await this.supabaseService.clientRef
      .from('users')
      .update({ reset_token: hashedToken, reset_token_expires_at: expiresAt })
      .eq('id', user.id);

    await this.mailService.sendPasswordResetEmail(user.email, rawToken);

    return { message: 'If this email is registered, a reset link has been sent.' };
  }

  async resetPassword(token: string, password: string) {
    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

    const { data, error } = await this.supabaseService.clientRef
      .from('users')
      .select('*')
      .eq('reset_token', hashedToken)
      .single();

    if (error || !data) throw new NotFoundException('Invalid or expired reset link');

    const now = new Date();
    if (now > new Date(data.reset_token_expires_at)) {
      throw new BadRequestException('Reset link has expired. Please request a new one.');
    }

    const password_hash = await bcrypt.hash(password, 12);

    await this.supabaseService.clientRef
      .from('users')
      .update({ password_hash, reset_token: null, reset_token_expires_at: null })
      .eq('id', data.id);

    return { message: 'Password reset successfully. You can now sign in.' };
  }

  // ─────────────────────────────────────────
  // GENERATE ACTIVATION TOKEN (for admin flow)
  // ─────────────────────────────────────────
  generateActivationToken(): { rawToken: string; hashedToken: string; expiresAt: Date } {
    const rawToken = crypto.randomBytes(32).toString('hex');
    const hashedToken = crypto.createHash('sha256').update(rawToken).digest('hex');
    const expiresAt = new Date(Date.now() + 48 * 60 * 60 * 1000); // 48 hours
    return { rawToken, hashedToken, expiresAt };
  }
}