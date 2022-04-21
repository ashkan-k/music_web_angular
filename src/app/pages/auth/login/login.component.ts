import {Component, OnInit} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {GlobalPropertiesService} from "../../../services/global-properties.service";
import {FormGroup, FormControl, Validators} from '@angular/forms';
import {UserProviderService} from "../../../services/user-provider.service";
import { ToastrService } from 'ngx-toastr';
import {Router} from "@angular/router";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
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
              public global_properties: GlobalPropertiesService , private toastr: ToastrService) {
  }

  ngOnInit(): void {
  }

  Login() {
    if (this.form.invalid) {
      return;
    }

    this.loading = true;

    this.http.post(`${this.global_properties.BASE_YRL}/api/auth/login/`, this.form.value)
      .toPromise()
      .then(c => {
        const result = JSON.parse(JSON.stringify(c));

        localStorage.setItem('token', result['access_token']);
        this.user_provider.SetUser(result['user']);

        this.toastr.success('شما با موفقیت وارد شدید.', 'موفقیت آمیز' ,
          {progressBar : true , positionClass: "toast-bottom-center"});

        if (result['user']['is_superuser']) {
          window.location.href = '/admin'
        }
        else {
          window.location.href = '/'
        }

        return true;
      })
      .catch(er => {
        if (er['status'] == 403){
          this.toastr.error(er['error']['data'], 'خطا' ,
            {progressBar : true , positionClass: "toast-bottom-center"});
          return false;
        }

        if (er['status'] == 450){
          this.toastr.error(er['error']['data'], 'خطا' ,
            {progressBar : true , positionClass: "toast-bottom-center"});
          this.router.navigateByUrl('/admin/verify');
          return false;
        }

        this.toastr.error('نام کاربری و یا رمز عبور اشتباه است!', 'خطا' ,
          {progressBar : true , positionClass: "toast-bottom-center"});
        return false;
      })
      .finally(() => {
        this.loading = false;
      });

  }

}
