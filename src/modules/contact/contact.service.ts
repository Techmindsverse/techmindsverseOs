import { Injectable } from '@nestjs/common';
import { SupabaseService } from '../supabase/supabase.service';
import { CreateContactDto } from './dto/create-contact.dto';

@Injectable()
export class ContactService {
  constructor(private supabaseService: SupabaseService) {}

  async send(dto: CreateContactDto) {
    const { error } = await this.supabaseService.db.from('contacts').insert(dto);
    if (error) throw new Error('Failed to send message');
    return { message: 'Message sent successfully' };
  }
}