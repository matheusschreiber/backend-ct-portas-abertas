import { Injectable } from '@nestjs/common';
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

    //ID do evento(objeto)
    const eventID = await updateStudentDto.events[0]
    //instância do evento que foi passado pelo ID do body
    const eventbyid = await this.eventRepo.findOneBy(eventID)
    //instância do estudante que será atualizado 
    let student = await this.findOne(id)
    //Adicionando o evento novo nos eventos do estudante
    student.events.push(eventbyid)
    
    //atualizando o filled do evento
    await this.eventService.updateFilled(eventID)

    return await this.studentRepo.save(student)
  }

  remove(id: number) {
    return this.studentRepo.delete(id);
  }
}
