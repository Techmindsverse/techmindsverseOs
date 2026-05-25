import { Controller, Post, Patch, Body, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { BuildService } from './build.service';
import { CreateBuildDto } from './dto/create-build.dto';
import { UpdateBuildStatusDto } from './dto/update-build-status.dto';
import { BuildStatus } from './types/build-status.type';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { Get } from '@nestjs/common';

@ApiTags('Build')
@Controller('build')
export class BuildController {
  constructor(private readonly buildService: BuildService) {}

  @Post()
  @ApiOperation({ summary: 'Submit a build request' })
  submit(@Body() dto: CreateBuildDto) {
    return this.buildService.submit(dto);
  }

  @Patch(':id/status')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @ApiOperation({ summary: 'Update build status' })
  updateStatus(@Param('id') id: string, @Body() body: UpdateBuildStatusDto) {
    return this.buildService.updateStatus(id, body.status as BuildStatus, body.admin_note);
  }

  @Patch(':id/assign')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @ApiOperation({ summary: 'Assign builder to build' })
  assignBuilder(@Param('id') id: string, @Body() body: { assigned_to: string }) {
    return this.buildService.assignBuilder(id, body.assigned_to);
  }

  @Patch(':id/progress')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @ApiOperation({ summary: 'Update build progress' })
  updateProgress(@Param('id') id: string, @Body() body: { progress: number }) {
    return this.buildService.updateProgress(id, body.progress);
  }
  @Get('my')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@ApiOperation({ summary: 'Get my build requests by email' })
getMyBuilds(@CurrentUser() user: any) {
  return this.buildService.getMyBuilds(user.email);
}

}

  