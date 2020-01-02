import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { AppConfig } from '../Globals/app.config';
import { Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { environment } from '../../environments/environment';
import { FormGroup } from '@angular/forms';
import * as moment from 'moment';
import * as FileSaver from 'file-saver';
import * as XLSX from 'xlsx';


const EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
const EXCEL_EXTENSION = '.xlsx';

@Injectable()
export class MasterService {


  constructor(private httpClient: HttpClient, private http: Http, private config: AppConfig) { }
  // Grievance MAster
  GetGrievanceCategory() {
    const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) };
    return this.httpClient.get(environment.apiUrl + 'Grievance/GetGrievanceCategory', httpOptions);
  }
  GetGrievanceSubject(CategoryCode: any) {
    const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) };
    return this.httpClient.get(environment.apiUrl + 'Grievance/GetGrievanceSubject/' + CategoryCode, httpOptions);
  }
  GetStandardConcern(SubjectCode: any) {
    const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) };
    return this.httpClient.get(environment.apiUrl + 'Grievance/GetStandardConcern/' + SubjectCode, httpOptions);
  }

  GetAllStates() {
    const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) };
    return this.httpClient.get(environment.apiUrl + 'Master/GetAllState', httpOptions);
  }

  GetHistory() {
    const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) };
    return this.httpClient.get(environment.apiUrl + 'Master/GetHistory', httpOptions);
  }


  GetAllDistrict(StateID: string) {
    const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) };
    return this.httpClient.get(environment.apiUrl + 'Master/GetAllDistricts/' + StateID, httpOptions);
  }
  GetAllCity(StateID:any){
    const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) };
    return this.httpClient.get(environment.apiUrl + 'Master/GetAllCity/' + StateID, httpOptions);
  }

  GetAllDistrictvenu(StateVenuID: string) {
    const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) };
    return this.httpClient.get(environment.apiUrl + 'Master/GetAllDistricts/' + StateVenuID, httpOptions);
  }

  GetReligion() {
    const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) };
    return this.httpClient.get(environment.apiUrl + 'Master/GetReligion', httpOptions);
  }

  GetQualification() {
    const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) };
    return this.httpClient.get(environment.apiUrl + 'Master/GetQualification', httpOptions);
  }

  GetAllSectors() {
    const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) };
    return this.httpClient.get(environment.apiUrl + 'Master/GetAllSectors', httpOptions);
  }
  GetPrivacy() {
    const token = this.config.UserInfo.token;
    const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': token }) };
    return this.httpClient.get(environment.apiUrl + 'Master/GetPrivacy', httpOptions);
  }


  GetAllTrade(SectorID: string) {
    const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) };
    return this.httpClient.get(environment.apiUrl + 'Master/GetAllTrades/' + SectorID, httpOptions);
  }
  GetScheme() {
    const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) };
    return this.httpClient.get(environment.apiUrl + 'Master/GetScheme', httpOptions);
  }
  GetTrainingCenter(StateID: any, DistrictID: any, TCNature: string) {
    const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) };
    return this.httpClient.get(environment.apiUrl + 'Master/GetTrainingCenter/' + StateID + '/' + DistrictID + '/' + TCNature, httpOptions);
  }
  // End Grievance MAster
  GetAllCountry() {
    const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) };
    return this.httpClient.get(environment.apiUrl + 'Master/GetAllCountry', httpOptions);
  }

  GetTradByTC(TCID: any) {
  const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) };
    return this.httpClient.get(environment.apiUrl + 'Master/GetTradByTC/' + TCID, httpOptions);
  }
  // Get All Language
  GetAllLanguage() {
    //alert(environment.apiUrl);
    const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) };
    return this.httpClient.get(environment.apiUrl + 'Master/GetAllLanguage', httpOptions);
  }

  GetPhotosCategory() {
    const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) };
    return this.httpClient.get(environment.apiUrl + 'Master/GetPhotosCategory', httpOptions);
  }
  tslint
  SaveMyPhotoAlbum(objMyPhotoAlbum: FormData) {
    const token = sessionStorage.getItem('usertoken');
    const httpOptions = { headers: new HttpHeaders({ 'Authorization': token }) };
    return this.httpClient.post(environment.apiUrl + 'Master/SaveMyPhotoAlbum', objMyPhotoAlbum, httpOptions);
  }

  GetMyPhotoAlbum(ID: any) {
    const token = sessionStorage.getItem('usertoken');
   const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': token }) };
    return this.httpClient.get(environment.apiUrl + 'Master/GetMyPhotoAlbum/' + ID, httpOptions);
  }

  UpdateMyPhotoAlbum(objMyPhotoAlbum: FormData) {
    const token = sessionStorage.getItem('usertoken');
    const httpOptions = { headers: new HttpHeaders({ 'Authorization': token }) };
    return this.httpClient.post(environment.apiUrl + 'Master/UpdateMyPhotoAlbum', objMyPhotoAlbum, httpOptions);
  }

  DeleteCandAlbum(ID: any) {

    const token = sessionStorage.getItem('usertoken'); //this.config.UserInfo.token;
    const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': token }) };
    return this.httpClient.post(environment.apiUrl + 'Master/DeleteCandAlbum/' + ID, null, httpOptions);
  }
  DeletePhoto(ID: any) {

    const token = sessionStorage.getItem('usertoken'); //this.config.UserInfo.token;
    const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': token }) };
    return this.httpClient.post(environment.apiUrl + 'Master/DeletePhoto/' + ID, null, httpOptions);
  }
  // Get All Joining
  GetJoiningPrority() {
    //alert(environment.apiUrl);
    const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) };
    return this.httpClient.get(environment.apiUrl + 'Master/GetJoiningPriority', httpOptions);
  }
   // Get All Education
   GetAllMinEducation() {
    //alert(environment.apiUrl);
    const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) };
    return this.httpClient.get(environment.apiUrl + 'Master/GetEducation', httpOptions);
  }

  //AddJobId(jobopeningdetail:FormData) {
  //  //// ;
  //  const token = this.config.UserInfo.token;
  //  const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' , 'Authorization': token}) };
  //  return this.httpClient.post(environment.apiUrl + 'Job/SaveJobPosting',jobopeningdetail, httpOptions);
  //}
  //GetJobOpening(jobopeningdetail:any, JobId:any) {
  //  //alert(jobopeningdetail);
  //   const token = this.config.UserInfo.token;
  //   const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' , 'Authorization': token}) };
  //   return this.httpClient.post(environment.apiUrl + 'Job/SaveMultipleJobPosting/'+JobId,jobopeningdetail, httpOptions);
  // }
  // GetJobOpeningDetail(Jobid: any) {
  //  const token = this.config.UserInfo.token;
  //  const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' , 'Authorization': token}) };
  //  return this.httpClient.get(environment.apiUrl + 'Job/GetJobListDetails/' + Jobid, httpOptions);
  //}
  //GetAllJobs(JobId: any) {
  //  const token = this.config.UserInfo.token;
  //  const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' , 'Authorization': token}) };
  //  return this.httpClient.get(environment.apiUrl + 'Job/GetJobList/' + JobId, httpOptions);
  //}
  //GetAllIndustryArea() {
  //  //alert(environment.apiUrl);
  //  const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) };
  //  return this.httpClient.get(environment.apiUrl + 'User/GetAllIndustryArea', httpOptions);
  //}
  //GetAllFunctionalArea() {
  //  //alert(environment.apiUrl);
  //  const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) };
  //  return this.httpClient.get(environment.apiUrl + 'User/GetAllFunctionalArea', httpOptions);
  //}

  GetHiringLevel() {
    //alert(environment.apiUrl);
    const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) };
    return this.httpClient.get(environment.apiUrl + 'User/GetHiringLevel', httpOptions);
  }

  GetUserSkillDetails() {
    const token = sessionStorage.getItem('usertoken'); //this.config.UserInfo.token;
    const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' , 'Authorization': token}) };
    return this.httpClient.get(environment.apiUrl + 'User/GetUserSkillDetails/',httpOptions);
  }

  //UpdateJob(jobDetails:FormGroup)
  //{
  //  const token = this.config.UserInfo.token;
  //  const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' , 'Authorization': token}) };
  //  return this.httpClient.post(environment.apiUrl + 'Job/UpdateJobDetails' , jobDetails, httpOptions);
  //}
  //EditJobOpening(openingid: any)
  //{//alert(JSON.stringify(openingid));
  //  const token = this.config.UserInfo.token;
  //  //alert(token)
  //  const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' , 'Authorization': token}) };
  //  return this.httpClient.get(environment.apiUrl + 'job/GetJobOpeningDetailsById/' + openingid , httpOptions);
  //}
  //UpdateJobOpening(jobOpening:FormGroup)
  //{ //alert(JSON.stringify(jobOpening));
  //  const token = this.config.UserInfo.token;
  //  const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' , 'Authorization': token}) };
  //  return this.httpClient.post(environment.apiUrl + 'job/UpdateJobOpeningDetails', jobOpening , httpOptions);
  //}

  GetGender()
  {
    const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json'}) };
    return this.httpClient.get(environment.apiUrl + 'Master/GetGender', httpOptions);
  }
  GetAllFunctionArea() {
    const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) };
    return this.httpClient.get(environment.apiUrl + 'Master/GetAllFunctionalAreas', httpOptions);
  }
  GetAllIndustryArea() {
    const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) };
    return this.httpClient.get(environment.apiUrl + 'Master/GetAllIndustryAreas', httpOptions);
  }

  GetJobStatics() {
    const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) };
    return this.httpClient.get(environment.apiUrl + 'Dashboard/GetJobStatics', httpOptions);
  }
  GetCompaniesList() {
    const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) };
    return this.httpClient.get(environment.apiUrl + 'Dashboard/GetCompaniesList', httpOptions);
  }
  StatsJobsByCategories() {
    const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) };
    return this.httpClient.get(environment.apiUrl + 'Dashboard/DashsboardStatsJobsByCategories', httpOptions);
  }


