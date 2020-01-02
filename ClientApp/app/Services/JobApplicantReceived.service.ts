import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { AppConfig } from '../Globals/app.config';
import { Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { environment } from '../../environments/environment';

@Injectable()
export class JobApplicantReceivedService {
  Usertoken:any;
    constructor(private httpClient: HttpClient, private http: Http, private config: AppConfig) {

      this.Usertoken=sessionStorage.getItem('usertoken');

    }
      GetAllAppliedJobs(postdata:any={}):Observable<any> {
        const token = sessionStorage.getItem('usertoken');
      //  var postdata1 = {
      //                 'logintype':"0",
      //                 'StateId'  :"0",
      //                 'DistrictId':"0"
      //               }
     // const token = this.config.UserInfo.token;
        const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' , 'Authorization': token}) };
        return this.httpClient.post(environment.apiUrl + 'Job/GetAppliedJobListAplictRecvd/',postdata , httpOptions);
      }

      JobId: any = {};
      GetAppliedJobsList(JobId: any, pageNumber: number):Observable<any> {
        const token = sessionStorage.getItem('usertoken');
       // const token = this.config.UserInfo.token;
        const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': token }) };
        return this.httpClient.get(environment.apiUrl + 'Job/GetJobList/' + JobId + '/' + pageNumber, httpOptions);
      }

      GetAppliedJobById(JobId: any, PageNumber: number):Observable<any>{
        const token = sessionStorage.getItem('usertoken');
       // const token = this.config.UserInfo.token;
        const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': token }) };
        return this.httpClient.get(environment.apiUrl + 'InterviewSchedule/GetInterviewJobList/' + JobId + '/' + PageNumber, httpOptions);
      }

      getJobByState(jobId:any,pageNo:any):Observable<any>{
        const token = sessionStorage.getItem('usertoken');
        // const token = this.config.UserInfo.token;
        const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': token })};
        return this.httpClient.get(environment.apiUrl + 'Job/GetJobwiseOpeningList/' + jobId + '/' + pageNo, httpOptions);
      }

      GetAppliedCandidateByState(JobId: any,jobOpeningID:any):Observable<any> {

        const token = sessionStorage.getItem('usertoken');
        const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': token }) };
        return this.httpClient.get(environment.apiUrl + 'Job/GetAppliedOpeningWiseCandidateList/' + JobId + '/' + jobOpeningID, httpOptions);
      }

  public CandSuitable(postdata){
    const token = sessionStorage.getItem('usertoken');
    const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' , 'Authorization': token}) };
    return this.httpClient.post(environment.apiUrl+'Job/SetSuitableUnsuitableCandidate',postdata,httpOptions);
  }

///////////////////////  getScreeningAnswer //////////////////
  getScreeningAnswer(jobId,jobOpeningId,candidateId){    
    const token = sessionStorage.getItem('usertoken');
    const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' , 'Authorization': token}) };
    return this.httpClient.get(environment.apiUrl+'UserQuestionsAns/GetquestionAnslist/' +jobId+ '/' +jobOpeningId+ '/' +candidateId, httpOptions);

  }

  // Screening counts for review application BY Neeraj Singh 
  GetAppRevwScreeningCounts(jobId){    
    const token = sessionStorage.getItem('usertoken');
    const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' , 'Authorization': token}) };
    return this.httpClient.get(environment.apiUrl+'UserQuestionsAns/GetAppRevwScreeningCounts/' +jobId , httpOptions);
}

//Get Opening list By Neeraj Singh
GetJobAppreviwOpngAddressList(jobId){    
  const token = sessionStorage.getItem('usertoken');
  const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' , 'Authorization': token}) };
  return this.httpClient.get(environment.apiUrl+'UserQuestionsAns/GetJobAppreviwOpngAddressList/' +jobId , httpOptions);

}

GetAppRevwCandDetails(filterdata){
  const token = sessionStorage.getItem('usertoken');
  const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' , 'Authorization': token}) };
  return this.httpClient.post(environment.apiUrl+'UserQuestionsAns/GetAppRevwCandDetails',filterdata,httpOptions);
}


}
