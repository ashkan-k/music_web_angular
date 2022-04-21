import { Component, OnInit } from '@angular/core';
import {UserProviderService} from "../../../../../services/user-provider.service";
import {GlobalPropertiesService} from "../../../../../services/global-properties.service";

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {
  user_display_name = localStorage.getItem('user');

  constructor(public user_provider: UserProviderService, public global_properties: GlobalPropertiesService) { }

  ngOnInit(): void {
  }

  ShowUserImage() {
    return this.global_properties.BASE_YRL + localStorage.getItem('avatar');
  }
}
