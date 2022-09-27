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

  async findEvents(id: number) {
    const student = await this.studentRepo.findOne({where: {id: id}, relations: ["events"]});
    return student.events;
  }

  async addEvent(id: number, updateStudentDto: UpdateStudentDto) {

    const event = await this.eventRepo.findOneBy(updateStudentDto.event)
    let student = await this.findOne(id)

    // Se o evento já estiver cheio
    if(event.capacity === event.filled){
      throw new HttpException("Event is already full", HttpStatus.BAD_REQUEST)
    }

    //Se o estudante já está cadastrado no evento
    const foundEvent = student.events.find(stdevent => stdevent.id === event.id)
    if(foundEvent){
      throw new HttpException("You are already registered at event", HttpStatus.BAD_REQUEST)
    }

    await this.eventService.updateFilled(event.id,1)
    student.events.push(event)
    
    return await this.studentRepo.save(student)
  }

  async removeEvent(id: number, updateStudentDto: UpdateStudentDto){

    const event = await this.eventRepo.findOneBy(updateStudentDto.event)
    let student = await this.findOne(id)

    const foundEvent = student.events.find(stdevent => stdevent.id === event.id)
    if(!foundEvent){
      throw new HttpException("You are not registered at this event", HttpStatus.BAD_REQUEST)
    }

    const eventIndex = student.events.findIndex(e => e.id === event.id);
    student.events.splice(eventIndex,1);
    
    await this.eventService.updateFilled(event.id,-1)
    return await this.studentRepo.save(student)
  }

  async remove(id: number) {

    const student = await this.findOne(id);
    const studentEvents = student.events;

    for (let i = 0; i < Object.keys(studentEvents).length; i++) {
      await this.eventService.updateFilled(studentEvents[i].id,-1)
    }

    return await this.studentRepo.delete(id);
  }

  async findOneLogin(email: string): Promise<Student | undefined> {
    return await this.studentRepo.findOne({where: {email: email}});
  }
}
