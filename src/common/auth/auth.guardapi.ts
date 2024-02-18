import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';
import { Request } from 'express';

@Injectable()
export class AuthGuardApi implements CanActivate {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request: Request = context.switchToHttp().getRequest();

    //Pobiera api-key z headera
    const apiKey = request.header('api-key');

    console.log(apiKey);
    if (apiKey === 'jaja') return true;
    return false;
  }
}
