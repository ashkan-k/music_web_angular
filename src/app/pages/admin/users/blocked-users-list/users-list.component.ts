import {Component, OnInit, ViewChild} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {GlobalPropertiesService} from "../../../../services/global-properties.service";
import {ToastrService} from "ngx-toastr";
import Swal from "sweetalert2";
import {UserProviderService} from "../../../../services/user-provider.service";
import {BulkActionsComponent} from "../../sections/admin/bulk-actions/bulk-actions.component";

declare var $:any;

@Component({
  selector: 'app-users-list',
  templateUrl: './users-list.component.html',
  styleUrls: ['./users-list.component.css']
})
export class BlockedUsersListComponent implements OnInit {
  loading = false;
  users: any;
  search: String = "";
  data: any | null = {};

  last_page: number = 0;
  page: number = 1;

  @ViewChild(BulkActionsComponent) bulk_child!: BulkActionsComponent;

  constructor(private http: HttpClient, private global_properties: GlobalPropertiesService, private user_service: UserProviderService, private toastr: ToastrService) {
  }

  ngOnInit(): void {
    this.GetUsers();
  }

  GetPages(){
    return new Array(this.last_page);
  }

  async GetUsers(page: any = 1) {
    if (this.search){
      await this.global_properties.sleep(500);
    }

    this.page = page;

    this.loading = true;

    this.http.get(`${this.global_properties.BASE_YRL}/api/admin/blocked_users/?search=${this.search}&page=${page}`,{
      headers: this.user_service.headers
    })
      .toPromise()
      .then(c => {
        // @ts-ignore
        this.users = c['data'];
        // @ts-ignore
        this.last_page = c['last_page'];

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

  DeleteUser(id: number) {
    this.loading = true;

    this.http.delete(`${this.global_properties.BASE_YRL}/api/admin/users/${id}/`,{
      headers: this.user_service.headers
    })
      .toPromise()
      .then(c => {
        this.toastr.success('آیتم مورد نظر با موفقیت حذف شد!', 'موفقیت',
          {progressBar: true, positionClass: "toast-bottom-center"});
        this.GetUsers();
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

  UnBlock(id: number) {
    this.loading = true;

    var formData = new FormData()
    formData.append('is_blocked', '0');

    this.http.post(`${this.global_properties.BASE_YRL}/api/admin/blocked_users/change/${id}/`, formData,{
      headers: this.user_service.headers
    })
      .toPromise()
      .then(c => {
        this.toastr.success('آیتم مورد نظر با موفقیت آزاد شد!', 'موفقیت',
          {progressBar: true, positionClass: "toast-bottom-center"});
        this.GetUsers();
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

  Get(id: number) {
    this.loading = true;

    this.http.get(`${this.global_properties.BASE_YRL}/api/admin/users/${id}`,{
      headers: this.user_service.headers
    })
      .toPromise()
      .then(c => {
        console.log(c)
        this.data = c;
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

  ShowUserAvatar(avatar: any) {
    if (avatar) {
      return this.global_properties.BASE_YRL + avatar;
    }
    return 'assets/admin/assets/images/user.png'
  }
}
