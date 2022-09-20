import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super();
  }

  async validate(username: string, password: string): Promise<any> {
    const userStudent = await this.authService.validateStudent(username, password);
    const userSchool = await this.authService.validateSchool(username, password);
    /*
      Se não for um aluno ou escola, retorna um erro.
      Considerando que não tem como um aluno e uma escola terem o mesmo email.
    */
    if (!userStudent && userSchool) {
      return userSchool;
    } else if (userStudent && !userSchool) {
      return userStudent;
    } else {
      throw new UnauthorizedException();
    }
  }
}