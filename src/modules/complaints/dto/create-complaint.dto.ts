import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateComplaintDto {
  @ApiProperty() @IsString() subject: string;
  @ApiProperty() @IsString() message: string;
}