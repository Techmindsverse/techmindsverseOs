import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { SupabaseService } from '../supabase/supabase.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private configService: ConfigService,
    private supabaseService: SupabaseService,
  ) {
    const jwtSecret = configService.get<string>('JWT_SECRET');

    if (!jwtSecret) {
      throw new Error('JWT_SECRET is missing in environment variables');
    }

    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: jwtSecret,
    });
  }

  async validate(payload: any) {
    const { data, error } = await this.supabaseService.db
      .from('users')
      .select('id, email, role, status')
      .eq('id', payload.sub)
      .single();

    if (error || !data) {
      throw new UnauthorizedException('User not found');
    }

    if (data.status !== 'active') {
      throw new UnauthorizedException('Account is not active');
    }

    return {
      id: data.id,
      email: data.email,
      role: data.role,
      status: data.status,
    };
  }
}