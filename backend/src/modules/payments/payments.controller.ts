import {
  Controller, Post, Get, Body,
  UseGuards, UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiConsumes } from '@nestjs/swagger';
import { PaymentsService } from './payments.service';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { validateFile } from '../../common/utils/file-upload.util';
import { StorageUtil } from '../../common/utils/storage.util';

@ApiTags('Payments')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('payments')
export class PaymentsController {
  constructor(
    private readonly paymentsService: PaymentsService,
    private readonly storageUtil: StorageUtil,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Submit payment proof' })
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('proof_image', { storage: memoryStorage() }))
  async createPayment(
    @CurrentUser() user: any,
    @Body() dto: CreatePaymentDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    let proof_image_url: string | undefined;
    if (file) {
      validateFile(file);
      proof_image_url = await this.storageUtil.uploadImage(file, 'payments', 'proofs');
    }
    return this.paymentsService.createPayment(user.id, { ...dto, proof_image_url });
  }

  @Get('my')
  @ApiOperation({ summary: 'Get my payments' })
  getMyPayments(@CurrentUser() user: any) {
    return this.paymentsService.getMyPayments(user.id);
  }
}