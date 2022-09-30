import { TypeOrmModuleOptions } from "@nestjs/typeorm";
import { School } from "src/school/entities/school.entity";
import { Student } from "src/student/entities/student.entity";
import { Token } from "src/token/entities/token.entity";
import { Event } from "src/events/entities/event.entity"

export const typeOrmConfig: TypeOrmModuleOptions = {
    type: "postgres",
    host: "localhost", //mudar para dbctportasabertas no ambiente de prod
    port: 5432,
    username: "postgres",
    password: "root",
    database: "store",
    synchronize: true,
    logging: false,
    entities: [Student, School, Event, Token]       
}