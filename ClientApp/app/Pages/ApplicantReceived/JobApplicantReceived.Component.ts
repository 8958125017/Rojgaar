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
import { JobcardforApplicationReceived } from "../../Pages/jobcard/jobcard.component";
import { CandidateService } from '../../Services/candidate.service';
import { Subject } from 'rxjs/Subject';
import * as $ from 'jquery';
import { CommonViewLayoutComponent } from '../CommonModelView/CommonView-Layout.Component';
import { equal } from 'assert';
@Component({
  selector    : 'app-JobApplicantReceivedComponent',
  templateUrl : './JobApplicantReceived.Component.html',
})

export class JobApplicantReceivedComponent implements  OnInit {
  @ViewChild(CommonViewLayoutComponent) private mymodel: CommonViewLayoutComponent;
  modalRef: BsModalRef;
  modalRefdesc: BsModalRef;
  modaldefualt: BsModalRef;
  modaldpia: BsModalRef;
  dtOptions: DataTables.Settings = {};
  //dtTrigger: Subject<any> = new Subject();

  dtTrigger =null


  @ViewChild(ToastContainerDirective) toastContainer: ToastContainerDirective;
  @ViewChild( JobcardforApplicationReceived) jobcardComponent: JobcardforApplicationReceived;
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
      PageNumber             : number  = 0;
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
      CtcOptions             : Options = {
                                          floor: 5000,
                                          ceil: 250000,
                                          step: 100
                                        };

      ExpOptions             : Options = {
                                        floor: 0,
                                        ceil: 20,
                                        step: 1
                                      };
      Responce               : any = {};
      IndustryArea           : any = [];
      pageno                 : any = '';Neeraj
      from1                  : any = '';
      postdata               : any = {};
      filterResult           : number = 1;
      industryname           : any = '';
      functionalareaname;
      searchdata             : any = {};
      localpostdata          : any = {};
      searchsts              : number = 0;
      industry               : number = 0;
      minctc                 : number = 0;
      maxctc                 : number = 0;
      minexp                 : number = 0;
      maxexp                 : number = 0;
      functionalarea         : number = 0;
      viewcandidatedetails   : number = 1;
      redirection1           : any = '';
      redirection2           : any = '';
      detailsForm: FormGroup;


      ViewState:boolean=false;
  constructor(private appConfig                   : AppConfig
            , private toastrService               : ToastrService
            , private masterService               : MasterService
            , private spinnerService              : Ng4LoadingSpinnerService
            , private JobApplicantReceivedService : JobApplicantReceivedService
            , private router                      : Router
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


  @HostListener('window:scroll', ['$event'])
  scrollHandler(event) {
      let pos = (document.documentElement.scrollTop || document.body.scrollTop) + document.documentElement.offsetHeight;
      let max = document.documentElement.scrollHeight;
      if (pos >=(0.8 * max)) {
        if (this.delay) {
          return
        }
        this.delay = true;
        if(this.stateJobscrol){
          if(this.getstateJobDetails.length >= 10){
            this.PageNumber = this.PageNumber + 1;
            this.getJobByOpenings(this.jobId,this.PageNumber,'scroll');
          }
         }
         else if(this.jobroll) {
          if(this.GetAppliedJobList.length >0){
            this.PageNumber = this.PageNumber + 1;
            this.GetAllAppliedJobs(this.PageNumber,'scroll');
          }
        }
      }
  }

  jobroll:boolean=false;
  //dtOptions: DataTables.Settings = {};
  ngOnInit() {
    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength:2
    };
      var parentid = this.UserInfo.id;
      this.redirection1 = this.route.snapshot.paramMap.get('ViewJob');
      this.redirection2 = this.route.snapshot.paramMap.get('CandidateListing');
      if(this.redirection1!= null){

        // $('.filter-wrapper').slideToggle();
        this.getDetails();
        this.JobCard='1';
        this.ViewJob=false;
        $('.page-filters h2 a').click(function () {

          $(this).find('i').toggleClass('fa-chevron-down fa-chevron-right');
          $(this).parent().parent().find('.filter-wrapper').slideToggle();
        });
        $('.filter-toggle').click(function () {
            $('.filter-wrapper').slideToggle();
        });

        this.JobApplicationReceived = this.formBuilder.group({
          industry : ['', Validators.nullValidator],
          functionalarea : ['', Validators.nullValidator],
          MinCtc : ['',Validators.nullValidator],
          MaxCtc : ['',Validators.nullValidator],
          MinExp : ['',Validators.nullValidator],
          MaxExp : ['',Validators.nullValidator],
      })
      $('.filter-wrapper').slideToggle();
      this.GetAllIndustryArea();
      this.GetAllFunctionArea();
      }
      else{

      $('.page-filters h2 a').click(function () {
        $(this).find('i').toggleClass('fa-chevron-down fa-chevron-right');
        $(this).parent().parent().find('.filter-wrapper').slideToggle();
      });
      $('.filter-toggle').click(function () {
          $('.filter-wrapper').slideToggle();
      });

      this.JobApplicationReceived = this.formBuilder.group({
        industry : ['', Validators.nullValidator],
        functionalarea : ['', Validators.nullValidator],
        MinCtc : ['',Validators.nullValidator],
        MaxCtc : ['',Validators.nullValidator],
        MinExp : ['',Validators.nullValidator],
        MaxExp : ['',Validators.nullValidator],
    })
    $('.filter-wrapper').slideToggle();
     this.GetAllIndustryArea();
     this.GetAllFunctionArea();
     this.GetAllAppliedJobs(this.PageNumber,'scroll');
   }
  }


