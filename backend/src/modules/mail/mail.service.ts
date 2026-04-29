import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';

@Injectable()
export class MailService {
  private transporter: nodemailer.Transporter;
  private readonly logger = new Logger(MailService.name);

  constructor(private readonly configService: ConfigService) {
    this.transporter = nodemailer.createTransport({
      host: this.configService.get<string>('MAIL_HOST'),
      port: this.configService.get<number>('MAIL_PORT'),
      secure: false, // true only for 465
      auth: {
        user: this.configService.get<string>('MAIL_USER'),
        pass: this.configService.get<string>('MAIL_PASS'),
      },
    });
  }

  // -----------------------------
  // ACTIVATE ACCOUNT EMAIL
  // -----------------------------
  async sendActivationEmail(email: string, token: string): Promise<void> {
    try {
      const frontendUrl = this.configService.getOrThrow<string>('FRONTEND_URL');
      const activationLink = `${frontendUrl}/activate?token=${token}`;

      await this.transporter.sendMail({
        from: `"TechMindsVerse" <${this.configService.get('MAIL_USER')}>`,
        to: email,
        subject: 'Activate Your TechMindsVerse Account',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #1A3BDB;">Welcome to TechMindsVerse</h2>
            <p>Your account has been approved. Click below to activate your account.</p>

            <a href="${activationLink}" 
              style="display:inline-block;padding:12px 24px;background:#1A3BDB;color:#fff;text-decoration:none;border-radius:6px;margin-top:20px;">
              Activate Account
            </a>

            <p style="color:#666;margin-top:20px;">
              This link expires in 48 hours.
            </p>
          </div>
        `,
      });

      this.logger.log(`Activation email sent to ${email}`);
    } catch (err) {
      this.logger.error('Failed to send activation email', err);
    }
  }

  // -----------------------------
  // CONTACT EMAIL (ADMIN ALERT)
  // -----------------------------
  async sendContactEmail(data: {
    name: string;
    email: string;
    subject: string;
    message: string;
  }): Promise<void> {
    try {
      await this.transporter.sendMail({
        from: `"TechMindsVerse Contact" <${this.configService.get('MAIL_USER')}>`,
        to: this.configService.get('MAIL_USER'), // ADMIN EMAIL
        subject: `New Contact Message: ${data.subject}`,
        html: `
          <div style="font-family: Arial, sans-serif;">
            <h2 style="color:#1A3BDB;">New Contact Submission</h2>

            <p><b>Name:</b> ${data.name}</p>
            <p><b>Email:</b> ${data.email}</p>
            <p><b>Subject:</b> ${data.subject}</p>

            <hr />

            <p style="white-space: pre-line;">${data.message}</p>
          </div>
        `,
      });

      this.logger.log(`Contact email sent from ${data.email}`);
    } catch (err) {
      this.logger.error('Failed to send contact email', err);
    }
  }
}