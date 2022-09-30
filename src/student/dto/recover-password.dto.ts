import { PartialType } from '@nestjs/mapped-types';
import { IsNotEmpty } from 'class-validator';
import { CreateStudentDto } from './create-student.dto';

export class RecoverPasswordDto extends PartialType(CreateStudentDto) {
    
    @IsNotEmpty()
    email: string
}