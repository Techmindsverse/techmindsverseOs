"use strict";
var __esDecorate = (this && this.__esDecorate) || function (ctor, descriptorIn, decorators, contextIn, initializers, extraInitializers) {
    function accept(f) { if (f !== void 0 && typeof f !== "function") throw new TypeError("Function expected"); return f; }
    var kind = contextIn.kind, key = kind === "getter" ? "get" : kind === "setter" ? "set" : "value";
    var target = !descriptorIn && ctor ? contextIn["static"] ? ctor : ctor.prototype : null;
    var descriptor = descriptorIn || (target ? Object.getOwnPropertyDescriptor(target, contextIn.name) : {});
    var _, done = false;
    for (var i = decorators.length - 1; i >= 0; i--) {
        var context = {};
        for (var p in contextIn) context[p] = p === "access" ? {} : contextIn[p];
        for (var p in contextIn.access) context.access[p] = contextIn.access[p];
        context.addInitializer = function (f) { if (done) throw new TypeError("Cannot add initializers after decoration has completed"); extraInitializers.push(accept(f || null)); };
        var result = (0, decorators[i])(kind === "accessor" ? { get: descriptor.get, set: descriptor.set } : descriptor[key], context);
        if (kind === "accessor") {
            if (result === void 0) continue;
            if (result === null || typeof result !== "object") throw new TypeError("Object expected");
            if (_ = accept(result.get)) descriptor.get = _;
            if (_ = accept(result.set)) descriptor.set = _;
            if (_ = accept(result.init)) initializers.unshift(_);
        }
        else if (_ = accept(result)) {
            if (kind === "field") initializers.unshift(_);
            else descriptor[key] = _;
        }
    }
    if (target) Object.defineProperty(target, contextIn.name, descriptor);
    done = true;
};
var __runInitializers = (this && this.__runInitializers) || function (thisArg, initializers, value) {
    var useValue = arguments.length > 2;
    for (var i = 0; i < initializers.length; i++) {
        value = useValue ? initializers[i].call(thisArg, value) : initializers[i].call(thisArg);
    }
    return useValue ? value : void 0;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __setFunctionName = (this && this.__setFunctionName) || function (f, name, prefix) {
    if (typeof name === "symbol") name = name.description ? "[".concat(name.description, "]") : "";
    return Object.defineProperty(f, "name", { configurable: true, value: prefix ? "".concat(prefix, " ", name) : name });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminService = void 0;
var common_1 = require("@nestjs/common");
var AdminService = function () {
    var _classDecorators = [(0, common_1.Injectable)()];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var AdminService = _classThis = /** @class */ (function () {
        function AdminService_1(supabaseService, mailService, authService) {
            this.supabaseService = supabaseService;
            this.mailService = mailService;
            this.authService = authService;
        }
        // ─────────────────────────────────────────
        // METRICS
        // ─────────────────────────────────────────
        AdminService_1.prototype.getMetrics = function () {
            return __awaiter(this, void 0, void 0, function () {
                var _a, users, students, payments, builds, complaints, projects, p, b;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0: return [4 /*yield*/, Promise.all([
                                this.supabaseService.clientRef
                                    .from('users')
                                    .select('id, role, status', { count: 'exact' }),
                                this.supabaseService.clientRef
                                    .from('students')
                                    .select('id', { count: 'exact' }),
                                this.supabaseService.clientRef
                                    .from('payments')
                                    .select('id, status, amount'),
                                this.supabaseService.clientRef
                                    .from('builds')
                                    .select('id, status'),
                                this.supabaseService.clientRef
                                    .from('complaints')
                                    .select('id, status', { count: 'exact' }),
                                this.supabaseService.clientRef
                                    .from('projects')
                                    .select('id', { count: 'exact' }),
                            ])];
                        case 1:
                            _a = _b.sent(), users = _a[0], students = _a[1], payments = _a[2], builds = _a[3], complaints = _a[4], projects = _a[5];
                            p = payments.data || [];
                            b = builds.data || [];
                            return [2 /*return*/, {
                                    total_users: users.count || 0,
                                    active_students: students.count || 0,
                                    pending_payments: p.filter(function (x) { return x.status === 'pending'; }).length,
                                    approved_payments: p.filter(function (x) { return x.status === 'approved'; }).length,
                                    total_revenue: p
                                        .filter(function (x) { return x.status === 'approved'; })
                                        .reduce(function (acc, x) { return acc + (Number(x.amount) || 0); }, 0),
                                    active_builds: b.filter(function (x) {
                                        return ['reviewing', 'planning', 'in_progress', 'testing'].includes(x.status);
                                    }).length,
                                    completed_builds: b.filter(function (x) {
                                        return ['completed', 'delivered'].includes(x.status);
                                    }).length,
                                    pending_builds: b.filter(function (x) { return x.status === 'submitted'; }).length,
                                    open_complaints: complaints.count || 0,
                                    total_projects: projects.count || 0,
                                }];
                    }
                });
            });
        };
        // ─────────────────────────────────────────
        // PUBLIC STATS
        // ─────────────────────────────────────────
        AdminService_1.prototype.getPublicStats = function () {
            return __awaiter(this, void 0, void 0, function () {
                var _a, users, students, builds, completedBuilds;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0: return [4 /*yield*/, Promise.all([
                                this.supabaseService.clientRef
                                    .from('users')
                                    .select('id', { count: 'exact' })
                                    .eq('status', 'active'),
                                this.supabaseService.clientRef
                                    .from('students')
                                    .select('id', { count: 'exact' }),
                                this.supabaseService.clientRef
                                    .from('builds')
                                    .select('id', { count: 'exact' }),
                                this.supabaseService.clientRef
                                    .from('builds')
                                    .select('id', { count: 'exact' })
                                    .in('status', ['completed', 'delivered']),
                            ])];
                        case 1:
                            _a = _b.sent(), users = _a[0], students = _a[1], builds = _a[2], completedBuilds = _a[3];
                            return [2 /*return*/, {
                                    active_users: users.count || 0,
                                    total_students: students.count || 0,
                                    total_builds: builds.count || 0,
                                    completed_builds: completedBuilds.count || 0,
                                }];
                    }
                });
            });
        };
        // ─────────────────────────────────────────
        // ACTIVITY
        // ─────────────────────────────────────────
        AdminService_1.prototype.getActivity = function () {
            return __awaiter(this, arguments, void 0, function (page, limit) {
                var from, to, _a, data, error, count;
                if (page === void 0) { page = 1; }
                if (limit === void 0) { limit = 20; }
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            from = (page - 1) * limit;
                            to = from + limit - 1;
                            return [4 /*yield*/, this.supabaseService.clientRef
                                    .from('user_activities')
                                    .select('*, users(email)', { count: 'exact' })
                                    .order('created_at', { ascending: false })
                                    .range(from, to)];
                        case 1:
                            _a = _b.sent(), data = _a.data, error = _a.error, count = _a.count;
                            if (error)
                                throw new common_1.NotFoundException('Failed to fetch activity');
                            return [2 /*return*/, { data: data, total: count, page: page, limit: limit }];
                    }
                });
            });
        };
        // ─────────────────────────────────────────
        // PAYMENTS
        // ─────────────────────────────────────────
        AdminService_1.prototype.getAllPayments = function () {
            return __awaiter(this, arguments, void 0, function (page, limit) {
                var from, to, _a, data, error, count;
                if (page === void 0) { page = 1; }
                if (limit === void 0) { limit = 20; }
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            from = (page - 1) * limit;
                            to = from + limit - 1;
                            return [4 /*yield*/, this.supabaseService.clientRef
                                    .from('payments')
                                    .select('*, users(id, email, role, status), courses(title)', {
                                    count: 'exact',
                                })
                                    .order('created_at', { ascending: false })
                                    .range(from, to)];
                        case 1:
                            _a = _b.sent(), data = _a.data, error = _a.error, count = _a.count;
                            if (error)
                                throw new common_1.NotFoundException('Failed to fetch payments');
                            return [2 /*return*/, { data: data, total: count, page: page, limit: limit }];
                    }
                });
            });
        };
        AdminService_1.prototype.approvePayment = function (paymentId, dto) {
            return __awaiter(this, void 0, void 0, function () {
                var _a, payment, error, _b, rawToken, hashedToken, expiresAt;
                var _c;
                return __generator(this, function (_d) {
                    switch (_d.label) {
                        case 0: return [4 /*yield*/, this.supabaseService.clientRef
                                .from('payments')
                                .select('*, users(id, email, status, role)')
                                .eq('id', paymentId)
                                .single()];
                        case 1:
                            _a = _d.sent(), payment = _a.data, error = _a.error;
                            if (error || !payment)
                                throw new common_1.NotFoundException('Payment not found');
                            if (!(payment.users.role === 'admin')) return [3 /*break*/, 3];
                            return [4 /*yield*/, this.supabaseService.clientRef
                                    .from('payments')
                                    .update({ status: 'approved', admin_note: 'Admin account exempted' })
                                    .eq('id', paymentId)];
                        case 2:
                            _d.sent();
                            return [2 /*return*/, { message: 'Admin account exempted from activation flow.' }];
                        case 3: return [4 /*yield*/, this.supabaseService.clientRef
                                .from('payments')
                                .update({ status: 'approved', admin_note: (_c = dto.admin_note) !== null && _c !== void 0 ? _c : null })
                                .eq('id', paymentId)];
                        case 4:
                            _d.sent();
                            _b = this.authService.generateActivationToken(), rawToken = _b.rawToken, hashedToken = _b.hashedToken, expiresAt = _b.expiresAt;
                            return [4 /*yield*/, this.supabaseService.clientRef
                                    .from('users')
                                    .update({
                                    activation_token: hashedToken,
                                    activation_token_expires_at: expiresAt,
                                    status: 'pending_activation',
                                    access_granted: true,
                                })
                                    .eq('id', payment.user_id)];
                        case 5:
                            _d.sent();
                            return [4 /*yield*/, this.mailService.sendActivationEmail(payment.users.email, rawToken)];
                        case 6:
                            _d.sent();
                            return [4 /*yield*/, this.supabaseService.clientRef.from('user_activities').insert({
                                    user_id: payment.user_id,
                                    action: 'PAYMENT_APPROVED',
                                    metadata: { payment_id: paymentId },
                                })];
                        case 7:
                            _d.sent();
                            return [2 /*return*/, { message: 'Payment approved. Activation email sent.' }];
                    }
                });
            });
        };
        AdminService_1.prototype.rejectPayment = function (paymentId, dto) {
            return __awaiter(this, void 0, void 0, function () {
                var error;
                var _a;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0: return [4 /*yield*/, this.supabaseService.clientRef
                                .from('payments')
                                .update({ status: 'rejected', admin_note: (_a = dto.admin_note) !== null && _a !== void 0 ? _a : null })
                                .eq('id', paymentId)];
                        case 1:
                            error = (_b.sent()).error;
                            if (error)
                                throw new common_1.BadRequestException('Failed to reject payment');
                            return [2 /*return*/, { message: 'Payment rejected.' }];
                    }
                });
            });
        };
        // ─────────────────────────────────────────
        // STUDENTS
        // ─────────────────────────────────────────
        AdminService_1.prototype.getAllStudents = function () {
            return __awaiter(this, arguments, void 0, function (page, limit) {
                var from, to, _a, data, error, count;
                if (page === void 0) { page = 1; }
                if (limit === void 0) { limit = 20; }
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            from = (page - 1) * limit;
                            to = from + limit - 1;
                            return [4 /*yield*/, this.supabaseService.clientRef
                                    .from('students')
                                    .select('*, users(email, status, role)', { count: 'exact' })
                                    .order('created_at', { ascending: false })
                                    .range(from, to)];
                        case 1:
                            _a = _b.sent(), data = _a.data, error = _a.error, count = _a.count;
                            if (error)
                                throw new common_1.NotFoundException('Failed to fetch students');
                            return [2 /*return*/, { data: data, total: count, page: page, limit: limit }];
                    }
                });
            });
        };
        // ─────────────────────────────────────────
        // PROJECTS
        // ─────────────────────────────────────────
        AdminService_1.prototype.getAllProjects = function () {
            return __awaiter(this, arguments, void 0, function (page, limit) {
                var from, to, _a, data, error, count;
                if (page === void 0) { page = 1; }
                if (limit === void 0) { limit = 20; }
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            from = (page - 1) * limit;
                            to = from + limit - 1;
                            return [4 /*yield*/, this.supabaseService.clientRef
                                    .from('projects')
                                    .select('*, students(full_name)', { count: 'exact' })
                                    .order('created_at', { ascending: false })
                                    .range(from, to)];
                        case 1:
                            _a = _b.sent(), data = _a.data, error = _a.error, count = _a.count;
                            if (error)
                                throw new common_1.NotFoundException('Failed to fetch projects');
                            return [2 /*return*/, { data: data, total: count, page: page, limit: limit }];
                    }
                });
            });
        };
        // ─────────────────────────────────────────
        // COMPLAINTS
        // ─────────────────────────────────────────
        AdminService_1.prototype.getAllComplaints = function () {
            return __awaiter(this, arguments, void 0, function (page, limit) {
                var from, to, _a, data, error, count;
                if (page === void 0) { page = 1; }
                if (limit === void 0) { limit = 20; }
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            from = (page - 1) * limit;
                            to = from + limit - 1;
                            return [4 /*yield*/, this.supabaseService.clientRef
                                    .from('complaints')
                                    .select('*, users(email)', { count: 'exact' })
                                    .order('created_at', { ascending: false })
                                    .range(from, to)];
                        case 1:
                            _a = _b.sent(), data = _a.data, error = _a.error, count = _a.count;
                            if (error)
                                throw new common_1.NotFoundException('Failed to fetch complaints');
                            return [2 /*return*/, { data: data, total: count, page: page, limit: limit }];
                    }
                });
            });
        };
        // ─────────────────────────────────────────
        // CONTACTS
        // ─────────────────────────────────────────
        AdminService_1.prototype.getAllContacts = function () {
            return __awaiter(this, arguments, void 0, function (page, limit) {
                var from, to, _a, data, error, count;
                if (page === void 0) { page = 1; }
                if (limit === void 0) { limit = 20; }
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            from = (page - 1) * limit;
                            to = from + limit - 1;
                            return [4 /*yield*/, this.supabaseService.clientRef
                                    .from('contacts')
                                    .select('*', { count: 'exact' })
                                    .order('created_at', { ascending: false })
                                    .range(from, to)];
                        case 1:
                            _a = _b.sent(), data = _a.data, error = _a.error, count = _a.count;
                            if (error)
                                throw new common_1.NotFoundException('Failed to fetch contacts');
                            return [2 /*return*/, { data: data, total: count, page: page, limit: limit }];
                    }
                });
            });
        };
        // ─────────────────────────────────────────
        // BUILDS
        // ─────────────────────────────────────────
        AdminService_1.prototype.getAllBuilds = function () {
            return __awaiter(this, arguments, void 0, function (page, limit) {
                var from, to, _a, data, error, count;
                if (page === void 0) { page = 1; }
                if (limit === void 0) { limit = 20; }
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            from = (page - 1) * limit;
                            to = from + limit - 1;
                            return [4 /*yield*/, this.supabaseService.clientRef
                                    .from('builds')
                                    .select('*', { count: 'exact' })
                                    .order('created_at', { ascending: false })
                                    .range(from, to)];
                        case 1:
                            _a = _b.sent(), data = _a.data, error = _a.error, count = _a.count;
                            if (error)
                                throw new common_1.NotFoundException('Failed to fetch builds');
                            return [2 /*return*/, { data: data, total: count, page: page, limit: limit }];
                    }
                });
            });
        };
        // ─────────────────────────────────────────
        // ANNOUNCEMENTS
        // ─────────────────────────────────────────
        AdminService_1.prototype.getAnnouncements = function () {
            return __awaiter(this, arguments, void 0, function (limit) {
                var data;
                if (limit === void 0) { limit = 10; }
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.supabaseService.clientRef
                                .from('announcements')
                                .select('*')
                                .eq('status', 'active')
                                .order('pinned', { ascending: false })
                                .order('created_at', { ascending: false })
                                .limit(limit)];
                        case 1:
                            data = (_a.sent()).data;
                            return [2 /*return*/, data || []];
                    }
                });
            });
        };
        AdminService_1.prototype.createAnnouncement = function (dto, adminId) {
            return __awaiter(this, void 0, void 0, function () {
                var _a, data, error;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0: return [4 /*yield*/, this.supabaseService.clientRef
                                .from('announcements')
                                .insert({
                                title: dto.title,
                                content: dto.content,
                                type: dto.type,
                                pinned: dto.pinned || false,
                                status: 'active',
                                author_id: adminId,
                            })
                                .select()
                                .single()];
                        case 1:
                            _a = _b.sent(), data = _a.data, error = _a.error;
                            if (error)
                                throw new common_1.BadRequestException('Failed to create announcement');
                            return [2 /*return*/, data];
                    }
                });
            });
        };
        // ─────────────────────────────────────────
        // TESTIMONIALS
        // ─────────────────────────────────────────
        AdminService_1.prototype.getTestimonials = function () {
            return __awaiter(this, void 0, void 0, function () {
                var data;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.supabaseService.clientRef
                                .from('testimonials')
                                .select('*')
                                .eq('is_active', true)
                                .order('order_index', { ascending: true })];
                        case 1:
                            data = (_a.sent()).data;
                            return [2 /*return*/, data || []];
                    }
                });
            });
        };
        AdminService_1.prototype.manageTestimonial = function (dto) {
            return __awaiter(this, void 0, void 0, function () {
                var _a, data_1, error_1, _b, data, error;
                return __generator(this, function (_c) {
                    switch (_c.label) {
                        case 0:
                            if (!dto.id) return [3 /*break*/, 2];
                            return [4 /*yield*/, this.supabaseService.clientRef
                                    .from('testimonials')
                                    .update({
                                    name: dto.name,
                                    role: dto.role,
                                    text: dto.text,
                                    avatar_initial: dto.avatar_initial,
                                    is_active: dto.is_active !== undefined ? dto.is_active : true,
                                    order_index: dto.order_index || 0,
                                })
                                    .eq('id', dto.id)
                                    .select()
                                    .single()];
                        case 1:
                            _a = _c.sent(), data_1 = _a.data, error_1 = _a.error;
                            if (error_1)
                                throw new common_1.BadRequestException('Failed to update testimonial');
                            return [2 /*return*/, data_1];
                        case 2: return [4 /*yield*/, this.supabaseService.clientRef
                                .from('testimonials')
                                .insert({
                                name: dto.name,
                                role: dto.role,
                                text: dto.text,
                                avatar_initial: dto.avatar_initial || dto.name[0],
                                is_active: true,
                                order_index: dto.order_index || 0,
                            })
                                .select()
                                .single()];
                        case 3:
                            _b = _c.sent(), data = _b.data, error = _b.error;
                            if (error)
                                throw new common_1.BadRequestException('Failed to create testimonial');
                            return [2 /*return*/, data];
                    }
                });
            });
        };
        // ─────────────────────────────────────────
        // PLATFORM STATS
        // ─────────────────────────────────────────
        AdminService_1.prototype.getPlatformStats = function () {
            return __awaiter(this, void 0, void 0, function () {
                var data;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.supabaseService.clientRef
                                .from('platform_stats')
                                .select('*')
                                .order('key')];
                        case 1:
                            data = (_a.sent()).data;
                            return [2 /*return*/, data || []];
                    }
                });
            });
        };
        AdminService_1.prototype.updatePlatformStat = function (key, value, label) {
            return __awaiter(this, void 0, void 0, function () {
                var _a, data, error;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0: return [4 /*yield*/, this.supabaseService.clientRef
                                .from('platform_stats')
                                .upsert({ key: key, value: value, label: label, updated_at: new Date().toISOString() }, { onConflict: 'key' })
                                .select()
                                .single()];
                        case 1:
                            _a = _b.sent(), data = _a.data, error = _a.error;
                            if (error)
                                throw new common_1.BadRequestException('Failed to update stat');
                            return [2 /*return*/, data];
                    }
                });
            });
        };
        return AdminService_1;
    }());
    __setFunctionName(_classThis, "AdminService");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        AdminService = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return AdminService = _classThis;
}();
exports.AdminService = AdminService;
