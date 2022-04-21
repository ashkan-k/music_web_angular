import { Injectable } from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree} from '@angular/router';
import {Observable, of} from 'rxjs';
import {catchError, map, mergeMap, tap} from "rxjs/operators";
import {UserProviderService} from "../services/user-provider.service";
import {HttpClient} from "@angular/common/http";
import {GlobalPropertiesService} from "../services/global-properties.service";

@Injectable({
  providedIn: 'root'
})
export class GuestGuard implements CanActivate {
  constructor(private user_provider: UserProviderService, private http: HttpClient, private global_properties: GlobalPropertiesService) {
  }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {

    return true;

    const token = localStorage.getItem('token');
    if (token) {
      return true;
    }

    return this.user_provider.verifyToken()
      .toPromise()
      .then(c => {
        return false;
      })
      .catch(er => {
        return true;
      })
  }

}
