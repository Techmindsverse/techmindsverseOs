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
exports.MailService = void 0;
var common_1 = require("@nestjs/common");
var resend_1 = require("resend");
var MailService = function () {
    var _classDecorators = [(0, common_1.Injectable)()];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var MailService = _classThis = /** @class */ (function () {
        function MailService_1(configService) {
            this.configService = configService;
            this.logger = new common_1.Logger(MailService.name);
            this.resend = new resend_1.Resend(this.configService.getOrThrow('RESEND_API_KEY'));
            this.from = this.configService.getOrThrow('MAIL_FROM');
            this.adminEmail = this.configService.getOrThrow('ADMIN_EMAIL');
            this.frontendUrl = this.configService.getOrThrow('FRONTEND_URL');
            // If no custom domain, all emails go to admin email
            this.isDev = !this.configService.get('CUSTOM_DOMAIN');
        }
        // Route recipient — until domain verified, all go to admin
        MailService_1.prototype.recipient = function (email) {
            return this.isDev ? this.adminEmail : email;
        };
        MailService_1.prototype.sendOtpEmail = function (email, otp, name) {
            return __awaiter(this, void 0, void 0, function () {
                var err_1;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 2, , 3]);
                            return [4 /*yield*/, this.resend.emails.send({
                                    from: this.from,
                                    to: this.recipient(email),
                                    subject: "[".concat(email, "] Verify Your TechMindsVerse Account \u2014 OTP: ").concat(otp),
                                    html: "\n          <div style=\"font-family:Arial,sans-serif;max-width:600px;margin:0 auto;background:#000;color:#fff;padding:40px;\">\n            ".concat(this.isDev ? "<p style=\"background:#1a1a00;border:1px solid #ffff00;color:#ffff00;padding:8px;font-size:11px;margin-bottom:16px;\">DEV MODE: This email was meant for ".concat(email, "</p>") : '', "\n            <h2 style=\"color:#1A3BDB;\">Welcome").concat(name ? ", ".concat(name) : '', " \uD83D\uDC4B</h2>\n            <p style=\"color:#999;\">Your verification code for TechMindsVerse OS:</p>\n            <div style=\"background:#0a0a0a;border:1px solid #1A3BDB;padding:24px;text-align:center;margin:24px 0;\">\n              <span style=\"font-size:48px;font-weight:bold;letter-spacing:12px;color:#1A3BDB;\">").concat(otp, "</span>\n            </div>\n            <p style=\"color:#666;font-size:13px;\">This code expires in 15 minutes.</p>\n            <p style=\"color:#666;font-size:13px;\">If you did not request this, ignore this email.</p>\n          </div>\n        "),
                                })];
                        case 1:
                            _a.sent();
                            this.logger.log("OTP email sent \u2192 ".concat(email, " (delivered to: ").concat(this.recipient(email), ")"));
                            return [3 /*break*/, 3];
                        case 2:
                            err_1 = _a.sent();
                            this.logger.error('Failed to send OTP email', err_1);
                            throw err_1;
                        case 3: return [2 /*return*/];
                    }
                });
            });
        };
        MailService_1.prototype.sendActivationEmail = function (email, token) {
            return __awaiter(this, void 0, void 0, function () {
                var link, err_2;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            link = "".concat(this.frontendUrl, "/activate?token=").concat(token);
                            _a.label = 1;
                        case 1:
                            _a.trys.push([1, 3, , 4]);
                            return [4 /*yield*/, this.resend.emails.send({
                                    from: this.from,
                                    to: this.recipient(email),
                                    subject: "[".concat(email, "] Activate Your TechMindsVerse Account"),
                                    html: "\n          <div style=\"font-family:Arial,sans-serif;max-width:600px;margin:0 auto;background:#000;color:#fff;padding:40px;\">\n            ".concat(this.isDev ? "<p style=\"background:#1a1a00;border:1px solid #ffff00;color:#ffff00;padding:8px;font-size:11px;margin-bottom:16px;\">DEV MODE: This email was meant for ".concat(email, "</p>") : '', "\n            <h2 style=\"color:#1A3BDB;\">Welcome to TechMindsVerse</h2>\n            <p style=\"color:#999;\">Your account has been approved. Click below to activate your account and set your password.</p>\n            <a href=\"").concat(link, "\" style=\"display:inline-block;padding:14px 28px;background:#1A3BDB;color:#fff;text-decoration:none;margin:24px 0;font-weight:600;\">\n              Activate Account\n            </a>\n            <p style=\"color:#666;font-size:13px;\">This link expires in 48 hours.</p>\n          </div>\n        "),
                                })];
                        case 2:
                            _a.sent();
                            this.logger.log("Activation email \u2192 ".concat(email, " (delivered to: ").concat(this.recipient(email), ")"));
                            return [3 /*break*/, 4];
                        case 3:
                            err_2 = _a.sent();
                            this.logger.error('Failed to send activation email', err_2);
                            throw err_2;
                        case 4: return [2 /*return*/];
                    }
                });
            });
        };
        MailService_1.prototype.sendPasswordResetEmail = function (email, token) {
            return __awaiter(this, void 0, void 0, function () {
                var link, err_3;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            link = "".concat(this.frontendUrl, "/reset-password?token=").concat(token);
                            _a.label = 1;
                        case 1:
                            _a.trys.push([1, 3, , 4]);
                            return [4 /*yield*/, this.resend.emails.send({
                                    from: this.from,
                                    to: this.recipient(email),
                                    subject: "[".concat(email, "] Reset Your TechMindsVerse Password"),
                                    html: "\n          <div style=\"font-family:Arial,sans-serif;max-width:600px;margin:0 auto;background:#000;color:#fff;padding:40px;\">\n            ".concat(this.isDev ? "<p style=\"background:#1a1a00;border:1px solid #ffff00;color:#ffff00;padding:8px;font-size:11px;margin-bottom:16px;\">DEV MODE: This email was meant for ".concat(email, "</p>") : '', "\n            <h2 style=\"color:#1A3BDB;\">Reset Your Password</h2>\n            <p style=\"color:#999;\">You requested a password reset.</p>\n            <a href=\"").concat(link, "\" style=\"display:inline-block;padding:14px 28px;background:#1A3BDB;color:#fff;text-decoration:none;margin:24px 0;font-weight:600;\">\n              Reset Password\n            </a>\n            <p style=\"color:#666;font-size:13px;\">This link expires in 1 hour.</p>\n          </div>\n        "),
                                })];
                        case 2:
                            _a.sent();
                            this.logger.log("Password reset \u2192 ".concat(email, " (delivered to: ").concat(this.recipient(email), ")"));
                            return [3 /*break*/, 4];
                        case 3:
                            err_3 = _a.sent();
                            this.logger.error('Failed to send password reset email', err_3);
                            throw err_3;
                        case 4: return [2 /*return*/];
                    }
                });
            });
        };
        MailService_1.prototype.sendContactEmail = function (data) {
            return __awaiter(this, void 0, void 0, function () {
                var err_4;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 2, , 3]);
                            return [4 /*yield*/, this.resend.emails.send({
                                    from: this.from,
                                    to: this.adminEmail,
                                    replyTo: data.email,
                                    subject: "New Contact: ".concat(data.subject),
                                    html: "\n          <div style=\"font-family:Arial,sans-serif;max-width:600px;margin:0 auto;background:#000;color:#fff;padding:40px;\">\n            <h2 style=\"color:#1A3BDB;\">New Contact Submission</h2>\n            <p><strong style=\"color:#999;\">Name:</strong> ".concat(data.name, "</p>\n            <p><strong style=\"color:#999;\">Email:</strong> ").concat(data.email, "</p>\n            <p><strong style=\"color:#999;\">Subject:</strong> ").concat(data.subject, "</p>\n            <hr style=\"border-color:#222;margin:20px 0;\" />\n            <p style=\"color:#ccc;white-space:pre-line;\">").concat(data.message, "</p>\n          </div>\n        "),
                                })];
                        case 1:
                            _a.sent();
                            return [3 /*break*/, 3];
                        case 2:
                            err_4 = _a.sent();
                            this.logger.error('Failed to send contact email', err_4);
                            throw err_4;
                        case 3: return [2 /*return*/];
                    }
                });
            });
        };
        MailService_1.prototype.sendBuildRequestEmail = function (data) {
            return __awaiter(this, void 0, void 0, function () {
                var err_5;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 2, , 3]);
                            return [4 /*yield*/, this.resend.emails.send({
                                    from: this.from,
                                    to: this.adminEmail,
                                    replyTo: data.email,
                                    subject: "New Build Request: ".concat(data.category, " \u2014 ").concat(data.name),
                                    html: "\n          <div style=\"font-family:Arial,sans-serif;max-width:600px;margin:0 auto;background:#000;color:#fff;padding:40px;\">\n            <h2 style=\"color:#1A3BDB;\">New Build Request</h2>\n            <p><strong style=\"color:#999;\">Client:</strong> ".concat(data.name, "</p>\n            <p><strong style=\"color:#999;\">Email:</strong> ").concat(data.email, "</p>\n            <p><strong style=\"color:#999;\">Category:</strong> ").concat(data.category, "</p>\n            <p><strong style=\"color:#999;\">Mode:</strong> ").concat(data.mode || 'Not specified', "</p>\n            <p><strong style=\"color:#999;\">Budget:</strong> ").concat(data.budget || 'Not specified', "</p>\n            <hr style=\"border-color:#222;margin:20px 0;\" />\n            <p style=\"color:#ccc;white-space:pre-line;\">").concat(data.description, "</p>\n          </div>\n        "),
                                })];
                        case 1:
                            _a.sent();
                            return [3 /*break*/, 3];
                        case 2:
                            err_5 = _a.sent();
                            this.logger.error('Failed to send build request email', err_5);
                            throw err_5;
                        case 3: return [2 /*return*/];
                    }
                });
            });
        };
        return MailService_1;
    }());
    __setFunctionName(_classThis, "MailService");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        MailService = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return MailService = _classThis;
}();
exports.MailService = MailService;
