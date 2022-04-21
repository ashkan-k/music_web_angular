import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {GlobalPropertiesService} from "../../../../../services/global-properties.service";
import {ToastrService} from "ngx-toastr";
import Swal from "sweetalert2";

@Component({
  selector: 'app-bulk-actions',
  templateUrl: './bulk-actions.component.html',
  styleUrls: ['./bulk-actions.component.css']
})
export class BulkActionsComponent implements OnInit {
  loading = false;
  bulk_action: any;
  bulk_action_items: number[] = [];
  @Input() data: any;
  @Input() AllowedActions: any;
  @Input() model: any;

  @Output() GetDataEvent = new EventEmitter<boolean>();

  constructor(private http: HttpClient, private global_properties: GlobalPropertiesService, private toastr: ToastrService) { }

  ngOnInit(): void {
  }

  AddItemsToBulkAction(items:any, event:Event){
    if (items.length > 0){
      // @ts-ignore
      if (event.target['checked']){
        for(const i in items){
          // @ts-ignore
          this.bulk_action_items.push(items[i]['id']);
        }
      }
      else {
        this.bulk_action_items = [];
      }

    }else {
      // @ts-ignore
      if (event.target['checked']){
        this.bulk_action_items.push(items);
      }
      else {
        var index = this.bulk_action_items.indexOf(items);
        this.bulk_action_items.splice(index,1);
      }
    }
  }

  SubmitBulkActionConfirm() {
    if (!this.bulk_action){
      this.toastr.error('لطفا یک عملیات انتخاب کنید!', 'خطا',
        {progressBar: true, positionClass: "toast-bottom-center"});
      return;
    }

    if (this.bulk_action_items.length == 0){
      this.toastr.error('حداقل یک آیتم را برای انجام عملیات انتخاب کنید!', 'خطا',
        {progressBar: true, positionClass: "toast-bottom-center"});
      return;
    }

    Swal.fire({
      title: 'آیا از اجرای این عملیات اطیمان دارید؟',
      text: "این عملیات غیرقابل بازگشت است!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'بله',
      cancelButtonText:'لغو',
    }).then((result) => {
      if (result.isConfirmed) {
        this.SubmitBulkAction();
      }
    })

  }

  SubmitBulkAction(){
    const formData: FormData = new FormData();
    formData.append('action', this.bulk_action);
    formData.append('model', this.model);
    for (const item in this.bulk_action_items){
      formData.append('items[]', this.bulk_action_items[item].toString());
    }

    this.loading = true;

    this.http.post(`${this.global_properties.BASE_YRL}/api/admin/bulk/actions/`, formData,{
      headers: this.global_properties.headers
    })
      .toPromise()
      .then(c => {
        console.log(c)
        this.toastr.success('عملیات با موفقیت انجام شد!', 'موفقیت آمیز',
          {progressBar: true, positionClass: "toast-bottom-center"});
        this.GetDataEvent.emit(true);
        return true;
      })
      .catch(er => {
        console.log(er)
        if (er['status'] == 400){
          this.toastr.error(er['error']['data'], 'خطا',
            {progressBar: true, positionClass: "toast-bottom-center"});
          return;
        }
        this.toastr.error('خطایی هنگام دریافت اطلاعات پیش آمده است!', 'خطا',
          {progressBar: true, positionClass: "toast-bottom-center"});
        return false;
      })
      .finally(() => {
        this.loading = false;
      });
  }

}
