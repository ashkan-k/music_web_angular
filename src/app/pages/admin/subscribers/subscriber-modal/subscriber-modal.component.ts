import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {GlobalPropertiesService} from "../../../../services/global-properties.service";
import {ToastrService} from "ngx-toastr";
import {UserProviderService} from "../../../../services/user-provider.service";
declare var $:any;

@Component({
  selector: 'subscriber-modal-form',
  templateUrl: './subscriber-modal.component.html',
  styleUrls: ['./subscriber-modal.component.css']
})
export class SubscriberModalComponent implements OnInit {
  loading = false;
  @Input() data: any | null = {};
  users:any;
  subscriptions:any;
  wish_listable_ids: any;

  @Output() closeModalEvent = new EventEmitter<boolean>();

  constructor(private http: HttpClient, private global_properties: GlobalPropertiesService, private user_service: UserProviderService, private toastr: ToastrService) {
  }

  ngOnInit(): void {
    this.GetUsers();
    this.GetSubscriptions();
  }

  CloseAndClearModal(is_submited: boolean) {
    if (is_submited){
      this.closeModalEvent.emit(true);
    }
    this.data = {};
    $('#exampleModalCenter').modal('toggle');
  }

  GetUsers() {
    this.loading = true;

    this.http.get(`${this.global_properties.BASE_YRL}/api/admin/users/`, {
      headers: this.global_properties.headers
    })
      .toPromise()
      .then(c => {
        // @ts-ignore
        this.users = c['data'];
        return true;
      })
      .catch(er => {
        console.log(er['error'])
        this.toastr.error('اطلاعات خطایی رخ داده است!', 'خطا',
          {progressBar: true, positionClass: "toast-bottom-center"});
        return false;
      })
      .finally(() => {
        this.loading = false;
      });

  }

  GetSubscriptions() {
    this.loading = true;

    this.http.get(`${this.global_properties.BASE_YRL}/api/admin/subscriptions/`, {
      headers: this.global_properties.headers
    })
      .toPromise()
      .then(c => {
        // @ts-ignore
        this.subscriptions = c['data'];
        return true;
      })
      .catch(er => {
        console.log(er['error'])
        this.toastr.error('اطلاعات خطایی رخ داده است!', 'خطا',
          {progressBar: true, positionClass: "toast-bottom-center"});
        return false;
      })
      .finally(() => {
        this.loading = false;
      });

  }

  Submit() {
    this.loading = true;

    this.data['is_active'] = this.data['is_active'] ?? '0';

    if (this.data['is_active']){
      this.data['is_active'] = this.data['is_active'].toString();
    }

    const formData: FormData = new FormData();
    for (let item in this.data) {
      if (this.data[item]) {
        formData.append(item, this.data[item]);
      }
    }

    this.loading = true;

    if (this.data['id']) {
      this.Update(this.data['id'], formData);
    } else {
      this.Create(formData);
    }
  }

  Create(formData: FormData) {

    this.http.post(`${this.global_properties.BASE_YRL}/api/admin/subscribers/`, formData, {
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

    this.http.post(`${this.global_properties.BASE_YRL}/api/admin/subscribers/${id}/`, formData, {
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

}
