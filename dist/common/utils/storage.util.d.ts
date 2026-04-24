import { SupabaseService } from '../../modules/supabase/supabase.service';
export declare class StorageUtil {
    private supabaseService;
    constructor(supabaseService: SupabaseService);
    uploadImage(file: Express.Multer.File, bucket: string, folder: string): Promise<string>;
}
