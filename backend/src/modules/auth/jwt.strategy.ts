import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { SupabaseService } from '../supabase/supabase.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly configService: ConfigService,
    private readonly supabaseService: SupabaseService,
  ) {
    const secret = configService.get<string>('JWT_SECRET');
    if (!secret) throw new Error('JWT_SECRET is missing');

    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: secret,
    });
  }

  async validate(payload: any) {
    // Step 1: Load user
    const { data: user, error } = await this.supabaseService.clientRef
      .from('users')
      .select('id, email, role, roles, status, is_verified')
      .eq('id', payload.sub)
      .single();

    if (error || !user) {
      throw new UnauthorizedException('User not found');
    }

    const userRoles: string[] = user.roles || [user.role] || ['member'];
    const isPrivileged =
      userRoles.includes('admin') || userRoles.includes('super_admin');

    // Privileged roles bypass status check
    if (!isPrivileged && user.status !== 'active') {
      throw new UnauthorizedException('Account is not active');
    }

    // Step 2: Load modules separately — never fail auth if this errors
    let activeModules: string[] = [];
    try {
      const { data: memberships } = await this.supabaseService.clientRef
        .from('module_memberships')
        .select('module, status')
        .eq('user_id', user.id)
        .eq('status', 'active');

      activeModules = (memberships || []).map((m: any) => m.module);
    } catch {
      // module_memberships may not exist yet — fail silently
      activeModules = [];
    }

    return {
      id: user.id,
      email: user.email,
      role: user.role,
      roles: userRoles,
      status: user.status,
      is_verified: user.is_verified ?? false,
      modules: activeModules,
    };
  }
}