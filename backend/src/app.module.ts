import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerModule } from '@nestjs/throttler';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { validate } from './config/env.validation';
import { RolesModule } from './modules/roles/roles.module';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { StudentsModule } from './modules/students/students.module';
import { ClientsModule } from './modules/clients/clients.module';
import { PaymentsModule } from './modules/payments/payments.module';
import { ProjectsModule } from './modules/projects/projects.module';
import { ContactModule } from './modules/contact/contact.module';
import { ComplaintsModule } from './modules/complaints/complaints.module';
import { BuildModule } from './modules/build/build.module';
import { AdminModule } from './modules/admin/admin.module';
import { CoursesModule } from './modules/courses/courses.module';
import { SupabaseModule } from './modules/supabase/supabase.module';
import { MailModule } from './modules/mail/mail.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, validate }),
    ThrottlerModule.forRoot([{ ttl: 60000, limit: 100 }]),
    SupabaseModule,
    MailModule,
    AuthModule,
    UsersModule,
    StudentsModule,
    ClientsModule,
    PaymentsModule,
    ProjectsModule,
    ContactModule,
    ComplaintsModule,
    BuildModule,
    AdminModule,
    CoursesModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}