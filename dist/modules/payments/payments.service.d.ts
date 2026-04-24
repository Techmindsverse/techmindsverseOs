import { SupabaseService } from '../supabase/supabase.service';
import { CreatePaymentDto } from './dto/create-payment.dto';
export declare class PaymentsService {
    private supabaseService;
    constructor(supabaseService: SupabaseService);
    createPayment(userId: string, dto: CreatePaymentDto): Promise<any>;
    getMyPayments(userId: string): Promise<any[]>;
}
