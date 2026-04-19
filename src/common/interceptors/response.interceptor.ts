import {
  Injectable, NestInterceptor,
  ExecutionContext, CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

const SENSITIVE_FIELDS = [
  'password_hash',
  'activation_token',
  'activation_token_expires_at',
];

function stripSensitive(obj: any): any {
  if (Array.isArray(obj)) return obj.map(stripSensitive);
  if (obj && typeof obj === 'object') {
    const cleaned: any = {};
    for (const key of Object.keys(obj)) {
      if (!SENSITIVE_FIELDS.includes(key)) {
        cleaned[key] = stripSensitive(obj[key]);
      }
    }
    return cleaned;
  }
  return obj;
}

@Injectable()
export class ResponseInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(map((data) => stripSensitive(data)));
  }
}