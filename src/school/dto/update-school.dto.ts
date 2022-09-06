import { PartialType } from '@nestjs/mapped-types';
import { IsNotEmpty } from 'class-validator';
import { CreateSchoolDto } from './create-school.dto';

export class UpdateSchoolDto extends PartialType(CreateSchoolDto) {
    
    @IsNotEmpty()
    event: object;
}
