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
exports.AuthService = void 0;
var common_1 = require("@nestjs/common");
var bcrypt = require("bcrypt");
var crypto = require("crypto");
var AuthService = function () {
    var _classDecorators = [(0, common_1.Injectable)()];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var AuthService = _classThis = /** @class */ (function () {
        function AuthService_1(jwtService, supabaseService, mailService) {
            this.jwtService = jwtService;
            this.supabaseService = supabaseService;
            this.mailService = mailService;
        }
        // ─────────────────────────────────────────
        // REGISTER
        // ─────────────────────────────────────────
        AuthService_1.prototype.register = function (dto) {
            return __awaiter(this, void 0, void 0, function () {
                var email, existing, otpCount, usernameExists, password_hash, otp, otpExpiry, _a, newUser, error;
                var _b, _c;
                return __generator(this, function (_d) {
                    switch (_d.label) {
                        case 0:
                            email = dto.email.toLowerCase().trim();
                            return [4 /*yield*/, this.supabaseService.clientRef
                                    .from('users')
                                    .select('id, status, otp_code, otp_expires_at, created_at')
                                    .eq('email', email)
                                    .single()];
                        case 1:
                            existing = (_d.sent()).data;
                            if (!existing) return [3 /*break*/, 3];
                            if (existing.status === 'active') {
                                throw new common_1.ConflictException('An account with this email already exists. Please sign in.');
                            }
                            return [4 /*yield*/, this.supabaseService.clientRef
                                    .from('user_activities')
                                    .select('id', { count: 'exact' })
                                    .eq('user_id', existing.id)
                                    .eq('action', 'OTP_SENT')
                                    .gte('created_at', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString())];
                        case 2:
                            otpCount = (_d.sent()).count;
                            if ((otpCount || 0) >= 3) {
                                throw new common_1.BadRequestException('Too many verification attempts. Please try again after 24 hours.');
                            }
                            _d.label = 3;
                        case 3:
                            if (!dto.username) return [3 /*break*/, 5];
                            return [4 /*yield*/, this.supabaseService.clientRef
                                    .from('users')
                                    .select('id')
                                    .eq('username', dto.username.toLowerCase().trim())
                                    .single()];
                        case 4:
                            usernameExists = (_d.sent()).data;
                            if (usernameExists) {
                                throw new common_1.ConflictException('Username is already taken. Please choose another.');
                            }
                            _d.label = 5;
                        case 5: return [4 /*yield*/, bcrypt.hash(dto.password, 12)];
                        case 6:
                            password_hash = _d.sent();
                            otp = Math.floor(100000 + Math.random() * 900000).toString();
                            otpExpiry = new Date(Date.now() + 15 * 60 * 1000);
                            if (!existing) return [3 /*break*/, 9];
                            // Update existing pending account
                            return [4 /*yield*/, this.supabaseService.clientRef
                                    .from('users')
                                    .update({
                                    password_hash: password_hash,
                                    username: ((_b = dto.username) === null || _b === void 0 ? void 0 : _b.toLowerCase().trim()) || null,
                                    otp_code: otp,
                                    otp_expires_at: otpExpiry,
                                    otp_attempts: 0,
                                })
                                    .eq('id', existing.id)];
                        case 7:
                            // Update existing pending account
                            _d.sent();
                            return [4 /*yield*/, this.supabaseService.clientRef
                                    .from('user_activities')
                                    .insert({ user_id: existing.id, action: 'OTP_SENT' })];
                        case 8:
                            _d.sent();
                            return [3 /*break*/, 16];
                        case 9: return [4 /*yield*/, this.supabaseService.clientRef
                                .from('users')
                                .insert({
                                email: email,
                                password_hash: password_hash,
                                username: ((_c = dto.username) === null || _c === void 0 ? void 0 : _c.toLowerCase().trim()) || null,
                                role: dto.role || 'student',
                                status: 'pending',
                                otp_code: otp,
                                otp_expires_at: otpExpiry,
                                otp_verified: false,
                                otp_attempts: 0,
                                avatar_url: dto.avatar_url || null,
                            })
                                .select('id')
                                .single()];
                        case 10:
                            _a = _d.sent(), newUser = _a.data, error = _a.error;
                            if (error || !newUser) {
                                throw new common_1.BadRequestException('Failed to create account. Please try again.');
                            }
                            if (!(dto.role === 'student')) return [3 /*break*/, 12];
                            return [4 /*yield*/, this.supabaseService.clientRef
                                    .from('students')
                                    .insert({
                                    user_id: newUser.id,
                                    full_name: dto.fullName,
                                    phone: dto.phone || null,
                                    avatar_url: dto.avatar_url || null,
                                })];
                        case 11:
                            _d.sent();
                            return [3 /*break*/, 14];
                        case 12:
                            if (!(dto.role === 'client')) return [3 /*break*/, 14];
                            return [4 /*yield*/, this.supabaseService.clientRef
                                    .from('clients')
                                    .insert({
                                    user_id: newUser.id,
                                    full_name: dto.fullName,
                                    phone: dto.phone || null,
                                    avatar_url: dto.avatar_url || null,
                                })];
                        case 13:
                            _d.sent();
                            _d.label = 14;
                        case 14: return [4 /*yield*/, this.supabaseService.clientRef
                                .from('user_activities')
                                .insert({ user_id: newUser.id, action: 'OTP_SENT' })];
                        case 15:
                            _d.sent();
                            _d.label = 16;
                        case 16: return [4 /*yield*/, this.mailService.sendOtpEmail(email, otp, dto.fullName)];
                        case 17:
                            _d.sent();
                            return [2 /*return*/, { message: 'Account created. Check your email for the verification code.' }];
                    }
                });
            });
        };
        // ─────────────────────────────────────────
        // VERIFY OTP
        // ─────────────────────────────────────────
        AuthService_1.prototype.verifyOtp = function (email, otp) {
            return __awaiter(this, void 0, void 0, function () {
                var user, remaining, now, payload, token;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.supabaseService.clientRef
                                .from('users')
                                .select('*')
                                .eq('email', email.toLowerCase().trim())
                                .single()];
                        case 1:
                            user = (_a.sent()).data;
                            if (!user)
                                throw new common_1.NotFoundException('Account not found.');
                            if (user.status === 'active') {
                                throw new common_1.BadRequestException('Account is already verified. Please sign in.');
                            }
                            // OTP attempt limit
                            if ((user.otp_attempts || 0) >= 5) {
                                throw new common_1.BadRequestException('Too many attempts. Please register again to get a new code.');
                            }
                            if (!(user.otp_code !== otp)) return [3 /*break*/, 3];
                            return [4 /*yield*/, this.supabaseService.clientRef
                                    .from('users')
                                    .update({ otp_attempts: (user.otp_attempts || 0) + 1 })
                                    .eq('id', user.id)];
                        case 2:
                            _a.sent();
                            remaining = 4 - (user.otp_attempts || 0);
                            throw new common_1.BadRequestException("Invalid code. ".concat(remaining, " attempts remaining."));
                        case 3:
                            now = new Date();
                            if (now > new Date(user.otp_expires_at)) {
                                throw new common_1.BadRequestException('Code has expired. Please register again to get a new code.');
                            }
                            return [4 /*yield*/, this.supabaseService.clientRef
                                    .from('users')
                                    .update({
                                    status: 'active',
                                    otp_code: null,
                                    otp_expires_at: null,
                                    otp_verified: true,
                                    otp_attempts: 0,
                                })
                                    .eq('id', user.id)];
                        case 4:
                            _a.sent();
                            return [4 /*yield*/, this.supabaseService.clientRef
                                    .from('user_activities')
                                    .insert({ user_id: user.id, action: 'ACCOUNT_VERIFIED' })];
                        case 5:
                            _a.sent();
                            payload = { sub: user.id, email: user.email, role: user.role };
                            token = this.jwtService.sign(payload);
                            return [2 /*return*/, {
                                    access_token: token,
                                    role: user.role,
                                    user: { id: user.id, email: user.email, role: user.role },
                                }];
                    }
                });
            });
        };
        // ─────────────────────────────────────────
        // LOGIN
        // ─────────────────────────────────────────
        AuthService_1.prototype.login = function (email, password) {
            return __awaiter(this, void 0, void 0, function () {
                var user, lockUntil, minutesLeft, passwordMatch, payload, token;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.supabaseService.clientRef
                                .from('users')
                                .select('*')
                                .eq('email', email.toLowerCase().trim())
                                .single()];
                        case 1:
                            user = (_a.sent()).data;
                            // Generic error to prevent email enumeration
                            if (!user)
                                throw new common_1.UnauthorizedException('Invalid credentials');
                            if (!((user.failed_login_attempts || 0) >= 5)) return [3 /*break*/, 3];
                            lockUntil = new Date(user.last_failed_login);
                            lockUntil.setMinutes(lockUntil.getMinutes() + 15);
                            if (new Date() < lockUntil) {
                                minutesLeft = Math.ceil((lockUntil.getTime() - Date.now()) / 60000);
                                throw new common_1.UnauthorizedException("Account temporarily locked. Try again in ".concat(minutesLeft, " minute").concat(minutesLeft !== 1 ? 's' : '', "."));
                            }
                            // Lockout expired — reset
                            return [4 /*yield*/, this.supabaseService.clientRef
                                    .from('users')
                                    .update({ failed_login_attempts: 0 })
                                    .eq('id', user.id)];
                        case 2:
                            // Lockout expired — reset
                            _a.sent();
                            _a.label = 3;
                        case 3:
                            // Admin bypasses active check
                            if (user.role !== 'admin' && user.status !== 'active') {
                                throw new common_1.UnauthorizedException('Account is not active. Please verify your email or contact support.');
                            }
                            return [4 /*yield*/, bcrypt.compare(password, user.password_hash)];
                        case 4:
                            passwordMatch = _a.sent();
                            if (!!passwordMatch) return [3 /*break*/, 6];
                            return [4 /*yield*/, this.supabaseService.clientRef
                                    .from('users')
                                    .update({
                                    failed_login_attempts: (user.failed_login_attempts || 0) + 1,
                                    last_failed_login: new Date().toISOString(),
                                })
                                    .eq('id', user.id)];
                        case 5:
                            _a.sent();
                            throw new common_1.UnauthorizedException('Invalid credentials');
                        case 6: 
                        // Successful login — reset counters
                        return [4 /*yield*/, this.supabaseService.clientRef
                                .from('users')
                                .update({ failed_login_attempts: 0, last_login: new Date().toISOString() })
                                .eq('id', user.id)];
                        case 7:
                            // Successful login — reset counters
                            _a.sent();
                            return [4 /*yield*/, this.supabaseService.clientRef
                                    .from('user_activities')
                                    .insert({ user_id: user.id, action: 'LOGIN' })];
                        case 8:
                            _a.sent();
                            payload = { sub: user.id, email: user.email, role: user.role };
                            token = this.jwtService.sign(payload);
                            return [2 /*return*/, {
                                    access_token: token,
                                    role: user.role,
                                    user: { id: user.id, email: user.email, role: user.role },
                                }];
                    }
                });
            });
        };
        // ─────────────────────────────────────────
        // GET ME
        // ─────────────────────────────────────────
        AuthService_1.prototype.getMe = function (userId) {
            return __awaiter(this, void 0, void 0, function () {
                var _a, data, error;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0: return [4 /*yield*/, this.supabaseService.clientRef
                                .from('users')
                                .select('id, email, role, status, username, avatar_url')
                                .eq('id', userId)
                                .single()];
                        case 1:
                            _a = _b.sent(), data = _a.data, error = _a.error;
                            if (error || !data)
                                throw new common_1.NotFoundException('User not found');
                            return [2 /*return*/, data];
                    }
                });
            });
        };
        // ─────────────────────────────────────────
        // ACTIVATE (admin-sent link flow)
        // ─────────────────────────────────────────
        AuthService_1.prototype.validateActivationToken = function (token) {
            return __awaiter(this, void 0, void 0, function () {
                var hashedToken, _a, data, error, now;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            hashedToken = crypto.createHash('sha256').update(token).digest('hex');
                            return [4 /*yield*/, this.supabaseService.clientRef
                                    .from('users')
                                    .select('id, email, status, activation_token_expires_at')
                                    .eq('activation_token', hashedToken)
                                    .single()];
                        case 1:
                            _a = _b.sent(), data = _a.data, error = _a.error;
                            if (error || !data)
                                throw new common_1.NotFoundException('Invalid activation link');
                            if (data.status === 'active')
                                throw new common_1.BadRequestException('Account is already activated');
                            now = new Date();
                            if (now > new Date(data.activation_token_expires_at)) {
                                throw new common_1.BadRequestException('Activation link has expired. Please contact support.');
                            }
                            return [2 /*return*/, {
                                    valid: true,
                                    email: data.email.replace(/(.{2}).*(@.*)/, '$1***$2'),
                                }];
                    }
                });
            });
        };
        AuthService_1.prototype.activateAccount = function (token, password) {
            return __awaiter(this, void 0, void 0, function () {
                var hashedToken, _a, data, error, now, password_hash, updateError;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            hashedToken = crypto.createHash('sha256').update(token).digest('hex');
                            return [4 /*yield*/, this.supabaseService.clientRef
                                    .from('users')
                                    .select('*')
                                    .eq('activation_token', hashedToken)
                                    .single()];
                        case 1:
                            _a = _b.sent(), data = _a.data, error = _a.error;
                            if (error || !data)
                                throw new common_1.NotFoundException('Invalid activation link');
                            if (data.status === 'active')
                                throw new common_1.BadRequestException('Account already activated');
                            now = new Date();
                            if (now > new Date(data.activation_token_expires_at)) {
                                throw new common_1.BadRequestException('Activation link has expired.');
                            }
                            return [4 /*yield*/, bcrypt.hash(password, 12)];
                        case 2:
                            password_hash = _b.sent();
                            return [4 /*yield*/, this.supabaseService.clientRef
                                    .from('users')
                                    .update({
                                    password_hash: password_hash,
                                    status: 'active',
                                    activation_token: null,
                                    activation_token_expires_at: null,
                                })
                                    .eq('id', data.id)];
                        case 3:
                            updateError = (_b.sent()).error;
                            if (updateError)
                                throw new common_1.BadRequestException('Failed to activate account');
                            return [4 /*yield*/, this.supabaseService.clientRef
                                    .from('user_activities')
                                    .insert({ user_id: data.id, action: 'ACCOUNT_ACTIVATED' })];
                        case 4:
                            _b.sent();
                            return [2 /*return*/, { message: 'Account activated successfully. You can now sign in.' }];
                    }
                });
            });
        };
        // ─────────────────────────────────────────
        // FORGOT / RESET PASSWORD
        // ─────────────────────────────────────────
        AuthService_1.prototype.forgotPassword = function (email) {
            return __awaiter(this, void 0, void 0, function () {
                var user, rawToken, hashedToken, expiresAt;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.supabaseService.clientRef
                                .from('users')
                                .select('id, email, status')
                                .eq('email', email.toLowerCase().trim())
                                .single()];
                        case 1:
                            user = (_a.sent()).data;
                            // Always return success — prevent email enumeration
                            if (!user || user.status !== 'active') {
                                return [2 /*return*/, { message: 'If this email is registered, a reset link has been sent.' }];
                            }
                            rawToken = crypto.randomBytes(32).toString('hex');
                            hashedToken = crypto.createHash('sha256').update(rawToken).digest('hex');
                            expiresAt = new Date(Date.now() + 60 * 60 * 1000);
                            return [4 /*yield*/, this.supabaseService.clientRef
                                    .from('users')
                                    .update({ reset_token: hashedToken, reset_token_expires_at: expiresAt })
                                    .eq('id', user.id)];
                        case 2:
                            _a.sent();
                            return [4 /*yield*/, this.mailService.sendPasswordResetEmail(user.email, rawToken)];
                        case 3:
                            _a.sent();
                            return [2 /*return*/, { message: 'If this email is registered, a reset link has been sent.' }];
                    }
                });
            });
        };
        AuthService_1.prototype.resetPassword = function (token, password) {
            return __awaiter(this, void 0, void 0, function () {
                var hashedToken, _a, data, error, now, password_hash;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            hashedToken = crypto.createHash('sha256').update(token).digest('hex');
                            return [4 /*yield*/, this.supabaseService.clientRef
                                    .from('users')
                                    .select('*')
                                    .eq('reset_token', hashedToken)
                                    .single()];
                        case 1:
                            _a = _b.sent(), data = _a.data, error = _a.error;
                            if (error || !data)
                                throw new common_1.NotFoundException('Invalid or expired reset link');
                            now = new Date();
                            if (now > new Date(data.reset_token_expires_at)) {
                                throw new common_1.BadRequestException('Reset link has expired. Please request a new one.');
                            }
                            return [4 /*yield*/, bcrypt.hash(password, 12)];
                        case 2:
                            password_hash = _b.sent();
                            return [4 /*yield*/, this.supabaseService.clientRef
                                    .from('users')
                                    .update({ password_hash: password_hash, reset_token: null, reset_token_expires_at: null })
                                    .eq('id', data.id)];
                        case 3:
                            _b.sent();
                            return [2 /*return*/, { message: 'Password reset successfully. You can now sign in.' }];
                    }
                });
            });
        };
        // ─────────────────────────────────────────
        // GENERATE ACTIVATION TOKEN (for admin flow)
        // ─────────────────────────────────────────
        AuthService_1.prototype.generateActivationToken = function () {
            var rawToken = crypto.randomBytes(32).toString('hex');
            var hashedToken = crypto.createHash('sha256').update(rawToken).digest('hex');
            var expiresAt = new Date(Date.now() + 48 * 60 * 60 * 1000); // 48 hours
            return { rawToken: rawToken, hashedToken: hashedToken, expiresAt: expiresAt };
        };
        return AuthService_1;
    }());
    __setFunctionName(_classThis, "AuthService");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        AuthService = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return AuthService = _classThis;
}();
exports.AuthService = AuthService;
