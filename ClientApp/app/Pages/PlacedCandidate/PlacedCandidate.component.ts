import { Component, OnInit, ViewChild, Output, EventEmitter, TemplateRef} from '@angular/core';
import { Http } from '@angular/http';
import { AuthenticationService } from '../../Services/authenticate.service';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
import { ToastrService, } from 'ngx-toastr';
import { MasterService } from '../../Services/master.service';
import { CommonViewLayoutComponent } from '../CommonModelView/CommonView-Layout.Component';
import { CandidateService } from '../../Services/candidate.service';
import { AppConfig } from '../../Globals/app.config';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { Subject } from 'rxjs';
import { InterviewService } from '../../Services/interview.service';
import {ExcelService} from '../../Services/excel.service';
import { JobpostService } from '../../Services/jobpost.service';




@Component({

// tslint:disable-next-line: component-selector
  selector: 'PlacedCandidateComponent',
  templateUrl: './PlacedCandidate.component.html',
})

export class PlacedCandidateComponent implements OnInit {
  dtOptions: DataTables.Settings = {};
  dtTrigger = new Subject<any>();
  DbResponse: any = [];
  UserInfo: any;
  OfferletterDetail: any = [];

  logintype: any;
  @ViewChild(CommonViewLayoutComponent) private mymodel: CommonViewLayoutComponent;
  @Output() clicked = new EventEmitter<string>();

  constructor(
    private http: Http,
    private router: Router,
    private spinnerService: Ng4LoadingSpinnerService,
    private authenticationService: AuthenticationService,
    private candidateService: CandidateService,
    private toastrService: ToastrService,
    private forgotPasswordBuilder: FormBuilder,
    private activatedRoute: ActivatedRoute,
    private updatePasswordBuilder: FormBuilder,
    private formBuilder: FormBuilder,
    public appConfig: AppConfig,
    private config: AppConfig,
    private modalService: BsModalService,
    private masterService: MasterService,
    private interviewService: InterviewService,
    private excelService: ExcelService,
    private route : ActivatedRoute,
    private JobpostService : JobpostService

  ) {
    try {
      this.UserInfo = appConfig.UserInfo;
      this.logintype = this.UserInfo.loginType;
    } catch  { }
    this.appConfig.isverified();
   }
   postdata:any;
  ngOnInit() {
    this.postdata = this.route.snapshot.paramMap.get('postdata');
    
    if(this.postdata=='JobPost'){
      this.GetDashboardJobpostDetail();
    }else if(this.postdata=='PlacedCand'){
      this.GetPlacedCandidate();
    }else if(this.postdata=='applicantReciept'){
      this.GetDashboardApplicationsRecieved();
    }else if(this.postdata=='totalscheduldinterview'){
      this.GetDashboardInterviewScheduleList();
    }else if(this.postdata=='registeredcandidate'){
      this.GetDashboardRegistrationReceived();
    } 
}
/*********************************************
   List of placed candidate by neeraj Singh
 ********************************************/
 PlacedCandidate: any = [];
 GetPlacedCandidate() {
 
  this.spinnerService.show();
    this.candidateService.GetPlacedCandidate().subscribe(res => {
      this.DbResponse = res;
      if (this.DbResponse != null) {
        this.spinnerService.hide();
        this.PlacedCandidate = this.DbResponse.objPlacedresponse;       

      }


    });
  }

   /***********************************************************
   View placed candidate using CommonModelView by neeraj Singh
   ************************************************************/
  viewcandidateProfile(candiID: any, apitype: any) {
    this.mymodel.callMethod(candiID, apitype);
  }

