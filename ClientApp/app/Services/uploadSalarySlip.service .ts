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
export class UploadSalarySlipService {
  token:any;
  constructor(private httpClient: HttpClient, private http: Http, private config: AppConfig) { }


  // get candidate list

  GetCandidateSearchOpenDatabase(candidateInfo:any) {    
    const token = sessionStorage.getItem('usertoken');
    const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json','Authorization': token }) };
    return this.httpClient.post(environment.apiUrl + 'CandidateUploadsalary/CandidateSearchInfo',candidateInfo, httpOptions).pipe(
      retry(3)     
    );;
  }

  // get candidate personal info
  GetCandidatePersonalinfo(candiId:any){    
    const token = sessionStorage.getItem('usertoken');
    
    const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json','Authorization': token }) };
    return this.httpClient.get(environment.apiUrl + 'Candidate/GetEmpCandidatePersonalinfo/' + candiId, httpOptions).pipe(
      retry(3)     
    );
  }

  // upload salary slip

  uploadSalarySlip(uploadDocumentInformation:any){
    
    const token = sessionStorage.getItem('usertoken');
    const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json','Authorization': token }) };
    return this.httpClient.post(environment.apiUrl + 'Candidate/UploadCandidateSlip',uploadDocumentInformation, httpOptions).pipe(
      retry(6)     
    );
  }


  GetCandidateDocument(candidateID:any) {
    
    const token = sessionStorage.getItem('usertoken');
    const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json','Authorization': token }) };
    return this.httpClient.get(environment.apiUrl + 'Candidate/GetCandidateDocument/' + candidateID, httpOptions).pipe(
      retry(3)     
    );
   }


   DeletSalarySlip(postData: any):Observable<any> {     
   const token = sessionStorage.getItem('usertoken');        
   const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': token }) };
   return this.httpClient.post(environment.apiUrl + 'RojgaarCommon/SetData',postData, httpOptions);
 }
  
  CandidatePersonalinfo(candidatePersonalinfo:any){ 
    const token = sessionStorage.getItem('usertoken');
    // const token = this.config.UserInfo.token;
    const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json','Authorization': token }) };
    return this.httpClient.post(environment.apiUrl + 'CandidateUploadsalary/CandidateSearchInfo', candidatePersonalinfo,httpOptions);
    //alert(JSON.stringify(httpOptions));

  }

  CandidateLanguageinfo(candidateLanguageinfo:any){
    const token = sessionStorage.getItem('usertoken');
       // const token = this.config.UserInfo.token;
    const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json','Authorization': token  }) };
    return this.httpClient.post(environment.apiUrl + 'Candidate/SetCandidateLanguage', candidateLanguageinfo,httpOptions);
  }


  AddressInfo(AddressInfo:any){
    const token = sessionStorage.getItem('usertoken');
    // const token = this.config.UserInfo.token;
    const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': this.config.UserInfo.token }) };
    return this.httpClient.post(environment.apiUrl + 'Candidate/SetEmployeeAddress', AddressInfo,httpOptions);
  }
  
  FamilyInfo(familyinfo:any){
    const token = sessionStorage.getItem('usertoken');
       // const token = this.config.UserInfo.token;
    const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': this.config.UserInfo.token }) };
    return this.httpClient.post(environment.apiUrl + 'Candidate/SetFamilyDetails', familyinfo,httpOptions);
  }
  
  HobbiesInfo(hobbiesItem:any){
    const token = sessionStorage.getItem('usertoken');
    // const token = this.config.UserInfo.token;
    const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': this.config.UserInfo.token }) };
    return this.httpClient.post(environment.apiUrl + 'Candidate/SetEmpAreaOfIntrest', hobbiesItem,httpOptions);
  }
  
  WorkExperience(workExperience:any){
    const token = sessionStorage.getItem('usertoken');
    // const token = this.config.UserInfo.token;
    const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': this.config.UserInfo.token }) };
    return this.httpClient.post(environment.apiUrl + 'Candidate/SetEmpWorkExperience', workExperience,httpOptions);
  }

