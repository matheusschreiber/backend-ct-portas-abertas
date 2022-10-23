import { forwardRef, MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { StudentService } from './student.service';
import { StudentController } from './student.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Student } from './entities/student.entity';
import { Event } from '../events/entities/event.entity';
import { EventsService } from '../events/events.service';
import { AuthModule } from '../auth/auth.module';
import { ApiKeyMiddleWare } from '../middleware/apikey.middleware';
import { PasswordEncrypt } from 'src/middleware/crypto.middleware copy';
import { School } from 'src/school/entities/school.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Student, Event, School]), 
    forwardRef(() => AuthModule) // importação duplicada
  ],
  controllers: [StudentController],
  providers: [StudentService, EventsService],
  exports: [StudentService]
})

export class StudentModule implements NestModule{
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(ApiKeyMiddleWare)
      .exclude(
        'student/update-password/:id',
        'student/:id',
        'student/remove-event/:id',
        'student/add-event/:id',
        'student/events/:id',
        'student/auth/login'
        )
      .forRoutes(StudentController);
    
    consumer
      .apply(PasswordEncrypt)
      .forRoutes(
        { path: 'student', method: RequestMethod.POST }
      );
  }
}
