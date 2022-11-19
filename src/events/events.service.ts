import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { School } from 'src/school/entities/school.entity';
import { Student } from 'src/student/entities/student.entity';
import { Repository } from 'typeorm';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { Event } from './entities/event.entity';

@Injectable()
export class EventsService {

  constructor(
    @InjectRepository(Event)
    private eventRepo: Repository<Event>,
    @InjectRepository(Student)
    private studentRepo: Repository<Student>,
    @InjectRepository(School)
    private schoolRepo: Repository<School>
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

  // function to get all the students and schools subscribed in an event
  async getSubscribedInEvent(id: number) {
    let subscribed = [];
    const students = await this.studentRepo.find({relations: ["events"]});

    // passing through all students
    students.forEach(student => {
      if (student.events.length > 0) { // checking if is in any event
        student.events.map((e)=>{
          if (e.id == id) subscribed.push(student);
        })
      }
    });


    const schools = await this.schoolRepo.find({relations: ["events"]});

    // passing through all schools
    schools.forEach(school => {
      if (school.events.length > 0) { // checking if is in any event
        school.events.map((e)=>{
          if (e.id == id) subscribed.push(school);
        })
      }
    });

    return subscribed;
  }
}