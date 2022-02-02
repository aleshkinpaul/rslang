import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { BACKEND_PATH } from "../constants/constant";
import { AuthService } from "../services/auth.service";

@Injectable()
export class TokenInterceptor implements HttpInterceptor {
  constructor(private auth: AuthService) { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (!req.url.includes(`${BACKEND_PATH}/users/`) || req.url.includes(`${BACKEND_PATH}/users/${this.auth.userId}/tokens`)) {
      return next.handle(req);
    }

    const cloneReq = req.clone({
      headers: req.headers.append('Authorization', `Bearer ${this.auth.token}`),
    });

    return next.handle(cloneReq);
  }
}
