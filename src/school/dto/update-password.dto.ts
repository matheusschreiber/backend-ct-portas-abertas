import { PartialType } from '@nestjs/mapped-types';
import { IsNotEmpty } from 'class-validator';
import { CreateSchoolDto } from './create-school.dto';

export class UpdatePasswordDto extends PartialType(CreateSchoolDto) {
    
    @IsNotEmpty()
    password: string
}