import {Component, OnInit} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {FormGroup, FormControl, Validators} from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import {UserProviderService} from "../../../../services/user-provider.service";
import {GlobalPropertiesService} from "../../../../services/global-properties.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-reset_password_confirm',
  templateUrl: './reset_password_confirm.component.html',
  styleUrls: ['./reset_password_confirm.component.css']
})
export class ResetPasswordConfirmComponent implements OnInit {
  loading = false;
  counter = 60;

  form = new FormGroup({
    email: new FormControl(''),
    code: new FormControl('', [
      Validators.required,
      Validators.minLength(6),
      Validators.maxLength(6)
    ]),
  });

  constructor(private router: Router, private http: HttpClient, private user_provider: UserProviderService,
              private global_properties: GlobalPropertiesService , private toastr: ToastrService) {
  }

  ngOnInit(): void {
    if (!localStorage.getItem('reset_password_email')){
      this.router.navigateByUrl('/admin/reset/password');
    }
    this.ShowSendAgainTime();
  }

  ShowSendAgainTime(){
    var resendCodeInterval = setInterval(()=>{
      if (this.counter == 0){
        return;
      }
      this.counter --;
    }, 1000);

    if (this.counter == 0){
      clearInterval(resendCodeInterval);
    }
  }

  ReSendResetPasswordCode() {
    this.loading = true;

    var fd = new FormData();
    const email = localStorage.getItem('reset_password_email');

    fd.append('email', email ? email : '');
    fd.append('notification', 'App\\Notifications\\UserResetPasswordMail');

    this.http.post(`${this.global_properties.BASE_YRL}/api/auth/code/resend/`, fd)
      .toPromise()
      .then(c => {
        localStorage.setItem('reset_password_email', this.form.value['email']);
        this.counter = 60;

        this.toastr.success('کد بازیابی رمز عبور با موفقیت به ایمیل شما ارسال شد.', 'موفقیت آمیز' ,
          {progressBar : true , positionClass: "toast-bottom-center"});
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

  ConfirmResetPasswordCode() {
    if (this.form.invalid) {
      return;
    }

    this.form.value['email'] = localStorage.getItem('reset_password_email');

    this.loading = true;

    this.http.post(`${this.global_properties.BASE_YRL}/api/auth/reset_password/confirm/`, this.form.value)
      .toPromise()
      .then(c => {
        const result = JSON.parse(JSON.stringify(c));

        localStorage.setItem('reset_password_code', result['data']);

        this.toastr.success('رمز عبور جدید خود را وارد کنید.', 'موفقیت آمیز' ,
          {progressBar : true , positionClass: "toast-bottom-center"});

        this.router.navigateByUrl('/admin/reset/password/enter');

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
