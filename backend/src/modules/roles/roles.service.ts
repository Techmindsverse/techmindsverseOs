import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { SupabaseService } from '../supabase/supabase.service';

export type UserRole =
  | 'super_admin'
  | 'admin'
  | 'instructor'
  | 'student'
  | 'builder'
  | 'client'
  | 'member';

export type ModuleName =
  | 'academy'
  | 'build_studio'
  | 'community'
  | 'admin_panel'
  | 'marketplace'
  | 'hiring'
  | 'ai_tools';

// Which modules each role gets automatically on assignment
const ROLE_DEFAULT_MODULES: Record<UserRole, ModuleName[]> = {
  member: ['community'],
  student: ['community', 'academy'],
  client: ['community', 'build_studio'],
  builder: ['community', 'build_studio'],
  instructor: ['community', 'academy'],
  admin: ['community', 'academy', 'build_studio', 'admin_panel'],
  super_admin: [
    'community',
    'academy',
    'build_studio',
    'admin_panel',
    'marketplace',
    'hiring',
    'ai_tools',
  ],
};

// Valid role upgrade paths
const UPGRADE_PATHS: Record<UserRole, UserRole[]> = {
  member: ['student', 'client'],
  student: ['builder', 'instructor', 'client'],
  client: ['student', 'builder'],
  builder: ['instructor', 'client'],
  instructor: ['builder'],
  admin: [],
  super_admin: [],
};

@Injectable()
export class RolesService {
  constructor(private readonly supabaseService: SupabaseService) {}

  // ─────────────────────────────────────────
  // READ
  // ─────────────────────────────────────────

  async getUserWithRoles(userId: string) {
    const { data, error } = await this.supabaseService.clientRef
      .from('users')
      .select(
        'id, email, role, roles, status, is_verified, username, avatar_url',
      )
      .eq('id', userId)
      .single();

    if (error || !data) throw new NotFoundException('User not found');
    return data;
  }

  async getUserModules(userId: string): Promise<ModuleName[]> {
    const { data } = await this.supabaseService.clientRef
      .from('module_memberships')
      .select('module')
      .eq('user_id', userId)
      .eq('status', 'active');

    return (data || []).map((m) => m.module as ModuleName);
  }

  async hasModuleAccess(userId: string, module: ModuleName): Promise<boolean> {
    const { data } = await this.supabaseService.clientRef
      .from('module_memberships')
      .select('id')
      .eq('user_id', userId)
      .eq('module', module)
      .eq('status', 'active')
      .single();

    return !!data;
  }

  getUpgradePaths(role: UserRole): UserRole[] {
    return UPGRADE_PATHS[role] || [];
  }

  // ─────────────────────────────────────────
  // ROLE MANAGEMENT
  // ─────────────────────────────────────────

  async addRole(userId: string, newRole: UserRole, grantedBy: string) {
    const user = await this.getUserWithRoles(userId);
    const currentRoles: UserRole[] = user.roles || [user.role];

    if (currentRoles.includes(newRole)) {
      throw new BadRequestException(
        `User already has the ${newRole} role.`,
      );
    }

    const updatedRoles = [...new Set([...currentRoles, newRole])];

    const { error } = await this.supabaseService.clientRef
      .from('users')
      .update({ roles: updatedRoles })
      .eq('id', userId);

    if (error) throw new BadRequestException('Failed to add role');

    await this.supabaseService.clientRef.from('role_history').insert({
      user_id: userId,
      from_roles: currentRoles,
      to_roles: updatedRoles,
      primary_role_changed: false,
      reason: `Role ${newRole} added`,
      changed_by: grantedBy,
    });

    // Auto-grant default modules for new role
    await this.grantDefaultModules(userId, newRole, grantedBy);

    await this.supabaseService.clientRef.from('user_activities').insert({
      user_id: userId,
      action: `ROLE_ADDED:${newRole}`,
    });

    return {
      message: `Role ${newRole} added successfully`,
      roles: updatedRoles,
    };
  }

  async setPrimaryRole(
    userId: string,
    newPrimary: UserRole,
    changedBy: string,
  ) {
    const user = await this.getUserWithRoles(userId);
    const currentRoles: UserRole[] = user.roles || [user.role];

    // Add to roles array if not present
    if (!currentRoles.includes(newPrimary)) {
      await this.addRole(userId, newPrimary, changedBy);
    }

    const { error } = await this.supabaseService.clientRef
      .from('users')
      .update({ role: newPrimary })
      .eq('id', userId);

    if (error) throw new BadRequestException('Failed to set primary role');

    await this.supabaseService.clientRef.from('role_history').insert({
      user_id: userId,
      from_roles: currentRoles,
      to_roles: currentRoles.includes(newPrimary)
        ? currentRoles
        : [...currentRoles, newPrimary],
      primary_role_changed: true,
      from_primary: user.role,
      to_primary: newPrimary,
      reason: 'Primary role updated',
      changed_by: changedBy,
    });

    return { message: `Primary role set to ${newPrimary}` };
  }

