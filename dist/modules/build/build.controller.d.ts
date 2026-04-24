import { BuildService } from './build.service';
import { CreateBuildDto } from './dto/create-build.dto';
export declare class BuildController {
    private readonly buildService;
    constructor(buildService: BuildService);
    submit(dto: CreateBuildDto): Promise<{
        message: string;
    }>;
}
