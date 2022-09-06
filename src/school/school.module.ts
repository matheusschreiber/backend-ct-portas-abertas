import { Module } from '@nestjs/common';
import { SchoolService } from './school.service';
import { SchoolController } from './school.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { School } from './entities/school.entity';
import { Event } from '../events/entities/event.entity';
import { EventsService } from '../events/events.service';


@Module({
  imports: [TypeOrmModule.forFeature([School, Event])],
  controllers: [SchoolController],
  providers: [SchoolService, EventsService]
})
export class SchoolModule {}
