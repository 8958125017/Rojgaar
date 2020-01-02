import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Http} from '@angular/http';
import { AppConfig } from '../Globals/app.config';
import { environment } from '../../environments/environment';


@Injectable()
export class UserInfoService {
  constructor(private httpClient: HttpClient, private http: Http, private config: AppConfig) { }

  UpdateProfile(objProfile: any) {
     const token = sessionStorage.getItem('usertoken');        // const token = this.config.UserInfo.token;
    const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': token }) };
    return this.httpClient.post(environment.apiUrl + 'User/UpdateProfile', objProfile, httpOptions);
  }

  UpdateJobProfile(objJobProfile: any) {
     const token = sessionStorage.getItem('usertoken');        // const token = this.config.UserInfo.token;
    const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': token }) };
    return this.httpClient.post(environment.apiUrl + 'User/UpdateJobProfile', objJobProfile, httpOptions);
  }


  AddAddress(objAddress: any) {
     const token = sessionStorage.getItem('usertoken');        // const token = this.config.UserInfo.token;
    const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': token }) };
    return this.httpClient.post(environment.apiUrl + 'User/AddAddress', objAddress, httpOptions);
  }
  UpdateAddress(objAddress: any) {
     const token = sessionStorage.getItem('usertoken');        // const token = this.config.UserInfo.token;
    const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': token }) };
    return this.httpClient.post(environment.apiUrl + 'User/UpdateAddress', objAddress, httpOptions);
  }


  GetProfileDetails() {
     const token = sessionStorage.getItem('usertoken');        // const token = this.config.UserInfo.token;
    const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': token }) };
    return this.httpClient.get(environment.apiUrl + 'User/GetProfileDetails', httpOptions).do(response => console.log("logging response both bad and ok..."), error => console.log("Something exploded, call 911"));
  }


  GetJobProfileDetails() {
     const token = sessionStorage.getItem('usertoken');        // const token = this.config.UserInfo.token;
    const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': token }) };
    return this.httpClient.get(environment.apiUrl + 'User/GetJobProfileDetails', httpOptions);
  }

  GetAddress(ID: any) {
    ID = ID != null && ID != "" ? ID : 0;
     const token = sessionStorage.getItem('usertoken');        // const token = this.config.UserInfo.token;
    const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': token }) };
    return this.httpClient.get(environment.apiUrl + 'User/GetAddress/' + ID, httpOptions);
  }
  AddFamily(objFamily: any) {
     const token = sessionStorage.getItem('usertoken');        // const token = this.config.UserInfo.token;
    const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': token }) };
    return this.httpClient.post(environment.apiUrl + 'User/AddFamily', objFamily, httpOptions);
  }
  GetFamily(ID: any) {
    ID = ID != null && ID != "" ? ID : 0;
     const token = sessionStorage.getItem('usertoken');        // const token = this.config.UserInfo.token;
    const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': token }) };
    return this.httpClient.get(environment.apiUrl + 'User/GetFamily/' + ID, httpOptions);
  }
  UpdateFamily(objFamily: any) {
     const token = sessionStorage.getItem('usertoken');        // const token = this.config.UserInfo.token;
    const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': token }) };
    return this.httpClient.post(environment.apiUrl + 'User/UpdateFamily', objFamily, httpOptions);
  }

  DeleteFamily(ID: any) {
     const token = sessionStorage.getItem('usertoken');        // const token = this.config.UserInfo.token;
    const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': token }) };
    return this.httpClient.post(environment.apiUrl + 'User/DeleteFamily/' + ID, null, httpOptions);
  }
  DeleteAddress(ID: any) {
     const token = sessionStorage.getItem('usertoken');        // const token = this.config.UserInfo.token;
    const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': token }) };
    return this.httpClient.post(environment.apiUrl + 'User/DeleteAddress/' + ID, null, httpOptions);
  }

