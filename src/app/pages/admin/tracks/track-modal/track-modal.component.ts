import {Component, EventEmitter, Input, OnInit, Output, SimpleChange} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {GlobalPropertiesService} from "../../../../services/global-properties.service";
import {ToastrService} from "ngx-toastr";
import {UserProviderService} from "../../../../services/user-provider.service";

declare var $: any;

@Component({
  selector: 'track-modal-form',
  templateUrl: './track-modal.component.html',
  styleUrls: ['./track-modal.component.css']
})
export class TrackModalComponent implements OnInit {
  loading = false;
  @Input() data: any | null = {};
  cover: File | any = null;
  file: File | any = null;
  current_file: String = "";
  current_track_file: String = "";
  singers: any | null = [];
  albums: any | null = [];
  genres: any | null = [];
  is_file_link: boolean = true;
  @Output() closeModalEvent = new EventEmitter<boolean>();

  constructor(private http: HttpClient, private global_properties: GlobalPropertiesService, private user_service: UserProviderService, private toastr: ToastrService) {
  }

  ngOnInit(): void {
    this.GetSingers();
    this.GetGenres();
    this.InitDependencies();
  }

  InitDependencies() {
    $('.published_date').persianDatepicker({
      format: 'YYYY/MM/DD',
      initialValue: false,
    });

    // $('.select2').select2()
  }

  ngOnChanges(changes: SimpleChange) {
    // @ts-ignore
    if (changes['data'] && this.data.singer_id) {
      this.GetAlbums();
    }

    // @ts-ignore
    if (changes['data'] && this.data.file) {
      this.is_file_link = this.data.is_file_link;
      console.log(this.is_file_link)
    }
  }

  TrackFileChanged(){
    this.file = null;
    delete this.data.file;
    this.data.is_file_link=this.is_file_link ? '1' : '0';
  }

  handleFileInput(event: any) {
    this.cover = event.target.files[0] ?? null;
  }

  handleTrackFileInput(event: any) {
    this.file = event.target.files[0] ?? null;
  }

  CloseAndClearModal(is_submited: boolean) {
    if (is_submited){
      this.closeModalEvent.emit(true);
    }
    this.data = {};
    this.cover = null;
    this.file = null;
    // @ts-ignore
    document.getElementById("form").reset();
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

  GetGenres() {
    this.loading = true;

    this.http.get(`${this.global_properties.BASE_YRL}/api/admin/genres/`, {
      headers: this.global_properties.headers
    })
      .toPromise()
      .then(c => {
        // @ts-ignore
        this.genres = c['data'];

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

  GetAlbums() {
    this.loading = true;

    this.http.get(`${this.global_properties.BASE_YRL}/api/admin/singer_albums/${this.data.singer_id}`, {
      headers: this.global_properties.headers
    })
      .toPromise()
      .then(c => {
        // @ts-ignore
        this.albums = c['data'];
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

    this.current_file = this.data['cover'];
    delete this.data['cover'];

    if (this.file){
      this.current_track_file = this.data['file'];
      delete this.data['file'];
    }

    this.data['is_vip'] = this.data['is_vip'] ?? 0;

    if (!this.data['album_id']) {
        delete this.data['album_id'];
    }

    if (!this.data['genre_id']) {
      delete this.data['genre_id'];
      delete this.data['genre'];
    }

    const formData: FormData = new FormData();
    for (let item in this.data) {
      formData.append(item, this.data[item]);
    }

    if (this.cover) {
      formData.append('cover', this.cover, this.cover.name);
    }

    if (this.file) {
      formData.append('file', this.file, this.file.name);
    }

    this.loading = true;

    if (this.data['id']) {
      this.Update(this.data['id'], formData);
    } else {
      this.Create(formData);
    }

    this.data['cover'] = this.current_file;
    if (this.file){
      this.data['file'] = this.current_track_file;
    }
  }

  Create(formData: FormData) {

    this.http.post(`${this.global_properties.BASE_YRL}/api/admin/tracks/`, formData, {
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

    this.http.post(`${this.global_properties.BASE_YRL}/api/admin/tracks/${id}/`, formData, {
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

  RemoveImage() {
    this.data['delete_file'] = true;
    delete this.data['cover'];
    this.current_file = "";
  }

  RemoveTrackFile() {
    this.data['delete_track_file'] = true;
    delete this.data['file'];
    this.current_track_file = "";
  }

  ShowTrackCover(cover: any) {
    if (cover) {
      return this.global_properties.BASE_YRL + cover;
    }
    return 'assets/admin/assets/images/music.png';
  }

  ShowTrackFile(file: any) {
    if (file && !this.data.is_file_link) {
      return this.global_properties.BASE_YRL + file;
    }
    return file;
  }
}
