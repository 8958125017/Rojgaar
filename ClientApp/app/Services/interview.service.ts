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
export class InterviewService {

  constructor(private httpClient: HttpClient, private http: Http, private config: AppConfig) { }
  addInterviewschedule(interviwdetail: any) {
    const token = sessionStorage.getItem('usertoken');        // const token = this.config.UserInfo.token;
    const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': token }) };
    return this.httpClient.post(environment.apiUrl + 'InterviewSchedule/SetInterviewSchedule', interviwdetail, httpOptions);
  }
  getInterviewlist(detail: any) {
    const token = sessionStorage.getItem('usertoken');        // const token = this.config.UserInfo.token;
    const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': token }) };
   // return this.httpClient.get(environment.apiUrl + 'InterviewSchedule/GetInterviewScheduleList/' + PageNumber, httpOptions);
   return this.httpClient.post(environment.apiUrl + 'InterviewSchedule/GetInterviewScheduleList',detail, httpOptions);
  }
  getInterviewDetailById(id: any) {
    const token = sessionStorage.getItem('usertoken');        // const token = this.config.UserInfo.token;
    const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': token }) };
    return this.httpClient.get(environment.apiUrl + 'InterviewSchedule/GetInterviewDetail/' + id, httpOptions);
  }
  getInterviewDetailByCandidateName(Name: any) {
    const token = sessionStorage.getItem('usertoken');        // const token = this.config.UserInfo.token;
    const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': token }) };
    return this.httpClient.get(environment.apiUrl + 'InterviewSchedule/GetInterviewDetail/' + Name, httpOptions);
  }
  GetCandidateList(getcand: any) {
    const token = sessionStorage.getItem('usertoken');        // const token = this.config.UserInfo.token;
    const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': token }) };
    return this.httpClient.post(environment.apiUrl + 'InterviewSchedule/GetAppliedCandListForInterviewRJ', getcand, httpOptions);
  }
  GetCandidateListForDatatable(getcand: any) {
    const token = sessionStorage.getItem('usertoken');        // const token = this.config.UserInfo.token;
    const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': token }) };
    return this.httpClient.post(environment.apiUrl + 'InterviewSchedule/GetAppliedCandListForInterviewDS', getcand, httpOptions);
  }
  GetAppliedJobById(JobId: any, PageNumber: number) {
    const token = sessionStorage.getItem('usertoken');        // const token = this.config.UserInfo.token;
    const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': token }) };
    return this.httpClient.get(environment.apiUrl + 'InterviewSchedule/GetInterviewJobList/' + JobId + '/' + PageNumber, httpOptions);
  }

  GetAppliedJobs(PostData: any) {
    const token = sessionStorage.getItem('usertoken');        // const token = this.config.UserInfo.token;
    const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': token }) };
    return this.httpClient.post(environment.apiUrl + 'InterviewSchedule/GetAppliedJobsListForInterview', PostData, httpOptions);
  }
  SetCandidateRescheduleDetail(RescheduleDetail: any) {
    const token = sessionStorage.getItem('usertoken');
    const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': token }) };
    return this.httpClient.post(environment.apiUrl + 'InterviewSchedule/RescheduleCandidateInterview', RescheduleDetail, httpOptions);
  }
  SetCandidateSelectionDetail(SelectionDetail: any) {
    const token = sessionStorage.getItem('usertoken');
    const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': token }) };
    return this.httpClient.post(environment.apiUrl + 'InterviewSchedule/SetCandidateInterviewResult', SelectionDetail, httpOptions);
  }

