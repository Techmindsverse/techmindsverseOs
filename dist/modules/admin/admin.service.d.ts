import { SupabaseService } from '../supabase/supabase.service';
import { MailService } from '../mail/mail.service';
import { AuthService } from '../auth/auth.service';
import { AdminNoteDto } from './dto/admin-note.dto';
export declare class AdminService {
    private supabaseService;
    private mailService;
    private authService;
    constructor(supabaseService: SupabaseService, mailService: MailService, authService: AuthService);
    getAllPayments(page?: number, limit?: number): Promise<{
        data: any[];
        total: number;
        page: number;
        limit: number;
    }>;
    approvePayment(paymentId: string, dto: AdminNoteDto): Promise<{
        message: string;
    }>;
    rejectPayment(paymentId: string, dto: AdminNoteDto): Promise<{
        message: string;
    }>;
    getAllStudents(page?: number, limit?: number): Promise<{
        data: any[];
        total: number;
        page: number;
        limit: number;
    }>;
    getAllProjects(page?: number, limit?: number): Promise<{
        data: any[];
        total: number;
        page: number;
        limit: number;
    }>;
    getAllComplaints(page?: number, limit?: number): Promise<{
        data: any[];
        total: number;
        page: number;
        limit: number;
    }>;
    getAllContacts(page?: number, limit?: number): Promise<{
        data: any[];
        total: number;
        page: number;
        limit: number;
    }>;
    getAllBuilds(page?: number, limit?: number): Promise<{
        data: any[];
        total: number;
        page: number;
        limit: number;
    }>;
}
