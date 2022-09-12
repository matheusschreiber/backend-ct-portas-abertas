import { Injectable } from '@nestjs/common';
import { StudentService } from '../student/student.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
    constructor(private studentService: StudentService) {}

    async validateStudent(email: string, pass: string): Promise<any> {
        const student = await this.studentService.findOneLogin(email);
        if (student && bcrypt.compareSync(pass, student.password)) {
            const { password, ...result } = student;
            return result;
        }
        return null;
    }
}
