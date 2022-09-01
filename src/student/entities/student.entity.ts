import { Column, Entity, JoinTable, ManyToMany, PrimaryGeneratedColumn, Timestamp } from "typeorm";

import { Event } from "../../events/entities/event.entity"

@Entity({name: "Students"})
export class Student {
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    name: string

    @Column()
    cpf: string

    @Column()
    password: string

    @Column()
    email: string

    @ManyToMany(() => Event)
    @JoinTable()
    events: Event[]
}