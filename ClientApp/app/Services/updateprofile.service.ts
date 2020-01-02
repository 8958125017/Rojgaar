import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { AppConfig } from '../Globals/app.config';
import { Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { environment } from '../../environments/environment';

@Injectable()
export class UpdateprofileService {
  token:any;
  constructor(private httpClient: HttpClient,) { 
    //token = sessionStorage.getItem('usertoken');  
  }
  GetProfileDetails() {
    const token = sessionStorage.getItem('usertoken');       
      // const token = this.config.UserInfo.token;
    const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': token }) };
    return this.httpClient.post(environment.apiUrl + 'User/GetUserDetails', null, httpOptions);
  }


 SaveMultipleSkill(sectordta:any) {   
     const token = sessionStorage.getItem('usertoken');       
      // const token = this.config.UserInfo.token;
    const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': token }) };
    return this.httpClient.post(environment.apiUrl + 'User/SaveMultipleSkill',sectordta, httpOptions);
  }

  GetUserProfile() {    
     const token = sessionStorage.getItem('usertoken');       
  //  const token = this.config.UserInfo.token;
    const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': token }) };
    return this.httpClient.get(environment.apiUrl + 'User/GetUserProfile', httpOptions);
  }

  UpdateUserProfile(profile:any) {
    const token = sessionStorage.getItem('usertoken');      
       // const token = this.config.UserInfo.token;
    const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': token }) };
    return this.httpClient.post(environment.apiUrl + 'User/UpdateUserProfile',profile, httpOptions);
  }

  DeleteUserSkill(sectorid:any) {
     const token = sessionStorage.getItem('usertoken');       
      // const token = this.config.UserInfo.token;
    const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': token }) };
    return this.httpClient.post(environment.apiUrl + 'User/DeleteUserSkill/'+sectorid,null, httpOptions);
  }


}

