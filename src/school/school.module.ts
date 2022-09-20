import { forwardRef, Module } from '@nestjs/common';
import { SchoolService } from './school.service';
import { SchoolController } from './school.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { School } from './entities/school.entity';
import { Event } from '../events/entities/event.entity';
import { EventsService } from '../events/events.service';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([School, Event]),
    forwardRef(() => AuthModule), // importação duplicada
  ],
  controllers: [SchoolController],
  providers: [SchoolService, EventsService],
  exports: [SchoolService]
})
export class SchoolModule {}
