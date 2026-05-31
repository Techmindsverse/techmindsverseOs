"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateFile = validateFile;
exports.sanitizeFileName = sanitizeFileName;
var common_1 = require("@nestjs/common");
var path = require("path");
var crypto = require("crypto");
var ALLOWED_MIME_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
var MAX_SIZE_BYTES = 500 * 1024;
function validateFile(file) {
    if (!file) {
        throw new common_1.BadRequestException('File is required');
    }
    if (!ALLOWED_MIME_TYPES.includes(file.mimetype)) {
        throw new common_1.BadRequestException('Invalid file type. Only JPEG, PNG, and WebP are allowed');
    }
    if (file.size > MAX_SIZE_BYTES) {
        throw new common_1.BadRequestException('File too large. Maximum size is 500KB');
    }
}
function sanitizeFileName(originalName) {
    var ext = path.extname(originalName).toLowerCase();
    var hash = crypto.randomBytes(16).toString('hex');
    return "".concat(hash).concat(ext);
}
