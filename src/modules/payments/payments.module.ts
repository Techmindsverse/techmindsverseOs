import { Module } from '@nestjs/common';
import { PaymentsController } from './payments.controller';
import { PaymentsService } from './payments.service';
import { StorageUtil } from '../../common/utils/storage.util';

@Module({
  controllers: [PaymentsController],
  providers: [PaymentsService, StorageUtil],
  exports: [PaymentsService],
})
export class PaymentsModule {}