import { IsNumber, IsString, IsOptional, IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class CreatePaymentDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsUUID()
  course_id?: string;

  @ApiProperty()
  @IsNumber()
  @Type(() => Number)
  amount!: number;

  @ApiProperty()
  @IsString()
  reference!: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  proof_image_url?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  note?: string;
}