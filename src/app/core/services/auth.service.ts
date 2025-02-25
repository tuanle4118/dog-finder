import { Injectable } from '@angular/core';
import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpEvent,
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '@environments/environment';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  intercept(
    req: HttpRequest<any>,
    next: HttpHandler,
  ): Observable<HttpEvent<any>> {
    const apiKey = environment.apiKey;

    const modifiedReq = req.clone({
      setHeaders: {
        'x-api-key': apiKey,
        'Content-Type': 'application/json',
      },
    });

    return next.handle(modifiedReq);
  }
}
