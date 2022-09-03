import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateStudentDto } from './dto/create-student.dto';
import { UpdateStudentDto } from './dto/update-student.dto';
import { Student } from './entities/student.entity';
import { Event } from '../events/entities/event.entity';
import { EventsService } from '../events/events.service';

@Injectable()
export class StudentService {

  constructor(
    @InjectRepository(Student)
    private studentRepo: Repository<Student>,
    @InjectRepository(Event)
    private eventRepo: Repository<Event>,
    private eventService: EventsService
  ){}

  async create(createStudentDto: CreateStudentDto) {
    const student = await this.studentRepo.create(createStudentDto);
    return await this.studentRepo.save(student);
  }

  async findAll() {
    return await this.studentRepo.find({relations: ["events"]});
  }

  async findOne(id: number) {
    return await this.studentRepo.findOne({where: {id: id}, relations: ["events"]})
  }

  async update(id: number, updateStudentDto: UpdateStudentDto) {

    const eventID = await updateStudentDto.events[0]
    const event = await this.eventRepo.findOneBy(eventID)
    let student = await this.findOne(id)

    //Se o estudante já está cadastrado no evento
    const foundEvent = student.events.find(event => event.id === event.id)
    if(foundEvent){
      throw new HttpException("You are already registered at event", HttpStatus.BAD_REQUEST)
    }

    await this.eventService.updateFilled(eventID)
    student.events.push(event)
    
    return await this.studentRepo.save(student)
  }

  async remove(id: number) {
    return await this.studentRepo.delete(id);
  }
}
