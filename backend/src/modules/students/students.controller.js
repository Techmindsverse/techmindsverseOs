"use strict";
var __runInitializers = (this && this.__runInitializers) || function (thisArg, initializers, value) {
    var useValue = arguments.length > 2;
    for (var i = 0; i < initializers.length; i++) {
        value = useValue ? initializers[i].call(thisArg, value) : initializers[i].call(thisArg);
    }
    return useValue ? value : void 0;
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
var __setFunctionName = (this && this.__setFunctionName) || function (f, name, prefix) {
    if (typeof name === "symbol") name = name.description ? "[".concat(name.description, "]") : "";
    return Object.defineProperty(f, "name", { configurable: true, value: prefix ? "".concat(prefix, " ", name) : name });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.StudentsController = void 0;
var common_1 = require("@nestjs/common");
var swagger_1 = require("@nestjs/swagger");
var jwt_auth_guard_1 = require("../../common/guards/jwt-auth.guard");
var StudentsController = function () {
    var _classDecorators = [(0, swagger_1.ApiTags)('Students'), (0, swagger_1.ApiBearerAuth)(), (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard), (0, common_1.Controller)('students')];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var _instanceExtraInitializers = [];
    var _getMyProfile_decorators;
    var _getById_decorators;
    var _getMyEnrollments_decorators;
    var StudentsController = _classThis = /** @class */ (function () {
        function StudentsController_1(studentsService) {
            this.studentsService = (__runInitializers(this, _instanceExtraInitializers), studentsService);
        }
        StudentsController_1.prototype.getMyProfile = function (user) {
            return this.studentsService.getProfile(user.id);
        };
        StudentsController_1.prototype.getById = function (id) {
            return this.studentsService.getById(id);
        };
        StudentsController_1.prototype.getMyEnrollments = function (user) {
            return this.studentsService.getEnrollments(user.id);
        };
        return StudentsController_1;
    }());
    __setFunctionName(_classThis, "StudentsController");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        _getMyProfile_decorators = [(0, common_1.Get)('me'), (0, swagger_1.ApiOperation)({ summary: 'Get my student profile' })];
        _getById_decorators = [(0, common_1.Get)(':id'), (0, swagger_1.ApiOperation)({ summary: 'Get student by ID' })];
        _getMyEnrollments_decorators = [(0, common_1.Get)('me/enrollments'), (0, swagger_1.ApiOperation)({ summary: 'Get my enrolled courses' })];
        __esDecorate(_classThis, null, _getMyProfile_decorators, { kind: "method", name: "getMyProfile", static: false, private: false, access: { has: function (obj) { return "getMyProfile" in obj; }, get: function (obj) { return obj.getMyProfile; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _getById_decorators, { kind: "method", name: "getById", static: false, private: false, access: { has: function (obj) { return "getById" in obj; }, get: function (obj) { return obj.getById; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _getMyEnrollments_decorators, { kind: "method", name: "getMyEnrollments", static: false, private: false, access: { has: function (obj) { return "getMyEnrollments" in obj; }, get: function (obj) { return obj.getMyEnrollments; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        StudentsController = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return StudentsController = _classThis;
}();
exports.StudentsController = StudentsController;
