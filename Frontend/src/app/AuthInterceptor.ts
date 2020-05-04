import {Injectable} from '@angular/core';
import {HttpEvent, HttpInterceptor, HttpHandler, HttpRequest} from '@angular/common/http';
import { AuthService } from './auth.service';
import { Observable } from 'rxjs';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private auth: AuthService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    if (req.url.includes('resetpassword')) {
      return next.handle(req);
    }

    // Clone the request to add the new header.
    const authReq = req.clone({headers: req.headers.set('Authorization', 'Bearer ' + this.auth.getToken())});
    // Pass on the cloned request instead of the original request.
    return next.handle(authReq);
  }
}
