import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { StudentModule } from '../student/student.module';
import { AuthService } from './auth.service';
import { LocalStrategy } from './local.strategy';

@Module({
  imports: [StudentModule, PassportModule],
  providers: [AuthService, LocalStrategy]
})
export class AuthModule {}