  async removeRole(userId: string, roleToRemove: UserRole, removedBy: string) {
    const user = await this.getUserWithRoles(userId);
    const currentRoles: UserRole[] = user.roles || [user.role];

    if (user.role === roleToRemove) {
      throw new BadRequestException(
        'Cannot remove the primary role. Change primary role first.',
      );
    }

    const updatedRoles = currentRoles.filter((r) => r !== roleToRemove);

    const { error } = await this.supabaseService.clientRef
      .from('users')
      .update({ roles: updatedRoles })
      .eq('id', userId);

    if (error) throw new BadRequestException('Failed to remove role');

    await this.supabaseService.clientRef.from('role_history').insert({
      user_id: userId,
      from_roles: currentRoles,
      to_roles: updatedRoles,
      reason: `Role ${roleToRemove} removed`,
      changed_by: removedBy,
    });

    return { message: `Role ${roleToRemove} removed`, roles: updatedRoles };
  }

  // ─────────────────────────────────────────
  // MODULE ACCESS
  // ─────────────────────────────────────────

  async grantModuleAccess(
    userId: string,
    module: ModuleName,
    grantedBy: string,
    expiresAt?: Date,
  ) {
    const { error } = await this.supabaseService.clientRef
      .from('module_memberships')
      .upsert(
        {
          user_id: userId,
          module,
          status: 'active',
          granted_by: grantedBy,
          granted_at: new Date().toISOString(),
          expires_at: expiresAt?.toISOString() || null,
        },
        { onConflict: 'user_id,module' },
      );

    if (error) throw new BadRequestException('Failed to grant module access');

    await this.supabaseService.clientRef.from('user_activities').insert({
      user_id: userId,
      action: `MODULE_GRANTED:${module}`,
    });

    return { message: `Module ${module} access granted` };
  }

  async revokeModuleAccess(userId: string, module: ModuleName) {
    const { error } = await this.supabaseService.clientRef
      .from('module_memberships')
      .update({ status: 'suspended' })
      .eq('user_id', userId)
      .eq('module', module);

    if (error) throw new BadRequestException('Failed to revoke module access');

    await this.supabaseService.clientRef.from('user_activities').insert({
      user_id: userId,
      action: `MODULE_REVOKED:${module}`,
    });

    return { message: `Module ${module} access revoked` };
  }

  // ─────────────────────────────────────────
  // PERMISSIONS
  // ─────────────────────────────────────────

  async grantPermission(
    userId: string,
    permission: string,
    grantedBy: string,
    expiresAt?: Date,
  ) {
    const { error } = await this.supabaseService.clientRef
      .from('user_permissions')
      .upsert(
        {
          user_id: userId,
          permission,
          granted: true,
          granted_by: grantedBy,
          expires_at: expiresAt?.toISOString() || null,
        },
        { onConflict: 'user_id,permission' },
      );

    if (error) throw new BadRequestException('Failed to grant permission');
    return { message: `Permission ${permission} granted` };
  }

  async revokePermission(userId: string, permission: string) {
    const { error } = await this.supabaseService.clientRef
      .from('user_permissions')
      .update({ granted: false })
      .eq('user_id', userId)
      .eq('permission', permission);

    if (error) throw new BadRequestException('Failed to revoke permission');
    return { message: `Permission ${permission} revoked` };
  }

  async getUserPermissions(userId: string): Promise<string[]> {
    const { data } = await this.supabaseService.clientRef
      .from('user_permissions')
      .select('permission')
      .eq('user_id', userId)
      .eq('granted', true)
      .or(`expires_at.is.null,expires_at.gt.${new Date().toISOString()}`);

    return (data || []).map((p) => p.permission);
  }

  // ─────────────────────────────────────────
  // INITIALIZATION (called on register)
  // ─────────────────────────────────────────

  async initializeUserEcosystem(userId: string, primaryRole: UserRole) {
    const modules = ROLE_DEFAULT_MODULES[primaryRole] || ['community'];

    for (const module of modules) {
      await this.supabaseService.clientRef
        .from('module_memberships')
        .upsert(
          {
            user_id: userId,
            module,
            status: 'active',
            granted_at: new Date().toISOString(),
          },
          { onConflict: 'user_id,module' },
        );
    }

    // Initialize roles array
    await this.supabaseService.clientRef
      .from('users')
      .update({ roles: [primaryRole] })
      .eq('id', userId);
  }

  // ─────────────────────────────────────────
  // PRIVATE
  // ─────────────────────────────────────────

  private async grantDefaultModules(
    userId: string,
    role: UserRole,
    grantedBy: string,
  ) {
    const modules = ROLE_DEFAULT_MODULES[role] || [];
    for (const module of modules) {
      await this.grantModuleAccess(userId, module, grantedBy);
    }
  }
}