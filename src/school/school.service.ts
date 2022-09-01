import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateSchoolDto } from './dto/create-school.dto';
import { UpdateSchoolDto } from './dto/update-school.dto';
import { School } from './entities/school.entity';

@Injectable()
export class SchoolService {

  constructor(
    @InjectRepository(School)
    private schoolRepo: Repository<School>
  ){}

  create(createSchoolDto: CreateSchoolDto) {
    const school = this.schoolRepo.create(createSchoolDto)
    return this.schoolRepo.save(school)
  }

  findAll() {
    return this.schoolRepo.find({relations: ["events"]})
  }

  findOne(id: number) {
    return `This action returns a #${id} school`;
  }

  update(id: number, updateSchoolDto: UpdateSchoolDto) {
    return `This action updates a #${id} school`;
  }

  remove(id: number) {
    return `This action removes a #${id} school`;
  }
}
