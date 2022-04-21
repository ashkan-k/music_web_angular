import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {GlobalPropertiesService} from "./global-properties.service";
import {map, tap} from "rxjs/operators";
import {Observable, of} from "rxjs";
import {ToastrService} from "ngx-toastr";

@Injectable({
  providedIn: 'root'
})
export class UserProviderService {
  loading = false;

  headers = new HttpHeaders({
    // 'Content-Type': 'application/json',
    'Authorization': 'Bearer ' + this.GetUserToken()
  });

  user_data: any;

  constructor(private http: HttpClient, private global_properties: GlobalPropertiesService, private toastr: ToastrService) {
  }

  public Logout() {

    this.http.post(`${this.global_properties.BASE_YRL}/api/auth/logout/`,{},{
      headers: this.global_properties.headers
    })
      .toPromise()
      .then(c => {
        this.toastr.success('شما با موفقیت از حساب کاربری خود خارج شدید.', 'موفقیت',
          {progressBar: true, positionClass: "toast-bottom-center"});

        localStorage.clear();

        setTimeout(function () {
          localStorage.clear();
          window.location.href = '/admin/login';
        }, 1000)

        return true;
      })
      .catch(er => {
        this.toastr.error('خطایی پیش آمده است!', 'خطا',
          {progressBar: true, positionClass: "toast-bottom-center"});
        return false;
      })

  }

  public SetUser(data: any) {
    this.user_data = data;
    console.log(data);
    localStorage.setItem('avatar', data['avatar'] ? data['avatar'] : '/user.png');
    localStorage.setItem('user', `${data['first_name']}  ${data['last_name']}`);
  }

  public IsSuperuser() {
    return this.user_data.is_superuser;
  }

  public GetUserToken() {
    return localStorage.getItem('token')
  }

  public GetLoginUser() {
    this.loading = true;

    return this.http.post(`${this.global_properties.BASE_YRL}/api/auth/profile/`, {}, {
      headers: this.headers
    })
      .toPromise()
      .then(c => {
        this.SetUser(JSON.parse(JSON.stringify(c)));
        return this.user_data;
      })
      .catch(err => {
        localStorage.clear();
        this.user_data = null;
        return Promise.reject(err);
      })
      .finally(() => {
        this.loading = false;
      });
  }

  public verifyToken(): Observable<boolean> {
    const token = this.GetUserToken();
    return token ? this.http
      .post(this.global_properties.BASE_YRL + '/api/auth/profile/', {} , {
        headers: this.headers
      })
      .pipe(
        tap(res => this.SetUser(res)),
        map(
          res => {
            // @ts-ignore
            if (res['is_blocked']) {
              window.location.href = '/admin/login';
            }
            return true;
          },
          // error => false,
          false
        )
      ) : of(false);
  }
}
