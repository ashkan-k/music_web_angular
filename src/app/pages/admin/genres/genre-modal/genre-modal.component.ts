import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {GlobalPropertiesService} from "../../../../services/global-properties.service";
import {ToastrService} from "ngx-toastr";
import {UserProviderService} from "../../../../services/user-provider.service";

declare var $:any;

@Component({
  selector: 'genre-modal-form',
  templateUrl: './genre-modal.component.html',
  styleUrls: ['./genre-modal.component.css']
})
export class GenreModalComponent implements OnInit {
  loading = false;
  @Input() data: any | null = {};
  image: File | any = null;
  @Output() closeModalEvent = new EventEmitter<boolean>();

  constructor(private http: HttpClient, private global_properties: GlobalPropertiesService, private user_service: UserProviderService, private toastr: ToastrService) {
  }

  ngOnInit(): void {
  }

  handleFileInput(event: any) {
    this.image = event.target.files[0];
  }

  CloseAndClearModal(is_submited: boolean) {
    if (is_submited){
      this.closeModalEvent.emit(true);
    }
    this.data = {};
    this.image = null;
    // @ts-ignore
    document.getElementById("form").reset();
    $('#exampleModalCenter').modal('toggle');
  }

  Submit() {
    this.loading = true;

    delete this.data['image'];
    const formData: FormData = new FormData();
    for (let item in this.data) {
      if(this.data[item]){
        formData.append(item, this.data[item]);
      }
    }

    if (this.image) {
      formData.append('image', this.image, this.image.name);
    }

    this.loading = true;

    if (this.data['id'])
    {
      this.Update(this.data['id'] , formData);
    }
    else
    {
      this.Create(formData);
    }
  }

  Create(formData: FormData) {

    this.http.post(`${this.global_properties.BASE_YRL}/api/admin/genres/`, formData,{
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
        for(const item in er['error']['errors']){
          this.toastr.error(er['error']['errors'][item],'خطا',
          {progressBar: true, positionClass: "toast-bottom-center"});
          return false;
        }
        this.toastr.error('هنگام ثبت اطلاعات خطایی رخ داده است!','خطا',
          {progressBar: true, positionClass: "toast-bottom-center"});
        return false;
      })
      .finally(() => {
        this.loading = false;
      });

  }

  Update(id: number , formData: FormData) {

    formData.append('_method', 'PATCH');

    this.http.post(`${this.global_properties.BASE_YRL}/api/admin/genres/${id}/`, formData,{
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
        for(const item in er['error']['errors']){
          this.toastr.error(er['error']['errors'][item],'خطا',
          {progressBar: true, positionClass: "toast-bottom-center"});
          return false;
        }
        this.toastr.error('هنگام ثبت اطلاعات خطایی رخ داده است!','خطا',
          {progressBar: true, positionClass: "toast-bottom-center"});
        return false;
      })
      .finally(() => {
        this.loading = false;
      });

  }

  ShowSingerImage(image: any) {
    if (image) {
      return this.global_properties.BASE_YRL + image;
    }
    return 'assets/admin/assets/images/user.png';
  }

}
