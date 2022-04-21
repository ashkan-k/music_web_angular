import { Component, OnInit } from '@angular/core';
import {UserProviderService} from "../../../services/user-provider.service";
import {HttpClient} from "@angular/common/http";
import {GlobalPropertiesService} from "../../../services/global-properties.service";

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  loading = false;
  statistics_info: any | null = {};

  constructor(private http: HttpClient, private global_properties: GlobalPropertiesService, private user_service: UserProviderService) { }

  ngOnInit(): void {
    this.GetStatisticsData();
  }

  GetStatisticsData() {
    this.loading = true;

    this.http.get(`${this.global_properties.BASE_YRL}/api/admin/statistics_info/`, {
      headers: this.user_service.headers
    })
      .toPromise()
      .then(c => {
        // @ts-ignore
        this.statistics_info = c['data'];
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

}
