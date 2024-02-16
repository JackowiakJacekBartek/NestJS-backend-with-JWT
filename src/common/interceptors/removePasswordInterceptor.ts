import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class RemovePasswordInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      map((data) => {
        if (Array.isArray(data)) {
          return data.map((item) => this.removePasswordField(item));
        } else {
          return this.removePasswordField(data);
        }
      }),
    );
  }

  private removePasswordField(data: any): any {
    if (data && data.password) {
      delete data.password;
    }
    if (data && data.confirmPassword) {
      delete data.confirmPassword;
    }
    return data;
  }
}