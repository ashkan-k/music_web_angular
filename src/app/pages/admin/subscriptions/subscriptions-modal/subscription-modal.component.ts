import {Component, EventEmitter, Input, OnInit, Output, SimpleChange} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {GlobalPropertiesService} from "../../../../services/global-properties.service";
import {ToastrService} from "ngx-toastr";
import {UserProviderService} from "../../../../services/user-provider.service";

declare var $: any;

@Component({
  selector: 'subscription-modal-form',
  templateUrl: './subscription-modal.component.html',
  styleUrls: ['./subscription-modal.component.css']
})
export class SubscriptionModalComponent implements OnInit {
  loading = false;
  @Input() data: any | null = {};
  @Output() closeModalEvent = new EventEmitter<boolean>();

  constructor(private http: HttpClient, private global_properties: GlobalPropertiesService, private user_service: UserProviderService, private toastr: ToastrService) {
  }

  ngOnInit(): void {
  }

  ngOnChanges(changes: SimpleChange) {
    console.log(changes)
    // @ts-ignore
    if (changes['data'] && this.data.amount) {
      this.data.amount = this.data.amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }
  }

  SeperateNumbersByComma() {
    if (this.data.amount){
      var nStr = this.data.amount.toString();
      nStr = nStr.replace(/\,/g, "");
      var x = nStr.split('.');
      var x1 = x[0];
      var x2 = x.length > 1 ? '.' + x[1] : '';
      var rgx = /(\d+)(\d{3})/;
      while (rgx.test(x1)) {
        x1 = x1.replace(rgx, '$1' + ',' + '$2');
      }
      this.data.amount = x1 + x2;
    }
  }

  CloseAndClearModal(is_submited: boolean) {
    if (is_submited) {
      this.closeModalEvent.emit(true);
    }
    this.data = {};
    // @ts-ignore
    document.getElementById("form").reset();
    $('#exampleModalCenter').modal('toggle');
  }

  Submit() {
    this.loading = true;

    if (this.data.amount) {
      this.data.amount = this.data.amount.toString().replaceAll(",", "");
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

    this.SeperateNumbersByComma();
  }

  Create(formData: FormData) {

    this.http.post(`${this.global_properties.BASE_YRL}/api/admin/subscriptions/`, formData, {
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

    this.http.post(`${this.global_properties.BASE_YRL}/api/admin/subscriptions/${id}/`, formData, {
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
