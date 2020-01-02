import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { AppConfig } from '../Globals/app.config';
import { Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { environment } from '../../environments/environment';
import { FormGroup } from '@angular/forms';
import { Alert } from 'selenium-webdriver';

@Injectable()
export class EventService {
    constructor(private httpClient: HttpClient, private http: Http, private config: AppConfig) { }

    // GetEventType() {
    //     const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json'}) };
    //     return this.httpClient.get(environment.apiUrl + 'Event/AdminGetEventType', httpOptions);
    //   }

    GetEventType(SearchFilter:any) {
      
      const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json'}) };
      return this.httpClient.post(environment.apiUrl + 'Event/AdminRojgaarEventList/',SearchFilter, httpOptions);
    }
    
    setData(Data:any){
      const token = sessionStorage.getItem('usertoken');
      const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': token }) };
      return this.httpClient.post(environment.apiUrl + 'RojgaarCommon/SetData',Data, httpOptions);
    }  
    GetData(Data:any){
      const token = sessionStorage.getItem('usertoken');
      const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': token}) };
      return this.httpClient.post(environment.apiUrl + 'RojgaarCommon/GetData/',Data,httpOptions);
  
    }

    GetEventEmployerDetails(){
    const token = sessionStorage.getItem('usertoken');
    const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': token}) };
    return this.httpClient.get(environment.apiUrl + 'Event/GetEventEmployerDetails',httpOptions);
  }

  SetRojgaarEventEmpRegistration(senddata:any){
    
    const token = sessionStorage.getItem('usertoken');
    const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': token }) };
    return this.httpClient.post(environment.apiUrl + 'Event/SetRojgaarEventEmpRegistration', senddata,httpOptions);
  }

  GetEventRegistrationDetail(eventId:any,companyIid:any){
    const token = sessionStorage.getItem('usertoken');
    const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': token}) };
    return this.httpClient.get(environment.apiUrl + 'Event/GetEventEmployerJobList/'+eventId+'/'+companyIid,httpOptions);
  }

  GetEventRegisterCandidate(eventid:any,userId:any){
    
    const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json'}) };
    return this.httpClient.get(environment.apiUrl + 'Event/GetEventRegisterCandidate/' +eventid +'/'+userId,httpOptions);
  }

  GetEventEmployerJobDtlAndContactDtlList(jobId:any,employerId:any,eventId:any){
    
    const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json'}) };
    return this.httpClient.get(environment.apiUrl + 'Event/GetEventEmployerJobDtlAndContactDtlList/' +jobId+'/'+employerId+'/'+eventId ,httpOptions);
  }

  GetEventDetailIdWise(eventId:any){
    const token = sessionStorage.getItem('usertoken');
    const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': token}) };
    return this.httpClient.get(environment.apiUrl + 'Event/GetEventDetailIdWise/' + eventId ,httpOptions);
  }

  CompanyWiseActiveUserList(companyIid:any){
    
    const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json'}) };
    return this.httpClient.get(environment.apiUrl + 'CompanyProfile/AdminCompanyWiseActiveUserList/0/' +companyIid,httpOptions);
  }

  GetUserDetail(contactpersonId:any){
    
    const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json'}) };
    return this.httpClient.get(environment.apiUrl + 'Event/GetUserDetail/' +contactpersonId,httpOptions);
  }

  GetEventTypeList(){
    
    const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json'}) };
    return this.httpClient.get(environment.apiUrl + 'Event/AdminGetEventType/',httpOptions);
  }
//////////////////  Registred Event List ///////////////
  RegisteredEventList(Data: any) {
    const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json'})};
    return this.httpClient.post(environment.apiUrl + 'Event/AdminRojgaarEventList',Data, httpOptions);
}
GetEventPosterImage() {
  const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json'})};
  return this.httpClient.get(environment.apiUrl + 'Event/GetEventPosterImage', httpOptions);
}
GetEventDetailIdWiseHome(AdminID: any,EventID:any) {
  const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json'})};
  return this.httpClient.get(environment.apiUrl + 'Event/AdminGetEventDetailIdWise/'+AdminID+'/'+EventID, httpOptions);
}

GetEventGalleryImage(GallryData:any) {
  const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json'})};
  return this.httpClient.post(environment.apiUrl + 'Event/GetAdminEventImageGallery',GallryData,httpOptions);
}
/////////////////////
GetEventdContactDetailList(companyId: any,EventID:any) {
  
  const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json'})};
  return this.httpClient.get(environment.apiUrl + 'Event/GetEventContactDetailList/'+companyId+'/'+EventID, httpOptions);
}




}