import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY, PERMISSIONS_KEY, MODULES_KEY } from '../decorators/roles.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<string[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    const requiredPermissions = this.reflector.getAllAndOverride<string[]>(PERMISSIONS_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    const requiredModules = this.reflector.getAllAndOverride<string[]>(MODULES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    // No restrictions — public route
    if (!requiredRoles && !requiredPermissions && !requiredModules) return true;

    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (!user) throw new UnauthorizedException('Authentication required');

    const userRoles: string[] = user.roles || [user.role] || [];

    // Super admin bypasses everything
    if (userRoles.includes('super_admin') || userRoles.includes('admin')) {
      return true;
    }

    // Check roles
    if (requiredRoles?.length) {
      const hasRole = requiredRoles.some(r => userRoles.includes(r));
      if (!hasRole) {
        throw new ForbiddenException('Insufficient permissions');
      }
    }

    // Check permissions
    if (requiredPermissions?.length) {
      const userPermissions: string[] = user.permissions || [];
      const hasPermission = requiredPermissions.every(p => userPermissions.includes(p));
      if (!hasPermission) {
        throw new ForbiddenException('Missing required permissions');
      }
    }

    return true;
  }
}