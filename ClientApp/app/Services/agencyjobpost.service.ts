import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { AppConfig } from '../Globals/app.config';
import { Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { environment } from '../../environments/environment';
import { FormGroup } from '@angular/forms';
import { retry, catchError } from 'rxjs/operators';

@Injectable()
export class AgencyjobpostService {

  constructor(private httpClient: HttpClient, private http: Http, private config: AppConfig) { }


  GetAllJobs(postdata:any={}) {
    const token = sessionStorage.getItem('usertoken');
       // const token = this.config.UserInfo.token;
    const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' , 'Authorization': token}) };
    return this.httpClient.post(environment.apiUrl + 'Agency/RojgaarGetEmployerJobList/',postdata,httpOptions);
  }


 // get employer list code by Pankaj Joshi
  getEmployerList(PageNumber:any){
    const token = sessionStorage.getItem('usertoken');
    const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': token}) };
    return this.httpClient.get(environment.apiUrl + 'Master/GetAllEmployee/'+PageNumber ,httpOptions);

  }

  ApplyJob(data:any){

    const token = sessionStorage.getItem('usertoken');
    // const token = this.config.UserInfo.token;
    const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' , 'Authorization': token}) };
    return this.httpClient.post(environment.apiUrl + 'Job/SetAgencyJobApplication/' , data, httpOptions);
  }

  // ApplyJobopeningWise(data:any={}){
  //   const token = sessionStorage.getItem('usertoken');  
  //   const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' , 'Authorization': token}) };
  //   return this.httpClient.post(environment.apiUrl + 'Job/SetAgencyJobApplication/' , data, httpOptions);
  // }

  GetAllCandidateDetailsByjobId(PageNumber:any,jobId:any){
    const token = sessionStorage.getItem('usertoken');
    // const token = this.config.UserInfo.token;
    const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': token}) };
    return this.httpClient.get(environment.apiUrl + 'Agency/GetAllCandidateDetailsByjobId/'+ PageNumber+'/'+jobId ,httpOptions);
  }
  getJobByOpening(jobId:any,pageNo:any):Observable<any>{ 
            
    //const token = sessionStorage.getItem('usertoken');
    const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' })};
    return this.httpClient.get(environment.apiUrl + 'Agency/GetJobwiseOpeningForAgency/' + jobId + '/' + pageNo, httpOptions);
  }
  GetAllCandidateDetailsByJobOpeningId(jobId:any,jobOpeningId:any,PageNumber:any):Observable<any>{
    
    const token = sessionStorage.getItem('usertoken');
    // const token = this.config.UserInfo.token;
    const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': token}) };
    return this.httpClient.get(environment.apiUrl + 'Agency/GetOpeningCandidateListForAgency/'+jobId +'/'+jobOpeningId+'/'+PageNumber,httpOptions);
  }

  getScreeningQuestionList(JobId: any) {
    const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) };
    return this.httpClient.get(environment.apiUrl + 'YuvaRojgaar/GetYuvaSamparkQuestion/'+ JobId).pipe(
      retry(3)     
    );
  }



}
