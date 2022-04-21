import {Component, OnInit} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {GlobalPropertiesService} from "../../../services/global-properties.service";
import {FormGroup, FormControl, Validators} from '@angular/forms';
import {UserProviderService} from "../../../services/user-provider.service";
import { ToastrService } from 'ngx-toastr';
import {Router} from "@angular/router";

@Component({
  selector: 'app-login',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  loading = false;

  form = new FormGroup({
    first_name: new FormControl('', [
      Validators.required,
    ]),
    last_name: new FormControl('', [
      Validators.required,
    ]),
    phone: new FormControl('', [
      Validators.required,
      Validators.minLength(11),
      Validators.maxLength(11)
    ]),
    email: new FormControl('', [
      Validators.required,
    ]),
    password: new FormControl('', [
      Validators.required,
      Validators.minLength(8)
    ]),
    password_confirmed: new FormControl('', [
      Validators.required,
      Validators.minLength(8)
    ]),
    remember_me: new FormControl(false)
  });

  constructor(private router: Router, private http: HttpClient, private user_provider: UserProviderService,
              public global_properties: GlobalPropertiesService , private toastr: ToastrService) {
  }

  ngOnInit(): void {
  }

  Register() {
    if (this.form.invalid) {
      return;
    }

    this.loading = true;

    this.http.post(`${this.global_properties.BASE_YRL}/api/auth/register/`, this.form.value)
      .toPromise()
      .then(c => {
        this.toastr.success('شما با موفقیت ثبت نام شدید.', 'موفقیت آمیز' ,
          {progressBar : true , positionClass: "toast-bottom-center"});

        localStorage.setItem('verify_email', this.form.value.email)

        this.router.navigateByUrl('/admin/verify');

        return true;
      })
      .catch(er => {
        for (const item in er['error']['errors']) {
          this.toastr.error(er['error']['errors'][item], 'خطا',
            {progressBar: true, positionClass: "toast-bottom-center"});
          return false;
        }
        return false;
      })
      .finally(() => {
        this.loading = false;
      });

  }

}
