import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { RolesService, UserRole, ModuleName } from './roles.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@ApiTags('Roles')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('roles')
export class RolesController {
  constructor(private readonly rolesService: RolesService) {}

  @Get('me')
  @ApiOperation({ summary: 'Get my roles and modules' })
  getMyRoles(@CurrentUser() user: any) {
    return this.rolesService.getUserWithRoles(user.id);
  }

  @Get('me/modules')
  @ApiOperation({ summary: 'Get my active modules' })
  getMyModules(@CurrentUser() user: any) {
    return this.rolesService.getUserModules(user.id);
  }

  @Get('me/permissions')
  @ApiOperation({ summary: 'Get my permissions' })
  getMyPermissions(@CurrentUser() user: any) {
    return this.rolesService.getUserPermissions(user.id);
  }

  @Get('me/upgrade-paths')
  @ApiOperation({ summary: 'Get available role upgrade paths' })
  getUpgradePaths(@CurrentUser() user: any) {
    return { paths: this.rolesService.getUpgradePaths(user.role) };
  }

  @Post(':userId/add-role')
  @UseGuards(RolesGuard)
  @Roles('admin', 'super_admin')
  @ApiOperation({ summary: 'Add role to user' })
  addRole(
    @Param('userId') userId: string,
    @Body() dto: { role: UserRole },
    @CurrentUser() admin: any,
  ) {
    return this.rolesService.addRole(userId, dto.role, admin.id);
  }

  @Patch(':userId/primary-role')
  @UseGuards(RolesGuard)
  @Roles('admin', 'super_admin')
  @ApiOperation({ summary: 'Set primary role' })
  setPrimaryRole(
    @Param('userId') userId: string,
    @Body() dto: { role: UserRole },
    @CurrentUser() admin: any,
  ) {
    return this.rolesService.setPrimaryRole(userId, dto.role, admin.id);
  }

  @Delete(':userId/remove-role')
  @UseGuards(RolesGuard)
  @Roles('admin', 'super_admin')
  @ApiOperation({ summary: 'Remove role from user' })
  removeRole(
    @Param('userId') userId: string,
    @Body() dto: { role: UserRole },
    @CurrentUser() admin: any,
  ) {
    return this.rolesService.removeRole(userId, dto.role, admin.id);
  }

  @Post(':userId/grant-module')
  @UseGuards(RolesGuard)
  @Roles('admin', 'super_admin')
  @ApiOperation({ summary: 'Grant module access to user' })
  grantModule(
    @Param('userId') userId: string,
    @Body() dto: { module: ModuleName; expires_at?: string },
    @CurrentUser() admin: any,
  ) {
    return this.rolesService.grantModuleAccess(
      userId,
      dto.module,
      admin.id,
      dto.expires_at ? new Date(dto.expires_at) : undefined,
    );
  }

  @Post(':userId/revoke-module')
  @UseGuards(RolesGuard)
  @Roles('admin', 'super_admin')
  @ApiOperation({ summary: 'Revoke module access' })
  revokeModule(
    @Param('userId') userId: string,
    @Body() dto: { module: ModuleName },
  ) {
    return this.rolesService.revokeModuleAccess(userId, dto.module);
  }

  @Post(':userId/grant-permission')
  @UseGuards(RolesGuard)
  @Roles('admin', 'super_admin')
  @ApiOperation({ summary: 'Grant specific permission' })
  grantPermission(
    @Param('userId') userId: string,
    @Body() dto: { permission: string; expires_at?: string },
    @CurrentUser() admin: any,
  ) {
    return this.rolesService.grantPermission(
      userId,
      dto.permission,
      admin.id,
      dto.expires_at ? new Date(dto.expires_at) : undefined,
    );
  }
}