  EducationalQualification(educationalQualification:any){
    const token = sessionStorage.getItem('usertoken');
       // const token = this.config.UserInfo.token;
    const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': this.config.UserInfo.token }) };
    return this.httpClient.post(environment.apiUrl + 'Candidate/SetEmpEdutnQualifictin', educationalQualification,httpOptions);
  }

  Certification(certification:any){
    const token = sessionStorage.getItem('usertoken');
    // const token = this.config.UserInfo.token;
    const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': this.config.UserInfo.token }) };
    return this.httpClient.post(environment.apiUrl + 'Candidate/SetEmpCertification', certification,httpOptions);
  }

  GetAllRelation(){
    const token = sessionStorage.getItem('usertoken');
    // const token = this.config.UserInfo.token;
    const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json','Authorization': token}) };
    return this.httpClient.get(environment.apiUrl + 'Candidate/GetAllRelation',httpOptions);
  }

  SetCandidateLanguage(){
    const token = sessionStorage.getItem('usertoken');
    // const token = this.config.UserInfo.token;
    const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': token}) };
    return this.httpClient.get(environment.apiUrl + 'Candidate/SetCandidateLanguage',httpOptions);
  }

  GetAllReligions(){
    const token = sessionStorage.getItem('usertoken');
    // const token = this.config.UserInfo.token;
    const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': token}) };
    return this.httpClient.get(environment.apiUrl + 'Candidate/GetAllReligions',httpOptions);
  }

  GetAllCandidateDetails(PageNumber:any){
    
    const token = sessionStorage.getItem('usertoken');
       // const token = this.config.UserInfo.token;
    const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': token}) };
    return this.httpClient.get(environment.apiUrl + 'Candidate/GetAllCandidateDetails/'+ PageNumber,httpOptions);
  }
  
  GetEmpCandidatePersonalinfo(CANDID: string) {
    const token = sessionStorage.getItem('usertoken');
       // const token = this.config.UserInfo.token;
    const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json','Authorization': token }) };
    return this.httpClient.get(environment.apiUrl + 'Candidate/GetEmpCandidatePersonalinfo/' + CANDID, httpOptions);
  }

  GetEmployeeAddress(CANDID: string) {
    const token = sessionStorage.getItem('usertoken');
    // const token = this.config.UserInfo.token;
    const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json','Authorization': token }) };
    return this.httpClient.get(environment.apiUrl + 'Candidate/GetEmployeeAddress/' + CANDID, httpOptions);
  }

  GetFamilyDetails(CANDID: string) {
    const token = sessionStorage.getItem('usertoken');
    // const token = this.config.UserInfo.token;
    const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json','Authorization': token }) };
    return this.httpClient.get(environment.apiUrl + 'Candidate/GetFamilyDetails/' + CANDID, httpOptions);
  }

  GetCandidateLanguage(CANDID: string) {
    const token = sessionStorage.getItem('usertoken');
    // const token = this.config.UserInfo.token;
    const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json','Authorization': token }) };
    return this.httpClient.get(environment.apiUrl + 'Candidate/GetCandidateLanguage/' + CANDID, httpOptions);
  }

  GetEmpAreaOfIntrest(CANDID: string) {
    const token = sessionStorage.getItem('usertoken');
    // const token = this.config.UserInfo.token;
    const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json','Authorization': token }) };
    return this.httpClient.get(environment.apiUrl + 'Candidate/GetEmpAreaOfIntrest/' + CANDID, httpOptions);
  }