//   this.Searchjobs.FunctionAreaId = this.FunctionAreaSelecteds.id;
//this.Searchjobs.IndustryAreaId = this.IndustryAreaSelecteds.id;
//this.Searchjobs.StatesId = this.StatesSelecteds.id;
//this.Searchjobs.DistrictId = 0;

 objSearchjobs: any = {
   FunctionAreaId: 0,
   IndustryAreaId: 0,
   StatesId: 0,
   DistrictId: 0,
   minExp:0,
   maxExp:0,
   minCtc:0,
   maxCtc:0,
};

  SearchJobHome(PageNumber: number, objSearchjobs: any) {
    //const token = this.config.UserInfo.token;
    const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) };
    return this.httpClient.post(environment.apiUrl + 'job/SearchJobHome/' + PageNumber, objSearchjobs, httpOptions);
  }
  GetHomeJobDetails(jobid: number) {
    //const token = this.config.UserInfo.token;
    const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) };
    return this.httpClient.get(environment.apiUrl + 'job/GetHomeJobDetails/' + jobid, httpOptions);
  }
  getsubscribeJobDetails(jobid: number) {
    const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) };
    return this.httpClient.get(environment.apiUrl + 'job/DashboardSearchJobHome/' + jobid, httpOptions);
  }

  GetAllSectorsys() {
    const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) };
    return this.httpClient.get(environment.ysUrl + 'Master/GetAllSectors', httpOptions);
  }
  GetAllTrades(tradeid:any) {
    const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) };
    return this.httpClient.get(environment.ysUrl + 'Master/GetAllTrades/' + tradeid, httpOptions);
  }

  GetEmpDashboardValue(){
    const token =sessionStorage.getItem('usertoken'); // this.config.UserInfo.token;
    const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' , 'Authorization': token}) };
    return this.httpClient.get(environment.apiUrl + 'Dashboard/GetEmpDashBoard',httpOptions );
  }

  GetPlaceddata(data){
    const token =sessionStorage.getItem('usertoken'); // this.config.UserInfo.token;
    const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' , 'Authorization': token}) };
    return this.httpClient.post(environment.apiUrl + 'Dashboard/GetDashboardCntPlacedCandidate',null,httpOptions );
  }

  GetPlaceddataList(jobid){
    const token =sessionStorage.getItem('usertoken'); // this.config.UserInfo.token;
    const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' , 'Authorization': token}) };
    return this.httpClient.get(environment.apiUrl + 'Dashboard/GetDashboardPlacedCandidateList/'+jobid,httpOptions );
  }

