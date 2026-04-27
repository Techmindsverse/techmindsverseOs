import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { StudentsService } from './students.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@ApiTags('Students')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('students')
export class StudentsController {
  constructor(private readonly studentsService: StudentsService) {}

  @Get('me')
  @ApiOperation({ summary: 'Get my student profile' })
  getMyProfile(@CurrentUser() user: any) {
    return this.studentsService.getProfile(user.id);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get student by ID' })
  getById(@Param('id') id: string) {
    return this.studentsService.getById(id);
  }
}