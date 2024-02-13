import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request } from 'express';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  use(req: Request, res: Request, next: () => void) {
    console.log('request:', req.baseUrl, req.method)
    next();
  }
}
