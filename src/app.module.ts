import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { EventsModule } from './events/events.module';
import { SchoolModule } from './school/school.module';
import { StudentModule } from './student/student.module';

@Module({
  imports: [EventsModule, SchoolModule, StudentModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
