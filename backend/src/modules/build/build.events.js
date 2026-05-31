"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BuildAssignedEvent = exports.BuildUpdatedEvent = exports.BuildCreatedEvent = void 0;
var BuildCreatedEvent = /** @class */ (function () {
    function BuildCreatedEvent(build) {
        this.build = build;
    }
    return BuildCreatedEvent;
}());
exports.BuildCreatedEvent = BuildCreatedEvent;
var BuildUpdatedEvent = /** @class */ (function () {
    function BuildUpdatedEvent(build) {
        this.build = build;
    }
    return BuildUpdatedEvent;
}());
exports.BuildUpdatedEvent = BuildUpdatedEvent;
var BuildAssignedEvent = /** @class */ (function () {
    function BuildAssignedEvent(build) {
        this.build = build;
    }
    return BuildAssignedEvent;
}());
exports.BuildAssignedEvent = BuildAssignedEvent;
