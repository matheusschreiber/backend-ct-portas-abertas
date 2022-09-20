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

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.schoolService.findOne(+id);
  }

  @UseGuards(JwtAuthGuard) // para usar essa rota, é necessário passar o token no header da requisição
  @Patch('add-event/:id')
  addEvent(@Param('id') id: string, @Body(new ValidationPipe({errorHttpStatusCode: 422})) updateSchoolDto: UpdateSchoolDto) {
    return this.schoolService.addEvent(+id, updateSchoolDto);
  }

  @UseGuards(JwtAuthGuard)
  @Patch('remove-event/:id')
  removeEvent(@Param('id') id: string, @Body(new ValidationPipe({errorHttpStatusCode: 422})) updateSchoolDto: UpdateSchoolDto) {
    return this.schoolService.removeEvent(+id, updateSchoolDto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.schoolService.remove(+id);
  }
}
