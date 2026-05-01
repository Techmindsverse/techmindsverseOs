import { IsEnum, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import type { BuildStatus } from '../types/build-status.type';

export class UpdateBuildStatusDto {
  @ApiProperty({ enum: ['pending', 'reviewed', 'accepted', 'rejected', 'in_progress', 'completed'] })
  @IsEnum(['pending', 'reviewed', 'accepted', 'rejected', 'in_progress', 'completed'])
  status!: BuildStatus; // ✅ FIX HERE

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  admin_note?: string;
}