  GetEmpWorkExperience(CANDID: string) {
    const token = sessionStorage.getItem('usertoken');
       // const token = this.config.UserInfo.token;
    const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json','Authorization': token }) };
    return this.httpClient.get(environment.apiUrl + 'Candidate/GetEmpWorkExperience/' + CANDID, httpOptions);
  }
  GetEmpCertification(CANDID: string) {
    const token = sessionStorage.getItem('usertoken');
    // const token = this.config.UserInfo.token;
    const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json','Authorization': token }) };
    return this.httpClient.get(environment.apiUrl + 'Candidate/GetEmpCertification/' + CANDID, httpOptions);
  }

  GetEmpEdutnQualifictin(CANDID: string) {
    const token = sessionStorage.getItem('usertoken');
       // const token = this.config.UserInfo.token;
    const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json','Authorization': token }) };
    return this.httpClient.get(environment.apiUrl + 'Candidate/GetEmpEdutnQualifictin/' + CANDID, httpOptions);
  }
  DeleteEmpCandidateLang(langID: string) {
    const token = sessionStorage.getItem('usertoken');
       // const token = this.config.UserInfo.token;
    const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json','Authorization': token }) };
    return this.httpClient.post(environment.apiUrl + 'Candidate/DeleteEmpCandidateLang/'+ langID,null, httpOptions);
  }
  DeleteEmpCandidateAreaOfInterest(interestID: string) {
    const token = sessionStorage.getItem('usertoken');
    // const token = this.config.UserInfo.token;
    const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json','Authorization': token }) };
    return this.httpClient.post(environment.apiUrl + 'Candidate/DeleteEmpCandidateAreaOfInterest/'+interestID,null, httpOptions);
  }

  DeleteEmpCandidate(candidateID: string) {
    const token = sessionStorage.getItem('usertoken');
       // const token = this.config.UserInfo.token;
    const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json','Authorization': token }) };
    return this.httpClient.post(environment.apiUrl + 'Candidate/DeleteEmpCandidate/'+candidateID,null, httpOptions);
  }
  DeleteEmpCertification(certificateID: string) {
    const token = sessionStorage.getItem('usertoken');
    // const token = this.config.UserInfo.token;
    const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json','Authorization': token }) };
    return this.httpClient.post(environment.apiUrl + 'Candidate/DeleteEmpCertification/'+certificateID,null, httpOptions);
  }
  DeleteEmpEducationQualification(educationID: string) {
    const token = sessionStorage.getItem('usertoken');
       // const token = this.config.UserInfo.token;
    const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json','Authorization': token }) };
    return this.httpClient.post(environment.apiUrl + 'Candidate/DeleteEmpEducationQualification/'+educationID,null, httpOptions);
  }
DeleteEmpCandidateWorkExp(workexpID: string) {
  const token = sessionStorage.getItem('usertoken');
  // const token = this.config.UserInfo.token;
  const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json','Authorization': token }) };
  return this.httpClient.post(environment.apiUrl + 'Candidate/DeleteEmpCandidateWorkExp/'+workexpID,null, httpOptions);
}

DeleteEmpCandidateFamilyDetails(familyID: string) {
  const token = sessionStorage.getItem('usertoken');
  // const token = this.config.UserInfo.token;
  const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json','Authorization': token }) };
  return this.httpClient.post(environment.apiUrl + 'Candidate/DeleteEmpCandidateFamilyDetails/'+familyID,null, httpOptions);
}
SearchFriendForRojgaar(candidatevalue:any) {
  //alert(candidatevalue);
  const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) };
  return this.httpClient.post(environment.ysUrl + 'Friend/SearchFriendForRojgaar',candidatevalue, httpOptions); 
}

GetCandidateSearchMyDatabase(candidateID:any) {
  const token = sessionStorage.getItem('usertoken');
       // const token = this.config.UserInfo.token;
  const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json','Authorization': token  }) };
  return this.httpClient.post(environment.apiUrl + 'Candidate/GetCandidateSearchMyDatabase/', candidateID, httpOptions);
}

