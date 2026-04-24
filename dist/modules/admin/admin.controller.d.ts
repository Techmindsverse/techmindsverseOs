import { AdminService } from './admin.service';
import { AdminNoteDto } from './dto/admin-note.dto';
export declare class AdminController {
    private readonly adminService;
    constructor(adminService: AdminService);
    getAllPayments(page?: number, limit?: number): Promise<{
        data: any[];
        total: number;
        page: number;
        limit: number;
    }>;
    approvePayment(id: string, dto: AdminNoteDto): Promise<{
        message: string;
    }>;
    rejectPayment(id: string, dto: AdminNoteDto): Promise<{
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
