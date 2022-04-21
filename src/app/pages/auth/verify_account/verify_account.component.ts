import {Component, OnInit} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {GlobalPropertiesService} from "../../../services/global-properties.service";
import {FormGroup, FormControl, Validators} from '@angular/forms';
import {UserProviderService} from "../../../services/user-provider.service";
import { ToastrService } from 'ngx-toastr';
import {Router} from "@angular/router";

@Component({
  selector: 'app-confirm_account',
  templateUrl: './verify_account.component.html',
  styleUrls: ['./verify_account.component.css']
})
export class Verify_accountComponent implements OnInit {
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
    if (!localStorage.getItem('verify_email')){
      this.router.navigateByUrl('/admin/login');
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

  ReSendVerifyCode() {
    this.loading = true;

    var fd = new FormData();
    const email = localStorage.getItem('verify_email');

    fd.append('email', email ? email : '');
    fd.append('notification', 'App\\Notifications\\UserVerificationMail');

    this.http.post(`${this.global_properties.BASE_YRL}/api/auth/code/resend/`, fd)
      .toPromise()
      .then(c => {
        localStorage.setItem('reset_password_email', this.form.value['email']);
        this.counter = 60;

        this.toastr.success('کد احراز هویت حساب کاربری با موفقیت به ایمیل شما ارسال شد.', 'موفقیت آمیز' ,
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

  ConfirmAccount() {
    if (this.form.invalid) {
      return;
    }

    this.form.value['email'] = localStorage.getItem('verify_email');

    this.loading = true;

    this.http.post(`${this.global_properties.BASE_YRL}/api/auth/account/verify/`, this.form.value)
      .toPromise()
      .then(c => {
        const result = JSON.parse(JSON.stringify(c));

        localStorage.setItem('token', result['access_token']);
        this.user_provider.SetUser(result['user']);

        this.toastr.success('حساب کاربری شما تایید شد و با موفقیت وارد شدید.', 'موفقیت آمیز' ,
          {progressBar : true , positionClass: "toast-bottom-center"});

        localStorage.removeItem('verify_email');

        if (result['user']['is_superuser']) {
          window.location.href = '/admin'
        }
        else {
          window.location.href = '/'
        }

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
