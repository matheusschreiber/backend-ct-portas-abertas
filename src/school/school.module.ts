import { forwardRef, MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { SchoolService } from './school.service';
import { SchoolController } from './school.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { School } from './entities/school.entity';
import { Event } from '../events/entities/event.entity';
import { EventsService } from '../events/events.service';
import { AuthModule } from '../auth/auth.module';
import { ApiKeyMiddleWare } from '../middleware/apikey.middleware';

@Module({
  imports: [
    TypeOrmModule.forFeature([School, Event]),
    forwardRef(() => AuthModule), // importação duplicada
  ],
  controllers: [SchoolController],
  providers: [SchoolService, EventsService],
  exports: [SchoolService]
})

export class SchoolModule implements NestModule{
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(ApiKeyMiddleWare)
      .exclude(
        'school/update-password/:id',
        'school/auth/login',
        'school/events/:id',
        'school/add-event/:id',
        'remove-event/:id',
        'school/:id'
      )
      .forRoutes(SchoolController);
  }
}
