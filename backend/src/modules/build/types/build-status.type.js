"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BuildStatus = void 0;
var BuildStatus;
(function (BuildStatus) {
    BuildStatus["SUBMITTED"] = "submitted";
    BuildStatus["REVIEWING"] = "reviewing";
    BuildStatus["PLANNING"] = "planning";
    BuildStatus["IN_PROGRESS"] = "in_progress";
    BuildStatus["TESTING"] = "testing";
    BuildStatus["COMPLETED"] = "completed";
    BuildStatus["DELIVERED"] = "delivered";
    BuildStatus["REJECTED"] = "rejected";
})(BuildStatus || (exports.BuildStatus = BuildStatus = {}));
