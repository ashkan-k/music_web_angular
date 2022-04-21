import {Component, OnInit} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {FormGroup, FormControl, Validators} from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import {UserProviderService} from "../../../../services/user-provider.service";
import {GlobalPropertiesService} from "../../../../services/global-properties.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-reset_password',
  templateUrl: './reset_password.component.html',
  styleUrls: ['./reset_password.component.css']
})
export class ResetPasswordComponent implements OnInit {
  loading = false;

  form = new FormGroup({
    email: new FormControl(''),
  });

  constructor(private router: Router, private http: HttpClient, private user_provider: UserProviderService,
              private global_properties: GlobalPropertiesService , private toastr: ToastrService) {
  }

  ngOnInit(): void {
  }

  SendResetPasswordCode() {
    if (this.form.invalid) {
      return;
    }

    this.loading = true;

    this.http.post(`${this.global_properties.BASE_YRL}/api/auth/reset_password/`, this.form.value)
      .toPromise()
      .then(c => {
        localStorage.setItem('reset_password_email', this.form.value['email']);

        this.toastr.success('کد بازیابی رمز عبور با موفقیت به ایمیل شما ارسال شد.', 'موفقیت آمیز' ,
          {progressBar : true , positionClass: "toast-bottom-center"});

        this.router.navigateByUrl('/admin/reset/password/confirm');

        return true;
      })
      .catch(er => {
        for (const item in er['error']['errors']) {
          this.toastr.error(er['error']['errors'][item], 'خطا',
            {progressBar: true, positionClass: "toast-bottom-center"});
          return false;
        }

        this.toastr.error('خطایی پیش آمده است. لطفا دوباره امتحان کنید!', 'خطا' ,
          {progressBar : true , positionClass: "toast-bottom-center"});
        return false;
      })
      .finally(() => {
        this.loading = false;
      });

  }

}
