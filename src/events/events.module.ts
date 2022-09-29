import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { EventsService } from './events.service';
import { EventsController } from './events.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Event } from './entities/event.entity';
import { ApiKeyMiddleWare } from './middleware/apikey.middleware';

@Module({
  // Tentar adicionar outros módulos
  imports: [TypeOrmModule.forFeature([Event])],
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
