import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { AppConfig } from '../Globals/app.config';
import { Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { environment } from '../../environments/environment';
import { FormGroup } from '@angular/forms';


@Injectable()
export class TCSearchService {

  constructor(private httpClient: HttpClient, private http: Http, private config: AppConfig) { }

  GetAllSector() {
    // var ss=environment.apiUrl + ' MrigsRojgaar/GelAllSector';
    // alert(ss);
   const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) };
  // return this.httpClient.get(environment.mrigsUrl + 'COMMON/SECTORLIST/0/0/0/0/', httpOptions);MrigsRojgaar/GelAllSector

  return this.httpClient.get(environment.apiUrl + 'MrigsRojgaar/GelAllSector', httpOptions);
  }


 GetAllTraidList(ID: string) {
  const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) };
 // return this.httpClient.get(environment.mrigsUrl + 'COMMON/SECTERTRADELIST/'+ ID+'/0/0/0/', httpOptions);
 return this.httpClient.get(environment.apiUrl+'MrigsRojgaar/GetAllTrade/'+ ID, httpOptions);
 }
 
 GetFilterData(SearchData:any) {
     const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) };
   return this.httpClient.post(environment.apiUrl +'MrigsRojgaar/GetTrainingCentreDetail/',SearchData, httpOptions);
}   

batchCode(BatchId:any) {
  var mdm ={'BatchId':BatchId,'PageNumber':0}
  const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) };
  return this.httpClient.post(environment.apiUrl +'MrigsRojgaar/RojgaarBatchwiseCandidate/',mdm, httpOptions);
}  
viewCandidateDetails(InqId:any){ 
  const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) };
  return this.httpClient.get(environment.apiUrl +'MrigsRojgaar/ViewRojgaarCandidateDetailForPredict/'+InqId, httpOptions);
} 

GetBatchrData(SearchData:any) {
  const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) };
  return this.httpClient.post(environment.apiUrl +'Candidate/GetRojgaarBatchSearch/',SearchData, httpOptions);
} 
batchData(mdm:any) { 
  const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) };
  return this.httpClient.post(environment.apiUrl +'MrigsRojgaar/RojgaarBatchwiseCandidate/',mdm, httpOptions);
}  
}
