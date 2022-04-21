import {Component, OnInit} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {FormGroup, FormControl, Validators} from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import {UserProviderService} from "../../../../services/user-provider.service";
import {GlobalPropertiesService} from "../../../../services/global-properties.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-reset_password_enter',
  templateUrl: './reset_password_enter.component.html',
  styleUrls: ['./reset_password_enter.component.css']
})
export class ResetPasswordEnterComponent implements OnInit {
  loading = false;

  form = new FormGroup({
    password: new FormControl('', [
      Validators.minLength(8),
    ]),
    password_confirmation: new FormControl('', [
      Validators.minLength(8),
    ]),

    code: new FormControl('', ),
  });

  constructor(private router: Router, private http: HttpClient, private user_provider: UserProviderService,
              private global_properties: GlobalPropertiesService , private toastr: ToastrService) {
  }

  ngOnInit(): void {
  }

  ConfirmResetPasswordCode() {
    if (this.form.invalid) {
      return;
    }

    if(this.form.value['password'] != this.form.value['password_confirmation']){
      this.toastr.error('رمز عبور با تکرارش تطابق ندارد!', 'خطا',
        {progressBar: true, positionClass: "toast-bottom-center"});
      return;
    }

    this.form.value['code'] = localStorage.getItem('reset_password_code');

    this.loading = true;

    this.http.post(`${this.global_properties.BASE_YRL}/api/auth/reset_password/enter/`, this.form.value)
      .toPromise()
      .then(c => {
        this.toastr.success('تغییر رمز عبور شما با موفقیت انجام شد. اکنون میتوانید وارد شوید.', 'موفقیت آمیز' ,
          {progressBar : true , positionClass: "toast-bottom-center"});

        localStorage.clear();

        this.router.navigateByUrl('/admin/login');

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
