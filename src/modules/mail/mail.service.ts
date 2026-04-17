import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';

@Injectable()
export class MailService {
  private transporter: nodemailer.Transporter;

  constructor(private configService: ConfigService) {
    this.transporter = nodemailer.createTransport({
      host: this.configService.get<string>('MAIL_HOST'),
      port: this.configService.get<number>('MAIL_PORT'),
      secure: false,
      auth: {
        user: this.configService.get<string>('MAIL_USER'),
        pass: this.configService.get<string>('MAIL_PASS'),
      },
    });
  }

  async sendActivationEmail(email: string, token: string): Promise<void> {
    const frontendUrl = this.configService.getOrThrow<string>('FRONTEND_URL');
    const activationLink = `${frontendUrl}/activate?token=${token}`;

    await this.transporter.sendMail({
      from: `"TechMindsVerse" <${this.configService.get('MAIL_USER')}>`,
      to: email,
      subject: 'Activate Your TechMindsVerse Account',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #1A3BDB;">Welcome to TechMindsVerse</h2>
          <p>Your account has been approved. Click the button below to activate your account and set your password.</p>
          <a href="${activationLink}" 
             style="display: inline-block; padding: 12px 24px; background-color: #1A3BDB; color: white; text-decoration: none; border-radius: 6px; margin: 20px 0;">
            Activate Account
          </a>
          <p style="color: #666;">This link expires in 48 hours.</p>
          <p style="color: #666;">If you did not expect this email, ignore it.</p>
        </div>
      `,
    });
  }
}