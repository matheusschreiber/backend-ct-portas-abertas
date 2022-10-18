import { PartialType } from '@nestjs/mapped-types';
import { CreateEventDto } from './create-event.dto';
import { EventType } from '../entities/event.entity';

export class UpdateEventDto extends PartialType(CreateEventDto) {

    title: string

    local:string

    time: Date

    capacity: number

    filled: number

    type: EventType 

    key: string
}
