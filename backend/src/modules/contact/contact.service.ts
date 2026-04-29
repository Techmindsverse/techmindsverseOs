import { Injectable } from '@nestjs/common';
import { SupabaseService } from '../supabase/supabase.service';
import { CreateContactDto } from './dto/create-contact.dto';
import { MailService } from '../mail/mail.service';

@Injectable()
export class ContactService {
  constructor(
    private readonly supabaseService: SupabaseService,
    private readonly mailService: MailService,
  ) {}

  async send(dto: CreateContactDto) {
    // 1. Save to Supabase
    const { error } = await this.supabaseService.db
      .from('contacts')
      .insert(dto);

    if (error) throw new Error('Failed to send message');

    // 2. SEND EMAIL (THIS WAS MISSING)
    await this.mailService.sendContactEmail(dto);

    return { message: 'Message sent successfully' };
  }
}