  /**********************************
   View offer letter by neeraj Singh
  ***********************************/
  modalRefForOffer: BsModalRef;
  GetOfferLetterDetail(jobId: any, interviewId: any, CandId: any, template6: TemplateRef<any>) {
    this.modalRefForOffer = this.modalService.show(template6,
      { backdrop: 'static', keyboard: false });
    try {
      this.interviewService.getCandidateOfferLetterDetail(jobId, interviewId, CandId).subscribe(res => {
        this.DbResponse = res
        if (this.DbResponse != null) {
          this.OfferletterDetail = this.DbResponse.lstCandidateOfferLette[0];
        }
      });
    } catch  { }
  }
  /************************
   close offer letter modal
  *************************/
  CloseOfferLetter() {
    this.modalRefForOffer.hide();
  }
  PlacedCandidateForExport:any=[];
  ExcelExport()
  {
    var exportCanDetail;
    for (let j = 0; j < this.PlacedCandidate.length; j++) {
      exportCanDetail={
        'jobtitle':this.PlacedCandidate[j]['jobtitle'],
        'candname':this.PlacedCandidate[j]['candname'],
        'offerletterdate':this.PlacedCandidate[j]['offerletterdate'],
        'joiningdate':this.PlacedCandidate[j]['joiningdate'],
        'source':this.PlacedCandidate[j]['source'],
        'age':this.PlacedCandidate[j]['age'],
        'mobile':this.PlacedCandidate[j]['mobile'],
        'gender':this.PlacedCandidate[j]['gender'],
        'statename':this.PlacedCandidate[j]['statename'],
        'districtname':this.PlacedCandidate[j]['districtname']
      }
    }
    this.PlacedCandidateForExport.push(exportCanDetail);
  for (let i = 0; i < this.PlacedCandidate.length; i++) {
    delete this.PlacedCandidate[i]['stateid'];
  }
  this.excelService.exportAsExcelFile(this.PlacedCandidateForExport, 'StatewiseReports');
  }

  JobpostDetaillist:any=[];
  GetDashboardJobpostDetail(){
    this.DbResponse=''
    this.JobpostService.GetDashboardJobpostDetail().subscribe(res =>{
      this.DbResponse = res
      if(this.DbResponse.lstGetDashboardJobpostDetaillist !=null){
        this.JobpostDetaillist = this.DbResponse.lstGetDashboardJobpostDetaillist;
        this.dtTrigger.next();
      }
    });
  }

  // excel download for Get Dashboard Job post Detail
jobPostForExport:any=[];
ExcelExportJobPost()
{
  var exportCanDetail;
  for (let j = 0; j < this.JobpostDetaillist.length; j++) {
    exportCanDetail={
      'jobcode':this.JobpostDetaillist[j]['jobcode'],
      'jobtitle':this.JobpostDetaillist[j]['jobtitle'],
      'functionarea':this.JobpostDetaillist[j]['functionarea'],
      'industryname':this.JobpostDetaillist[j]['industryname'],
      'noOfVacancy':this.JobpostDetaillist[j]['noOfVacancy'],
      'validupto':this.JobpostDetaillist[j]['validupto'],     
    }
    this.jobPostForExport.push(exportCanDetail);
  }  
  this.excelService.exportAsExcelFile(this.jobPostForExport, 'JOb Post Detail');
}

   //  GetDashboardApplicationsRecieved By Pankaj Joshi 
  applicationsRecieved:any=[]
  GetDashboardApplicationsRecieved(){
    this.DbResponse=''
    this.JobpostService.GetDashboardApplicationsRecieved().subscribe(res =>{
      this.DbResponse = res      
      if(this.DbResponse.lstGetDashboardApplicationsRecieved !=null){
        this.applicationsRecieved = this.DbResponse.lstGetDashboardApplicationsRecieved;
        
      }
    });
  }
// excel download for scheduled interview candidate list
applicationsRecievedForExport:any=[];
ExcelExportapplicationsRecieved()
{
  var exportCanDetail;
  for (let j = 0; j < this.applicationsRecieved.length; j++) {
    exportCanDetail={
      'jobtitle':this.applicationsRecieved[j]['jobTitle'],
      'candname':this.applicationsRecieved[j]['candName'],
      'mobile':this.applicationsRecieved[j]['mobile'],
      'gender':this.applicationsRecieved[j]['gender'],
      'dob':this.applicationsRecieved[j]['dob'],
      'interviewDateFrom':this.applicationsRecieved[j]['interviewDateFrom'],       
      'interviewFrom':this.applicationsRecieved[j]['interviewDateFrom'],       
      'interviewDateTo':this.applicationsRecieved[j]['interviewDateFrom'],       
      'interviewTo':this.applicationsRecieved[j]['interviewDateFrom'],
    }
    this.applicationsRecievedForExport.push(exportCanDetail);
  }  
  this.excelService.exportAsExcelFile(this.applicationsRecievedForExport, 'Applications Recieved');
}


