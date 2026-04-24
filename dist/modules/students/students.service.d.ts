import { SupabaseService } from '../supabase/supabase.service';
export declare class StudentsService {
    private supabaseService;
    constructor(supabaseService: SupabaseService);
    getProfile(userId: string): Promise<any>;
    getById(id: string): Promise<any>;
}
