import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { Event } from './entities/event.entity';

@Injectable()
export class EventsService {

  constructor(
    @InjectRepository(Event)
    private eventRepo: Repository<Event>
  ){}

  create(createEventDto: CreateEventDto) {
    const event = this.eventRepo.create(createEventDto);
    return this.eventRepo.save(event);
  }

  findAll() {
    return this.eventRepo.find();
  }

  findOne(id: number) {
    return this.eventRepo.findOneBy({id: id});
  }

  update(id: number, updateEventDto: UpdateEventDto) {
    return `This action updates a #${id} event`;
  }

  remove(id: number) {
    return `This action removes a #${id} event`;
  }
}
