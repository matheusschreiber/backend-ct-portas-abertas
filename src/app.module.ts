import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EventsModule } from './events/events.module';
import { SchoolModule } from './school/school.module';
import { StudentModule } from './student/student.module';
import { AuthModule } from './auth/auth.module';
import { TokenModule } from './token/token.module';
import { ConfigModule } from '@nestjs/config';
import { MailerModule } from '@nestjs-modules/mailer';
import { typeOrmConfig } from './config/typeOrm.config';
import  mailerConfig  from './config/mailer.config';

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true, load: [mailerConfig] }),
    TypeOrmModule.forRoot(typeOrmConfig),
    MailerModule.forRoot(mailerConfig()),
    EventsModule,
    SchoolModule,
    AuthModule,
    StudentModule,
    TokenModule]
})
export class AppModule {}