GetDashboardPlacedCandidateList
  sendFeedback(feedbackDetails:any){
    //const token = "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJ0ZXN0MTIzIiwianRpIjoiNDY2MTQyMGYtOTljNy00NDVmLTljMDktODI1YzZiZGZiOTk1IiwiTWVtYmVyc2hpcElkIjoiMCIsIlVzZXJuYW1lIjoidGVzdDEyMyIsImV4cCI6MTU0ODgzNDU0MiwiaXNzIjoiRml2ZXIuU2VjdXJpdHkuQmVhcmVyIiwiYXVkIjoiRml2ZXIuU2VjdXJpdHkuQmVhcmVyIn0.eNT62UFNzVGg4jdu17KEurZPNtI-9bgMBSapWYDpDsY";
    const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json'}) };
    return this.httpClient.post(environment.apiUrl + 'RojgaarAdmin/SetNewUserFeedback', feedbackDetails,httpOptions);
  }

  sendFeedbackWithLogin(feedbackDetails:any){
    const token = sessionStorage.getItem('usertoken'); //this.config.UserInfo.token;
    const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json','Authorization': token}) };
    return this.httpClient.post(environment.apiUrl + 'RojgaarAdmin/SetUserFeedback', feedbackDetails,httpOptions);
  }



    SendYuvaSandesh(PushSandesh:any){
      const token = sessionStorage.getItem('usertoken'); //this.config.UserInfo.token;
      const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json','Authorization': token}) };
      return this.httpClient.post(environment.apiUrl + 'YuvaSandesh/SetYuvaSandesh',PushSandesh,httpOptions);
    }


    // save user logs

    userLogInfo:any
    myIp:any;
    userLog:any

    saveUserLogs(description:any,moduleName:any){
      const token = sessionStorage.getItem('usertoken');
      this.userLogInfo = JSON.parse(localStorage.getItem('userLogs'));
      var lat     =      localStorage.getItem('lat');
      var lang    =      localStorage.getItem('lang');
      this.http.get('https://jsonip.com/').subscribe(data => {
        var res =data["_body"];
        this.myIp=  JSON.parse(res).ip // get ip
        this.userLog = {
          'IpAddress': this.myIp ? this.myIp : '0',
          'Latitude':  lat ? lat : '0',
          'Lognitude': lang ? lang : '0',
          'Logintime': this.userLogInfo.loginTime,
          'LoginType': this.userLogInfo.loginType,
          'ModuleName': moduleName,
          'Description': environment.apiUrl+description,
      }

      const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json','Authorization': token}) };
       return this.httpClient.post(environment.apiUrl + 'User/UserLogs', this.userLog,httpOptions);
     })
    }

    GetYuvaSandeshList(){
      const token = sessionStorage.getItem('usertoken'); //this.config.UserInfo.token;
      const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' , 'Authorization': token}) };
      return this.httpClient.get(environment.apiUrl + 'YuvaSandesh/GetYuvaSandesh',httpOptions );
    }


    UpdateYuvaSandesh(PushSandesh:any){
      const token = sessionStorage.getItem('usertoken'); //this.config.UserInfo.token;
      const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' , 'Authorization': token}) };
      return this.httpClient.post(environment.apiUrl + 'YuvaSandesh/UpdateYuvaSandesh',PushSandesh,httpOptions );
    }

    SetUploadImage(MultiImage:any){
      const token = sessionStorage.getItem('usertoken'); //this.config.UserInfo.token;
      const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' , 'Authorization': token}) };
      return this.httpClient.post(environment.apiUrl + 'YuvaSandesh/SetYuvaSandesh',MultiImage,httpOptions );
    }

    GetAllZone() {
      const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) };
      return this.httpClient.get(environment.apiUrl + 'Master/GetAllZone/', httpOptions);
    }

    GetAllRegion(zoneid:any) {
      const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) };
      return this.httpClient.get(environment.apiUrl + 'Master/GetAllRegion/'+zoneid, httpOptions);
    }

    GetAllSubRegion(zoneid:any,regionid:any) {
      const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) };
      return this.httpClient.get(environment.apiUrl + 'Master/GetAllSubRegion/'+zoneid+'/'+regionid, httpOptions);
    }

    GetVerifiedCompanyEmployerList() {
      const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) };
      return this.httpClient.get(environment.apiUrl + 'RojgaarAdmin/GetVerifiedCompanyEmployerList/', httpOptions);
    }

    getuserInfoAfterUpdate(){
      const token = sessionStorage.getItem('usertoken'); //this.config.UserInfo.token;
      const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' , 'Authorization': token}) };
      return this.httpClient.get(environment.apiUrl + 'Account/GetUserDetails', httpOptions);
    }


    GetAllMrigsSector() {
      const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) };
      return this.httpClient.get(environment.apiUrl + 'MrigsRojgaar/GelAllSector', httpOptions);
    }
    GetAllMrigsTrade(tradeid:any) {
      const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) };
      return this.httpClient.get(environment.apiUrl + 'MrigsRojgaar/GetAllTrade/' + tradeid, httpOptions);
    }

    GetAllPia(){

      const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) };
      return this.httpClient.get(environment.apiUrl + 'MrigsRojgaar/GetPia/' , httpOptions);

    }

    // Get Server Date and time
    GetServerDateTime(){
      const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json'}) };
      return this.httpClient.get(environment.apiUrl + 'Master/GetSysCurrentDate', httpOptions);
    }

    public exportAsExcelFile(json: any[], excelFileName: string): void {

      const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(json);
      console.log('worksheet',worksheet);
      const workbook: XLSX.WorkBook = { Sheets: { 'data': worksheet }, SheetNames: ['data'] };
      const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
      //const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'buffer' });
      this.saveAsExcelFile(excelBuffer, excelFileName);
    }

    private saveAsExcelFile(buffer: any, fileName: string): void {
      const data: Blob = new Blob([buffer], {
        type: EXCEL_TYPE
      });
      FileSaver.saveAs(data, fileName + '_export_' + new Date().getTime() + EXCEL_EXTENSION);
    }

    // Api for all Preference by neeraj singh
    GetAllPreference(){
      const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json'}) };
      return this.httpClient.get(environment.apiUrl + 'Master/GetAllPreference', httpOptions);
    }

    GetNdscMessageByComapnyId(){
      const token = sessionStorage.getItem('usertoken'); 
      const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' , 'Authorization': token}) };
      return this.httpClient.get(environment.apiUrl + 'YuvaSandesh/GetNdscMessageByComapnyId', httpOptions);
    }

    DeleteNdscMessage(sandeshid:any){
      const token = sessionStorage.getItem('usertoken');
      const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' , 'Authorization': token}) };
      return this.httpClient.get(environment.apiUrl + 'YuvaSandesh/DeleteNdscMessage/' + sandeshid, httpOptions);
    
    }

    GetFeedbackType(){
      const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json'}) };
      return this.httpClient.get(environment.apiUrl + 'RojgaarAdmin/GetFeedbackType', httpOptions);
    }


}
