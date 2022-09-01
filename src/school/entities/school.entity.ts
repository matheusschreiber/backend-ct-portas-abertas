import { Column, Entity, JoinTable, ManyToMany, PrimaryGeneratedColumn } from "typeorm";

import { Event } from "../../events/entities/event.entity"

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