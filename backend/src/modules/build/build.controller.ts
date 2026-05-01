import { Controller, Patch, Body, Param } from '@nestjs/common';
import { BuildService } from './build.service';
import { UpdateBuildStatusDto } from './dto/update-build-status.dto';
import { BuildStatus } from './types/build-status.type';
@Controller('build')
export class BuildController {
  constructor(private readonly buildService: BuildService) {}

  @Patch(':id/status')
  updateStatus(
    @Param('id') id: string,
    @Body() body: UpdateBuildStatusDto,
  ) {
    return this.buildService.updateStatus(
      id,
      body.status as BuildStatus,
      body.admin_note,
    );
  }
}