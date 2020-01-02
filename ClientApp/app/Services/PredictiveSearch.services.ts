import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { AppConfig } from '../Globals/app.config';
import { Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { environment } from '../../environments/environment';
import { FormGroup } from '@angular/forms';


@Injectable()
export class PredictiveSearchService {

  constructor(private httpClient: HttpClient, private http: Http, private config: AppConfig) { }

  GetAllSector() {
   const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) };
   return this.httpClient.get(environment.apiUrl + 'MrigsRojgaar/GelAllSector', httpOptions);
 }


 GetAllTraidList(ID: string) {
  const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) };
  return this.httpClient.get(environment.apiUrl + 'MrigsRojgaar/GetAllTrade/'+ ID, httpOptions);
 }
 
 GetFilterData(SearchData:any) {
  const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) };
  return this.httpClient.post(environment.apiUrl +'Candidate/GetRojgaarBatchSearch/',SearchData, httpOptions);
}   

batchCode(BatchId:any,PageNum:any) {
  var mdm ={'BatchId':BatchId,'pageNumber':PageNum}
  const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) };
  return this.httpClient.post(environment.apiUrl +'MrigsRojgaar/RojgaarBatchwiseCandidate/',mdm, httpOptions);
}  
viewCandidateDetails(InqId:any){ 
  // var InqId ={'BatchId':candidateid,'PageNumber':0}
  const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) };
  return this.httpClient.get(environment.apiUrl +'MrigsRojgaar/ViewRojgaarCandidateDetailForPredict/'+InqId, httpOptions);
} 
}
