import { IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class AdminNoteDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  admin_note?: string;
}