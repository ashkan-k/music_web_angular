import {Component, OnInit} from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {GlobalPropertiesService} from "../../../services/global-properties.service";
import {FormGroup, FormControl, Validators} from '@angular/forms';
import {UserProviderService} from "../../../services/user-provider.service";
import {ToastrService} from 'ngx-toastr';
import {Router} from "@angular/router";

@Component({
  selector: 'app-google_auth',
  templateUrl: './google_auth.component.html',
  styleUrls: ['./google_auth.component.css']
})
export class GoogleAuthComponent implements OnInit {
  loading = false;

  form = new FormGroup({
    email: new FormControl('', [
      Validators.required,
    ]),
    password: new FormControl('', [
      Validators.required,
      // Validators.minLength(8)
    ]),
    remember_me: new FormControl(false)
  });

  constructor(private router: Router, private http: HttpClient, private user_provider: UserProviderService,
              private global_properties: GlobalPropertiesService, private toastr: ToastrService) {
  }

  ngOnInit(): void {
    this.CheckTokenAndRedirect();
  }

  CheckTokenAndRedirect() {
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('token');

    if (!token) {
      this.router.navigateByUrl('/login');
      return;
    }

    localStorage.setItem('token', token);

    this.loading = true;

    const headers = new HttpHeaders({
      'Authorization': 'Bearer ' + token
    });

    this.http.post(`${this.global_properties.BASE_YRL}/api/auth/profile/`, {}, {
      headers: headers
    })
      .toPromise()
      .then(c => {
        const result = JSON.parse(JSON.stringify(c));

        this.user_provider.SetUser(result);

        this.toastr.success('شما با موفقیت وارد شدید.', 'موفقیت آمیز',
          {progressBar: true, positionClass: "toast-bottom-center"});

        if (result['is_superuser']) {
          window.location.href = '/admin'
        } else {
          window.location.href = '/'
        }

        return true;
      })
      .catch(er => {
        if (er['status'] == 403) {
          this.toastr.error(er['error']['data'], 'خطا',
            {progressBar: true, positionClass: "toast-bottom-center"});
          return false;
        }

        if (er['status'] == 450) {
          this.toastr.error(er['error']['data'], 'خطا',
            {progressBar: true, positionClass: "toast-bottom-center"});
          this.router.navigateByUrl('/admin/verify');
          return false;
        }

        this.toastr.error('خطایی پیش آمده است!', 'خطا',
          {progressBar: true, positionClass: "toast-bottom-center"});

        this.router.navigateByUrl('/login');
        return false;
      })
      .finally(() => {
        this.loading = false;
      });

  }

}
