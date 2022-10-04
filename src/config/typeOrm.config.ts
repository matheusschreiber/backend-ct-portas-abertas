import { TypeOrmModuleOptions } from "@nestjs/typeorm";
import { School } from "src/school/entities/school.entity";
import { Student } from "src/student/entities/student.entity";
import { Token } from "src/token/entities/token.entity";
import { Event } from "src/events/entities/event.entity"

export default (): TypeOrmModuleOptions => ({
    type: process.env.TYPEORM_TYPE as any,
    host: process.env.TYPEORM_HOST,
    port: parseInt(process.env.TYPEORM_PORT),
    username: process.env.TYPEORM_DB_USERNAME,
    password: process.env.TYPEORM_DB_PASSWORD,
    database: process.env.TYPEORM_DB_DATABASE,
    synchronize: Boolean(JSON.parse(process.env.TYPEORM_SYNCHRONIZE)),
    logging: Boolean(JSON.parse(process.env.TYPEORM_LOGGING)),
    entities: [Student, School, Event, Token]       
    }
)
