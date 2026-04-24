import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { ActivateDto } from './dto/activate.dto';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    login(dto: LoginDto): Promise<{
        access_token: string;
        role: any;
        user: {
            id: any;
            email: any;
            role: any;
        };
    }>;
    getMe(user: any): Promise<{
        id: any;
        email: any;
        role: any;
        status: any;
    }>;
    validateToken(token: string): Promise<{
        valid: boolean;
        email: any;
    }>;
    activate(dto: ActivateDto): Promise<{
        message: string;
    }>;
}
