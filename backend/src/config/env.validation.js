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
Object.defineProperty(exports, "__esModule", { value: true });
exports.EnvironmentVariables = void 0;
exports.validate = validate;
var class_transformer_1 = require("class-transformer");
var class_validator_1 = require("class-validator");
var EnvironmentVariables = function () {
    var _a;
    var _SUPABASE_URL_decorators;
    var _SUPABASE_URL_initializers = [];
    var _SUPABASE_URL_extraInitializers = [];
    var _SUPABASE_SERVICE_ROLE_KEY_decorators;
    var _SUPABASE_SERVICE_ROLE_KEY_initializers = [];
    var _SUPABASE_SERVICE_ROLE_KEY_extraInitializers = [];
    var _JWT_SECRET_decorators;
    var _JWT_SECRET_initializers = [];
    var _JWT_SECRET_extraInitializers = [];
    var _RESEND_API_KEY_decorators;
    var _RESEND_API_KEY_initializers = [];
    var _RESEND_API_KEY_extraInitializers = [];
    var _MAIL_FROM_decorators;
    var _MAIL_FROM_initializers = [];
    var _MAIL_FROM_extraInitializers = [];
    var _ADMIN_EMAIL_decorators;
    var _ADMIN_EMAIL_initializers = [];
    var _ADMIN_EMAIL_extraInitializers = [];
    var _FRONTEND_URL_decorators;
    var _FRONTEND_URL_initializers = [];
    var _FRONTEND_URL_extraInitializers = [];
    var _CUSTOM_DOMAIN_decorators;
    var _CUSTOM_DOMAIN_initializers = [];
    var _CUSTOM_DOMAIN_extraInitializers = [];
    var _NODE_ENV_decorators;
    var _NODE_ENV_initializers = [];
    var _NODE_ENV_extraInitializers = [];
    var _PORT_decorators;
    var _PORT_initializers = [];
    var _PORT_extraInitializers = [];
    return _a = /** @class */ (function () {
            function EnvironmentVariables() {
                this.SUPABASE_URL = __runInitializers(this, _SUPABASE_URL_initializers, void 0);
                this.SUPABASE_SERVICE_ROLE_KEY = (__runInitializers(this, _SUPABASE_URL_extraInitializers), __runInitializers(this, _SUPABASE_SERVICE_ROLE_KEY_initializers, void 0));
                this.JWT_SECRET = (__runInitializers(this, _SUPABASE_SERVICE_ROLE_KEY_extraInitializers), __runInitializers(this, _JWT_SECRET_initializers, void 0));
                this.RESEND_API_KEY = (__runInitializers(this, _JWT_SECRET_extraInitializers), __runInitializers(this, _RESEND_API_KEY_initializers, void 0));
                this.MAIL_FROM = (__runInitializers(this, _RESEND_API_KEY_extraInitializers), __runInitializers(this, _MAIL_FROM_initializers, void 0));
                this.ADMIN_EMAIL = (__runInitializers(this, _MAIL_FROM_extraInitializers), __runInitializers(this, _ADMIN_EMAIL_initializers, void 0));
                this.FRONTEND_URL = (__runInitializers(this, _ADMIN_EMAIL_extraInitializers), __runInitializers(this, _FRONTEND_URL_initializers, void 0));
                this.CUSTOM_DOMAIN = (__runInitializers(this, _FRONTEND_URL_extraInitializers), __runInitializers(this, _CUSTOM_DOMAIN_initializers, void 0));
                this.NODE_ENV = (__runInitializers(this, _CUSTOM_DOMAIN_extraInitializers), __runInitializers(this, _NODE_ENV_initializers, void 0));
                this.PORT = (__runInitializers(this, _NODE_ENV_extraInitializers), __runInitializers(this, _PORT_initializers, void 0));
                __runInitializers(this, _PORT_extraInitializers);
            }
            return EnvironmentVariables;
        }()),
        (function () {
            var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _SUPABASE_URL_decorators = [(0, class_validator_1.IsString)(), (0, class_validator_1.IsNotEmpty)()];
            _SUPABASE_SERVICE_ROLE_KEY_decorators = [(0, class_validator_1.IsString)(), (0, class_validator_1.IsNotEmpty)()];
            _JWT_SECRET_decorators = [(0, class_validator_1.IsString)(), (0, class_validator_1.IsNotEmpty)()];
            _RESEND_API_KEY_decorators = [(0, class_validator_1.IsString)(), (0, class_validator_1.IsNotEmpty)()];
            _MAIL_FROM_decorators = [(0, class_validator_1.IsString)(), (0, class_validator_1.IsNotEmpty)()];
            _ADMIN_EMAIL_decorators = [(0, class_validator_1.IsString)(), (0, class_validator_1.IsNotEmpty)()];
            _FRONTEND_URL_decorators = [(0, class_validator_1.IsString)(), (0, class_validator_1.IsNotEmpty)()];
            _CUSTOM_DOMAIN_decorators = [(0, class_validator_1.IsString)(), (0, class_validator_1.IsOptional)()];
            _NODE_ENV_decorators = [(0, class_validator_1.IsString)(), (0, class_validator_1.IsOptional)()];
            _PORT_decorators = [(0, class_validator_1.IsString)(), (0, class_validator_1.IsOptional)()];
            __esDecorate(null, null, _SUPABASE_URL_decorators, { kind: "field", name: "SUPABASE_URL", static: false, private: false, access: { has: function (obj) { return "SUPABASE_URL" in obj; }, get: function (obj) { return obj.SUPABASE_URL; }, set: function (obj, value) { obj.SUPABASE_URL = value; } }, metadata: _metadata }, _SUPABASE_URL_initializers, _SUPABASE_URL_extraInitializers);
            __esDecorate(null, null, _SUPABASE_SERVICE_ROLE_KEY_decorators, { kind: "field", name: "SUPABASE_SERVICE_ROLE_KEY", static: false, private: false, access: { has: function (obj) { return "SUPABASE_SERVICE_ROLE_KEY" in obj; }, get: function (obj) { return obj.SUPABASE_SERVICE_ROLE_KEY; }, set: function (obj, value) { obj.SUPABASE_SERVICE_ROLE_KEY = value; } }, metadata: _metadata }, _SUPABASE_SERVICE_ROLE_KEY_initializers, _SUPABASE_SERVICE_ROLE_KEY_extraInitializers);
            __esDecorate(null, null, _JWT_SECRET_decorators, { kind: "field", name: "JWT_SECRET", static: false, private: false, access: { has: function (obj) { return "JWT_SECRET" in obj; }, get: function (obj) { return obj.JWT_SECRET; }, set: function (obj, value) { obj.JWT_SECRET = value; } }, metadata: _metadata }, _JWT_SECRET_initializers, _JWT_SECRET_extraInitializers);
            __esDecorate(null, null, _RESEND_API_KEY_decorators, { kind: "field", name: "RESEND_API_KEY", static: false, private: false, access: { has: function (obj) { return "RESEND_API_KEY" in obj; }, get: function (obj) { return obj.RESEND_API_KEY; }, set: function (obj, value) { obj.RESEND_API_KEY = value; } }, metadata: _metadata }, _RESEND_API_KEY_initializers, _RESEND_API_KEY_extraInitializers);
            __esDecorate(null, null, _MAIL_FROM_decorators, { kind: "field", name: "MAIL_FROM", static: false, private: false, access: { has: function (obj) { return "MAIL_FROM" in obj; }, get: function (obj) { return obj.MAIL_FROM; }, set: function (obj, value) { obj.MAIL_FROM = value; } }, metadata: _metadata }, _MAIL_FROM_initializers, _MAIL_FROM_extraInitializers);
            __esDecorate(null, null, _ADMIN_EMAIL_decorators, { kind: "field", name: "ADMIN_EMAIL", static: false, private: false, access: { has: function (obj) { return "ADMIN_EMAIL" in obj; }, get: function (obj) { return obj.ADMIN_EMAIL; }, set: function (obj, value) { obj.ADMIN_EMAIL = value; } }, metadata: _metadata }, _ADMIN_EMAIL_initializers, _ADMIN_EMAIL_extraInitializers);
            __esDecorate(null, null, _FRONTEND_URL_decorators, { kind: "field", name: "FRONTEND_URL", static: false, private: false, access: { has: function (obj) { return "FRONTEND_URL" in obj; }, get: function (obj) { return obj.FRONTEND_URL; }, set: function (obj, value) { obj.FRONTEND_URL = value; } }, metadata: _metadata }, _FRONTEND_URL_initializers, _FRONTEND_URL_extraInitializers);
            __esDecorate(null, null, _CUSTOM_DOMAIN_decorators, { kind: "field", name: "CUSTOM_DOMAIN", static: false, private: false, access: { has: function (obj) { return "CUSTOM_DOMAIN" in obj; }, get: function (obj) { return obj.CUSTOM_DOMAIN; }, set: function (obj, value) { obj.CUSTOM_DOMAIN = value; } }, metadata: _metadata }, _CUSTOM_DOMAIN_initializers, _CUSTOM_DOMAIN_extraInitializers);
            __esDecorate(null, null, _NODE_ENV_decorators, { kind: "field", name: "NODE_ENV", static: false, private: false, access: { has: function (obj) { return "NODE_ENV" in obj; }, get: function (obj) { return obj.NODE_ENV; }, set: function (obj, value) { obj.NODE_ENV = value; } }, metadata: _metadata }, _NODE_ENV_initializers, _NODE_ENV_extraInitializers);
            __esDecorate(null, null, _PORT_decorators, { kind: "field", name: "PORT", static: false, private: false, access: { has: function (obj) { return "PORT" in obj; }, get: function (obj) { return obj.PORT; }, set: function (obj, value) { obj.PORT = value; } }, metadata: _metadata }, _PORT_initializers, _PORT_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
}();
exports.EnvironmentVariables = EnvironmentVariables;
function validate(config) {
    var validated = (0, class_transformer_1.plainToInstance)(EnvironmentVariables, config, {
        enableImplicitConversion: true,
    });
    var errors = (0, class_validator_1.validateSync)(validated, { skipMissingProperties: false });
    if (errors.length > 0) {
        throw new Error("Environment validation failed:\n".concat(errors.map(function (e) { return Object.values(e.constraints || {}).join(', '); }).join('\n')));
    }
    return validated;
}
