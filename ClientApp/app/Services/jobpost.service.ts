import { stringify } from 'querystring';

import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { AppConfig } from '../Globals/app.config';
import { Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { environment } from '../../environments/environment';
import { FormGroup } from '@angular/forms';
import { Injectable } from '@angular/core';
import { retry, catchError } from 'rxjs/operators';

@Injectable()
export class JobpostService {
  token:any;
  constructor(private httpClient: HttpClient, private http: Http, private config: AppConfig) {
        // token = sessionStorage.getItem('usertoken'); 
  }

  AddJobId(jobdetail:any) {
    const token = sessionStorage.getItem('usertoken');
    const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' , 'Authorization': token}) };
    return this.httpClient.post(environment.apiUrl + 'Job/SetJob',jobdetail, httpOptions).pipe(
      retry(3)     
    );
  }

  GetJobOpening(jobopeningdetail:any, JobId:any) {
    const token = sessionStorage.getItem('usertoken');
     const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' , 'Authorization': token}) };
     return this.httpClient.post(environment.apiUrl + 'Job/SaveJobOpening/'+JobId,jobopeningdetail, httpOptions).pipe(
      retry(3)     
    );
   }
   
   SetJobOpening(jobopeningdetail:any, JobId:number) {    
    const token = sessionStorage.getItem('usertoken'); 
    const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' , 'Authorization': token}) };
     return this.httpClient.post(environment.apiUrl + 'Job/UpdateJobOpening/'+JobId,jobopeningdetail, httpOptions).pipe(
      retry(3)     
    );
   }
   GetJobOpeningDetail(Jobid: any) {    
    const token = sessionStorage.getItem('usertoken'); 
    const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' , 'Authorization': token}) };
    return this.httpClient.get(environment.apiUrl + 'Job/GetJobOpening/' + Jobid, httpOptions).pipe(
      retry(3)     
    );
  }

  GetAllJobs(PushData:any={}) {  
    const token = sessionStorage.getItem('usertoken');
    const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': token }) };
    return this.httpClient.post(environment.apiUrl + 'Job/GetJobList/',PushData,httpOptions).pipe(
      retry(3)     
    );
  }

  // recreate a copy of job after invalidTo Date
  reCreateJobs(postData:any){  
    const token = sessionStorage.getItem('usertoken');
    const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': token }) };
    return this.httpClient.post(environment.apiUrl + 'Job/RecreateJob/',postData,httpOptions).pipe(
      retry(3)     
    );
  }

  AgencyGetAllJobs(JobId: any, pageNumber: number) { 
    const token = sessionStorage.getItem('usertoken');    
    const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': token }) };
    //return this.httpClient.get(environment.apiUrl + 'Job/GetJobList/' + JobId + '/' + pageNumber, httpOptions);
    return this.httpClient.get(environment.apiUrl + 'Agency/GetAllAgencyJobList/' + JobId + '/' + pageNumber, httpOptions).pipe(
      retry(3)     
    );
  }

  UpdateJob(jobDetails:any)
  {    
    const token = sessionStorage.getItem('usertoken');
    const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' , 'Authorization': token}) };
    return this.httpClient.post(environment.apiUrl + 'Job/SetJob' , jobDetails, httpOptions).pipe(
      retry(3)     
    );
  }
  EditJobOpening(openingid: any)
  {
    const token = sessionStorage.getItem('usertoken');
    const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' , 'Authorization': token}) };
    return this.httpClient.get(environment.apiUrl + 'job/GetJobOpeningDetailsById/' + openingid , httpOptions);
  }
  UpdateJobOpening(jobOpening:any)
  { 
    const token = sessionStorage.getItem('usertoken');
    const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' , 'Authorization': token}) };
    return this.httpClient.post(environment.apiUrl + 'job/UpdateJobOpeningDetails', jobOpening , httpOptions).pipe(
      retry(3)     
    );
  }

  postToYs(jobId:any){   
    const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json',}) };
    return this.httpClient.get(environment.apiUrl + 'Job/PostRojgaarToYs/' + jobId , httpOptions).pipe(
      retry(3)     
    );
 
  }


  //Publish Job by Akash
  PublishJob(JobId: any):Observable<any>  {    
    const token = sessionStorage.getItem('usertoken');
     const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' , 'Authorization': token}) };
     return this.httpClient.get(environment.apiUrl + 'job/PublishJob/' + JobId , httpOptions).pipe(
      retry(3)     
    );
  }

  RevokeJob(Jobid:any)
   {   
    const token = sessionStorage.getItem('usertoken');
    const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' , 'Authorization': token}) };
    return this.httpClient.get(environment.apiUrl + 'job/RevokeJob/' + Jobid , httpOptions).pipe(
      retry(3)     
    );
  }
  DeletOpeningJob(id: any) { 
    const token = sessionStorage.getItem('usertoken');
    const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': token }) };
    return this.httpClient.get(environment.apiUrl + 'job/DeleteEmpJobPostOpening/' + id, httpOptions).pipe(
      retry(3)     
    );
  }
  PostWalkin(postdata: any)
  {
    const token = sessionStorage.getItem('usertoken');
    const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json'}) };
    return this.httpClient.post(environment.ysUrl + 'Rojgaar/AddUserPostForRojgaar' , postdata , httpOptions);
  }
  PostJobYS(postdata: any)
  {    
    const token = sessionStorage.getItem('usertoken');
    const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json'}) };
    return this.httpClient.post(environment.ysUrl + 'Rojgaar/AddUserPostForRojgaar' , postdata , httpOptions);
  }

  CloseJob(Jobid:any)
  { 
    const token = sessionStorage.getItem('usertoken');
   const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' , 'Authorization': token}) };
   return this.httpClient.get(environment.apiUrl + 'job/ClosedJob/' + Jobid , httpOptions).pipe(
    retry(3)     
  );
 }

 scrapJob(Jobid:any)
 {
  const token = sessionStorage.getItem('usertoken');
  const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' , 'Authorization': token}) };
  return this.httpClient.get(environment.apiUrl + 'job/ScrapJob/' + Jobid , httpOptions).pipe(
    retry(3)     
  );
}
DeleteSectorjobpost(JobID:any,TblID:any,SecID:any,TradID:any)
 {   
  const token = sessionStorage.getItem('usertoken');
  const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' , 'Authorization': token}) };
  const body = JSON.stringify({
          'JobId': JobID, 'Id': TblID
        , 'SectorId': SecID, 'TradeId': TradID
      });
  return this.httpClient.post(environment.apiUrl + 'CandidateWalkIn/DeleteSectorTrade' , body , httpOptions);
}

// get previousJobQuestionList


  getJobTitleList(){
    const token = sessionStorage.getItem('usertoken');
    const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' , 'Authorization': token}) };
    return this.httpClient.get(environment.apiUrl + 'UserQuestionsAns/GetJobcodedetail',httpOptions );
  }

  getJobDetails(JobId: any):Observable<any>  {  
    const token = sessionStorage.getItem('usertoken');   
    const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' , 'Authorization': token}) };
    return this.httpClient.get(environment.apiUrl + 'UserQuestionsAns/GetJobpostedlist/' + JobId , httpOptions);
 }

  getPreviousQuestionList(JobId: any):Observable<any>  {  
    const token = sessionStorage.getItem('usertoken');   
    const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' , 'Authorization': token}) };
    return this.httpClient.get(environment.apiUrl + 'UserQuestionsAns/GetJobScreeningquestion/' + JobId , httpOptions);
 } 
 
 saveQuestion(questionList:any) {   
  const token = sessionStorage.getItem('usertoken');
  const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' , 'Authorization': token}) };
  return this.httpClient.post(environment.apiUrl + 'UserQuestionsAns/SetUserQuestion',questionList, httpOptions);
 }

updateQuestion(questionList:any) {
  const token = sessionStorage.getItem('usertoken');
  const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' , 'Authorization': token}) };
  return this.httpClient.post(environment.apiUrl + 'UserQuestionsAns/SetUserQuestion',questionList, httpOptions);
}

GetDashboardJobpostDetail()  {  
  const token = sessionStorage.getItem('usertoken');   
  const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' , 'Authorization': token}) };
  return this.httpClient.get(environment.apiUrl + 'Dashboard/GetDashboardJobpostDetail' , httpOptions);
} 


GetDashboardApplicationsRecieved()  {  
  const token = sessionStorage.getItem('usertoken');   
  const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' , 'Authorization': token}) };
  return this.httpClient.get(environment.apiUrl + 'Dashboard/GetDashboardApplicationsRecieved' , httpOptions);
} 

GetDashboardInterviewScheduleList(){
  const token = sessionStorage.getItem('usertoken');   
  const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' , 'Authorization': token}) };
  return this.httpClient.get(environment.apiUrl + 'Dashboard/GetDashboardInterviewScheduleList' , httpOptions);

}

GetDashboardRegistrationReceived(){
  const token = sessionStorage.getItem('usertoken');   
  const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' , 'Authorization': token}) };
  return this.httpClient.get(environment.apiUrl + 'Dashboard/GetDashboardRegistrationReceived' , httpOptions);

}
}
