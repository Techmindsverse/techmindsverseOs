import { Module } from '@nestjs/common';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';
import { AdminPublicController } from './admin-public.controller';
import { BuildModule } from '../build/build.module';
import { AuthModule } from '../auth/auth.module';
import { SupabaseModule } from '../supabase/supabase.module';
import { MailModule } from '../mail/mail.module';

@Module({
  imports: [
    BuildModule,   // ✅ now properly exports BuildService
    AuthModule,
    SupabaseModule,
    MailModule,
  ],
  controllers: [AdminController, AdminPublicController],
  providers: [AdminService],
})
export class AdminModule {}