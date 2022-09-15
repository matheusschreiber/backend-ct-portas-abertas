import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { EventsModule } from './events/events.module';
import { SchoolModule } from './school/school.module';
import { StudentModule } from './student/student.module';
import { Event } from './events/entities/event.entity';
import { School } from './school/entities/school.entity';
import { Student } from './student/entities/student.entity';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [TypeOrmModule.forRoot({
    type: "postgres",
    host: "localhost",
    port: 5432,
    username: "postgres",
    password: "root",
    database: "store",
    synchronize: true,
    logging: false,
    entities: [Student, School, Event]
  }) ,EventsModule, SchoolModule, AuthModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
