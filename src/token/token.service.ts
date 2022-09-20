import { forwardRef, HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UpdateTokenDto } from './dto/update-token.dto';
import { Token } from './entities/token.entity';
import { AuthService } from '../auth/auth.service';
import { SchoolService } from '../school/school.service';
import { StudentService } from '../student/student.service';

@Injectable()
export class TokenService {

  constructor(
    @InjectRepository(Token)
    private tokenRepo: Repository<Token>,
    @Inject(forwardRef(() => StudentService))
    private studentService: StudentService,
    @Inject(forwardRef(() => SchoolService))
    private schoolService: SchoolService,
    @Inject(forwardRef(() => AuthService))
    private authService: AuthService
  ) {} 

  async create(hash: string, username: string) {
    let objToken = await this.tokenRepo.findOne({where: {username: username}});
    if (objToken) {
      this.tokenRepo.update(objToken.id, {hash: hash});
    } else {
      this.tokenRepo.insert({
        hash: hash,
        username: username
      })
    }
  }

  async refreshToken(oldToken: string) {
    let objToken = await this.tokenRepo.findOne({where: {hash: oldToken}});
    if (objToken) {
      let student = await this.studentService.findOneLogin(objToken.username);
      let school = await this.schoolService.findOneLogin(objToken.username);

      if (student && !school) {
        return this.authService.login(student);
      } else if (student && !school) {
        return this.authService.login(school);
      }

    } else { // requisição inválida
      return new HttpException({
        errorMessage: 'Token inválido'
      }, HttpStatus.UNAUTHORIZED);
    }
  }

  findAll() {
    return `This action returns all token`;
  }

  findOne(id: number) {
    return `This action returns a #${id} token`;
  }

  update(id: number, updateTokenDto: UpdateTokenDto) {
    return `This action updates a #${id} token`;
  }

  remove(id: number) {
    return `This action removes a #${id} token`;
  }
}
