import { HttpException, HttpStatus, Injectable, NestMiddleware } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Request, Response, NextFunction } from 'express';


@Injectable()
export class ApiKeyMiddleWare implements NestMiddleware {
  
  constructor(private readonly configservice: ConfigService){}
  
  use(req: Request, res: Response, next: NextFunction) {

    const key = req.body.key;
    const secretKey = this.configservice.get("API_KEY");

    if(!key){
      throw new HttpException("Requisição necessita de uma Api key!", HttpStatus.BAD_REQUEST);
    }

    if(key !== secretKey)
        throw new HttpException("Api key inválida!", HttpStatus.FORBIDDEN); 
    
    next();
  }
}
