import { FormGroup } from '@angular/forms';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { AppConfig } from '../Globals/app.config';
import { Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { environment } from '../../environments/environment';

@Injectable()
export class RegistrationService {

  constructor(private httpClient: HttpClient, private http: Http, private config: AppConfig) { }

  // Registration(Email: string, password: string, FirstName: string, LastName: string) {
  //   const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) };
  //   const body = JSON.stringify({
  //     'EmailAddress': Email, 'password': password
  //     , 'FirstName': FirstName, 'LastName': LastName
  //   });
  //   return this.httpClient.post(environment.apiUrl + 'Account/UserRegistration', body, httpOptions);
  // }

  // Registration(FirstName: string, LastName: string, Email: string, PhoneNo: string,UserName: string,Password: string,LoginType: string,UserFrom: string,Pan_Number: string,Gstn: string) {
  //   const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) };
  //   const body = JSON.stringify({
  //     'FirstName': FirstName, 'LastName': LastName
  //     , 'Email': Email, 'PhoneNo': PhoneNo, 'UserName': UserName,'Password': Password, 'LoginType': LoginType, 'UserFrom': UserFrom, 'Pan_Number': Pan_Number,'Gstn': Gstn
  //   });
  //   
  //   return this.httpClient.post(environment.apiUrl + 'Account/SaveUserDetails', body, httpOptions);
  // }

  Registration(employeevalue:any) {
    const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) };
    return this.httpClient.post(environment.apiUrl + 'Account/SaveUserDetails', employeevalue);
  }

  // Registration(employeevalue:FormData) {
  //   const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) };
  //   const body = JSON.stringify({employeevalue});
  //   // ;
  //   
  //   return this.httpClient.post(environment.rojApiUrl + 'Account/SaveUserDetails', body, httpOptions);
  // }

  CheckUserRegistration(RegOrEnrollNo: string) {
    const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) };
    const body = JSON.stringify({ 'RegOrEnrollNo': RegOrEnrollNo });
    return this.httpClient.post(environment.apiUrl + 'Account/CheckUserRegistration', body, httpOptions);
  }

  GetUserRegistrationOTP(RegDetails: any) {
    const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) };
    return this.httpClient.post(environment.apiUrl + 'Account/GetUserRegistrationOTP', RegDetails, httpOptions);
  }

  UserRegistration(obj: any) {
    const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) };
    return this.httpClient.post(environment.apiUrl + 'Account/UserRegistration', obj, httpOptions);
  }
  username_verification(value: any) {
    const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) };
    return this.httpClient.post(environment.apiUrl + 'Account/username_verification/'+ value, httpOptions);
  }
  onCheckEmail(Email: any) {
    const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) };
    const body = JSON.stringify({ 'Email': Email });
    return this.httpClient.post(environment.apiUrl + 'Account/onCheckEmail', body, httpOptions);
  }

  onCheckMobile(Mobile: any) {
    const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) };
    const body = JSON.stringify({ 'Mobile': Mobile });
    return this.httpClient.post(environment.apiUrl + 'Account/onCheckMobile', body, httpOptions);
  }



  // usercheck(employeevalue:any) {
  //   const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) };
  //   return this.httpClient.post(environment.rojApiUrl + 'Account/onCheckUsers', employeevalue);
  // }

  usercheck(uservalue:any) {
    const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) };
    const body = JSON.stringify({ 'UserName': uservalue });

    return this.httpClient.post(environment.apiUrl + 'Account/onCheckUsers', body, httpOptions);
  }



  CheckPanCard(panvalue: any) {
    const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) };
    const body = JSON.stringify({ 'Pan': panvalue });
    return this.httpClient.post(environment.apiUrl + 'Account/onCheckPanCard', body, httpOptions);
  }

  // CheckPanCard(employeevalue:any) {
  //   const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) };
  //   return this.httpClient.post(environment.rojApiUrl + 'Account/onCheckPanCard', employeevalue);
  // }
   

  CheckGstn(gsteenvalue: any) {
    const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) };
    const body = JSON.stringify({ 'Gstn': gsteenvalue });
    return this.httpClient.post(environment.apiUrl + 'Account/onCheckGstn', body, httpOptions);
  }

  CheckMobile(mobvalue: any) {
    const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) };
    const body = JSON.stringify({ 'Mobile': mobvalue });
    return this.httpClient.post(environment.apiUrl + 'Account/onCheckMobile', body, httpOptions);
  }

  CheckEmail(emailvalues: any) {
    const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) };
    const body = JSON.stringify({ 'Email': emailvalues });
    return this.httpClient.post(environment.apiUrl + 'Account/onCheckEmail', body, httpOptions);
  }

  GenerateOTP(otvalues: any) {
    const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) };
    const body = JSON.stringify({ 'Mobile': otvalues });
    return this.httpClient.post(environment.apiUrl + 'Account/GenerateOTP', body, httpOptions);
  }

  CheckOTP(checkotpvalues: any,Mobile:any) {
    const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) };
    const body = JSON.stringify({ 'OTP': checkotpvalues,'MobileNo': Mobile});
    return this.httpClient.post(environment.apiUrl + 'Account/CheckOTP', body, httpOptions);
  }

  CreateUser(userdetails:any){

    const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': this.config.UserInfo.token }) };
    return this.httpClient.post(environment.apiUrl + 'User/SaveUser', userdetails,httpOptions);
  }

  getcompanyName(Uniqno:any){
    const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) };   
    return this.httpClient.get(environment.apiUrl + 'Account/GetcompanyName/' + Uniqno , httpOptions);
  }

  SetEmpSubscriptionDetails(userdetails:any){
    const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json'}) };
    return this.httpClient.post(environment.apiUrl + 'RojgaarAdmin/SetEmpSubscriptionDetails', userdetails,httpOptions);
  }

  CheckMobileSubscription(checkmob:any){
    const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json'}) };
    const body = JSON.stringify({ 'Mobile': checkmob });
    return this.httpClient.post(environment.apiUrl + 'RojgaarAdmin/CheckMobileSubscription', body,httpOptions);
  }

  CheckEmailSubscription(checkmail:any){
    const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json'}) };
    const body = JSON.stringify({ 'Email': checkmail });
    return this.httpClient.post(environment.apiUrl + 'RojgaarAdmin/CheckEmailSubscription', body,httpOptions);
  }


}
