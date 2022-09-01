import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateStudentDto } from './dto/create-student.dto';
import { UpdateStudentDto } from './dto/update-student.dto';
import { Student } from './entities/student.entity';
import { Event } from '../events/entities/event.entity';
import { EventsService } from '../events/events.service';
import { EventEmitter } from 'stream';

@Injectable()
export class StudentService {

  constructor(
    @InjectRepository(Student)
    private studentRepo: Repository<Student>,
    @InjectRepository(Event)
    private eventRepo: Repository<Event>,
    private eventService: EventsService
  ){}

  create(createStudentDto: CreateStudentDto) {
    const student = this.studentRepo.create(createStudentDto);
    return this.studentRepo.save(student);
  }

  findAll() {
    return this.studentRepo.find({relations: ["events"]});
  }

  findOne(id: number) {
    return this.studentRepo.findOne({where: {id: id}, relations: ["events"]})
  }

  async update(id: number, updateStudentDto: UpdateStudentDto) {

    const eventID = await updateStudentDto.events[0]
    const event = await this.eventRepo.findOneBy(eventID)
    let student = await this.findOne(id)

    //Se o estudante já está cadastrado no evento
    const foundEvent = student.events.find(event => event.id === event.id)
    if(foundEvent){
      throw new HttpException("coro e cacete", HttpStatus.BAD_REQUEST)
    }

    await this.eventService.updateFilled(eventID)
    student.events.push(event)
    
    return await this.studentRepo.save(student)
  }

  remove(id: number) {
    return this.studentRepo.delete(id);
  }
}