   candidateid:number=0;
   MrigsDataShow:boolean=false;
   ArrayCandId:any=[];

   openModal(candiID:any,apitype:any) {
    this.mymodel.callMethod(candiID,apitype);
  }

  GetAllAppliedJobsSearch(){
    this.searchsts = 1;
    this.GetAllAppliedJobs(this.PageNumber,'scroll');
  }

getAppliedJobId:any;
  public GetAllAppliedJobs(PageNumber:number,from:any){

    localStorage.removeItem("filter_jobapplication_id");
    localStorage.removeItem("filter_jobOpening_id");
    this.stateJobscrol=false;
    // this.searchsts = 0;
    if(this.JobApplicationReceived.value.industry!=''){
      this.industry=this.JobApplicationReceived.value.industry;
      this.industryname=this.IndustryArea.find(o => o.id === this.industry);
      this.industryname = this.industryname.industryName;
   }else{
     this.industry=0;
     this.industryname='';
   }
    if(this.JobApplicationReceived.value.functionalarea!=''){
      this.functionalarea=this.JobApplicationReceived.value.functionalarea;
      this.functionalareaname=this.FunctionArea.find(o=>o.id===this.functionalarea)
      this.functionalareaname=this.functionalareaname.functionalAreaName;
  }else{
   this.functionalarea=0;
   this.functionalareaname='';
  }

   this.minctc=this.minCtc>0?this.minCtc:0;
   this.maxctc=this.maxCtc>0?this.maxCtc:0;
   this.minexp=this.minExp>0?this.minExp:0;
   this.maxexp=this.maxExp>0?this.maxExp:0;
  this.postdata= {
               'IndustryId':this.industry,
               'FunctionalAreaId':this.functionalarea,
               'MinExp':this.minexp,
               'MaxExp':this.maxexp,
               'Minctc':this.minctc,
               'Maxctc':this.maxctc,
               'PageNumber':PageNumber
              };

  this.searchdata={
              'industryid':this.industryname,
              'functionalareaid':this.functionalareaname,
              'MinExp':this.minexp,
              'MaxExp':this.maxexp,
              'Minctc':this.minctc,
              'Maxctc':this.maxctc,
              'Pagenumber':this.pageno
            };

  this.localpostdata={
                'industryid':this.industry,
                'functionalareaid':this.functionalarea,
                'MinExp':this.minexp,
                'MaxExp':this.maxexp,
                'Minctc':this.minctc,
                'Maxctc':this.maxctc,
                'Pagenumber':0
              };

  localStorage.setItem('filter_application_received',JSON.stringify(this.localpostdata));
  localStorage.setItem('search_application_receivedy',JSON.stringify(this.searchdata));
  this.spinnerService.show();
  this.ViewState=false;
    if (from == 'scroll') {
            this.JobApplicantReceivedService.GetAllAppliedJobs(this.postdata).subscribe(res => {
              this.DbResponce = res
                this.spinnerService.hide();
              if (this.DbResponce.lstAppliedJobList!= null) {
                this.ViewJob=true;
                this.GetAppliedJobListRes = this.DbResponce.lstAppliedJobList;
                this.GetAppliedJobList  = this.GetAppliedJobList.concat(this.GetAppliedJobListRes);
				this.getAppliedJobId   = this.GetAppliedJobList[0].jobId;
				
                this.jobroll=true
                this.from='scroll';
              }else{
                this.GetAppliedJobList = [];
                this.from='';
              }
              this.delay = false;
            });
          }else{
            this.PageNumber=0;
            this.GetAppliedJobList=[];
            this.masterService.saveUserLogs('Job/GetAppliedJobListAplictRecvd/','Application Received');
            this.JobApplicantReceivedService.GetAllAppliedJobs(this.postdata).subscribe(res => {
              this.DbResponce           = res;
              this.spinnerService.hide();
            if (this.DbResponce.lstAppliedJobList!= null) {
              this.ViewJob=true;
              this.previous=0;
              this.stateBackButton=false;
              this.CandidateListing=0;
              this.jobcardComponent.hideJobcard();
              this.GetAppliedJobListRes = this.DbResponce.lstAppliedJobList;
              this.GetAppliedJobList    = this.GetAppliedJobListRes;
              this.jobroll=true;
              this.from                 = '';
            }else{
              this.GetAppliedJobList    = [];
              this.from                 = '';
            }
            this.delay = false;
       });
     }
  }

