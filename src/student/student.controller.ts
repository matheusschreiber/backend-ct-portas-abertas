import { 
Controller,
Get,
Post,
Body,
Request,
Patch,
Param,
Delete,
ValidationPipe,
UseGuards,
} from '@nestjs/common';
import { StudentService } from './student.service';
import { CreateStudentDto } from './dto/create-student.dto';
import { UpdateStudentDto } from './dto/update-student.dto';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from '../auth/auth.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RecoverPasswordDto } from './dto/recover-password.dto';
import { UpdatePasswordDto } from './dto/update-password.dto';

@Controller('student')
export class StudentController {
  constructor(
    private readonly studentService: StudentService,
    private authService: AuthService
  ) {}

  @Post()
  create(@Body(new ValidationPipe({errorHttpStatusCode: 422})) createStudentDto: CreateStudentDto) {
    return this.studentService.create(createStudentDto);
  }

  @UseGuards(AuthGuard('local'))
  @Post('auth/login')
  async login(@Request() req) {
    return this.authService.login(req.user);
  }

  @Get()
  findAll() {
    return this.studentService.findAll();
  }

  @Get('find/:id')
  findOne(@Param('id') id: string) {
    return this.studentService.findOne(+id);
  }

  @UseGuards(JwtAuthGuard) // para usar essa rota, é necessário passar o token no header da requisição
  @Get('events/:id')
  findEvents(@Param('id') id: string) {
    return this.studentService.findEvents(+id);
  }

  @UseGuards(JwtAuthGuard)
  @Patch('add-event/:id')
  addEvent(@Param('id') id: string, @Body(new ValidationPipe({errorHttpStatusCode: 422})) updateStudentDto: UpdateStudentDto) {
    return this.studentService.addEvent(+id, updateStudentDto);
  }

  @UseGuards(JwtAuthGuard)
  @Patch('remove-event/:id')
  removeEvent(@Param('id') id: string, @Body(new ValidationPipe({errorHttpStatusCode: 422})) updateStudentDto: UpdateStudentDto) {
    return this.studentService.removeEvent(+id, updateStudentDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.studentService.remove(+id);
  }

  //adicionei as 2 rotas abaixo

  @Post('recover-password')
  recoverPassword(@Body(new ValidationPipe({errorHttpStatusCode:422})) recoverPasswordDto: RecoverPasswordDto){
    return this.studentService.recoverPassword(recoverPasswordDto);
  }

  @UseGuards(JwtAuthGuard)
  @Patch('update-password/:id')
  updatePassword(@Param('id') id: string, @Body(new ValidationPipe({errorHttpStatusCode:422})) updatePasswordDto: UpdatePasswordDto){
    return this.studentService.updatePassword(+id, updatePasswordDto);
  }
}
