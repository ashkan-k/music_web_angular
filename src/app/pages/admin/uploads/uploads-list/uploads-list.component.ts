import {Component, OnInit, ViewChild} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {GlobalPropertiesService} from "../../../../services/global-properties.service";
import {ToastrService} from "ngx-toastr";
import Swal from "sweetalert2";
import {BulkActionsComponent} from "../../sections/admin/bulk-actions/bulk-actions.component";
declare var $:any;

@Component({
  selector: 'app-uploads-list',
  templateUrl: './uploads-list.component.html',
  styleUrls: ['./uploads-list.component.css']
})
export class UploadsListComponent implements OnInit {
  loading = false;
  uploads: any;
  search: String = "";
  status_filter: String = "";
  data: any | null = {};
  file_url: any | null = {};

  @ViewChild(BulkActionsComponent) bulk_child!: BulkActionsComponent;

  meta_data: any;

  constructor(private http: HttpClient, private global_properties: GlobalPropertiesService, private toastr: ToastrService) {
  }

  ngOnInit(): void {
    this.GetUploads();
  }

  async GetUploads(offset: number = 0) {
    if (this.search){
      await this.global_properties.sleep(500);
    }

    this.loading = true

    this.http.get(`${this.global_properties.BASE_YRL}/api/admin/uploads/?search=${this.search}&status_filter=${this.status_filter}&offset=${offset}&limit=${this.global_properties.PAGINATION_NUMBER}`,{
      headers: this.global_properties.headers
    })
      .toPromise()
      .then(c => {
        // @ts-ignore
        this.uploads = c['data'];
        // @ts-ignore
        this.meta_data = c['meta']

        return true;
      })
      .catch(er => {
        this.toastr.error('خطایی هنگام دریافت اطلاعات پیش آمده است!', 'خطا',
          {progressBar: true, positionClass: "toast-bottom-center"});
        return false;
      })
      .finally(() => {
        this.loading = false;
      });
  }

  DeleteConfirm(id: number) {

    Swal.fire({
      title: 'آیا از حذف این مورد اطیمان دارید؟',
      text: "این عملیات غیرقابل بازگشت است!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'حذف',
      cancelButtonText:'لغو',
    }).then((result) => {
      if (result.isConfirmed) {
        this.DeleteUser(id);
      }
    })

  }

  Get(id: number) {
    this.loading = true;

    this.http.get(`${this.global_properties.BASE_YRL}/api/admin/uploads/${id}`,{
      headers: this.global_properties.headers
    })
      .toPromise()
      .then(c => {
        console.log(c)
        // @ts-ignore
        this.data = c['data'];
        $('#exampleModalCenter').modal();
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

  DeleteUser(id: number) {
    this.loading = true;

    this.http.delete(`${this.global_properties.BASE_YRL}/api/admin/uploads/${id}/`,{
      headers: this.global_properties.headers
    })
      .toPromise()
      .then(c => {
        this.toastr.success('آیتم مورد نظر با موفقیت حذف شد!', 'موفقیت',
          {progressBar: true, positionClass: "toast-bottom-center"});
        this.GetUploads();
        return true;
      })
      .catch(er => {
        this.toastr.error('خطایی هنگام دریافت اطلاعات پیش آمده است!', 'خطا',
          {progressBar: true, positionClass: "toast-bottom-center"});
        return false;
      })
      .finally(() => {
        this.loading = false;
      });
  }

  ShowFileUrlInModal(file_url: string){
    this.file_url = file_url;
    $('#showLinkModalCenter').modal('show');
  }

  DownloadFile(file_url: string){
    window.open(this.global_properties.BASE_YRL + file_url,'_blank');
  }

  ShowFile(file_url: string){
    return this.global_properties.BASE_YRL + '/' + file_url;
  }
}
