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

  async create(createEventDto: CreateEventDto) {
    const event = await this.eventRepo.create(createEventDto);
    return await this.eventRepo.save(event);
  }

  async findAll() {
    return await this.eventRepo.find();
  }

  async findOne(id: number) {
    return await this.eventRepo.findOneBy({id: id});
  }

  async update(id: number, updateEventDto: UpdateEventDto) {
    delete updateEventDto.key;
    return await this.eventRepo.update(id, updateEventDto);
  }

  async remove(id: number) {
    return await this.eventRepo.delete(id); 
  }

  //function without controller
  async updateFilled(id: number, amount: number) {
    const event = await this.eventRepo.findOneBy({id});
    event.filled+=amount
    return this.eventRepo.save(event);
  }
}
