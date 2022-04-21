import { Injectable } from '@angular/core';
import {HttpEvent, HttpHandler, HttpHeaders, HttpInterceptor, HttpRequest} from "@angular/common/http";
import {UserProviderService} from "./user-provider.service";
import {Router} from "@angular/router";
import {Observable, throwError} from "rxjs";
import {catchError} from "rxjs/operators";

@Injectable({
  providedIn: 'root'
})
export class TokenInterceptorService implements HttpInterceptor{
  httpHeaders: HttpHeaders = new HttpHeaders();

  constructor(private router: Router, private user_provider: UserProviderService) { }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    return next.handle(request).pipe(
      catchError((error) => {
        if(error.status === 401) {
          this.router.navigate(['/login']);
        }
        return throwError(error);
      })
    );

  }
}
