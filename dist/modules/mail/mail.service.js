"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MailService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const nodemailer = require("nodemailer");
let MailService = class MailService {
    constructor(configService) {
        this.configService = configService;
        this.transporter = nodemailer.createTransport({
            host: this.configService.get('MAIL_HOST'),
            port: this.configService.get('MAIL_PORT'),
            secure: false,
            auth: {
                user: this.configService.get('MAIL_USER'),
                pass: this.configService.get('MAIL_PASS'),
            },
        });
    }
    async sendActivationEmail(email, token) {
        const frontendUrl = this.configService.getOrThrow('FRONTEND_URL');
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
};
exports.MailService = MailService;
exports.MailService = MailService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], MailService);
//# sourceMappingURL=mail.service.js.map