  getInterviewlistByJobId(InterviewDetail: any) {
    const token = sessionStorage.getItem('usertoken');
    const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': token }) };
    return this.httpClient.post(environment.apiUrl + 'OfferLetter/GetInterviewListByJobId', InterviewDetail, httpOptions);
  }
  SetCandidateOfferLetterDetail(OfferLetterDetail: any) {
    const token = sessionStorage.getItem('usertoken');
    const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': token }) };
    return this.httpClient.post(environment.apiUrl + 'InterviewSchedule/SetCandidateOfferLetter', OfferLetterDetail, httpOptions);
  }
  getSelectedCandidateListByIterviewId(InterviewId: number) {
    const token = sessionStorage.getItem('usertoken');
    const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': token }) };
    return this.httpClient.get(environment.apiUrl + 'OfferLetter/GetSelectedCandidateList/' + InterviewId, httpOptions);
  }
  getCandidateOfferLetterDetail(JobId: number, InterviewId: number, CandId: number) {
    const token = sessionStorage.getItem('usertoken');
    const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': token }) };
    return this.httpClient.get(environment.apiUrl + 'InterviewSchedule/GetCandidateOfferLetter/' + JobId + '/' + InterviewId + '/' + CandId, httpOptions);
  }
  getConfirmedCandidateListByIterviewId(InterviewId: number) {
    const token = sessionStorage.getItem('usertoken');
    const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': token }) };
    return this.httpClient.get(environment.apiUrl + 'OfferLetter/GetConfirmOfferLetterCandidate/' + InterviewId, httpOptions);
  }
  SetJoinedCandidateList(JoiningDetail: any) {
    const token = sessionStorage.getItem('usertoken');
    const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': token }) };
    return this.httpClient.post(environment.apiUrl + 'OfferLetter/SetCandidateJoiningstatus', JoiningDetail, httpOptions);
  }
  GetCompanyWorkLocation(id: any) {
    const token = sessionStorage.getItem('usertoken');
    const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': token }) };
    return this.httpClient.get(environment.apiUrl + 'CompanyProfile/GetEmpCompanyWorkLocation/' + id, httpOptions);
  }
  GetCompanyWorkLocationstateDistrict(id: any) {
    const token = sessionStorage.getItem('usertoken');
    const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': token }) };
    return this.httpClient.get(environment.apiUrl + 'InterviewSchedule/GetStateDistrictByLoc/' + id, httpOptions);
  }
  UpdateSuitabilityStatusOfAppliedCandidate(Detail: any) {
    const token = sessionStorage.getItem('usertoken');        // const token = this.config.UserInfo.token;
    const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': token }) };
    return this.httpClient.post(environment.apiUrl + 'Job/SetSuitableUnsuitableCandidate', Detail, httpOptions);
  }
  CommanCandidateListForInterview(jobId: any, InterviewId: any) {
    const token = sessionStorage.getItem('usertoken');
    const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': token }) };
    return this.httpClient.get(environment.apiUrl + 'Candidate/GetAllCandidateData/' + jobId + '/' + InterviewId, httpOptions);

  }
  ///////////////////////  getScreeningAnswer //////////////////
  getScreeningAnswer(jobId,jobOpeningId,candidateId){    
    const token = sessionStorage.getItem('usertoken');
    const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' , 'Authorization': token}) };
    return this.httpClient.get(environment.apiUrl + 'InterviewSchedule/GetInverviewschldCandScreeingans/' +jobId+ '/' +jobOpeningId+ '/' +candidateId, httpOptions);

  }
  GetWalkInDetail(JobId: any,PageNumber:any) {
    const token = sessionStorage.getItem('usertoken');        // const token = this.config.UserInfo.token;
    const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': token }) };
    return this.httpClient.get(environment.apiUrl + 'InterviewSchedule/GetInterviewWalkList/' + JobId + '/' + PageNumber, httpOptions);
  }
  GetEventDetail(eventid:any,JobId: any,PageNumber:any) {
    const token = sessionStorage.getItem('usertoken');        // const token = this.config.UserInfo.token;
    const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': token }) };
    return this.httpClient.get(environment.apiUrl + 'InterviewSchedule/GetInterviewEventList/'+ eventid + '/'  + JobId + '/' + PageNumber, httpOptions);
  }
  CandidateListForWalkin(jobId: any, InterviewId: any) {
    const token = sessionStorage.getItem('usertoken');
    const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': token }) };
    return this.httpClient.get(environment.apiUrl + 'Candidate/GetAllCandidateDataByWalkin/' + jobId + '/' + InterviewId, httpOptions);

  }
  CandidateListForEvent(jobId: any,InterviewId:any,eventid: any) {
    const token = sessionStorage.getItem('usertoken');
    const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': token }) };
    return this.httpClient.get(environment.apiUrl + 'Candidate/GetAllCandidateDataByEvent/' + jobId + '/' + InterviewId + '/' + eventid, httpOptions);

  }
}   