GetCandidateSearchRegisteredPool(candidateID:any) {
  const token = sessionStorage.getItem('usertoken');
  // const token = this.config.UserInfo.token;
  const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json','Authorization': token  }) };
  return this.httpClient.post(environment.apiUrl + 'Candidate/GetCandidateSearchRegisteredPool/',candidateID, httpOptions);
}

GetProfileDetailsForYS(candidateID:any) {
  const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json'}) };
  return this.httpClient.get(environment.ysUrl + 'Rojgaar/GetProfileDetailsForRojgaar/' + candidateID, httpOptions);
}

GetTrainingCenter(stateid:any,districID:any) {
  const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json'}) };
  return this.httpClient.get(environment.ysUrl + 'Rojgaar/GetTrainingCenter/'+ stateid +'/'+ districID, httpOptions);
}


DdgkuCandidateDetail(candidateID:any) {
  const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json'}) };
  return this.httpClient.get(environment.apiUrl + 'Candidate/ViewRojgaarCandidateDetail/' + candidateID, httpOptions);
}
mydatabaseCandidateDetail(candidateID:any) {
  const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json'}) };
  return this.httpClient.get(environment.apiUrl + 'Candidate/ViewRojgaarCandeSeMyDatase/' + candidateID, httpOptions);
}
registerpollCandidateDetail(candidateID:any) {
  const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json'}) };
  return this.httpClient.get(environment.apiUrl + 'Candidate/ViewRojgaarCandateRegiredPool/' + candidateID, httpOptions);
}

ViewMrigsCandidateDetail(candidateID:any) {
  const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json'}) };
  return this.httpClient.get(environment.apiUrl + 'Candidate/ViewMrigsCandidateDetail/' + candidateID +'/CandidateInfo', httpOptions);
}
/////// special cases ////////////////
GetMrigsCandidateDetails(candidateID:any) {
  const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json'}) };
  return this.httpClient.get(environment.apiUrl + 'Candidate/GetMrigsCandidateDetails/' + candidateID, httpOptions);
}
/////////////////
ViewMrigsCandidateLanguageDetail(candidateID:any) {
  const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json'}) };
  return this.httpClient.get(environment.apiUrl + 'Candidate/ViewMrigsCandidateDetail/' + candidateID +'/Language', httpOptions);
}

ViewMrigsCandidateAddressDetail(candidateID:any) {
  const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json'}) };
  return this.httpClient.get(environment.apiUrl + 'Candidate/ViewMrigsCandidateDetail/' + candidateID +'/Address', httpOptions);
}

ViewMrigsCandidateFamilyDetail(candidateID:any) {
  const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json'}) };
  return this.httpClient.get(environment.apiUrl + 'Candidate/ViewMrigsCandidateDetail/' + candidateID +'/Family', httpOptions);
}

ViewMrigsCandidateInterestDetail(candidateID:any) {
  const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json'}) };
  return this.httpClient.get(environment.apiUrl + 'Candidate/ViewMrigsCandidateDetail/' + candidateID +'/Interest', httpOptions);
}

ViewMrigsCandidateExperienceDetail(candidateID:any) {
  const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json'}) };
  return this.httpClient.get(environment.apiUrl + 'Candidate/ViewMrigsCandidateDetail/' + candidateID +'/Experience', httpOptions);
}

ViewMrigsCandidateInteresteDetail(candidateID:any) {
  const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json'}) };
  return this.httpClient.get(environment.apiUrl + 'Candidate/ViewMrigsCandidateDetail/' + candidateID +'/Interest', httpOptions);
}

ViewMrigsCandidateEducationDetail(candidateID:any) {
  const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json'}) };
  return this.httpClient.get(environment.apiUrl + 'Candidate/ViewMrigsCandidateDetail/' + candidateID +'/Education', httpOptions);
}

ViewMrigsCandidateCertificateDetail(candidateID:any) {
  const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json'}) };
  return this.httpClient.get(environment.apiUrl + 'Candidate/ViewMrigsCandidateDetail/' + candidateID +'/Certificate', httpOptions);
}

