import { IsUUID, IsNumber, IsString, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreatePaymentDto {
  @ApiProperty()
  @IsUUID()
  course_id: string;

  @ApiProperty()
  @IsNumber()
  amount: number;

  @ApiProperty()
  @IsString()
  reference: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  proof_image_url?: string;
}