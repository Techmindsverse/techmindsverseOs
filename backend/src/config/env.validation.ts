import { plainToInstance } from 'class-transformer';
import { IsString, IsNotEmpty, validateSync, IsOptional } from 'class-validator';

export class EnvironmentVariables {
  @IsString()
  @IsNotEmpty()
  SUPABASE_URL!: string;

  @IsString()
  @IsNotEmpty()
  SUPABASE_SERVICE_ROLE_KEY!: string;

  @IsString()
  @IsNotEmpty()
  JWT_SECRET!: string;

  @IsString()
  @IsNotEmpty()
  RESEND_API_KEY!: string;

  @IsString()
  @IsNotEmpty()
  MAIL_FROM!: string;

  @IsString()
  @IsNotEmpty()
  ADMIN_EMAIL!: string;

  @IsString()
  @IsNotEmpty()
  FRONTEND_URL!: string;

  @IsString()
  @IsOptional()
  CUSTOM_DOMAIN?: string;

  @IsString()
  @IsOptional()
  NODE_ENV?: string;

  @IsString()
  @IsOptional()
  PORT?: string;
}

export function validate(config: Record<string, unknown>) {
  const validated = plainToInstance(EnvironmentVariables, config, {
    enableImplicitConversion: true,
  });
  const errors = validateSync(validated, { skipMissingProperties: false });
  if (errors.length > 0) {
    throw new Error(`Environment validation failed:\n${errors.map(e => Object.values(e.constraints || {}).join(', ')).join('\n')}`);
  }
  return validated;
}