import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders,HttpParams } from '@angular/common/http';
import { Http, Response, Headers, RequestOptions , HttpModule} from '@angular/http';
import { AppConfig } from '../Globals/app.config';
import { Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { environment } from '../../environments/environment';
import { FormGroup } from '@angular/forms';
import { map } from 'rxjs/operators';


@Injectable()
export class AuthenticationService {

  constructor(private httpClient: HttpClient, private http: Http, private config: AppConfig) { }
  //, GoogleReCaptcha: string
  Authenticate(Username: string, Password: string) {
   //alert();
    const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) };
    const body = JSON.stringify({ 'Username': Username, 'Password': Password, 'GoogleReCaptcha': ''});
    return this.httpClient.post(environment.apiUrl + 'Account/LoginUsers', body, httpOptions);
  }
  username_verification(value: any) {
    const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) };
    return this.httpClient.post(environment.apiUrl + 'Account/username_verification/' + value, httpOptions);
  }
  LogOut(token: string) {

    const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) };
    return this.httpClient.post(environment.apiUrl + 'Account/LogOut/'+token, httpOptions);
  }
  ForgetPassword(Username: string) {
    const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) };
    const body = JSON.stringify({ 'Username': Username });
    return this.httpClient.post(environment.apiUrl + 'Account/ForgotPassword', body, httpOptions);
  }

  CheckTokenResetPassword(recoveryToken: string) {
    const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) };
    return this.httpClient.get(environment.apiUrl + 'Account/CheckTokenResetPassword/' + recoveryToken, httpOptions);
  }
  ResetPassword(Password: string, ConfirmPassword: string, recoveryToken: string) {
    alert(environment.apiUrl);
    //const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) };
    //const body = JSON.stringify({ 'Password': Password, 'ConfirmPassword': ConfirmPassword });
    //return this.httpClient.post(environment.apiUrl + 'Account/ResetPassword/' + recoveryToken + '/', body, httpOptions);
  }

  ChangePassword(OldPassword:String,Password: string,ConfirmPassword:string) {

     const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': this.config.UserInfo.token }) };
     const body = JSON.stringify({'OldPassword':OldPassword,'Password': Password ,'ConfirmPassword':ConfirmPassword});
     return this.httpClient.post(environment.apiUrl + 'Account/ChangePassword', body, httpOptions);

  }

  ValidateToken() {
    const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': this.config.UserInfo.token }) };
    return this.httpClient.get(environment.apiUrl + 'Account/ValidateToken', httpOptions);
  }

  SaveGeoLocation(obj:any) {
    const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': this.config.UserInfo.token }) };
    return this.httpClient.post(environment.apiUrl + 'Account/SaveGeoLocation', obj, httpOptions);
  }
  ForgotPassword(Username: string) {
    const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) };
    const body = JSON.stringify({ 'Username': Username });
    return this.httpClient.post(environment.apiUrl + 'Account/ForgotPassword', body, httpOptions);
  }

  CheckTokenForgotPassword(recoveryToken: string) {
    const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) };
    return this.httpClient.get(environment.apiUrl + 'Account/CheckTokenForgotPassword/' + recoveryToken, httpOptions);
  }

  UpdateUserPassword(Password: string, ConfirmPassword: string, recoveryToken: string) {
    // ;
    const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) };
    const body = JSON.stringify({ 'Password': Password, 'ConfirmPassword': ConfirmPassword });
    return this.httpClient.post(environment.apiUrl + 'Account/UpdateUserPassword/' + recoveryToken + '/', body, httpOptions);
  }

  CheckPassword(Password:string) {

    const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': this.config.UserInfo.token }) };
    const body = JSON.stringify({'Passwords':Password});
    return this.httpClient.post(environment.apiUrl + 'Account/CheckPassword', body, httpOptions);

 }
}
