import { SupabaseService } from '../supabase/supabase.service';
import { CreateProjectDto } from './dto/create-project.dto';
export declare class ProjectsService {
    private supabaseService;
    constructor(supabaseService: SupabaseService);
    submit(userId: string, dto: CreateProjectDto): Promise<any>;
}
