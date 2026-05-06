import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Resend } from 'resend';

@Injectable()
export class MailService {
  private readonly resend: Resend;
  private readonly logger = new Logger(MailService.name);

  constructor(private readonly configService: ConfigService) {
    const apiKey = this.configService.get<string>('RESEND_API_KEY');

    if (!apiKey) {
      throw new Error('RESEND_API_KEY is not set');
    }

    this.resend = new Resend(apiKey);
  }

  private getFrom() {
    return this.configService.get<string>('MAIL_FROM')!;
  }

  async sendActivationEmail(email: string, token: string) {
    try {
      const frontendUrl = this.configService.getOrThrow<string>('FRONTEND_URL');
      const link = `${frontendUrl}/activate?token=${token}`;

      await this.resend.emails.send({
        from: this.getFrom(),
        to: email,
        subject: 'Activate Your TechMindsVerse Account',
        html: `
          <h2>Welcome to TechMindsVerse</h2>
          <p>Your account has been approved.</p>
          <a href="${link}" style="padding:10px 20px;background:#1A3BDB;color:#fff;text-decoration:none;border-radius:5px;">
            Activate Account
          </a>
          <p>This link expires in 48 hours.</p>
        `,
      });

      this.logger.log(`Activation email sent to ${email}`);
    } catch (err) {
      this.logger.error('Activation email failed', err);
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
        from: this.getFrom(),
        to: this.getFrom(),
        replyTo: data.email,
        subject: `New Contact: ${data.subject}`,
        html: `
          <h2>New Contact Message</h2>
          <p><b>Name:</b> ${data.name}</p>
          <p><b>Email:</b> ${data.email}</p>
          <p><b>Subject:</b> ${data.subject}</p>
          <hr/>
          <p>${data.message}</p>
        `,
      });

      this.logger.log(`Contact email from ${data.email}`);
    } catch (err) {
      this.logger.error('Contact email failed', err);
      throw err;
    }
  }

  async sendPasswordResetEmail(email: string, token: string) {
    try {
      const frontendUrl = this.configService.getOrThrow<string>('FRONTEND_URL');
      const link = `${frontendUrl}/reset-password?token=${token}`;

      await this.resend.emails.send({
        from: this.getFrom(),
        to: email,
        subject: 'Reset Your Password',
        html: `
          <h2>Password Reset</h2>
          <p>Click below to reset your password:</p>
          <a href="${link}" style="padding:10px 20px;background:#1A3BDB;color:#fff;text-decoration:none;border-radius:5px;">
            Reset Password
          </a>
          <p>This link expires in 1 hour.</p>
        `,
      });

      this.logger.log(`Password reset email sent to ${email}`);
    } catch (err) {
      this.logger.error('Password reset failed', err);
      throw err;
    }
  }
}