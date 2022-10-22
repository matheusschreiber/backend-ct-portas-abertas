import * as bcrypt from 'bcrypt';

import { Injectable, NestMiddleware } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class PasswordEncrypt implements NestMiddleware {
  
  constructor(private readonly configservice: ConfigService){}
  
    async use(req: Request, res: Response, next: NextFunction) {

    const saltOrRounds = 10;
    const password = req.body.password;
    const hash = await bcrypt.hash(password, saltOrRounds);

    req.body.password = hash
    next();
  }
}
