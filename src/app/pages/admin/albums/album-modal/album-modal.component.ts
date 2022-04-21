import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {GlobalPropertiesService} from "../../../../services/global-properties.service";
import {ToastrService} from "ngx-toastr";
import {UserProviderService} from "../../../../services/user-provider.service";
declare var $:any;

@Component({
  selector: 'album-modal-form',
  templateUrl: './album-modal.component.html',
  styleUrls: ['./album-modal.component.css']
})
export class AlbumModalComponent implements OnInit {
  loading = false;
  @Input() data: any | null = {};
  cover: File | any = null;
  current_file: String = "";
  singers: any | null = [];

  @Output() closeModalEvent = new EventEmitter<boolean>();

  constructor(private http: HttpClient, private global_properties: GlobalPropertiesService, private user_service: UserProviderService, private toastr: ToastrService) {
  }

  ngOnInit(): void {
    this.GetSingers();
    this.InitDependencies();
  }

  handleFileInput(event: any) {
    this.cover = event.target.files[0];
  }

  InitDependencies() {
    $('.published_date').persianDatepicker({
      format: 'YYYY/MM/DD',
      initialValue: false,
    });

    // $('.select2').select2()
  }

  CloseAndClearModal(is_submited: boolean) {
    if (is_submited){
      this.closeModalEvent.emit(true);
    }
    this.data = {};
    this.cover = null;
    $('#exampleModalCenter').modal('toggle');
  }

  Format_Publish_Date() {
    var persianNumbers = [/۰/g, /۱/g, /۲/g, /۳/g, /۴/g, /۵/g, /۶/g, /۷/g, /۸/g, /۹/g],
      arabicNumbers = [/٠/g, /١/g, /٢/g, /٣/g, /٤/g, /٥/g, /٦/g, /٧/g, /٨/g, /٩/g],
      convertPersianNumbersToGourgian = function (str: any) {
        if (typeof str === 'string') {
          for (var i = 0; i < 10; i++) {
            str = str.replace(persianNumbers[i], i).replace(arabicNumbers[i], i);
          }
        }
        return str;
      };

    this.data['published_date'] = convertPersianNumbersToGourgian($('#published_date').val());
    this.data['published_date'] = this.data['published_date'].replaceAll("/", "-");
  }

  GetSingers() {
    this.loading = true;

    this.http.get(`${this.global_properties.BASE_YRL}/api/admin/singers/`, {
      headers: this.global_properties.headers
    })
      .toPromise()
      .then(c => {
        // @ts-ignore
        this.singers = c['data'];

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

    this.Format_Publish_Date();

    this.current_file =  this.data['cover'];
    delete this.data['cover'];

    this.data['is_vip'] = this.data['is_vip'] ?? 0;

    const formData: FormData = new FormData();
    for (let item in this.data) {
      if (this.data[item]) {
        formData.append(item, this.data[item]);
      }
    }

    if (this.cover) {
      formData.append('cover', this.cover, this.cover.name);
    }

    this.loading = true;

    if (this.data['id']) {
      this.Update(this.data['id'], formData);
    } else {
      this.Create(formData);
    }

    this.data['cover'] = this.current_file;
  }

  Create(formData: FormData) {

    this.http.post(`${this.global_properties.BASE_YRL}/api/admin/albums/`, formData, {
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

    this.http.post(`${this.global_properties.BASE_YRL}/api/admin/albums/${id}/`, formData, {
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
    delete this.data['cover'];
    this.current_file = "";
  }

  ShowAlbumrCover(cover: any) {
    if (cover) {
      return this.global_properties.BASE_YRL + cover;
    }
    return 'assets/admin/assets/images/music.png';
  }
}
