import { forwardRef, Module } from '@nestjs/common';
import { TokenService } from './token.service';
import { AuthModule } from '../auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Token } from './entities/token.entity';
import { TokenController } from './token.controller';
import { AuthService } from '../auth/auth.service';
import { StudentModule } from '../student/student.module';
import { SchoolModule } from '../school/school.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Token]),
    forwardRef(() => AuthModule),
    forwardRef(() => StudentModule),
    forwardRef(() => SchoolModule),
  ],
  controllers: [TokenController],
  providers: [TokenService, AuthService],
  exports: [TokenService]
})
export class TokenModule {}
