import { SupabaseService } from '../supabase/supabase.service';
import { CreateComplaintDto } from './dto/create-complaint.dto';
export declare class ComplaintsService {
    private supabaseService;
    constructor(supabaseService: SupabaseService);
    create(userId: string, dto: CreateComplaintDto): Promise<{
        message: string;
    }>;
}
