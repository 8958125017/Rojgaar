import { Component, OnInit} from '@angular/core';
import { AppConfig } from '../../Globals/app.config';
@Component({
  selector: 'app-jobcardComponent',
  templateUrl: './jobcard.component.html',
})
export class JobcardComponent implements OnInit {
  UserInfo  : any; 
  jobDetail : any; 
  JobCard   : boolean=true;
  constructor(public appConfig : AppConfig){
    this.UserInfo = appConfig.UserInfo    
  }
  setJobcardValue(jobdata :any){    
    this.JobCard=true;
    this.jobDetail=jobdata
  }
  hideJobcard(){
    this.JobCard=false;
  }
  ngOnInit() {  
  }
}
@Component({
  selector: 'app-jobcardComponent',
  templateUrl: './jobcard.component.html',
})
export class JobcardforApplicationReceived implements OnInit {
  UserInfo : any; 
  jobDetail : any; 
  JobCard   : boolean=false;
  constructor(public appConfig : AppConfig){
    this.UserInfo = appConfig.UserInfo    
  }
  setJobcardValue(jobdata :any){   
    
    this.JobCard=true;
    this.jobDetail=jobdata
    
  }
  hideJobcard(){
    this.JobCard=false;
  }
  ngOnInit() {  
  }
}
// @Component({
//  selector: 'app-jobcardComponent',
//  templateUrl: './jobcard.component.html',
// })
// export class JobcardforCandidateScreening implements OnInit {
//  UserInfo : any; 
//  jobDetail : any; 
//  JobCard   : boolean=false;
//  constructor(public appConfig : AppConfig){
//    this.UserInfo = appConfig.UserInfo    
//  }
//  setJobcardValue(jobdata :any){   
    
//    this.JobCard=true;
//    this.jobDetail=jobdata
    
//  }
//  hideJobcard(){
//    this.JobCard=false;
//  }
//  ngOnInit() {  
//  }
// }

