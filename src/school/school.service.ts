import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateSchoolDto } from './dto/create-school.dto';
import { UpdateSchoolDto } from './dto/update-school.dto';
import { School } from './entities/school.entity';
import { Event } from '../events/entities/event.entity';
import { EventsService } from '../events/events.service';

@Injectable()
export class SchoolService {

  constructor(
    @InjectRepository(School)
    private schoolRepo: Repository<School>,
    @InjectRepository(Event)
    private eventRepo: Repository<Event>,
    private eventService: EventsService
  ){}

  async create(createSchoolDto: CreateSchoolDto) {
    const school = this.schoolRepo.create(createSchoolDto)
    return this.schoolRepo.save(school)
  }

  async findAll() {
    return this.schoolRepo.find({relations: ["events"]})
  }

  async findOne(id: number) {
    return await this.schoolRepo.findOne({where: {id: id}, relations:["events"]})
  }

  async addEvent(id: number, updateSchoolDto: UpdateSchoolDto) {
    
    const eventID = updateSchoolDto.event
    const event = await this.eventRepo.findOneBy(eventID)
    let school = await this.findOne(id)

    // Se o evento já estiver cheio
    if(event.capacity < (event.filled + school.studentsAmount)){
      throw new HttpException("Impossible to register all students at this event", HttpStatus.BAD_REQUEST)
    }

    //Se o estudante já está cadastrado no evento
    const foundEvent = school.events.find(scevent => scevent.id === event.id)
    if(foundEvent){
      throw new HttpException("You are already registered at event", HttpStatus.BAD_REQUEST)
    }

    await this.eventService.updateFilled(eventID, school.studentsAmount)
    school.events.push(event)
    
    return await this.schoolRepo.save(school)
  }

  async removeEvent(id: number, updateSchoolDto: UpdateSchoolDto){

    const eventID = updateSchoolDto.event
    const event = await this.eventRepo.findOneBy(eventID)
    let school = await this.findOne(id)

    const foundEvent = school.events.find(scevent => scevent.id === event.id)
    if(!foundEvent){
      throw new HttpException("You are not registered at this event", HttpStatus.BAD_REQUEST)
    }

    const schoolEvents = school.events
    schoolEvents.splice(schoolEvents.indexOf(event),1)
    
    await this.eventService.updateFilled(eventID,-school.studentsAmount)
    return await this.schoolRepo.save(school)
  }

  async remove(id: number) {
    return await this.schoolRepo.delete(id)
  }

  async findOneLogin(email: string): Promise<School | undefined> {
    return await this.schoolRepo.findOne({where: {emailRes: email}});
  }
}
