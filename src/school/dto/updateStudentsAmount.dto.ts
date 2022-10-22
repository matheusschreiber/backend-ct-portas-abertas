import { PartialType } from '@nestjs/mapped-types';
import { IsNotEmpty } from 'class-validator';
import { CreateSchoolDto } from './create-school.dto';

export class UpdateStudentsAmountDto extends PartialType(CreateSchoolDto) {
    
    @IsNotEmpty()
    studentsAmount: number;
}
