import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {GlobalPropertiesService} from "../../../../services/global-properties.service";
import {ToastrService} from "ngx-toastr";
import {UserProviderService} from "../../../../services/user-provider.service";
declare var $:any;

@Component({
  selector: 'comment-change-status-modal-form',
  templateUrl: './comment-modal.component.html',
  styleUrls: ['./comment-modal.component.css']
})
export class CommentChangeStatusModalComponent implements OnInit {
  loading = false;
  @Input() data: any | null = {};
  @Output() closeModalEvent = new EventEmitter<boolean>();

  constructor(private http: HttpClient, private global_properties: GlobalPropertiesService, private user_service: UserProviderService, private toastr: ToastrService) {
  }

  ngOnInit(): void {
  }

  CloseAndClearModal(is_submited: boolean) {
    if (is_submited){
      this.closeModalEvent.emit(true);
    }
    this.data = {};
    // @ts-ignore
    document.getElementById("form").reset();
    $('#changeStatusModalCenter').modal('toggle');
  }

  Submit() {
    this.loading = true;

    const formData: FormData = new FormData();
    formData.append('status', this.data['status']);

    this.loading = true;

    this.Update(this.data['id'], formData);
  }
  Update(id: number, formData: FormData) {

    formData.append('_method', 'PATCH');

    this.http.post(`${this.global_properties.BASE_YRL}/api/admin/comments/${id}/`, formData, {
      headers: this.user_service.headers
    })
      .toPromise()
      .then(c => {
        console.log(c)

        this.toastr.success('وضعیت آیتم مورد نظر با موفقیت تغییر شد.', 'موفقیت آمیز',
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
