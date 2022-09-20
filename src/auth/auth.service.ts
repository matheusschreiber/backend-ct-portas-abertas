import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { StudentService } from '../student/student.service';
import { SchoolService } from '../school/school.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { TokenService } from '../token/token.service';

@Injectable()
export class AuthService {
    constructor(
        private studentService: StudentService,
        private schoolService: SchoolService,
        private jwtService: JwtService,
        private tokenService: TokenService,
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

    async validateSchool(email: string, pass: string): Promise<any> {
        const school = await this.schoolService.findOneLogin(email);
        // if (school && bcrypt.compareSync(pass, school.password)) {
        //     const { password, ...result } = school;
        //     return result;
        // }
        if (school && pass === school.password) {
            const { password, ...result } = school;
            return result;
        }
        return null;
    }

    async login(user: any) {
        const payload = { username: user.email, sub: user.id };
        const token = this.jwtService.sign(payload);
        this.tokenService.create(token, user.email);
        return {
          access_token: token
        };
    }
}
