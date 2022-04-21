import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree} from '@angular/router';
import {Observable, of} from 'rxjs';
import {UserProviderService} from "../services/user-provider.service";
import {catchError, map, tap} from "rxjs/operators";
import {HttpClient} from "@angular/common/http";
import {GlobalPropertiesService} from "../services/global-properties.service";

@Injectable({
  providedIn: 'root'
})
export class SuperuserGuard implements CanActivate {

  constructor(private global_properties: GlobalPropertiesService, private user_provider: UserProviderService, private router: Router, private http: HttpClient) {
  }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {

    let token = localStorage.getItem('token');
    if (!token) {
      window.location.href = '/admin/login';
      return false;
    }

    return this.http.post(this.global_properties.BASE_YRL + '/api/auth/profile/', {}, {
      headers: this.user_provider.headers
    })
      .pipe(
        tap(res => {
          // @ts-ignore
          if (!res['is_superuser']) {
            window.location.href = '/admin/login';
          }
          this.user_provider.SetUser(res);
        }),
        map(
          res => true,
          // error => false,
          false
        )
      );
  }

}
