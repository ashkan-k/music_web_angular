import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {GlobalPropertiesService} from "../../../../services/global-properties.service";
import {ToastrService} from "ngx-toastr";
import {UserProviderService} from "../../../../services/user-provider.service";
declare var $:any;

@Component({
  selector: 'user-modal-form',
  templateUrl: './user-modal.component.html',
  styleUrls: ['./user-modal.component.css']
})
export class UserModalComponent implements OnInit {
  loading = false;
  @Input() data: any | null = {};
  avatar: File | any = null;
  current_file: String = "";
  @Output() closeModalEvent = new EventEmitter<boolean>();

  constructor(private http: HttpClient, private global_properties: GlobalPropertiesService, private user_service: UserProviderService, private toastr: ToastrService) {
  }

  ngOnInit(): void {
  }

  handleFileInput(event: any) {
    this.avatar = event.target.files[0];
  }

  CloseAndClearModal(is_submited: boolean) {
    if (is_submited){
      this.closeModalEvent.emit(true);
    }
    this.data = {};
    this.avatar = null;
    // @ts-ignore
    document.getElementById("form").reset();
    $('#exampleModalCenter').modal('toggle');
  }

  Submit() {
   this.current_file =  this.data['avatar'];
   delete this.data['avatar'];

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

    if (this.data['id']) {
      this.Update(this.data['id'], formData);
    } else {
      this.Create(formData);
    }

    this.data['avatar'] = this.current_file;
  }

  Create(formData: FormData) {

    this.http.post(`${this.global_properties.BASE_YRL}/api/admin/users/`, formData, {
      headers: this.user_service.headers
    })
      .toPromise()
      .then(c => {
        console.log(c)

        this.toastr.success('آیتم جدید با موفقیت ثبت شد.', 'موفقیت آمیز',
          {progressBar: true, positionClass: "toast-bottom-center"});

        this.CloseAndClearModal(true);

        return true;
      })
      .catch(er => {
        console.log(er['error'])
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

  Update(id: number, formData: FormData) {

    formData.append('_method', 'PATCH');

    this.http.post(`${this.global_properties.BASE_YRL}/api/admin/users/${id}/`, formData, {
      headers: this.user_service.headers
    })
      .toPromise()
      .then(c => {
        console.log(c)

        this.toastr.success('آیتم مورد نظر با موفقیت ویرایش شد.', 'موفقیت آمیز',
          {progressBar: true, positionClass: "toast-bottom-center"});

        this.CloseAndClearModal(true);

        return true;
      })
      .catch(er => {
        console.log(er['error'])
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
    if (avatar) {
      return this.global_properties.BASE_YRL + avatar;
    }
    return 'assets/admin/assets/images/user.png';
  }

}