 JobDetails:any;
 last:any;
 jobOpeningID:any;
 dbresponseappliedlist:any=[];
 success_jobid:any=[];

 getCandidateListing(jobId:any){
   this.router.navigate(['/reviewApplication', {jobid:jobId}]);
}

 getCandidateListing1(jobDetail:any,PageNumber:number,from:any){
	 
	localStorage.setItem('filter_jobapplication_id',jobDetail.jobId);
  localStorage.setItem('filter_jobOpening_id',jobDetail.jobOpeningID);

   this.router.navigate(['/reviewApplication', {jobid:jobDetail.jobId,JobOpeningId:jobDetail.jobOpeningID}]);


  this.success_jobid=jobDetail;
  this.spinnerService.show();
  this.stateJobscrol=false;
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
  this.JobApplicantReceivedService.GetAppliedJobById(jobDetail.jobId,PageNumber).subscribe(res=>{
  this.DbResponce = res
  this.JobList    = this.DbResponce.lstInterviewJobList[0];

    //this.jobCardDetail(this.JobList);

  this.viewcandidatedetails=0;

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
    //this.dtTrigger.next();
  }
});
//this.dtTrigger.next();
});

  this.searchsts=1;
  this.JobCard          = '1';
  this.ViewJob          = false;
  this.CandidateListing = '1';
  this.previous         = '0';
  this.stateBackButton  = true;
  this.searchsts        =  0;
  this.dtTrigger.next();
}

jobCardDetail(JobList){
  this.jobcardComponent.setJobcardValue(JobList);
}

jobIdDetail:any = {};
BackButton:boolean;
InterviewSchedule(){
  this.BackButton= true;
  this.jobIdDetail.jobId = this.id;
  this.router.navigate(['/scheduleinterview',{ jid: parseInt(this.id),backToJob:'1', BackButton:true}]);
  this.JobApplicantReceivedService.JobId = this.jobIdDetail;
}

CandidateName : any;
Email         : any;
mobile        : any;
gender        : any;
stateName     : any;
districtName  : any;
dob           : any;
age           : any;
image         : any;


previousList(){
//   $('.filter-toggle').click(function () {
//     $('.filter-wrapper').slideToggle();
// });
  this.ViewJob          = true;
  this.stateJobscrol    = false
  this.jobroll          =true;
  this.CandidateListing = '0';
  this.JobCard          = '0';
  this.viewcandidatedetails=1;
  this.searchsts=1;
  this.PageNumber=0;
  this.ViewState=false;
  this.previous = '0';
  this.SerialNumber=1;
  this.jobcardComponent.hideJobcard();
  this.GetAllAppliedJobs(0,'');
}

stateBackButton:boolean=false;

backButton(){
    this.stateJobscrol    = true;
    this.jobroll          = false;
  	this.jobcardComponent.hideJobcard();
    this.CandidateListing = '0';
    this.stateBackButton         = false;
    this.ViewState=true;
    this.previous         = '1';
	  this.searchsts=1;
   // $('.filter-toggle').click(function () {
     // $('.filter-wrapper').slideToggle();
   //});

    this.PageNumber=0;
    if(!this.jobId){
      this.jobId= localStorage.getItem('filter_jobapplication_id');
    }
    this.getJobByOpenings(this.jobId,this.PageNumber,'');
}

