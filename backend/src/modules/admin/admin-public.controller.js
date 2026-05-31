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
exports.AdminPublicController = void 0;
var common_1 = require("@nestjs/common");
var swagger_1 = require("@nestjs/swagger");
var AdminPublicController = function () {
    var _classDecorators = [(0, swagger_1.ApiTags)('Public'), (0, common_1.Controller)('public')];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var _instanceExtraInitializers = [];
    var _getPublicStats_decorators;
    var _getAnnouncements_decorators;
    var _getTestimonials_decorators;
    var _getPlatformStats_decorators;
    var AdminPublicController = _classThis = /** @class */ (function () {
        function AdminPublicController_1(adminService) {
            this.adminService = (__runInitializers(this, _instanceExtraInitializers), adminService);
        }
        AdminPublicController_1.prototype.getPublicStats = function () {
            return this.adminService.getPublicStats();
        };
        AdminPublicController_1.prototype.getAnnouncements = function (limit) {
            if (limit === void 0) { limit = 10; }
            return this.adminService.getAnnouncements(+limit);
        };
        AdminPublicController_1.prototype.getTestimonials = function () {
            return this.adminService.getTestimonials();
        };
        AdminPublicController_1.prototype.getPlatformStats = function () {
            return this.adminService.getPlatformStats();
        };
        return AdminPublicController_1;
    }());
    __setFunctionName(_classThis, "AdminPublicController");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        _getPublicStats_decorators = [(0, common_1.Get)('stats'), (0, swagger_1.ApiOperation)({ summary: 'Live platform stats' })];
        _getAnnouncements_decorators = [(0, common_1.Get)('announcements'), (0, swagger_1.ApiOperation)({ summary: 'Active announcements' })];
        _getTestimonials_decorators = [(0, common_1.Get)('testimonials'), (0, swagger_1.ApiOperation)({ summary: 'Active testimonials' })];
        _getPlatformStats_decorators = [(0, common_1.Get)('platform-stats'), (0, swagger_1.ApiOperation)({ summary: 'Platform stats' })];
        __esDecorate(_classThis, null, _getPublicStats_decorators, { kind: "method", name: "getPublicStats", static: false, private: false, access: { has: function (obj) { return "getPublicStats" in obj; }, get: function (obj) { return obj.getPublicStats; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _getAnnouncements_decorators, { kind: "method", name: "getAnnouncements", static: false, private: false, access: { has: function (obj) { return "getAnnouncements" in obj; }, get: function (obj) { return obj.getAnnouncements; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _getTestimonials_decorators, { kind: "method", name: "getTestimonials", static: false, private: false, access: { has: function (obj) { return "getTestimonials" in obj; }, get: function (obj) { return obj.getTestimonials; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _getPlatformStats_decorators, { kind: "method", name: "getPlatformStats", static: false, private: false, access: { has: function (obj) { return "getPlatformStats" in obj; }, get: function (obj) { return obj.getPlatformStats; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        AdminPublicController = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return AdminPublicController = _classThis;
}();
exports.AdminPublicController = AdminPublicController;
