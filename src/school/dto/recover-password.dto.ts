import { PartialType } from '@nestjs/mapped-types';
import { IsNotEmpty } from 'class-validator';
import { CreateSchoolDto } from './create-school.dto';


export class RecoverPasswordDto extends PartialType(CreateSchoolDto) {
    
    @IsNotEmpty()
    emailRes: string
}