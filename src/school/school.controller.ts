import { Controller, Get, Post, Body, Patch, Param, Delete, ValidationPipe } from '@nestjs/common';
import { SchoolService } from './school.service';
import { CreateSchoolDto } from './dto/create-school.dto';
import { UpdateSchoolDto } from './dto/update-school.dto';

@Controller('school')
export class SchoolController {
  constructor(private readonly schoolService: SchoolService) {}

  @Post()
  create(@Body(new ValidationPipe({errorHttpStatusCode: 422})) createSchoolDto: CreateSchoolDto) {
    return this.schoolService.create(createSchoolDto);
  }

  @Get()
  findAll() {
    return this.schoolService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.schoolService.findOne(+id);
  }

  @Patch('add-event/:id')
  addEvent(@Param('id') id: string, @Body(new ValidationPipe({errorHttpStatusCode: 422})) updateSchoolDto: UpdateSchoolDto) {
    return this.schoolService.addEvent(+id, updateSchoolDto);
  }

  @Patch('remove-event/:id')
  removeEvent(@Param('id') id: string, @Body(new ValidationPipe({errorHttpStatusCode: 422})) updateSchoolDto: UpdateSchoolDto) {
    return this.schoolService.removeEvent(+id, updateSchoolDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.schoolService.remove(+id);
  }
}
