"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
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
exports.BuildService = void 0;
var common_1 = require("@nestjs/common");
var BuildService = function () {
    var _classDecorators = [(0, common_1.Injectable)()];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var BuildService = _classThis = /** @class */ (function () {
        function BuildService_1(supabaseService, mailService, buildLogsService, buildGateway) {
            this.supabaseService = supabaseService;
            this.mailService = mailService;
            this.buildLogsService = buildLogsService;
            this.buildGateway = buildGateway;
            this.logger = new common_1.Logger(BuildService.name);
        }
        // ==========================
        // CREATE BUILD (SAFE + STRUCTURED)
        // ==========================
        BuildService_1.prototype.submit = function (dto, clientIp) {
            return __awaiter(this, void 0, void 0, function () {
                var normalizedBudget, _a, data, error, error_1;
                var _this = this;
                var _b, _c, _d;
                return __generator(this, function (_e) {
                    switch (_e.label) {
                        case 0:
                            _e.trys.push([0, 3, , 4]);
                            normalizedBudget = this.normalizeBudget(dto.budget);
                            return [4 /*yield*/, this.supabaseService.clientRef
                                    .from('builds')
                                    .insert(__assign(__assign({}, dto), { budget: (_b = normalizedBudget === null || normalizedBudget === void 0 ? void 0 : normalizedBudget.raw) !== null && _b !== void 0 ? _b : null, budget_min: (_c = normalizedBudget === null || normalizedBudget === void 0 ? void 0 : normalizedBudget.min) !== null && _c !== void 0 ? _c : null, budget_max: (_d = normalizedBudget === null || normalizedBudget === void 0 ? void 0 : normalizedBudget.max) !== null && _d !== void 0 ? _d : null, status: 'submitted', priority: 'normal', payment_status: 'unpaid', progress: 0 }))
                                    .select()
                                    .single()];
                        case 1:
                            _a = _e.sent(), data = _a.data, error = _a.error;
                            if (error || !data) {
                                throw new common_1.BadRequestException('Failed to submit build request');
                            }
                            // 🔥 async email (do NOT block request)
                            this.safeEmailNotify(dto).catch(function (err) {
                                return _this.logger.error('Email failed', err);
                            });
                            // 🪵 safe logging (never break request)
                            return [4 /*yield*/, this.safeLog(data.id, 'CREATED', 'Build submitted', {
                                    ip: clientIp,
                                })];
                        case 2:
                            // 🪵 safe logging (never break request)
                            _e.sent();
                            return [2 /*return*/, {
                                    message: 'Build request submitted successfully',
                                    build: data,
                                }];
                        case 3:
                            error_1 = _e.sent();
                            this.logger.error('BUILD SUBMIT ERROR:', error_1);
                            throw new common_1.BadRequestException((error_1 instanceof Error ? error_1.message : String(error_1)) || 'Failed to submit build request');
                        case 4: return [2 /*return*/];
                    }
                });
            });
        };
        // ==========================
        // STATUS UPDATE (with timeline support)
        // ==========================
        BuildService_1.prototype.updateStatus = function (id, status, admin_note) {
            return __awaiter(this, void 0, void 0, function () {
                var _a, data, error;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0: return [4 /*yield*/, this.supabaseService.clientRef
                                .from('builds')
                                .update({
                                status: status,
                                admin_note: admin_note,
                            })
                                .eq('id', id)
                                .select()
                                .single()];
                        case 1:
                            _a = _b.sent(), data = _a.data, error = _a.error;
                            if (error || !data) {
                                throw new common_1.BadRequestException('Failed to update build status');
                            }
                            return [4 /*yield*/, this.safeLog(id, 'STATUS_UPDATED', "Status \u2192 ".concat(status), {
                                    status: status,
                                    admin_note: admin_note,
                                })];
                        case 2:
                            _b.sent();
                            return [2 /*return*/, {
                                    message: 'Build updated successfully',
                                    build: data,
                                }];
                    }
                });
            });
        };
        // ==========================
        // ASSIGN BUILDER
        // ==========================
        BuildService_1.prototype.assignBuilder = function (id, assigned_to) {
            return __awaiter(this, void 0, void 0, function () {
                var _a, data, error;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0: return [4 /*yield*/, this.supabaseService.clientRef
                                .from('builds')
                                .update({
                                assigned_to: assigned_to,
                                status: 'accepted',
                            })
                                .eq('id', id)
                                .select()
                                .single()];
                        case 1:
                            _a = _b.sent(), data = _a.data, error = _a.error;
                            if (error || !data) {
                                throw new common_1.BadRequestException('Failed to assign builder');
                            }
                            return [4 /*yield*/, this.safeLog(id, 'ASSIGNED', 'Builder assigned', {
                                    assigned_to: assigned_to,
                                })];
                        case 2:
                            _b.sent();
                            return [2 /*return*/, {
                                    message: 'Builder assigned successfully',
                                    build: data,
                                }];
                    }
                });
            });
        };
        // ==========================
        // UPDATE PROGRESS
        // ==========================
        BuildService_1.prototype.updateProgress = function (id, progress) {
            return __awaiter(this, void 0, void 0, function () {
                var _a, data, error;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            if (progress < 0 || progress > 100) {
                                throw new common_1.BadRequestException('Progress must be 0–100');
                            }
                            return [4 /*yield*/, this.supabaseService.clientRef
                                    .from('builds')
                                    .update({ progress: progress })
                                    .eq('id', id)
                                    .select()
                                    .single()];
                        case 1:
                            _a = _b.sent(), data = _a.data, error = _a.error;
                            if (error || !data) {
                                throw new common_1.BadRequestException('Failed to update progress');
                            }
                            return [4 /*yield*/, this.safeLog(id, 'PROGRESS', "Progress \u2192 ".concat(progress, "%"), {
                                    progress: progress,
                                })];
                        case 2:
                            _b.sent();
                            return [2 /*return*/, {
                                    message: 'Progress updated',
                                    build: data,
                                }];
                    }
                });
            });
        };
        BuildService_1.prototype.getMyBuilds = function (email) {
            return __awaiter(this, void 0, void 0, function () {
                var _a, data, error;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0: return [4 /*yield*/, this.supabaseService.clientRef
                                .from('builds')
                                .select('*')
                                .eq('email', email)
                                .order('created_at', { ascending: false })];
                        case 1:
                            _a = _b.sent(), data = _a.data, error = _a.error;
                            if (error)
                                throw new common_1.NotFoundException('Failed to fetch builds');
                            return [2 /*return*/, data || []];
                    }
                });
            });
        };
        // ==========================
        // FIND ALL
        // ==========================
        BuildService_1.prototype.findAll = function () {
            return __awaiter(this, void 0, void 0, function () {
                var _a, data, error;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0: return [4 /*yield*/, this.supabaseService.clientRef
                                .from('builds')
                                .select('*')
                                .order('created_at', { ascending: false })];
                        case 1:
                            _a = _b.sent(), data = _a.data, error = _a.error;
                            if (error) {
                                throw new common_1.BadRequestException('Failed to fetch builds');
                            }
                            return [2 /*return*/, data];
                    }
                });
            });
        };
        // ==========================
        // ADMIN ANALYTICS (NEW 🔥)
        // ==========================
        BuildService_1.prototype.getDailyAnalytics = function (date) {
            return __awaiter(this, void 0, void 0, function () {
                var targetDate, _a, data, error;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            targetDate = date || new Date().toISOString().split('T')[0];
                            return [4 /*yield*/, this.supabaseService.clientRef
                                    .from('builds')
                                    .select('*')
                                    .gte('created_at', "".concat(targetDate, "T00:00:00"))
                                    .lte('created_at', "".concat(targetDate, "T23:59:59"))];
                        case 1:
                            _a = _b.sent(), data = _a.data, error = _a.error;
                            if (error) {
                                throw new common_1.BadRequestException('Failed to fetch analytics');
                            }
                            return [2 /*return*/, {
                                    date: targetDate,
                                    total: data.length,
                                    pending: data.filter(function (b) { return b.status === 'pending'; }).length,
                                    in_progress: data.filter(function (b) { return b.status === 'in_progress'; }).length,
                                    completed: data.filter(function (b) { return b.status === 'completed'; }).length,
                                }];
                    }
                });
            });
        };
        // ==========================
        // SAFE LOGGING (FIXES YOUR BUG)
        // ==========================
        BuildService_1.prototype.safeLog = function (build_id, action, message, metadata, user) {
            return __awaiter(this, void 0, void 0, function () {
                var err_1;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 2, , 3]);
                            return [4 /*yield*/, this.buildLogsService.log({
                                    build_id: build_id,
                                    action: action,
                                    message: message,
                                    metadata: metadata,
                                    created_by: user,
                                })];
                        case 1:
                            _a.sent();
                            return [3 /*break*/, 3];
                        case 2:
                            err_1 = _a.sent();
                            this.logger.warn('Build log failed (non-blocking)');
                            return [3 /*break*/, 3];
                        case 3: return [2 /*return*/];
                    }
                });
            });
        };
        // ==========================
        // EMAIL SAFE QUEUE (SIMPLIFIED)
        // ==========================
        BuildService_1.prototype.safeEmailNotify = function (dto) {
            return __awaiter(this, void 0, void 0, function () {
                var err_2;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 2, , 3]);
                            return [4 /*yield*/, this.mailService.sendBuildRequestEmail({
                                    name: dto.name,
                                    email: dto.email,
                                    category: dto.category,
                                    description: dto.description,
                                    budget: dto.budget,
                                    mode: dto.mode,
                                })];
                        case 1:
                            _a.sent();
                            return [3 /*break*/, 3];
                        case 2:
                            err_2 = _a.sent();
                            this.logger.error('Email send failed', err_2);
                            return [3 /*break*/, 3];
                        case 3: return [2 /*return*/];
                    }
                });
            });
        };
        // ==========================
        // BUDGET NORMALIZER (NEW 🔥)
        // ==========================
        BuildService_1.prototype.normalizeBudget = function (budget) {
            if (!budget)
                return null;
            var numbers = budget.match(/\d+/g);
            if (!numbers) {
                return { raw: budget, min: null, max: null };
            }
            return {
                raw: budget,
                min: Number(numbers[0]),
                max: numbers[1] ? Number(numbers[1]) : Number(numbers[0]),
            };
        };
        return BuildService_1;
    }());
    __setFunctionName(_classThis, "BuildService");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        BuildService = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return BuildService = _classThis;
}();
exports.BuildService = BuildService;
