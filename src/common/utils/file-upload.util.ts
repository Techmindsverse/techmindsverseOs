import { BadRequestException } from '@nestjs/common';
import * as path from 'path';
import * as crypto from 'crypto';

const ALLOWED_MIME_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
const MAX_SIZE_BYTES = 500 * 1024;

export function validateFile(file: Express.Multer.File): void {
  if (!file) {
    throw new BadRequestException('File is required');
  }
  if (!ALLOWED_MIME_TYPES.includes(file.mimetype)) {
    throw new BadRequestException('Invalid file type. Only JPEG, PNG, and WebP are allowed');
  }
  if (file.size > MAX_SIZE_BYTES) {
    throw new BadRequestException('File too large. Maximum size is 500KB');
  }
}

export function sanitizeFileName(originalName: string): string {
  const ext = path.extname(originalName).toLowerCase();
  const hash = crypto.randomBytes(16).toString('hex');
  return `${hash}${ext}`;
}