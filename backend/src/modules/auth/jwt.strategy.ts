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
    if (!secret) throw new Error('JWT_SECRET missing');

    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: secret,
    });
  }

  async validate(payload: any) {
    // Load user with roles and active modules in one query
    const { data: user, error } = await this.supabaseService.clientRef
      .from('users')
      .select(`
        id, email, role, roles, status, is_verified,
        module_memberships!inner(module, status)
      `)
      .eq('id', payload.sub)
      .single();

    if (error || !user) throw new UnauthorizedException('User not found');

    const userRoles: string[] = user.roles || [user.role] || ['member'];
    const isPrivileged =
      userRoles.includes('admin') || userRoles.includes('super_admin');

    if (!isPrivileged && user.status !== 'active') {
      throw new UnauthorizedException('Account is not active');
    }

    const activeModules = ((user as any).module_memberships || [])
      .filter((m: any) => m.status === 'active')
      .map((m: any) => m.module);

    return {
      id: user.id,
      email: user.email,
      role: user.role,
      roles: userRoles,
      status: user.status,
      is_verified: user.is_verified,
      modules: activeModules,
    };
  }
}