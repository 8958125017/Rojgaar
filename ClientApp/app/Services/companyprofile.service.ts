import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { AppConfig } from '../Globals/app.config';
import { Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { environment } from '../../environments/environment';

@Injectable()
export class CompanyProfileService {

  constructor(private httpClient: HttpClient, private http: Http, private config: AppConfig) { }

 SaveCompanyProfile(sectordta:any) {
    const token = sessionStorage.getItem('usertoken');        
    // const token = this.config.UserInfo.token;
    const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': token }) };
    return this.httpClient.post(environment.apiUrl + 'CompanyProfile/CompanyProfileUpdate',sectordta, httpOptions);
  }

  GetCompanyData() {
    const token = sessionStorage.getItem('usertoken');        
    // const token = this.config.UserInfo.token;
    const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': token }) };
    return this.httpClient.get(environment.apiUrl + 'CompanyProfile/GetCompanyDetail', httpOptions);
  }

  GetCompanyTypeData() {
    const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) };
    return this.httpClient.get(environment.apiUrl + 'Master/GetCompanyType', httpOptions);
  }

  

  SaveMultidata(profile:any) {
    const token = sessionStorage.getItem('usertoken');        
    // const token = this.config.UserInfo.token;
    const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': token }) };
    return this.httpClient.post(environment.apiUrl + 'CompanyProfile/SetEmpCompanyWorkLocation',profile, httpOptions);
  }

  GetCompanyLocationdata(id) {
    const token = sessionStorage.getItem('usertoken');       
     // const token = this.config.UserInfo.token;
    const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': token }) };
    return this.httpClient.get(environment.apiUrl + 'CompanyProfile/GetEmpCompanyWorkLocation/'+id, httpOptions);
  }



  DeleteCompanyProfile(companyid:any) 
  {
    const token = sessionStorage.getItem('usertoken');        
    // const token = this.config.UserInfo.token;
    const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': token }) };
    return this.httpClient.post(environment.apiUrl + 'CompanyProfile/DeleteEmpCompanyWorkLocation/'+companyid,null, httpOptions);
  }

  GetUserProfile() {
    const token = sessionStorage.getItem('usertoken');        
    // const token = this.config.UserInfo.token;
    const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': token }) };
    return this.httpClient.get(environment.apiUrl + 'User/GetUserProfile', httpOptions);
  }

  CheckGstn(Gstn:any) {
    var mm={'Gstn':Gstn}
    const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json'}) };
    return this.httpClient.post(environment.apiUrl + 'Account/onCheckGstn',mm, httpOptions);
  }
}

