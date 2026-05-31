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
exports.AdminController = void 0;
var common_1 = require("@nestjs/common");
var swagger_1 = require("@nestjs/swagger");
var jwt_auth_guard_1 = require("../../common/guards/jwt-auth.guard");
var roles_guard_1 = require("../../common/guards/roles.guard");
var roles_decorator_1 = require("../../common/decorators/roles.decorator");
var AdminController = function () {
    var _classDecorators = [(0, swagger_1.ApiTags)('Admin'), (0, swagger_1.ApiBearerAuth)(), (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard), (0, roles_decorator_1.Roles)('admin'), (0, common_1.Controller)('admin')];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var _instanceExtraInitializers = [];
    var _getMetrics_decorators;
    var _getActivity_decorators;
    var _getAllPayments_decorators;
    var _approvePayment_decorators;
    var _rejectPayment_decorators;
    var _getAllStudents_decorators;
    var _getAllProjects_decorators;
    var _getAllComplaints_decorators;
    var _getAllContacts_decorators;
    var _getAllBuilds_decorators;
    var _createAnnouncement_decorators;
    var _manageTestimonial_decorators;
    var _updateStat_decorators;
    var AdminController = _classThis = /** @class */ (function () {
        function AdminController_1(adminService) {
            this.adminService = (__runInitializers(this, _instanceExtraInitializers), adminService);
        }
        AdminController_1.prototype.getMetrics = function () {
            return this.adminService.getMetrics();
        };
        AdminController_1.prototype.getActivity = function (page, limit) {
            if (page === void 0) { page = 1; }
            if (limit === void 0) { limit = 20; }
            return this.adminService.getActivity(+page, +limit);
        };
        AdminController_1.prototype.getAllPayments = function (page, limit) {
            if (page === void 0) { page = 1; }
            if (limit === void 0) { limit = 20; }
            return this.adminService.getAllPayments(+page, +limit);
        };
        AdminController_1.prototype.approvePayment = function (id, dto) {
            return this.adminService.approvePayment(id, dto);
        };
        AdminController_1.prototype.rejectPayment = function (id, dto) {
            return this.adminService.rejectPayment(id, dto);
        };
        AdminController_1.prototype.getAllStudents = function (page, limit) {
            if (page === void 0) { page = 1; }
            if (limit === void 0) { limit = 20; }
            return this.adminService.getAllStudents(+page, +limit);
        };
        AdminController_1.prototype.getAllProjects = function (page, limit) {
            if (page === void 0) { page = 1; }
            if (limit === void 0) { limit = 20; }
            return this.adminService.getAllProjects(+page, +limit);
        };
        AdminController_1.prototype.getAllComplaints = function (page, limit) {
            if (page === void 0) { page = 1; }
            if (limit === void 0) { limit = 20; }
            return this.adminService.getAllComplaints(+page, +limit);
        };
        AdminController_1.prototype.getAllContacts = function (page, limit) {
            if (page === void 0) { page = 1; }
            if (limit === void 0) { limit = 20; }
            return this.adminService.getAllContacts(+page, +limit);
        };
        AdminController_1.prototype.getAllBuilds = function (page, limit) {
            if (page === void 0) { page = 1; }
            if (limit === void 0) { limit = 20; }
            return this.adminService.getAllBuilds(+page, +limit);
        };
        AdminController_1.prototype.createAnnouncement = function (dto, req) {
            return this.adminService.createAnnouncement(dto, req.user.id);
        };
        AdminController_1.prototype.manageTestimonial = function (dto) {
            return this.adminService.manageTestimonial(dto);
        };
        AdminController_1.prototype.updateStat = function (dto) {
            return this.adminService.updatePlatformStat(dto.key, dto.value, dto.label);
        };
        return AdminController_1;
    }());
    __setFunctionName(_classThis, "AdminController");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        _getMetrics_decorators = [(0, common_1.Get)('metrics'), (0, swagger_1.ApiOperation)({ summary: 'Get system metrics' })];
        _getActivity_decorators = [(0, common_1.Get)('activity'), (0, swagger_1.ApiOperation)({ summary: 'Get system activity feed' })];
        _getAllPayments_decorators = [(0, common_1.Get)('payments'), (0, swagger_1.ApiOperation)({ summary: 'Get all payments' })];
        _approvePayment_decorators = [(0, common_1.Patch)('payments/:id/approve'), (0, swagger_1.ApiOperation)({ summary: 'Approve a payment' })];
        _rejectPayment_decorators = [(0, common_1.Patch)('payments/:id/reject'), (0, swagger_1.ApiOperation)({ summary: 'Reject a payment' })];
        _getAllStudents_decorators = [(0, common_1.Get)('students'), (0, swagger_1.ApiOperation)({ summary: 'Get all students' })];
        _getAllProjects_decorators = [(0, common_1.Get)('projects'), (0, swagger_1.ApiOperation)({ summary: 'Get all projects' })];
        _getAllComplaints_decorators = [(0, common_1.Get)('complaints'), (0, swagger_1.ApiOperation)({ summary: 'Get all complaints' })];
        _getAllContacts_decorators = [(0, common_1.Get)('contacts'), (0, swagger_1.ApiOperation)({ summary: 'Get all contacts' })];
        _getAllBuilds_decorators = [(0, common_1.Get)('builds'), (0, swagger_1.ApiOperation)({ summary: 'Get all build requests' })];
        _createAnnouncement_decorators = [(0, common_1.Post)('announcements'), (0, swagger_1.ApiOperation)({ summary: 'Create announcement' })];
        _manageTestimonial_decorators = [(0, common_1.Post)('testimonials'), (0, swagger_1.ApiOperation)({ summary: 'Manage testimonials' })];
        _updateStat_decorators = [(0, common_1.Patch)('platform-stats'), (0, swagger_1.ApiOperation)({ summary: 'Update platform stat' })];
        __esDecorate(_classThis, null, _getMetrics_decorators, { kind: "method", name: "getMetrics", static: false, private: false, access: { has: function (obj) { return "getMetrics" in obj; }, get: function (obj) { return obj.getMetrics; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _getActivity_decorators, { kind: "method", name: "getActivity", static: false, private: false, access: { has: function (obj) { return "getActivity" in obj; }, get: function (obj) { return obj.getActivity; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _getAllPayments_decorators, { kind: "method", name: "getAllPayments", static: false, private: false, access: { has: function (obj) { return "getAllPayments" in obj; }, get: function (obj) { return obj.getAllPayments; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _approvePayment_decorators, { kind: "method", name: "approvePayment", static: false, private: false, access: { has: function (obj) { return "approvePayment" in obj; }, get: function (obj) { return obj.approvePayment; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _rejectPayment_decorators, { kind: "method", name: "rejectPayment", static: false, private: false, access: { has: function (obj) { return "rejectPayment" in obj; }, get: function (obj) { return obj.rejectPayment; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _getAllStudents_decorators, { kind: "method", name: "getAllStudents", static: false, private: false, access: { has: function (obj) { return "getAllStudents" in obj; }, get: function (obj) { return obj.getAllStudents; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _getAllProjects_decorators, { kind: "method", name: "getAllProjects", static: false, private: false, access: { has: function (obj) { return "getAllProjects" in obj; }, get: function (obj) { return obj.getAllProjects; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _getAllComplaints_decorators, { kind: "method", name: "getAllComplaints", static: false, private: false, access: { has: function (obj) { return "getAllComplaints" in obj; }, get: function (obj) { return obj.getAllComplaints; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _getAllContacts_decorators, { kind: "method", name: "getAllContacts", static: false, private: false, access: { has: function (obj) { return "getAllContacts" in obj; }, get: function (obj) { return obj.getAllContacts; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _getAllBuilds_decorators, { kind: "method", name: "getAllBuilds", static: false, private: false, access: { has: function (obj) { return "getAllBuilds" in obj; }, get: function (obj) { return obj.getAllBuilds; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _createAnnouncement_decorators, { kind: "method", name: "createAnnouncement", static: false, private: false, access: { has: function (obj) { return "createAnnouncement" in obj; }, get: function (obj) { return obj.createAnnouncement; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _manageTestimonial_decorators, { kind: "method", name: "manageTestimonial", static: false, private: false, access: { has: function (obj) { return "manageTestimonial" in obj; }, get: function (obj) { return obj.manageTestimonial; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _updateStat_decorators, { kind: "method", name: "updateStat", static: false, private: false, access: { has: function (obj) { return "updateStat" in obj; }, get: function (obj) { return obj.updateStat; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        AdminController = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return AdminController = _classThis;
}();
exports.AdminController = AdminController;
