import { PaymentsService } from './payments.service';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { StorageUtil } from '../../common/utils/storage.util';
export declare class PaymentsController {
    private readonly paymentsService;
    private readonly storageUtil;
    constructor(paymentsService: PaymentsService, storageUtil: StorageUtil);
    createPayment(user: any, dto: CreatePaymentDto, file: Express.Multer.File): Promise<any>;
    getMyPayments(user: any): Promise<any[]>;
}
