import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateStudentDto } from './dto/create-student.dto';
import { UpdateStudentDto } from './dto/update-student.dto';
import { Student } from './entities/student.entity';
import { Event } from '../events/entities/event.entity';
import { EventsService } from '../events/events.service';
import { MailerService } from '@nestjs-modules/mailer';
import { RecoverPasswordDto } from './dto/recover-password.dto';
import { UpdatePasswordDto } from './dto/update-password.dto';

@Injectable()
export class StudentService {

  constructor(
    @InjectRepository(Student)
    private studentRepo: Repository<Student>,
    @InjectRepository(Event)
    private eventRepo: Repository<Event>,
    private eventService: EventsService,
    private mailerService: MailerService,
  ){}

  async create(createStudentDto: CreateStudentDto) {
    const alreadyRegistered = await this.studentRepo.findOne({where: {email: createStudentDto.email }, relations: ["events"]});
    
    if (alreadyRegistered) throw new HttpException("Esse email já foi registrado, utilize outro", HttpStatus.BAD_REQUEST)

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

    if(!student){
      throw new HttpException("Usuário não encontrado", HttpStatus.BAD_REQUEST)
    }

    // Se o evento já estiver cheio
    if(event.capacity === event.filled){
      throw new HttpException(`O evento ${event.title} está lotado`, HttpStatus.BAD_REQUEST)
    }

    //Se o estudante já está cadastrado no evento
    const foundEvent = student.events.find(stdevent => stdevent.id === event.id)
    if(foundEvent){
      throw new HttpException(`Você já está registrado(a) no evento ${foundEvent.title}`, HttpStatus.BAD_REQUEST)
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
      throw new HttpException("Você não está registrado(a) nesse evento", HttpStatus.BAD_REQUEST)
    }

    const eventIndex = student.events.findIndex(e => e.id === event.id);
    student.events.splice(eventIndex,1);
    
    await this.eventService.updateFilled(event.id,-1)
    return await this.studentRepo.save(student)
  }

  async remove(id: number) {

    const student = await this.findOne(id);

    if(!student){
      throw new HttpException("Usuário não encontrado", HttpStatus.BAD_REQUEST)
    }

    const studentEvents = student.events;

    for (let i = 0; i < Object.keys(studentEvents).length; i++) {
      await this.eventService.updateFilled(studentEvents[i].id,-1)
    }

    return await this.studentRepo.delete(id);
  }

  async findOneLogin(email: string): Promise<Student | undefined> {
    return await this.studentRepo.findOne({where: {email: email}});
  }


  //=====================================Editing=================================================//

  async recoverPassword(recoverDto: RecoverPasswordDto){
    
    if(!recoverDto.email){
      throw new HttpException("É preciso passar o email na requisição!", HttpStatus.BAD_REQUEST);
    }

    const student = await this.studentRepo.findOne({where:{email: recoverDto.email}});
    if(!student){
      throw new HttpException("Este email não está cadastrado", HttpStatus.BAD_REQUEST);
    }

    const mail = {
      to: student.email,
        from: 'noreply@application.com',
        subject: 'Recuperação de senha - CT de portas abertas',
        template: 'recover-password',
        context: {
          password: student.password,
        }
    }
    this.mailerService.sendMail(mail);
  }

  async updatePassword(id: number, updatePasswordDto: UpdatePasswordDto){
    try {
      return await this.studentRepo.update(id, updatePasswordDto);
    } catch (err) {
      throw new HttpException("Falha na atualização da senha. Tente novamente!", HttpStatus.INTERNAL_SERVER_ERROR)     
    }
  }
}
