import * as bcrypt from 'bcrypt';

import { Injectable } from '@nestjs/common';
import { StudentService } from '../student/student.service';
import { SchoolService } from '../school/school.service';
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
        
        if (student) {
            const isMatch = await bcrypt.compare(pass, student.password);
            if (!isMatch) return null
            
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

        
        if (school) {
            const isMatch = await bcrypt.compare(pass, school.password);
            if (!isMatch) return null
                
            const { password, ...result } = school;
            return result;
        }
        return null;
    }

    async login(user: any) {
        const payload = { username: user.email, sub: user.id };
        let type='student';
        /* se não achou por "email" é porque é escola, não aluno */
        if (!user.email) {
            payload.username = user.emailRes;
            type='school'
        }

        const token = this.jwtService.sign(payload);

        if (!user.email) this.tokenService.create(token, user.emailRes); 
        else this.tokenService.create(token, user.email);

        return {
          access_token: token,
          id: user.id,
          type,
          name:user.name,
          studentsAmount: user.studentsAmount?user.studentsAmount:0
        };
    }
}
