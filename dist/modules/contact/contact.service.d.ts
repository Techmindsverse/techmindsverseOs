import { SupabaseService } from '../supabase/supabase.service';
import { CreateContactDto } from './dto/create-contact.dto';
export declare class ContactService {
    private supabaseService;
    constructor(supabaseService: SupabaseService);
    send(dto: CreateContactDto): Promise<{
        message: string;
    }>;
}
