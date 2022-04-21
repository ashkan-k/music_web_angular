import {Component, EventEmitter, Input, OnInit, Output, SimpleChange} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {GlobalPropertiesService} from "../../../../services/global-properties.service";
import {ToastrService} from "ngx-toastr";
import {UserProviderService} from "../../../../services/user-provider.service";
declare var $:any;

@Component({
  selector: 'upload-show-modal',
  templateUrl: './upload-modal.component.html',
  styleUrls: ['./upload-modal.component.css']
})
export class UploadShowModalComponent implements OnInit {
  loading = false;
  @Input() file_url: any | null = {};

  constructor(public global_properties: GlobalPropertiesService) {
  }

  ngOnChanges(changes: SimpleChange) {
    $("#copy_button").attr('class', 'btn btn-danger');
    $("#copy_button").text('کپی');
  }

  ngOnInit(): void {
  }
}
