import { Injectable } from '@nestjs/common';
import { SupabaseService } from '../../modules/supabase/supabase.service';
import { sanitizeFileName } from './file-upload.util';

// eslint-disable-next-line @typescript-eslint/no-require-imports
const sharp = require('sharp') as typeof import('sharp');

@Injectable()
export class StorageUtil {
  constructor(private supabaseService: SupabaseService) {}

  async uploadImage(
    file: Express.Multer.File,
    bucket: string,
    folder: string,
  ): Promise<string> {
    const compressed = await sharp(file.buffer)
      .webp({ quality: 80 })
      .toBuffer();

    const fileName = sanitizeFileName(file.originalname).replace(/\.[^.]+$/, '.webp');
    const filePath = `${folder}/${fileName}`;

    const { error } = await this.supabaseService.db.storage
      .from(bucket)
      .upload(filePath, compressed, {
        contentType: 'image/webp',
        upsert: false,
      });

    if (error) throw new Error('Failed to upload file');

    const { data } = this.supabaseService.db.storage
      .from(bucket)
      .getPublicUrl(filePath);

    return data.publicUrl;
  }
}