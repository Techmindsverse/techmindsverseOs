import { Controller, Post, Body } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { BuildService } from './build.service';
import { CreateBuildDto } from './dto/create-build.dto';

@ApiTags('Build')
@Controller('build')
export class BuildController {
  constructor(private readonly buildService: BuildService) {}

  @Post()
  @ApiOperation({ summary: 'Submit a build request' })
  submit(@Body() dto: CreateBuildDto) {
    return this.buildService.submit(dto);
  }
}