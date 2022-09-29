import { HttpException, HttpStatus, Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class ApiKeyMiddleWare implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    console.log('Request...', req.body);

    const key = req.body.key;
    if(key !== '12345678910')
        throw new HttpException("Api key inválida!", HttpStatus.FORBIDDEN); 
    
    next();
  }
}
