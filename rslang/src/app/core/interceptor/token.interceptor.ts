import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from "@angular/common/http";
import { Injectable, Injector } from "@angular/core";
import { Observable } from "rxjs";
import { BACKEND_PATH } from "../constants/constant";
import { AuthService } from "../services/auth.service";

@Injectable()
export class TokenInterceptor implements HttpInterceptor {
  constructor(private injector: Injector) { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const auth = this.injector.get(AuthService);
    if (!req.url.includes(`${BACKEND_PATH}/users/`) || req.url.includes(`${BACKEND_PATH}/users/${auth.userId}/tokens`)) {
      return next.handle(req);
    }

    const cloneReq = req.clone({
      headers: req.headers.append('Authorization', `Bearer ${auth.token}`),
    });

    return next.handle(cloneReq);
  }
}
