"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProjectsService = void 0;
const common_1 = require("@nestjs/common");
const supabase_service_1 = require("../supabase/supabase.service");
let ProjectsService = class ProjectsService {
    constructor(supabaseService) {
        this.supabaseService = supabaseService;
    }
    async submit(userId, dto) {
        const { data: student } = await this.supabaseService.db
            .from('students').select('id').eq('user_id', userId).single();
        if (!student)
            throw new common_1.NotFoundException('Student profile not found');
        const { data, error } = await this.supabaseService.db
            .from('projects')
            .insert({ student_id: student.id, ...dto, status: 'submitted' })
            .select().single();
        if (error)
            throw new common_1.NotFoundException('Failed to submit project');
        return data;
    }
};
exports.ProjectsService = ProjectsService;
exports.ProjectsService = ProjectsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [supabase_service_1.SupabaseService])
], ProjectsService);
//# sourceMappingURL=projects.service.js.map