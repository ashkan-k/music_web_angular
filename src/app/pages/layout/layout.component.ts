import {Component, OnInit} from '@angular/core';
import {UserProviderService} from "../../services/user-provider.service";
import {Router} from "@angular/router";
import {GlobalPropertiesService} from "../../services/global-properties.service";
import {HttpClient} from "@angular/common/http";
import {catchError} from "rxjs/operators";
import {of} from "rxjs";

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.css']
})
export class LayoutComponent implements OnInit {
  constructor(private http: HttpClient, public user_provider: UserProviderService, public global_properties: GlobalPropertiesService) {
  }

  ngOnInit(): void {
    this.GetCommonSettings();
    this.GetUserData();
  }

  GetUserData(){
    this.user_provider.verifyToken();
  }

  GetCommonSettings(){
    this.http.get(`${this.global_properties.BASE_YRL}/api/admin/panel_settings/`, {
      headers: this.global_properties.headers
    })
      .toPromise()
      .then(c => {
        // @ts-ignore
        this.global_properties.SetSettings(c['data']);

        return true;
      })
      .catch(er => {
        console.log(er)
        return false;
      });
  }
}
