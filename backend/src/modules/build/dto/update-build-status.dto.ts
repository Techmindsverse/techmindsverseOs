import { IsEnum, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { BuildStatus } from '../types/build-status.type';

export class UpdateBuildStatusDto {
  @ApiProperty({
    enum: ['submitted', 'reviewing', 'planning', 'in_progress', 'testing', 'completed', 'delivered', 'rejected'],
  })
  @IsEnum(BuildStatus)
  status!: BuildStatus;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  admin_note?: string;
}