PartnerInfo(candidateID:any) {
 // const token = sessionStorage.getItem('usertoken');
    const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json'}) };
 return this.httpClient.get(environment.apiUrl + 'Candidate/ViewMrigsCandidateDetail/' + candidateID+'/PartnerInfo', httpOptions);
 }
 trainingPartner(candidateID:any) {
  //const token = sessionStorage.getItem('usertoken');
    const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json'}) };
 return this.httpClient.get(environment.apiUrl + 'Candidate/ViewMrigsCandidateDetail/' + candidateID+'/TrainingInformation', httpOptions);
 }
////////////////////////////////////
ViewYSCandidateDetail(candidateID:any) {
  const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json'}) };
  return this.httpClient.get(environment.ysUrl + 'Rojgaar/ViewYSCandidateDetail/' + candidateID +'/CandidateDetail', httpOptions);
}

ViewYSCandidateLanguageDetail(candidateID:any) {
  const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json'}) };
  return this.httpClient.get(environment.ysUrl + 'Rojgaar/ViewYSCandidateDetail/' + candidateID +'/Language', httpOptions);
}

ViewYSCandidateAddressDetail(candidateID:any) {
  const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json'}) };
  return this.httpClient.get(environment.ysUrl + 'Rojgaar/ViewYSCandidateDetail/' + candidateID +'/Address', httpOptions);
}

ViewYSCandidateFamilyDetail(candidateID:any) {
  const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json'}) };
  return this.httpClient.get(environment.ysUrl + 'Rojgaar/ViewYSCandidateDetail/' + candidateID +'/Family', httpOptions);
}

ViewYSCandidateInterestDetail(candidateID:any) {
  const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json'}) };
  return this.httpClient.get(environment.ysUrl + 'Rojgaar/ViewYSCandidateDetail/' + candidateID +'/Intrest', httpOptions);
}

ViewYSCandidateExperienceDetail(candidateID:any) {
  const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json'}) };
  return this.httpClient.get(environment.ysUrl + 'Rojgaar/ViewYSCandidateDetail/' + candidateID +'/Experience', httpOptions);
}

ViewYSCandidateEducationDetail(candidateID:any) {
  const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json'}) };
  return this.httpClient.get(environment.ysUrl + 'Rojgaar/ViewYSCandidateDetail/' + candidateID +'/Education', httpOptions);
}

ViewYSCandidateCertificationetail(candidateID:any) {
  const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json'}) };
  return this.httpClient.get(environment.ysUrl + 'Rojgaar/ViewYSCandidateDetail/' + candidateID +'/Certification', httpOptions);
}

GetAllSector() {
 const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) };
return this.httpClient.get(environment.apiUrl + 'MrigsRojgaar/GelAllSector', httpOptions);
}

GetJoiningConfermedCandidate(candidateID:any) {
  const token = sessionStorage.getItem('usertoken');
  const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json','Authorization': token  }) };
  return this.httpClient.post(environment.apiUrl + 'Candidate/GetJoiningConfermedCandidate/',candidateID, httpOptions);
}
GetCandidateDocumentType() {
  const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) };
 return this.httpClient.get(environment.apiUrl + 'Master/GetCandidateDocumentType', httpOptions);
 }
 
 SaveCandidateDocument(candiadtedata:any)
 {
  const token = sessionStorage.getItem('usertoken');
  const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json','Authorization': token  }) };
  return this.httpClient.post(environment.apiUrl + 'Candidate/SetCandidateDocument/',candiadtedata, httpOptions);
 }


 GetPiaDetail(JobId:any,JobOpeningId:any,CandidateID:any) {
  //const token = sessionStorage.getItem('usertoken');
const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json'}) };
 return this.httpClient.get(environment.apiUrl + 'Job/GetPiaDetail/' + JobId+'/'+JobOpeningId+'/'+CandidateID, httpOptions);
 }
 
}

