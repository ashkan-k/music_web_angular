import {Component, Input, OnInit} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {GlobalPropertiesService} from "../../../services/global-properties.service";
import {UserProviderService} from "../../../services/user-provider.service";
import {ToastrService} from "ngx-toastr";

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  loading = false;
  data: any | null = {};
  avatar: File | any = null;
  current_file: String = "";

  constructor(private http: HttpClient, private global_properties: GlobalPropertiesService, public user_service: UserProviderService, private toastr: ToastrService) { }

  ngOnInit(): void {
    this.GetData();
  }

  handleFileInput(event: any) {
    this.avatar = event.target.files[0];
  }

  Subscription(){
    this.toastr.error('درگاه پرداخت درحال حاضر غیرفعال است.', '',
      {progressBar: true, positionClass: "toast-bottom-center"});
  }

  GetData() {
    this.loading = true;

    this.current_file =  this.data['avatar'];
    delete this.data['avatar'];

    this.http.post(`${this.global_properties.BASE_YRL}/api/auth/profile/`, {},{
      headers: this.user_service.headers
    })
      .toPromise()
      .then(c => {
        console.log(c)
        this.data = c;
        return true;
      })
      .catch(er => {
        console.log(er)
        return false;
      })
      .finally(() => {
        this.loading = false;
      });

  }

  Submit() {
    this.loading = true;

    this.current_file =  this.data['avatar'];
    delete this.data['avatar'];

    this.data['is_vip'] = this.data['is_vip'] ?? 0;

    const formData: FormData = new FormData();
    for (let item in this.data) {
      if (this.data[item]) {
        formData.append(item, this.data[item]);
      }
    }

    if (this.avatar) {
      formData.append('avatar', this.avatar, this.avatar.name);
    }

    this.loading = true;

    this.http.post(`${this.global_properties.BASE_YRL}/api/auth/profile/update/`, formData, {
      headers: this.user_service.headers
    })
      .toPromise()
      .then(c => {
        // @ts-ignore
        this.data = c['data'];
        this.user_service.SetUser(this.data);

        this.toastr.success('پروفایل شما با موفقیت بروزرسانی شد.', 'موفقیت آمیز',
          {progressBar: true, positionClass: "toast-bottom-center"});

        return true;
      })
      .catch(er => {
        console.log(er['error'])
        this.data['avatar'] = this.current_file;

        for (const item in er['error']['errors']) {
          this.toastr.error(er['error']['errors'][item], 'خطا',
            {progressBar: true, positionClass: "toast-bottom-center"});
          return false;
        }
        this.toastr.error('هنگام ثبت اطلاعات خطایی رخ داده است!', 'خطا',
          {progressBar: true, positionClass: "toast-bottom-center"});
        return false;
      })
      .finally(() => {
        this.loading = false;
      });
  }

  RemoveImage(){
    this.data['delete_file'] = true;
    delete this.data['avatar'];
    this.current_file = "";
  }

  ShowUserAvatar(avatar: any) {
    return this.global_properties.BASE_YRL + avatar;
  }

  ShowSubscriptionActive(is_active: any) {
    if (is_active){
      return 'فعال';
    }
    return 'غیرفعال';
  }

  ShowSubscriptionActiveClass(is_active: any) {
    if (is_active){
      return 'success';
    }
    return 'danger';
  }
}
