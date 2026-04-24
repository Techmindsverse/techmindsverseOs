import { IsString, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateBuildDto {
  @ApiProperty() @IsString() name: string;
  @ApiProperty() @IsString() email: string;
  @ApiProperty() @IsString() description: string;
  @ApiProperty() @IsString() category: string;
  @ApiProperty({ required: false }) @IsOptional() @IsString() budget?: string;
  @ApiProperty({ required: false }) @IsOptional() @IsString() requirements?: string;
}