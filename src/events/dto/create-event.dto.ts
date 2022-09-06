import { EventType } from "../entities/event.entity"

export class CreateEventDto {

    title: string

    local:string

    time: Date

    capacity: number

    type: EventType 
}
