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

  constructor(private readonly configService: ConfigService) {
    this.resend = new Resend(this.configService.getOrThrow<string>('RESEND_API_KEY'));
    this.from = this.configService.getOrThrow<string>('MAIL_FROM');
    this.adminEmail = this.configService.getOrThrow<string>('ADMIN_EMAIL');
    this.frontendUrl = this.configService.getOrThrow<string>('FRONTEND_URL');
  }

  async sendActivationEmail(email: string, token: string) {
    const link = `${this.frontendUrl}/activate?token=${token}`;
    try {
      await this.resend.emails.send({
        from: this.from,
        to: email,
        subject: 'Activate Your TechMindsVerse Account',
        html: `
          <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;background:#000;color:#fff;padding:40px;">
            <h2 style="color:#1A3BDB;">Welcome to TechMindsVerse</h2>
            <p style="color:#999;">Your account has been approved. Click below to activate your account and set your password.</p>
            <a href="${link}" style="display:inline-block;padding:14px 28px;background:#1A3BDB;color:#fff;text-decoration:none;border-radius:4px;margin:24px 0;font-weight:600;">
              Activate Account
            </a>
            <p style="color:#666;font-size:13px;">This link expires in 48 hours.</p>
            <p style="color:#666;font-size:13px;">If you did not expect this email, ignore it.</p>
          </div>
        `,
      });
      this.logger.log(`Activation email sent to ${email}`);
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
        to: email,
        subject: 'Reset Your TechMindsVerse Password',
        html: `
          <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;background:#000;color:#fff;padding:40px;">
            <h2 style="color:#1A3BDB;">Reset Your Password</h2>
            <p style="color:#999;">You requested a password reset. Click below to set a new password.</p>
            <a href="${link}" style="display:inline-block;padding:14px 28px;background:#1A3BDB;color:#fff;text-decoration:none;border-radius:4px;margin:24px 0;font-weight:600;">
              Reset Password
            </a>
            <p style="color:#666;font-size:13px;">This link expires in 1 hour.</p>
            <p style="color:#666;font-size:13px;">If you did not request this, ignore this email.</p>
          </div>
        `,
      });
      this.logger.log(`Password reset email sent to ${email}`);
    } catch (err) {
      this.logger.error('Failed to send password reset email', err);
      throw err;
    }
  }

  async sendContactEmail(data: {
    name: string;
    email: string;
    subject: string;
    message: string;
  }) {
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
      this.logger.log(`Contact email received from ${data.email}`);
    } catch (err) {
      this.logger.error('Failed to send contact email', err);
      throw err;
    }
  }

  async sendBuildRequestEmail(data: {
    name: string;
    email: string;
    category: string;
    description: string;
    budget?: string;
    mode?: string;
  }) {
    try {
      // Notify admin
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

      // Confirm to client
      await this.resend.emails.send({
        from: this.from,
        to: data.email,
        subject: 'We received your build request — TechMindsVerse',
        html: `
          <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;background:#000;color:#fff;padding:40px;">
            <h2 style="color:#1A3BDB;">Build Request Received</h2>
            <p style="color:#999;">Hi ${data.name}, we have received your build request for a <strong>${data.category}</strong> project.</p>
            <p style="color:#999;">Our team will review it and contact you within 24–48 hours with next steps.</p>
            <hr style="border-color:#222;margin:20px 0;" />
            <p style="color:#666;font-size:13px;">TechMindsVerse Build Studio — Turning ideas into real digital products.</p>
          </div>
        `,
      });

      this.logger.log(`Build request emails sent for ${data.email}`);
    } catch (err) {
      this.logger.error('Failed to send build request email', err);
      throw err;
    }
  }
}