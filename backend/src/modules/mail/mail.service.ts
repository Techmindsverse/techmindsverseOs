import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Resend } from 'resend';

@Injectable()
export class MailService {
  private readonly resend: Resend;
  private readonly logger = new Logger(MailService.name);
  private readonly from: string;
  private readonly frontendUrl: string;

  constructor(private readonly configService: ConfigService) {
    const apiKey = this.configService.getOrThrow<string>('RESEND_API_KEY');

    this.resend = new Resend(apiKey);
    this.from = this.configService.getOrThrow<string>('MAIL_FROM');
    this.frontendUrl = this.configService.getOrThrow<string>('FRONTEND_URL');
  }

  async sendActivationEmail(email: string, token: string) {
    const link = `${this.frontendUrl}/activate?token=${token}`;

    await this.resend.emails.send({
      from: this.from,
      to: email,
      subject: 'Activate Your TechMindsVerse Account',
      html: `
        <h2>Welcome to TechMindsVerse</h2>
        <p>Your account has been approved.</p>
        <a href="${link}" style="padding:10px 20px;background:#1A3BDB;color:#fff;text-decoration:none;">
          Activate Account
        </a>
        <p>Expires in 48 hours.</p>
      `,
    });

    this.logger.log(`Activation email sent to ${email}`);
  }

  async sendPasswordResetEmail(email: string, token: string) {
    const link = `${this.frontendUrl}/reset-password?token=${token}`;

    await this.resend.emails.send({
      from: this.from,
      to: email,
      subject: 'Reset Your Password',
      html: `
        <h2>Password Reset</h2>
        <a href="${link}">Reset Password</a>
        <p>Expires in 1 hour.</p>
      `,
    });

    this.logger.log(`Password reset sent to ${email}`);
  }

  async sendContactEmail(data: {
    name: string;
    email: string;
    subject: string;
    message: string;
  }) {
    await this.resend.emails.send({
      from: this.from,
      to: this.from,
      replyTo: data.email,
      subject: `New Contact: ${data.subject}`,
      html: `
        <h2>Contact Message</h2>
        <p><b>Name:</b> ${data.name}</p>
        <p><b>Email:</b> ${data.email}</p>
        <p><b>Message:</b> ${data.message}</p>
      `,
    });

    this.logger.log(`Contact email received from ${data.email}`);
  }
}