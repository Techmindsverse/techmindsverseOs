import { Module } from '@nestjs/common';
import { BuildController } from './build.controller';
import { BuildService } from './build.service';
import { BuildLogsService } from './build-logs.service';

@Module({
  controllers: [BuildController],
  providers: [BuildService, BuildLogsService],

  // 👇 VERY IMPORTANT
  exports: [BuildService],
})
export class BuildModule {}