  //Work Experience  Actions
  AddWorkExperience(objFamily: any) {
     const token = sessionStorage.getItem('usertoken');        // const token = this.config.UserInfo.token;
    const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': token }) };
    return this.httpClient.post(environment.apiUrl + 'User/AddWorkExperience', objFamily, httpOptions);
  }
  GetWorkExperience(ID: any) {
    ID = ID != null && ID != "" ? ID : 0;
     const token = sessionStorage.getItem('usertoken');        // const token = this.config.UserInfo.token;
    const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': token }) };
    return this.httpClient.get(environment.apiUrl + 'User/GetWorkExperience/' + ID, httpOptions);
  }
  UpdateWorkExperience(objFamily: any) {
     const token = sessionStorage.getItem('usertoken');        // const token = this.config.UserInfo.token;
    const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': token }) };
    return this.httpClient.post(environment.apiUrl + 'User/UpdateWorkExperience', objFamily, httpOptions);
  }
  DeleteWorkExperience(ID: any) {
     const token = sessionStorage.getItem('usertoken');        // const token = this.config.UserInfo.token;
    const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': token }) };
    return this.httpClient.post(environment.apiUrl + 'User/DeleteWorkExperience/' + ID, null, httpOptions);
  }
  GetInterestArea() {
     const token = sessionStorage.getItem('usertoken');        // const token = this.config.UserInfo.token;
    const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': token }) };
    return this.httpClient.get(environment.apiUrl + 'User/GetInterestArea', httpOptions);
  }
  AddInterestArea(objHobbies: any) {
     const token = sessionStorage.getItem('usertoken');        // const token = this.config.UserInfo.token;
    const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': token }) };
    return this.httpClient.post(environment.apiUrl + 'User/AddInterestArea', objHobbies, httpOptions);
  }
  DeleteInterestArea(ID: any) {
     const token = sessionStorage.getItem('usertoken');        // const token = this.config.UserInfo.token;
    const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': token }) };
    return this.httpClient.post(environment.apiUrl + 'User/DeleteInterestArea/' + ID, null, httpOptions);
  }
  // GetEducationQualification() {
  //    const token = sessionStorage.getItem('usertoken');        // const token = this.config.UserInfo.token;
  //   const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': token }) };
  //   return this.httpClient.get(environment.apiUrl + 'User/GetEducationQualification', httpOptions);
  // }
  DeleteEducationQualification(ID: any) {
     const token = sessionStorage.getItem('usertoken');        // const token = this.config.UserInfo.token;
    const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': token }) };
    return this.httpClient.post(environment.apiUrl + 'User/DeleteEducationQualification/' + ID, null, httpOptions);
  }
  GetEducationQualification(ID: any) {
    ID = ID != null && ID != "" ? ID : 0;
     const token = sessionStorage.getItem('usertoken');        // const token = this.config.UserInfo.token;
    const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': token }) };
    return this.httpClient.get(environment.apiUrl + 'User/GetEducationQualification/' + ID, httpOptions);
  }
  UpdateEducationQualification(objEducationQualification: any) {
     const token = sessionStorage.getItem('usertoken');        // const token = this.config.UserInfo.token;
    const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': token }) };
    return this.httpClient.post(environment.apiUrl + 'User/UpdateEducationQualification', objEducationQualification, httpOptions);
  }
  AddEducationQualification(objEducationQualification: any) {
     const token = sessionStorage.getItem('usertoken');        // const token = this.config.UserInfo.token;
    const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': token }) };
    return this.httpClient.post(environment.apiUrl + 'User/AddEducationQualification', objEducationQualification, httpOptions);
  }
  DeleteCertification(ID: any) {
     const token = sessionStorage.getItem('usertoken');        // const token = this.config.UserInfo.token;
    const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': token }) };
    return this.httpClient.post(environment.apiUrl + 'User/DeleteCertification/' + ID, null, httpOptions);
  }
  GetCertification(ID: any) {
    ID = ID != null && ID != "" ? ID : 0;
     const token = sessionStorage.getItem('usertoken');        // const token = this.config.UserInfo.token;
    const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': token }) };
    return this.httpClient.get(environment.apiUrl + 'User/GetCertification/' + ID, httpOptions);
  }
  UpdateCertification(objCertification: any) {
     const token = sessionStorage.getItem('usertoken');        // const token = this.config.UserInfo.token;
    const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': token }) };
    return this.httpClient.post(environment.apiUrl + 'User/UpdateCertification', objCertification, httpOptions);
  }
  AddCertification(objCertification: any) {
     const token = sessionStorage.getItem('usertoken');        // const token = this.config.UserInfo.token;
    const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': token }) };
    return this.httpClient.post(environment.apiUrl + 'User/AddCertification', objCertification, httpOptions);
  }

