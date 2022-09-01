import { Column, Entity, JoinTable, ManyToMany, PrimaryGeneratedColumn, Timestamp } from "typeorm";

import { Event } from "src/events/entities/event.entity"

@Entity({name: "Schools"})
export class School {
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    name: string

    @Column()
    nameRes: string

    @Column()
    cpfRes: string

    @Column()
    studentsAmount: number

    @Column()
    password: string

    @Column()
    emailRes: string

    @ManyToMany(() => Event)
    @JoinTable()
    events: Event[]
}