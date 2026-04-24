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
exports.StudentsService = void 0;
const common_1 = require("@nestjs/common");
const supabase_service_1 = require("../supabase/supabase.service");
let StudentsService = class StudentsService {
    constructor(supabaseService) {
        this.supabaseService = supabaseService;
    }
    async getProfile(userId) {
        const { data, error } = await this.supabaseService.db
            .from('students')
            .select('*, users(email, status), enrollments(*, courses(title, description)), projects(title, status), complaints(subject, status)')
            .eq('user_id', userId)
            .single();
        if (error || !data)
            throw new common_1.NotFoundException('Student profile not found');
        return data;
    }
    async getById(id) {
        const { data, error } = await this.supabaseService.db
            .from('students')
            .select('*, users(email)')
            .eq('id', id)
            .single();
        if (error || !data)
            throw new common_1.NotFoundException('Student not found');
        return data;
    }
};
exports.StudentsService = StudentsService;
exports.StudentsService = StudentsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [supabase_service_1.SupabaseService])
], StudentsService);
//# sourceMappingURL=students.service.js.map