import { Controller, Get, Patch, Param, Body, UseGuards, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { AdminService } from './admin.service';
import { AdminNoteDto } from './dto/admin-note.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';

@ApiTags('Admin')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('admin')
@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Get('payments')
  @ApiOperation({ summary: 'Get all payments' })
  getAllPayments(@Query('page') page = 1, @Query('limit') limit = 20) {
    return this.adminService.getAllPayments(+page, +limit);
  }

  @Patch('payments/:id/approve')
  @ApiOperation({ summary: 'Approve a payment' })
  approvePayment(@Param('id') id: string, @Body() dto: AdminNoteDto) {
    return this.adminService.approvePayment(id, dto);
  }

  @Patch('payments/:id/reject')
  @ApiOperation({ summary: 'Reject a payment' })
  rejectPayment(@Param('id') id: string, @Body() dto: AdminNoteDto) {
    return this.adminService.rejectPayment(id, dto);
  }

  @Get('students')
  @ApiOperation({ summary: 'Get all students' })
  getAllStudents(@Query('page') page = 1, @Query('limit') limit = 20) {
    return this.adminService.getAllStudents(+page, +limit);
  }

  @Get('projects')
  @ApiOperation({ summary: 'Get all projects' })
  getAllProjects(@Query('page') page = 1, @Query('limit') limit = 20) {
    return this.adminService.getAllProjects(+page, +limit);
  }

  @Get('complaints')
  @ApiOperation({ summary: 'Get all complaints' })
  getAllComplaints(@Query('page') page = 1, @Query('limit') limit = 20) {
    return this.adminService.getAllComplaints(+page, +limit);
  }

  @Get('contacts')
  @ApiOperation({ summary: 'Get all contacts' })
  getAllContacts(@Query('page') page = 1, @Query('limit') limit = 20) {
    return this.adminService.getAllContacts(+page, +limit);
  }

  @Get('builds')
  @ApiOperation({ summary: 'Get all build requests' })
  getAllBuilds(@Query('page') page = 1, @Query('limit') limit = 20) {
    return this.adminService.getAllBuilds(+page, +limit);
  }
}