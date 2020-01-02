// import { Component, OnInit, ViewChild } from '@angular/core';
import { Component, HostListener,  OnInit, TemplateRef, ViewChild,EventEmitter, Input,Output,VERSION } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { ToastContainerDirective, ToastrService } from 'ngx-toastr';
import { AppConfig } from '../../Globals/app.config';
import { UserInfoService } from '../../Services/userInfo.service.';
import { CustomValidators } from '../../Validators/custom-validator.directive';
import { MasterService } from '../../Services/master.service';
import { identifierModuleUrl } from '@angular/compiler';
import { debug } from 'util';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
import { JobApplicantReceivedService } from '../../Services/JobApplicantReceived.service';
import { FormGroup , FormBuilder , Validators} from '@angular/forms';
import { Options } from 'ng5-slider';
import { count, multicast } from 'rxjs/operators';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
// import { JobcardforReviewApplication } from "../../Pages/jobcard/jobcard.component";
import { CandidateService } from '../../Services/candidate.service';
import { Subject } from 'rxjs/Subject';
import * as $ from 'jquery';
import { CommonViewLayoutComponent } from '../CommonModelView/CommonView-Layout.Component';
import { equal } from 'assert';
import { JobpostService } from '../../Services/jobpost.service';

@Component({
  selector: 'app-reviewApplicationComponent',
  templateUrl: './reviewApplication.Component.html',
})

export class ReviewApplicationComponent implements  OnInit {
  @ViewChild(CommonViewLayoutComponent) private mymodel: CommonViewLayoutComponent;
  // @ViewChild( JobcardforReviewApplication) jobcardComponent: JobcardforReviewApplication;
  modalRef: BsModalRef;
  modalRefdesc: BsModalRef;
  modaldefualt: BsModalRef;
  modaldpia: BsModalRef;
  dtOptions: DataTables.Settings = {};
  //dtTrigger: Subject<any> = new Subject();

  dtTrigger =null;
  @ViewChild(ToastContainerDirective) toastContainer: ToastContainerDirective;
  
      UserInfo               : any;
      jobdetail              : any = [];
      static ID              : any = '';
      DbResponce             : any = {};
      CandidateListing       : any = '0';
      ViewJob                : boolean = false;
      GetAppliedJobcandidate : any = [];
      GetAppliedJobList      : any = [];
      GetAppliedJobListRes   : any = [];
      GetAppliedcandidate    : any = [];
      JobDetailShow1         : any;
      InterviewListShow1     : any;
      applicantListshow1     : any;
      JobCardShow1           : any;
      BackButton1            : any;
      CreateButton1          : any;
      BackFromJobDetailshow1 : any;
      jobId                  : any;
      id                     : any;
      states                 :any=[];
      JobCard                          ='0';
    
      item                   : any     = '';
      JobList                : any     = [];
      delay                  : boolean = false;
      from                   : any;
      backToJob              : any     ='0';
      previous               : any     ='0';
      paginationjobid        : number;
      JobApplicationReceived : FormGroup;
      minCtc                 : number = 0;
      maxCtc                 : number = 0;
      minExp                 : number = 0;
      maxExp                 : number = 0;
      count                  :any=[];
      Responce               : any = {};
      IndustryArea           : any = [];
      pageno                 : any = '';
      from1                  : any = '';
      postdata               : any = {};
      filterResult           : number = 1;
      industryname           : any = '';
      functionalareaname;
      searchdata             : any = {};
   


      ViewState:boolean=false;
  constructor(private appConfig                   : AppConfig
            , private toastrService               : ToastrService
            , private masterService               : MasterService
            , private spinnerService              : Ng4LoadingSpinnerService
            , private JobApplicantReceivedService : JobApplicantReceivedService
            , private router                      : Router
            , private jobpostService              : JobpostService
            , private activatedRoute              : ActivatedRoute
            , private route                       : ActivatedRoute
            ,  private modalService               : BsModalService
            , private formBuilder                 : FormBuilder
            , private CandidateService            : CandidateService


         )
  {
      this.UserInfo = appConfig.UserInfo;
      this.appConfig.isverified();
  }




