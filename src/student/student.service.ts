import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateStudentDto } from './dto/create-student.dto';
import { UpdateStudentDto } from './dto/update-student.dto';
import { Student } from './entities/student.entity';

@Injectable()
export class StudentService {

  constructor(
    @InjectRepository(Student)
    private studentRepo: Repository<Student>,
  ){}

  create(createStudentDto: CreateStudentDto) {
    const student = this.studentRepo.create(createStudentDto);
    return this.studentRepo.save(student);
  }

  findAll() {
    return this.studentRepo.find({relations: ["events"]});
  }

  findOne(id: number) {
    return this.studentRepo.findOneBy({id: id})
  }

  update(id: number, updateStudentDto: UpdateStudentDto) {
    return `This action updates a #${id} student`;
  }

  remove(id: number) {
    return this.studentRepo.delete(id);
  }
}
