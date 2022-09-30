import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EventsModule } from './events/events.module';
import { SchoolModule } from './school/school.module';
import { StudentModule } from './student/student.module';
import { Event } from './events/entities/event.entity';
import { School } from './school/entities/school.entity';
import { Student } from './student/entities/student.entity';
import { AuthModule } from './auth/auth.module';
import { TokenModule } from './token/token.module';
import { Token } from './token/entities/token.entity';
import { ConfigModule } from '@nestjs/config';
import { MailerModule } from '@nestjs-modules/mailer';
import { mailerConfig } from './config/mailer.config';

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot({
    type: "postgres",
    host: "localhost", //mudar para dbctportasabertas no ambiente de prod
    port: 5432,
    username: "postgres",
    password: "root",
    database: "store",
    synchronize: true,
    logging: false,
    entities: [Student, School, Event, Token]
    }),
    MailerModule.forRoot(mailerConfig),
    EventsModule,
    SchoolModule,
    AuthModule,
    StudentModule,
    TokenModule]
})
export class AppModule {}
