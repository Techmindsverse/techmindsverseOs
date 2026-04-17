import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SupabaseModule } from './modules/supabase/supabase.module';
import { MailModule } from './modules/mail/mail.module';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { StudentsModule } from './modules/students/students.module';
import { PaymentsModule } from './modules/payments/payments.module';
import { ProjectsModule } from './modules/projects/projects.module';
import { ContactModule } from './modules/contact/contact.module';
import { ComplaintsModule } from './modules/complaints/complaints.module';
import { AdminModule } from './modules/admin/admin.module';
import { BuildModule } from './modules/build/build.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    SupabaseModule,
    MailModule,
    AuthModule,
    UsersModule,
    StudentsModule,
    PaymentsModule,
    ProjectsModule,
    ContactModule,
    ComplaintsModule,
    AdminModule,
    BuildModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}