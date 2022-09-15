import { Injectable } from '@nestjs/common';
import { StudentService } from '../student/student.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
    constructor(
        private studentService: StudentService,
        private jwtService: JwtService
    ) {}

    async validateStudent(email: string, pass: string): Promise<any> {
        const student = await this.studentService.findOneLogin(email);
        // if (student && bcrypt.compareSync(pass, student.password)) {
        //     const { password, ...result } = student;
        //     return result;
        // }
        if (student && pass === student.password) {
            const { password, ...result } = student;
            return result;
        }
        return null;
    }

    async login(user: any) {
        const payload = { username: user.username, sub: user.userId };
        return {
          access_token: this.jwtService.sign(payload),
        };
    }
}
