import { School } from "../../school/entities/school.entity";
import { Student } from "../../student/entities/student.entity";
import { Column, Entity, ManyToMany, PrimaryGeneratedColumn, Timestamp } from "typeorm";

@Entity({name: "Events"})
export class Event {
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    title: string

    @Column()
    local: string

    @Column({type: "timestamp", nullable: true})
    time: Date 

    @Column()
    capacity: number

    @Column()
    filled: number
    
    // @ManyToMany(() => Student, (student) => student.events)
    // students: Student[]

    // @ManyToMany(() => School, (school) => school.events)
    // schools: School[]   
}