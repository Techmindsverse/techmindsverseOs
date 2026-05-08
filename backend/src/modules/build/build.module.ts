import { Module } from '@nestjs/common';
import { BuildController } from './build.controller';
import { BuildService } from './build.service';
import { BuildLogsService } from './build-logs.service';
import { MailModule } from '../mail/mail.module';
import { BuildGateway } from './gateway/build.gateway';

@Module({
  imports: [MailModule],
  controllers: [BuildController],
  providers: [BuildService, BuildLogsService, BuildGateway],
  exports: [BuildService],
})
export class BuildModule {}