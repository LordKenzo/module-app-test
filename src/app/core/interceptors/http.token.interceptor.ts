import { Injectable, Injector } from '@angular/core';
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';

import { JwtService } from '../services';

@Injectable()
export class HttpTokenInterceptor implements HttpInterceptor {
  constructor(private jwtService: JwtService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    console.log(req);
    if (new RegExp('^/api/v1|^/api/v2').test(req.url)) {
      console.log('Interceptor avviato...');
    } else {
      console.log('Interceptor bloccato!');
      return next.handle(req);
    }
    const headersConfig = {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    };
    try {
      const token = this.jwtService.getToken();


      if (token) {
        headersConfig['Authorization'] = `Bearer ${token}`;
      }
    } catch (err) {
      console.error(err.message);
    }

    const request = req.clone({ setHeaders: headersConfig });
    return next.handle(request);
  }
}
