import { Injectable } from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree} from '@angular/router';
import {Observable, of} from 'rxjs';
import {UserProviderService} from "../services/user-provider.service";
import {catchError} from "rxjs/operators";

@Injectable({
  providedIn: 'root'
})
export class AuthCheckGuard implements CanActivate {
  constructor(private user_provider: UserProviderService, private router: Router) {
  }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {

    const token = localStorage.getItem('token')
    if (!token) {
      window.location.href = '/login';
      return false;
    }

    return this.user_provider.verifyToken().pipe(
      catchError(err => {
        console.log('Handling error locally and rethrowing it...', err);
        window.location.href = '/login';
        return of(false);
      })
    );

  }

}
