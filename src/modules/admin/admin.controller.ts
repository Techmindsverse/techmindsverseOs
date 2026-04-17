import { Controller, Get, Patch, Param, Body, UseGuards } from '@nestjs/common';
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
  getAllPayments() {
    return this.adminService.getAllPayments();
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
  getAllStudents() {
    return this.adminService.getAllStudents();
  }

  @Get('projects')
  @ApiOperation({ summary: 'Get all projects' })
  getAllProjects() {
    return this.adminService.getAllProjects();
  }

  @Get('complaints')
  @ApiOperation({ summary: 'Get all complaints' })
  getAllComplaints() {
    return this.adminService.getAllComplaints();
  }

  @Get('contacts')
  @ApiOperation({ summary: 'Get all contacts' })
  getAllContacts() {
    return this.adminService.getAllContacts();
  }

  @Get('builds')
@ApiOperation({ summary: 'Get all build requests' })
getAllBuilds() {
  return this.adminService.getAllBuilds();
}
}