  //  GetDashboardInterviewScheduleList By Pankaj Joshi 
  totalscheduldinterviewDetails:any=[]
  GetDashboardInterviewScheduleList(){
    this.DbResponse=''
    this.JobpostService.GetDashboardInterviewScheduleList().subscribe(res =>{
      this.DbResponse = res      
      if(this.DbResponse.lstGetDashboardInterviewScheduleList !=null){
        this.totalscheduldinterviewDetails = this.DbResponse.lstGetDashboardInterviewScheduleList;
        
      }
    });
  }


  // excel download for scheduled interview candidate list
  scheduldinterviewDetailsForExport:any=[];
  ExcelExportScheduledInterview()
  {
    var exportCanDetail;
    for (let j = 0; j < this.totalscheduldinterviewDetails.length; j++) {
      exportCanDetail={
        'jobtitle':this.totalscheduldinterviewDetails[j]['jobTitle'],
        'candname':this.totalscheduldinterviewDetails[j]['candName'],
        'mobile':this.totalscheduldinterviewDetails[j]['mobile'],
        'gender':this.totalscheduldinterviewDetails[j]['gender'],
        'dob':this.totalscheduldinterviewDetails[j]['dob'],
        'interviewDateFrom':this.totalscheduldinterviewDetails[j]['interviewDateFrom'],       
        'interviewFrom':this.totalscheduldinterviewDetails[j]['interviewDateFrom'],       
        'interviewDateTo':this.totalscheduldinterviewDetails[j]['interviewDateFrom'],       
        'interviewTo':this.totalscheduldinterviewDetails[j]['interviewDateFrom'],          
        'stateName':this.totalscheduldinterviewDetails[j]['stateName'],
        'districtname':this.totalscheduldinterviewDetails[j]['districtName']
      }
      this.scheduldinterviewDetailsForExport.push(exportCanDetail);
    }  
    this.excelService.exportAsExcelFile(this.scheduldinterviewDetailsForExport, 'Scheduled Interview');
  }



   //  GetDashboardApplicationsRecieved By Pankaj Joshi 
   registrationReceived:any=[]
   GetDashboardRegistrationReceived(){
     this.DbResponse=''
     this.JobpostService.GetDashboardRegistrationReceived().subscribe(res =>{
       this.DbResponse = res      
       if(this.DbResponse.lstGetDashboardRegistrationReceived !=null){
         this.registrationReceived = this.DbResponse.lstGetDashboardRegistrationReceived;
         
       }
     });
   }

 // excel download for scheduled interview candidate list
 registrationReceivedForExport:any=[];
 ExcelExportRegistrationReceived()
 {
   var exportCanDetail;
   for (let j = 0; j < this.registrationReceived.length; j++) {
     exportCanDetail={
  //     'jobtitle':this.registrationReceived[j]['jobTitle'],
       'candname':this.registrationReceived[j]['candName'],
       'mobile':this.registrationReceived[j]['mobile'],
       'gender':this.registrationReceived[j]['gender'],
       'dob':this.registrationReceived[j]['dob'],       
     }
     this.registrationReceivedForExport.push(exportCanDetail);
   }  
   this.excelService.exportAsExcelFile(this.registrationReceivedForExport, 'Registration Recieved');
 }

  sortF:any;
  changeSort(event) {
    if (!event.order) {
      this.sortF = 'year';
    } else {
      this.sortF = event.field;
    }
  }

}
