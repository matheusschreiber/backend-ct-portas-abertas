import { PartialType } from '@nestjs/mapped-types';
import { IsNotEmpty } from 'class-validator';
import { CreateStudentDto } from './create-student.dto';

export class UpdatePasswordDto extends PartialType(CreateStudentDto) {
    
    @IsNotEmpty()
    password: string
}