import { Module } from '@nestjs/common';
import { BuildController } from './build.controller';
import { BuildService } from './build.service';
import { BuildLogsService } from './build-logs.service';
import { MailModule } from '../mail/mail.module';

@Module({
  imports: [MailModule],
  controllers: [BuildController],
  providers: [BuildService, BuildLogsService],
  exports: [BuildService],
})
export class BuildModule {}