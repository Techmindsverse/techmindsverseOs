import { Controller, Get, Query } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { AdminService } from './admin.service';

@ApiTags('Public')
@Controller('public')
export class AdminPublicController {
  constructor(private readonly adminService: AdminService) {}

  @Get('stats')
  @ApiOperation({ summary: 'Live platform stats' })
  getPublicStats() {
    return this.adminService.getPublicStats();
  }

  @Get('announcements')
  @ApiOperation({ summary: 'Active announcements' })
  getAnnouncements(@Query('limit') limit = 10) {
    return this.adminService.getAnnouncements(+limit);
  }

  @Get('testimonials')
  @ApiOperation({ summary: 'Active testimonials' })
  getTestimonials() {
    return this.adminService.getTestimonials();
  }

  @Get('platform-stats')
  @ApiOperation({ summary: 'Platform stats' })
  getPlatformStats() {
    return this.adminService.getPlatformStats();
  }
}