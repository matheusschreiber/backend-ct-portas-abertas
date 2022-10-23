import { forwardRef, MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { EventsService } from './events.service';
import { EventsController } from './events.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Event } from './entities/event.entity';
import { ApiKeyMiddleWare } from '../middleware/apikey.middleware';
import { Student } from 'src/student/entities/student.entity';
import { School } from 'src/school/entities/school.entity';

@Module({
  // Tentar adicionar outros módulos
  imports: [
    TypeOrmModule.forFeature([Event, Student, School]),
  ],
  controllers: [EventsController],
  providers: [EventsService]
})

export class EventsModule implements NestModule{

  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(ApiKeyMiddleWare)
      .forRoutes(EventsController);
  }
}
