import { Column, Entity, PrimaryGeneratedColumn, Timestamp } from "typeorm";

@Entity({name: "Events"})
export class Event {
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    title: string

    @Column()
    local: string

    @Column()
    time: Timestamp

    @Column()
    capacity: number

    @Column()
    filled: boolean
}