GetAllIndustryArea() {
  this.masterService.GetAllIndustryArea().subscribe(res => {
    this.Responce = res;
    this.IndustryArea = this.Responce;

  });
}

FunctionArea : any =[];
GetAllFunctionArea() {
  this.masterService.GetAllFunctionArea().subscribe(res => {
    this.Responce = res;
    this.FunctionArea = this.Responce;
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
  this.getCandidateListing1(userDta,0,'');
}

   SerialNumber:number=1;
   pagination(paginationNumber:number,pageno:any){
    this.stateJobscrol    = false
    this.jobroll          =false;
    this.PageNumber = paginationNumber;
    if(this.PageNumber==0)
    {
      this.SerialNumber = 1;
    }
    else{
    this.SerialNumber = ((this.PageNumber)*pageno)+1;
    }
    this.spinnerService.show();
      this.JobApplicantReceivedService.GetAppliedCandidateByState(this.paginationjobid, this.jobOpeningID).subscribe(res => {
        this.spinnerService.hide();
        this.DbResponce             = res;
        if(this.DbResponce){
          this.GetAppliedcandidate     = this.DbResponce.lstAppliedDisticWiseCandidateList;
          this.id=this.paginationjobid;
           if(this.GetAppliedcandidate != null){
            this.GetAppliedJobcandidate = this.GetAppliedJobcandidate;
           // this.dtTrigger.next();
          }else{
            this.GetAppliedJobcandidate = [];
          }
        }
    });
   }

   getstateJobDetails    : any = [];
   dbRes      : any = {};
   stateJobscrol:boolean=false;
   jobid:any='';

// get job by opening wise section

   getJobByOpenings(jobid,pageNumber,from:any){
	   
    var option_array=new Array();
    var remark_array=new Array();
     this.ViewJob       = false;
     this.jobroll       =  false;
     this.previous      = '1';
     this.jobid=jobid;
     if (from == 'scroll') {   // call when scroll
       // get job opening wise
      this.JobApplicantReceivedService.getJobByState(jobid,pageNumber).subscribe(res=>{
          this.spinnerService.hide();
          this.dbRes = res;
          if(this.dbRes.lstAppliedJobList != null){
            this.jobId=this.dbRes.lstAppliedJobList[0].jobId;
            var stateJobResult  = this.dbRes.lstAppliedJobList[0].jobOpeningList;
            if (stateJobResult!= null) {
              this.ViewState     = true;
              this.getstateJobDetails  = this.getstateJobDetails.concat(stateJobResult);
			 
              this.from='scroll';
            }else{
              this.getstateJobDetails = [];
              this.from='';
            }
            this.delay = false;
          }else{
            this.jobId=this.jobId;
          }
      })
     }else{
      this.spinnerService.show();
       // get job opening wise
      this.JobApplicantReceivedService.getJobByState(jobid,pageNumber).subscribe(res=>{
        this.spinnerService.hide();
       this.dbRes = res

       if(this.dbRes.lstJobwiseOpeningList.length){
            this.ViewState     = true;
            this.jobId=this.dbRes.lstJobwiseOpeningList[0].jobId;
            var stateJobResult    = this.dbRes.lstJobwiseOpeningList[0].jobOpeningList;
            this.id=this.paginationjobid;
           if(stateJobResult != null){
              this.stateJobscrol=true;
              this.getstateJobDetails = stateJobResult;
            }else{
              this.getstateJobDetails = [];
           }
         }
      })
     }
   }

////////////////////// view candidate details in model /////////
ProfileResponce:any=[];
candid:any;

/////////////////    my db details /////////////
////////////////////  ys detials  //////////
openpiaData(JobID:any,JobopeningID:any,candiID:any,apitype:any)
{
this.mymodel.GetPiaContactDetails(JobID,JobopeningID,candiID,apitype)

}

remarks:any=[];
PushSelectedCandidate:any = [];
indexvalue:any;
id1:any='';
isSuitable:any='';
id_arr=[];
options:any=[];


Selectcandidate(e: any,appliedjob,index:any){

  this.id1=index+1;
  this.indexvalue=index;
  let v = e.target.value.split(',');
  let option_val = v[0];
  let canid = v[1];
  let obj = {};
  obj[canid]=option_val;

  var index = this.options.findIndex(obj => obj.candId==canid);
  if(index>=0){
      this.options.splice(index,1);
  }
  this.options.push(
      {'candId':canid,'isSuitable':option_val,'jobId':this.jobId,'jobOpeningId':appliedjob.jobopeningid,'Sourceid':appliedjob.sourceId,SourceType:appliedjob.apitype,'Remarks':this.option1,}
  )
  //  alert("this.options = = "+JSON.stringify(this.options))
  if(option_val=='false'){
    $('#'+v[1]).show();
  }else{
    $('#'+v[1]).hide();
    $('#'+v[1]).val('');
  }
}

option1:any='';
setRemark(e,id){

    var index = this.options.findIndex(obj => obj.candId==id);
    this.options[index].Remarks=e.target.value;
   // console.log(this.options)
}

senddata:any=[];

SaveSelectedCandidate($e){
    if(this.options.length>0){
      this.spinnerService.show();
      this.JobApplicantReceivedService.CandSuitable(JSON.stringify(this.options)).subscribe(res => {

        this.dbresponseappliedlist= res

        if(this.dbresponseappliedlist!=null){
              this.spinnerService.hide();
              this.toastrService.success(this.dbresponseappliedlist.message);
              //this.getCandidateListing(this.success_jobid,0,'')
              //$('#candtable').DataTable().ajax.reload();
              this.jobcardComponent.hideJobcard();
              this.ViewState=true;
              this.CandidateListing='0';
              this.ViewJob=false;
              this.options=[];
            //  this.dtOptions.pageLength=10;

          }
      });
    }else{
      this.toastrService.error('Please select suitable status');
      return false;
    }


}
ResetFilterResult() {
  this.JobApplicationReceived.controls['industry'].setValue('');
  this.JobApplicationReceived.controls['functionalarea'].setValue('');
  this.JobApplicationReceived.controls['MinCtc'].setValue('');
  this.JobApplicationReceived.controls['MaxCtc'].setValue('');
  this.JobApplicationReceived.controls['MinExp'].setValue('');
  this.JobApplicationReceived.controls['MaxExp'].setValue('');
  this.searchsts = 0;
  this.GetAppliedJobList = [];
  this.GetAllAppliedJobs(this.PageNumber,'');
}

screeningAnswer:any=[];
modalScreening: BsModalRef;
appliedCandidate:any;
index:any;
result:any

openscreeningModal(templateSector: TemplateRef<any>,appliedjob,i) {
  this.appliedCandidate=appliedjob;
  this.index=i;
  this.spinnerService.show();
  this.screeningAnswer=[];
  this.JobApplicantReceivedService.getScreeningAnswer(this.jobId,appliedjob.jobopeningid,appliedjob.candidateid).subscribe(res=>{
    this.spinnerService.hide();
    this.result=res
    if(this.result.getquestiongroup[0].groupList.length){
      this.modalScreening = this.modalService.show(templateSector, { class: 'modal-md' });
       this.screeningAnswer=this.result.getquestiongroup[0];
     }else{
        this.toastrService.error('server error')
      //  this.closeScreeningModal();
     }
  })
}
appliedjob:{
  "isSuitable":''
};

closeScreeningModal(){
  this.modalScreening.hide();
}


// OPEN POP UP FOR CHECK SCREENING QUESTION ANSWER SECTION

selectSuitable(value,appliedjob,i:any){
  let option_val = value;
  let canid = appliedjob.candId;
  let obj = {};
  obj[canid]=option_val;
  var index = this.options.findIndex(obj => obj.candId==canid);
  if(index>=0){
      this.options.splice(index,1);
  }

  // FOR CHANGE DROPDOWN VALUE WHEN CLICK IN SUITABLE AND NOT SUITABLE AFTER CHECK SCREENING QUESTION.

  var myText=value+','+canid;
  $("#" +"myDropDown"+ i ).val(myText);

  //IS USED FOR OPEN TEXT FIELD AFTER CLICK IN NOT SUITABLE AFTER CHECK SCREENING QUESTION.

  if(value=='false'){
    $('#'+canid).show();
  }else{
    $('#'+canid).hide();
    $('#'+canid).val('');
  }

  this.options.push(
      {'candId':canid,'isSuitable':option_val,'jobId':this.jobId,'jobOpeningId':appliedjob.jobopeningid,'Sourceid':appliedjob.sourceId,SourceType:appliedjob.apitype,'Remarks':this.option1,}
  )

  this.appliedjob={
    isSuitable:null
  }
  this.modalScreening.hide();
}
// CLOSE POP UP SECTION

}

