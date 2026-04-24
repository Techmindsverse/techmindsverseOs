import { JwtService } from '@nestjs/jwt';
import { SupabaseService } from '../supabase/supabase.service';
export declare class AuthService {
    private jwtService;
    private supabaseService;
    constructor(jwtService: JwtService, supabaseService: SupabaseService);
    login(email: string, password: string): Promise<{
        access_token: string;
        role: any;
        user: {
            id: any;
            email: any;
            role: any;
        };
    }>;
    getMe(userId: string): Promise<{
        id: any;
        email: any;
        role: any;
        status: any;
    }>;
    validateActivationToken(token: string): Promise<{
        valid: boolean;
        email: any;
    }>;
    activateAccount(token: string, password: string): Promise<{
        message: string;
    }>;
    generateActivationToken(): {
        rawToken: string;
        hashedToken: string;
        expiresAt: Date;
    };
}
