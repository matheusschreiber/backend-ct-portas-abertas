import { 
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Request,
  Param,
  Delete,
  ValidationPipe,
  UseGuards
} from '@nestjs/common';
import { SchoolService } from './school.service';
import { CreateSchoolDto } from './dto/create-school.dto';
import { UpdateSchoolDto } from './dto/update-school.dto';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from '../auth/auth.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RecoverPasswordDto } from './dto/recover-password.dto';
import { UpdatePasswordDto } from './dto/update-password.dto';
import { UpdateStudentsAmountDto } from './dto/updateStudentsAmount.dto';

@Controller('school')
export class SchoolController {
  constructor(
    private readonly schoolService: SchoolService,
    private authService: AuthService
  ) {}

  @Post()
  create(@Body(new ValidationPipe({errorHttpStatusCode: 422})) createSchoolDto: CreateSchoolDto) {
    return this.schoolService.create(createSchoolDto);
  }

  @UseGuards(AuthGuard('local'))
  @Post('auth/login')
  async login(@Request() req) {
    return this.authService.login(req.user);
  }

  @Get()
  findAll() {
    return this.schoolService.findAll();
  }

  @Get('find/:id')
  findOne(@Param('id') id: string) {
    return this.schoolService.findOne(+id);
  }

  @UseGuards(JwtAuthGuard) // para usar essa rota, é necessário passar o token no header da requisição
  @Get('events/:id')
  findEvents(@Param('id') id: string) {
    return this.schoolService.findEvents(+id);
  }

  @UseGuards(JwtAuthGuard)
  @Patch('add-event/:id')
  addEvent(@Param('id') id: string, @Body(new ValidationPipe({errorHttpStatusCode: 422})) updateSchoolDto: UpdateSchoolDto) {
    return this.schoolService.addEvent(+id, updateSchoolDto);
  }

  @UseGuards(JwtAuthGuard)
  @Patch('remove-event/:id')
  removeEvent(@Param('id') id: string, @Body(new ValidationPipe({errorHttpStatusCode: 422})) updateSchoolDto: UpdateSchoolDto) {
    return this.schoolService.removeEvent(+id, updateSchoolDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.schoolService.remove(+id);
  }

  @Post('recover-password')
  recoverPassword(@Body(new ValidationPipe({errorHttpStatusCode:422})) recoverPasswordDto: RecoverPasswordDto){
    return this.schoolService.recoverPassword(recoverPasswordDto);
  }

  @UseGuards(JwtAuthGuard)
  @Patch('update-password/:id')
  updatePassword(@Param('id') id: string, @Body(new ValidationPipe({errorHttpStatusCode:422})) updatePasswordDto: UpdatePasswordDto){
    return this.schoolService.updatePassword(+id, updatePasswordDto);
  }
  
  @UseGuards(JwtAuthGuard)
  @Patch('update-students-amount/:id')
  updateStudentsAmount(@Param('id') id: string, @Body(new ValidationPipe({errorHttpStatusCode:422})) updateStudentsAmountDto: UpdateStudentsAmountDto){
    return this.schoolService.updateStudentsAmount(+id, updateStudentsAmountDto);
  }
}
