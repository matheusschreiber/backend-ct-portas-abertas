import { Module } from '@nestjs/common';
import { StudentService } from './student.service';
import { StudentController } from './student.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Student } from './entities/student.entity';
import { Event } from '../events/entities/event.entity';
import { EventsService } from '../events/events.service';

@Module({
  imports: [TypeOrmModule.forFeature([Student, Event])],
  controllers: [StudentController],
  providers: [StudentService, EventsService]
})
export class StudentModule {}