  // //post
  // GetUserPost() {
  //    const token = sessionStorage.getItem('usertoken');        // const token = this.config.UserInfo.token;
  //   const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': token }) };
  //   return this.httpClient.get(environment.apiUrl + 'User/GetUserPost/', httpOptions);
  // }
  //
  UpdateProfileImage(Image: any) {
     const token = sessionStorage.getItem('usertoken');        // const token = this.config.UserInfo.token;
    const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': token }) };
    return this.httpClient.post(environment.apiUrl + 'User/UpdateProfileImage', JSON.stringify({ "Image": Image }), httpOptions).do(response => console.log("logging response both bad and ok..."), error => console.log("Something exploded, call 911"));


  }
  //  User Training
  DeleteTraining(ID: any) {
     const token = sessionStorage.getItem('usertoken');        // const token = this.config.UserInfo.token;
    const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': token }) };
    return this.httpClient.post(environment.apiUrl + 'User/DeleteTraining/' + ID, null, httpOptions);
  }
  GetTraining(ID: any) {
    ID = ID != null && ID != "" ? ID : 0;
     const token = sessionStorage.getItem('usertoken');        // const token = this.config.UserInfo.token;
    const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': token }) };
    return this.httpClient.get(environment.apiUrl + 'User/GetTraining/' + ID, httpOptions);
  }
  UpdateTraining(objTraining: any) {
     const token = sessionStorage.getItem('usertoken');        // const token = this.config.UserInfo.token;
    const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': token }) };
    return this.httpClient.post(environment.apiUrl + 'User/UpdateTraining', objTraining, httpOptions);
  }
  AddTraining(objTraining: any) {
     const token = sessionStorage.getItem('usertoken');        // const token = this.config.UserInfo.token;
    const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': token }) };
    return this.httpClient.post(environment.apiUrl + 'User/AddTraining', objTraining, httpOptions);
  }
  Getlanguage() {
     const token = sessionStorage.getItem('usertoken');        // const token = this.config.UserInfo.token;
    const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': token }) };
    return this.httpClient.get(environment.apiUrl + 'User/Getlanguage', httpOptions);
  }
  Addlanguage(objlanguage: any) {
     const token = sessionStorage.getItem('usertoken');        // const token = this.config.UserInfo.token;
    const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': token }) };
    return this.httpClient.post(environment.apiUrl + 'User/Addlanguage', objlanguage, httpOptions);
  }
  Deletelanguage(ID: any) {
     const token = sessionStorage.getItem('usertoken');        // const token = this.config.UserInfo.token;
    const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': token }) };
    return this.httpClient.post(environment.apiUrl + 'User/Deletelanguage/' + ID, null, httpOptions);
  }

  GetUserList(Parient_Id: any) {
     const token = sessionStorage.getItem('usertoken');        // const token = this.config.UserInfo.token;
    const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': token }) };
    const body={'Parient_Id':Parient_Id};
    return this.httpClient.get(environment.apiUrl + 'User/GetUserChild/'+Parient_Id ,httpOptions);
  }

  GetPermissionDetails(id:any){

     const token = sessionStorage.getItem('usertoken');        // const token = this.config.UserInfo.token;
    const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': token }) };
    return this.httpClient.get(environment.apiUrl + 'User/MenuPermission/'+id ,httpOptions);

  }

}
