import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class ScreeningQuestionService {
  token:any;
  constructor(private httpClient: HttpClient) { 
 
  }

getGroupList(){
  const token = sessionStorage.getItem('usertoken');
  const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': token }) };
  return this.httpClient.get(environment.apiUrl + 'UserQuestionsAns/Getquestiongroup', httpOptions);
}

getQuestionListByGroup(groupID:any){
  const token = sessionStorage.getItem('usertoken');
  const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': token }) };
  return this.httpClient.get(environment.apiUrl + 'InterviewSchedule/GetInterviewJobList/'+ groupID , httpOptions);
}

setScreeningQuestion(questionObj){ 
  const token = sessionStorage.getItem('usertoken');
  const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': token }) };
  return this.httpClient.post(environment.apiUrl + 'UserQuestionsAns/SetMastergroup', questionObj, httpOptions);
} 
  
getscreeningQuestion(Groupid: any) {  
  const token = sessionStorage.getItem('usertoken');
  const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': token }) };
  return this.httpClient.get(environment.apiUrl + 'UserQuestionsAns/Getquestionlist/' + Groupid , httpOptions);
}

addUpdateQuestion(questionObject){
  const token = sessionStorage.getItem('usertoken');
  const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': token }) };
  return this.httpClient.post(environment.apiUrl + 'UserQuestionsAns/SetMastergroup', questionObject, httpOptions);

}
saveGroup(groupObject){
  const token = sessionStorage.getItem('usertoken');
  const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': token }) };
  return this.httpClient.post(environment.apiUrl + 'UserQuestionsAns/Setgroup', groupObject, httpOptions);

}

activeDeactiveQuestion(obj){
  const token = sessionStorage.getItem('usertoken');
  const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': token }) };
  return this.httpClient.post(environment.apiUrl + 'UserQuestionsAns/Groupstatuschange', obj, httpOptions);

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


GetActivequestionlist(Groupid: any) {  
  
  const token = sessionStorage.getItem('usertoken');
  const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': token }) };
  return this.httpClient.get(environment.apiUrl + 'UserQuestionsAns/GetActivequestionlist/' + Groupid , httpOptions);
}

getGrouponlyHaveQuestionlist(){
  const token = sessionStorage.getItem('usertoken');
  const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': token }) };
  return this.httpClient.get(environment.apiUrl + 'UserQuestionsAns/GetGroupName', httpOptions);
}

}
