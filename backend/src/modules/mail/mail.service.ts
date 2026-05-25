import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Resend } from 'resend';

@Injectable()
export class MailService {
  private readonly resend: Resend;
  private readonly logger = new Logger(MailService.name);
  private readonly from: string;
  private readonly adminEmail: string;
  private readonly frontendUrl: string;
  private readonly isDev: boolean;

  constructor(private readonly configService: ConfigService) {
    this.resend = new Resend(this.configService.getOrThrow<string>('RESEND_API_KEY'));
    this.from = this.configService.getOrThrow<string>('MAIL_FROM');
    this.adminEmail = this.configService.getOrThrow<string>('ADMIN_EMAIL');
    this.frontendUrl = this.configService.getOrThrow<string>('FRONTEND_URL');
    // If no custom domain, all emails go to admin email
    this.isDev = !this.configService.get<string>('CUSTOM_DOMAIN');
  }

  // Route recipient — until domain verified, all go to admin
  private recipient(email: string): string {
    return this.isDev ? this.adminEmail : email;
  }

  async sendOtpEmail(email: string, otp: string, name?: string) {
    try {
      await this.resend.emails.send({
        from: this.from,
        to: this.recipient(email),
        subject: `[${email}] Verify Your TechMindsVerse Account — OTP: ${otp}`,
        html: `
          <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;background:#000;color:#fff;padding:40px;">
            ${this.isDev ? `<p style="background:#1a1a00;border:1px solid #ffff00;color:#ffff00;padding:8px;font-size:11px;margin-bottom:16px;">DEV MODE: This email was meant for ${email}</p>` : ''}
            <h2 style="color:#1A3BDB;">Welcome${name ? `, ${name}` : ''} 👋</h2>
            <p style="color:#999;">Your verification code for TechMindsVerse OS:</p>
            <div style="background:#0a0a0a;border:1px solid #1A3BDB;padding:24px;text-align:center;margin:24px 0;">
              <span style="font-size:48px;font-weight:bold;letter-spacing:12px;color:#1A3BDB;">${otp}</span>
            </div>
            <p style="color:#666;font-size:13px;">This code expires in 15 minutes.</p>
            <p style="color:#666;font-size:13px;">If you did not request this, ignore this email.</p>
          </div>
        `,
      });
      this.logger.log(`OTP email sent → ${email} (delivered to: ${this.recipient(email)})`);
    } catch (err) {
      this.logger.error('Failed to send OTP email', err);
      throw err;
    }
  }

  async sendActivationEmail(email: string, token: string) {
    const link = `${this.frontendUrl}/activate?token=${token}`;
    try {
      await this.resend.emails.send({
        from: this.from,
        to: this.recipient(email),
        subject: `[${email}] Activate Your TechMindsVerse Account`,
        html: `
          <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;background:#000;color:#fff;padding:40px;">
            ${this.isDev ? `<p style="background:#1a1a00;border:1px solid #ffff00;color:#ffff00;padding:8px;font-size:11px;margin-bottom:16px;">DEV MODE: This email was meant for ${email}</p>` : ''}
            <h2 style="color:#1A3BDB;">Welcome to TechMindsVerse</h2>
            <p style="color:#999;">Your account has been approved. Click below to activate your account and set your password.</p>
            <a href="${link}" style="display:inline-block;padding:14px 28px;background:#1A3BDB;color:#fff;text-decoration:none;margin:24px 0;font-weight:600;">
              Activate Account
            </a>
            <p style="color:#666;font-size:13px;">This link expires in 48 hours.</p>
          </div>
        `,
      });
      this.logger.log(`Activation email → ${email} (delivered to: ${this.recipient(email)})`);
    } catch (err) {
      this.logger.error('Failed to send activation email', err);
      throw err;
    }
  }

  async sendPasswordResetEmail(email: string, token: string) {
    const link = `${this.frontendUrl}/reset-password?token=${token}`;
    try {
      await this.resend.emails.send({
        from: this.from,
        to: this.recipient(email),
        subject: `[${email}] Reset Your TechMindsVerse Password`,
        html: `
          <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;background:#000;color:#fff;padding:40px;">
            ${this.isDev ? `<p style="background:#1a1a00;border:1px solid #ffff00;color:#ffff00;padding:8px;font-size:11px;margin-bottom:16px;">DEV MODE: This email was meant for ${email}</p>` : ''}
            <h2 style="color:#1A3BDB;">Reset Your Password</h2>
            <p style="color:#999;">You requested a password reset.</p>
            <a href="${link}" style="display:inline-block;padding:14px 28px;background:#1A3BDB;color:#fff;text-decoration:none;margin:24px 0;font-weight:600;">
              Reset Password
            </a>
            <p style="color:#666;font-size:13px;">This link expires in 1 hour.</p>
          </div>
        `,
      });
      this.logger.log(`Password reset → ${email} (delivered to: ${this.recipient(email)})`);
    } catch (err) {
      this.logger.error('Failed to send password reset email', err);
      throw err;
    }
  }

  async sendContactEmail(data: { name: string; email: string; subject: string; message: string }) {
    try {
      await this.resend.emails.send({
        from: this.from,
        to: this.adminEmail,
        replyTo: data.email,
        subject: `New Contact: ${data.subject}`,
        html: `
          <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;background:#000;color:#fff;padding:40px;">
            <h2 style="color:#1A3BDB;">New Contact Submission</h2>
            <p><strong style="color:#999;">Name:</strong> ${data.name}</p>
            <p><strong style="color:#999;">Email:</strong> ${data.email}</p>
            <p><strong style="color:#999;">Subject:</strong> ${data.subject}</p>
            <hr style="border-color:#222;margin:20px 0;" />
            <p style="color:#ccc;white-space:pre-line;">${data.message}</p>
          </div>
        `,
      });
    } catch (err) {
      this.logger.error('Failed to send contact email', err);
      throw err;
    }
  }

  async sendBuildRequestEmail(data: { name: string; email: string; category: string; description: string; budget?: string; mode?: string }) {
    try {
      await this.resend.emails.send({
        from: this.from,
        to: this.adminEmail,
        replyTo: data.email,
        subject: `New Build Request: ${data.category} — ${data.name}`,
        html: `
          <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;background:#000;color:#fff;padding:40px;">
            <h2 style="color:#1A3BDB;">New Build Request</h2>
            <p><strong style="color:#999;">Client:</strong> ${data.name}</p>
            <p><strong style="color:#999;">Email:</strong> ${data.email}</p>
            <p><strong style="color:#999;">Category:</strong> ${data.category}</p>
            <p><strong style="color:#999;">Mode:</strong> ${data.mode || 'Not specified'}</p>
            <p><strong style="color:#999;">Budget:</strong> ${data.budget || 'Not specified'}</p>
            <hr style="border-color:#222;margin:20px 0;" />
            <p style="color:#ccc;white-space:pre-line;">${data.description}</p>
          </div>
        `,
      });
    } catch (err) {
      this.logger.error('Failed to send build request email', err);
      throw err;
    }
  }
}