import { School } from "../../school/entities/school.entity";
import { Student } from "../../student/entities/student.entity";
import { Column, Entity, ManyToMany, PrimaryGeneratedColumn, Timestamp } from "typeorm";

export enum EventType {
    visit = 'visit',
    workshop = 'workshop',
    booth = 'booth',
    pocket = 'pocket'
}

@Entity({name: "Events"})
export class Event {
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    title: string

    @Column()
    local: string

    @Column({type: "timestamp", nullable: true})
    start: Date 

    @Column({type: "timestamp", nullable: true})
    end: Date 

    @Column({ nullable: true })
    description: string

    @Column()
    capacity: number

    @Column({default: 0})
    filled: number

    @Column({ type: 'enum', enum: EventType, nullable: true })
    type: EventType
}

//Caso precise posteriormente
// @ManyToMany(() => Student, (student) => student.events)
    // students: Student[]

    // @ManyToMany(() => School, (school) => school.events)
    // schools: School[]  