import { SupabaseService } from '../supabase/supabase.service';
import { CreateBuildDto } from './dto/create-build.dto';
export declare class BuildService {
    private supabaseService;
    constructor(supabaseService: SupabaseService);
    submit(dto: CreateBuildDto): Promise<{
        message: string;
    }>;
}
