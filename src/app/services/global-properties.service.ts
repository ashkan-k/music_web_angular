import { HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { isDevMode } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class GlobalPropertiesService {

  constructor() { }

  headers = new HttpHeaders({
    // 'Content-Type': 'application/json',
    'Authorization': 'Bearer ' + localStorage.getItem('token')
  });

  // public BASE_YRL: string = 'http://127.0.0.1:8000';
  public BASE_YRL: string = isDevMode() ? 'http://127.0.0.1:8000' : 'https://radiant-badlands-38072.herokuapp.com';
  public PAGINATION_NUMBER: number = 10;
  public SETTINGS:any = {};

  public sleep(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  public SetSettings(data: any) {
    this.SETTINGS = data;
    this.PAGINATION_NUMBER = this.SETTINGS['PAGINATION'];
    localStorage.setItem('settings' , JSON.stringify(this.SETTINGS));
  }
}
