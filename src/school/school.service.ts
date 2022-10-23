import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateSchoolDto } from './dto/create-school.dto';
import { UpdateSchoolDto } from './dto/update-school.dto';
import { School } from './entities/school.entity';
import { Event } from '../events/entities/event.entity';
import { EventsService } from '../events/events.service';
import { RecoverPasswordDto } from './dto/recover-password.dto';
import { MailerService } from '@nestjs-modules/mailer';
import { UpdatePasswordDto } from './dto/update-password.dto';
import { UpdateStudentsAmountDto } from './dto/updateStudentsAmount.dto';

@Injectable()
export class SchoolService {

  constructor(
    @InjectRepository(School)
    private schoolRepo: Repository<School>,
    @InjectRepository(Event)
    private eventRepo: Repository<Event>,
    private eventService: EventsService,
    private mailerService: MailerService
  ){}

   
  async create(createSchoolDto: CreateSchoolDto) {
    
    const alreadyRegistered = await this.schoolRepo.findOne({where: {emailRes: createSchoolDto.emailRes}, relations:["events"]})

    if (alreadyRegistered) throw new HttpException("Esse email já foi registrado, utilize outro", HttpStatus.BAD_REQUEST)

    const school = this.schoolRepo.create(createSchoolDto)
    return this.schoolRepo.save(school)
  }


  async findAll() {
    return this.schoolRepo.find({relations: ["events"]})
  }


  async findOne(id: number) {
    return await this.schoolRepo.findOne({where: {id: id}, relations:["events"]})
  }


  async findEvents(id: number) {
    const school = await this.schoolRepo.findOne({where: {id: id}, relations:["events"]})
    return school.events
  }


  async addEvent(id: number, updateSchoolDto: UpdateSchoolDto) {
    
    const event = await this.eventRepo.findOneBy(updateSchoolDto.event)
    let school = await this.findOne(id)

    if(!school){
      throw new HttpException("Usuário não encontrado", HttpStatus.BAD_REQUEST)
    }

    // Se o evento já estiver cheio
    if(event.capacity < (event.filled + school.studentsAmount)){
      throw new HttpException(`Impossível inscrever todos os alunos no evento ${event.title}`, HttpStatus.BAD_REQUEST)
    }

    //Se o estudante já está cadastrado no evento
    const foundEvent = school.events.find(scevent => scevent.id === event.id)
    if(foundEvent){
      throw new HttpException(`Escola já está registrada no evento ${event.title}`, HttpStatus.BAD_REQUEST)
    }

    await this.eventService.updateFilled(event.id, school.studentsAmount)
    school.events.push(event)
    
    return await this.schoolRepo.save(school)
  }


  async removeEvent(id: number, updateSchoolDto: UpdateSchoolDto){

    const event = await this.eventRepo.findOneBy(updateSchoolDto.event)
    let school = await this.findOne(id)

    const foundEvent = school.events.find(scevent => scevent.id === event.id)
    if(!foundEvent){
      throw new HttpException("Escola não está registrada nesse evento", HttpStatus.BAD_REQUEST)
    }

    const eventIndex = school.events.findIndex(e => e.id === event.id);
    school.events.splice(eventIndex,1);

    await this.eventService.updateFilled(event.id ,-school.studentsAmount)
    return await this.schoolRepo.save(school)
  }

  
  async remove(id: number) {

    const school = await this.findOne(id);
    
    if(!school){
      throw new HttpException("Usuário não encontrado", HttpStatus.BAD_REQUEST)
    }
    
    const schoolEvents = school.events;

    for (let i = 0; i < Object.keys(schoolEvents).length; i++) {
      await this.eventService.updateFilled(schoolEvents[i].id, -school.studentsAmount)
    }
    
    return await this.schoolRepo.delete(id)
  }


  async findOneLogin(email: string): Promise<School | undefined> {
    return await this.schoolRepo.findOne({where: {emailRes: email}});
  }


  async recoverPassword(recoverDto: RecoverPasswordDto){
    
    if(!recoverDto.emailRes){
      throw new HttpException("É preciso passar o email na requisição!", HttpStatus.BAD_REQUEST);
    }

    const school = await this.schoolRepo.findOne({where:{emailRes: recoverDto.emailRes}});
    if(!school){
      throw new HttpException("Este email não está cadastrado", HttpStatus.BAD_REQUEST);
    }

    const mail = {
      to: school.emailRes,
        from: 'noreply@application.com',
        subject: 'Recuperação de senha - CT de portas abertas',
        template: 'recover-password',
        context: {
          password: school.password,
        }
    }
    this.mailerService.sendMail(mail);
  }

  
  async updatePassword(id: number, updatePasswordDto: UpdatePasswordDto){
    try {
      return await this.schoolRepo.update(id, updatePasswordDto);
    } catch (err) {
      throw new HttpException("Falha na atualização da senha. Tente novamente!", HttpStatus.INTERNAL_SERVER_ERROR)     
    }
  }

  async updateStudentsAmount(id: number, updateStudentsAmountDto: UpdateStudentsAmountDto){
    const oldStudentsAmount: number = (await this.schoolRepo.findOneBy({id: id})).studentsAmount;
    const newStudentsAmount: number = updateStudentsAmountDto.studentsAmount;
    const difference: number = newStudentsAmount - oldStudentsAmount;

    const schoolEvents = await this.findEvents(id);
    schoolEvents.forEach(event => {
      if (event.capacity<event.filled+difference) {
        throw new HttpException(`O Evento ${event.title} está lotado! Não foi possível inscrever mais ninguém!`, HttpStatus.INTERNAL_SERVER_ERROR)  
      }
      this.eventService.updateFilled(event.id, difference);
    })

    return await this.schoolRepo.update(id, updateStudentsAmountDto);
  }
}
