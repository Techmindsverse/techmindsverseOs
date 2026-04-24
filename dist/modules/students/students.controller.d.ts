import { StudentsService } from './students.service';
export declare class StudentsController {
    private readonly studentsService;
    constructor(studentsService: StudentsService);
    getMyProfile(user: any): Promise<any>;
    getById(id: string): Promise<any>;
}