  jobroll:boolean=false;
  //dtOptions: DataTables.Settings = {};
  ngOnInit() {
    this.getJobDetails();     
  }


 JobDetails:any;
 last:any;
 jobOpeningID:any;
 dbresponseappliedlist:any=[];
 success_jobid:any=[];


 getCandidateListing(jobDetail:any,PageNumber:number,from:any){
  
  this.success_jobid=jobDetail;
  this.spinnerService.show();

  this.ViewState=false;
  this.count=[];
  this.paginationjobid = jobDetail.jobId
  this.jobId =  this.paginationjobid; // Add by pankaj joshi for set job id
  this.id = jobDetail.jobId;
  this.jobOpeningID=jobDetail.jobOpeningID;
  this.PageNumber=0;
  this.JobDetails =  this.jobdetail;
  this.dtOptions=null;

  this.dtOptions = {
    pagingType: 'full_numbers',
    pageLength: 10,
    responsive: true,
    jQueryUI: true,
    destroy: true,
    retrieve: false,
    processing: true,
    deferRender: true,
    stateSave: false,
   // dom:'"<"H"lfr>t<"F"ip>',
    autoWidth:true,
    displayStart:0,
    language: {
      emptyTable: "No data available",
      infoEmpty: "Total Record Found: 0",
      infoFiltered: "(searched in _MAX_ records)",
      loadingRecords: "Loading...",
      processing: "Processing...",
      search: "Search all columns:",
      zeroRecords: "No matching records found"
    },
  };
  this.dtTrigger=new Subject<any>();
  debugger
  this.JobApplicantReceivedService.GetAppliedJobById(jobDetail.jobId,PageNumber).subscribe(res=>{
  this.DbResponce = res;
  this.JobList    = this.DbResponce.lstInterviewJobList[0];
  
   // this.jobCardDetail(this.JobList);

localStorage.setItem('filter_jobapplication_id',jobDetail.jobId);
  localStorage.setItem('filter_jobOpening_id',jobDetail.jobOpeningID);
  this.spinnerService.show();

  this.JobApplicantReceivedService.GetAppliedCandidateByState(this.paginationjobid,this.jobOpeningID).subscribe(res => {
    this.spinnerService.hide();
    this.dbresponseappliedlist= res
  if(this.dbresponseappliedlist!=null)
  {
  this.dtTrigger.next();
  this.GetAppliedcandidate = this.dbresponseappliedlist.lstAppliedDisticWiseCandidateList;
  this.dtTrigger.next();
  }
  else
  {
    this.GetAppliedJobcandidate = null;
  }
});
});

}

getDetails()
{

  this.ViewJob=true;
  this.CandidateListing='1';
  var filter_jobapplication_id=localStorage.getItem('filter_jobapplication_id');
  var filter_jobopening_id=localStorage.getItem('filter_jobOpening_id');
  
  let userDta={
          'jobId':filter_jobapplication_id,
          'jobOpeningID':filter_jobopening_id
  }
  this.getCandidateListing(userDta,0,'');
}


/*****************************************************
 Review Application Posted Job Details By Neeraj Singh  
*****************************************************/


JobId:any
PageNumber : number  = 0;

getJobDetails(){
  this.JobId        =    this.route.snapshot.paramMap.get('jobid');
  let JobOpeningId =    this.route.snapshot.paramMap.get('JobOpeningId');
  this.JobApplicantReceivedService.GetAppliedJobById(this.JobId,this.PageNumber).subscribe(res=>{
    this.DbResponce = res
    this.JobList    = this.DbResponce.lstInterviewJobList[0];
     
    this.spinnerService.show();
  
    this.JobApplicantReceivedService.GetAppliedCandidateByState(this.JobId ,this.jobOpeningID).subscribe(res => {
      this.spinnerService.hide();
      this.dbresponseappliedlist= res
    if(this.dbresponseappliedlist!=null)
    {
   
    this.GetAppliedcandidate = this.dbresponseappliedlist.lstAppliedDisticWiseCandidateList;

    }
    else
    {
      this.GetAppliedJobcandidate = null;
     
    }
  });

  });
}





}


