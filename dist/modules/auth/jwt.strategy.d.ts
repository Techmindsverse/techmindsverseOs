import { Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { SupabaseService } from '../supabase/supabase.service';
declare const JwtStrategy_base: new (...args: [opt: import("passport-jwt").StrategyOptionsWithRequest] | [opt: import("passport-jwt").StrategyOptionsWithoutRequest]) => Strategy & {
    validate(...args: any[]): unknown;
};
export declare class JwtStrategy extends JwtStrategy_base {
    private configService;
    private supabaseService;
    constructor(configService: ConfigService, supabaseService: SupabaseService);
    validate(payload: any): Promise<{
        id: any;
        email: any;
        role: any;
        status: any;
    }>;
}
export {};
