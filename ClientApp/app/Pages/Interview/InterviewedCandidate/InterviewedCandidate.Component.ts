import { Component, HostListener, OnInit, ViewChild, TemplateRef, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastContainerDirective, ToastrService } from 'ngx-toastr';
import { AppConfig } from '../../../Globals/app.config';
import { UserInfoService } from '../../../Services/userInfo.service.';
import { CustomValidators } from '../../../Validators/custom-validator.directive';
import { RegistrationService } from '../../../Services/registration.service';
import { MasterService } from '../../../Services/master.service';
import { identifierModuleUrl } from '@angular/compiler';
import { debug } from 'util';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
import { JobpostService } from '../../../Services/jobpost.service';
import { InterviewService } from '../../../Services/interview.service';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { Alert } from 'selenium-webdriver';
import { Location } from '@angular/common';
import { AmazingTimePickerService } from 'amazing-time-picker';
import * as $ from 'jquery';
import { Subject } from 'rxjs';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { AlertComponent } from 'ngx-bootstrap';
import { CandidateService } from '../../../Services/candidate.service';
import { DataTableDirective } from 'angular-datatables';
import { CommonViewLayoutComponent } from '../../CommonModelView/CommonView-Layout.Component';
import { AppConstants } from '../../../GlobalError/app-constants';

@Component({
  selector: 'app-InterviewedCandidateComponent',
  templateUrl: './InterviewedCandidate.Component.html',
})
export class InterviewedCandidateComponent implements OnInit {
  modalRef: BsModalRef;
  modalRefdesc: BsModalRef;
  modaldefualt: BsModalRef;
  modaldpia: BsModalRef;
  @ViewChild(ToastContainerDirective) toastContainer: ToastContainerDirective;
  @ViewChild(CommonViewLayoutComponent) private mymodel: CommonViewLayoutComponent;

  @Output() clicked = new EventEmitter<string>();

  dtTrigger = null;// new Subject<any>();
  dtOptions: any = {};

  UserInfo: any;
  JobId: any;
  InterviewId: any;
  candidateId: any;
  DbResponce: any = {};
  DbResponceInterview: any = {};
  InterviewRes: any = [];
  InterviewResfinal: any = [];
  InterviewById: any = {};
  pageNumber: number = 0;
  PageForInterview: number = 0;
  jobdetail: any = {};
  jobs: any = {};
  lstState: any = [];
  district: any = [];
  candidatedetail: any = [];
  candidatedetailList: any = [];
  interviewid: any = {};
  TimeMsg: any = true;
  RejectCandidateForm: FormGroup;
  UpdateScheduleInterviewForm: FormGroup;
  SearchCandidateForm: FormGroup;
  JobSearch: FormGroup;
  InterviewListValid = false;
  InterviewSearch: FormGroup;
  ShowPushData: any = [];
  pushdata: any = [];
  ShowPushDatajob: any = [];
  pushdatajob: any = [];
  JobInterviewListValid = false;
  InterviewSchedule: any = false;
  BackFromJob: any = false;
  idFormArray: any = [];
  CandidateStatus: any = [];
  formdata: any = [];
  applicantListshow: any = false;
  interviewId: any;
  PageNumber: number = 0;
  CandidateList: any = false;
  from: any;
  InterviewListShow: any = true;
  CandidateCount: any;
  ImgName: any;
  interviewformValid = true;
  count: any = [];
  joblistRes: any = [];
  joblist: any = [];
  JobCardShow: any = true;
  paginationjobid: number;
  viewcandidatedetails: number = 1;
  SelectCandidateStatus: any = false;
  msg: any = '';
  showErrorMessage:boolean=false;
  JobType:any='';
  errormsg=AppConstants.generalError_NodataFound;
  constructor(private appConfig: AppConfig
    , private toastrService: ToastrService
    , private masterService: MasterService
    , private interviewService: InterviewService
    , private jobpostService: JobpostService
    , private spinnerService: Ng4LoadingSpinnerService
    , private formBuilder: FormBuilder
    , private router: Router
    , private _location: Location
    , private atp: AmazingTimePickerService
    , private modalService: BsModalService
    , private CandidateService: CandidateService

  ) {
    this.UserInfo = appConfig.UserInfo
    this.appConfig.isverified();
  }
  open() {
    const amazingTimePicker = this.atp.open();
    amazingTimePicker.afterClose().subscribe(time => {
    });
  }
  delay: boolean = false;
  @HostListener('window:scroll', ['$event'])
  scrollHandler(event) {
    let pos = (document.documentElement.scrollTop || document.body.scrollTop) + document.documentElement.offsetHeight;
    let max = document.documentElement.scrollHeight;

    if (pos == max) {
      if (this.joblist.length >= 10 && this.JobCardShow == true) {
        this.PageNumber = this.PageNumber + 1;
        this.GetAllAppliedJobList(this.PageNumber, 'scroll');
      }
      else if (this.InterviewResfinal.length >= 10 && this.InterviewListValid == true) {
        this.PageForInterview = this.PageForInterview + 1;
        this.GetInterviewListByJobId(this.JobId, this.PageForInterview, 'scroll');
      }
    }
  }
  ngOnInit() {

    $('.page-filters h2 a').click(function () {
      $(this).find('i').toggleClass('fa-chevron-down fa-chevron-right');
      $(this).parent().parent().find('.filter-wrapper').slideToggle();
    });
    $('.filter-toggle').click(function () {
      $('.filter-wrapper').slideToggle();
    });


    var parentid = this.UserInfo.id;
    this.interviewid = localStorage.getItem('Interviewid');
    this.RejectCandidateForm = this.formBuilder.group({
      status: ['', [Validators.required,]],
      remarkofrejection: ['', [Validators.required, Validators.compose([CustomValidators.removeSpaces])]],
      jobId: ['', [Validators.nullValidator,]],
      interviewId: ['', [Validators.nullValidator,]],
      candId: ['', [Validators.nullValidator,]],

    });
    this.UpdateScheduleInterviewForm = this.formBuilder.group({
      InterviewDate: ['', [Validators.required,]],
      fromtime: ['', [Validators.required,]],
      totime: ['', [Validators.required,]],
      address: ['', [Validators.required,]],
      StateID: ['', [Validators.required,]],
      DistrictID: ['', [Validators.required,]],
      interviewid: ['', [Validators.nullValidator,]],
    });
    this.SearchCandidateForm = this.formBuilder.group({
      searchinput: ['', [Validators.nullValidator]],
    });
    this.JobSearch = this.formBuilder.group({
      Stateid: ['', ''],
      Districtid: ['', ''],
      SearchKeyJob: ['', ''],
      JobType: ['', ''],
    });
    this.InterviewSearch = this.formBuilder.group({
      Stateid: ['', ''],
      Districtid: ['', ''],
      SearchKeyInterview: ['', ''],
      DateFrom: ['', ''],
      DateTo: ['', ''],
      LocationFilter: ['', ''],
    });
    this.GetWorkLocation();
    this.GetAllAppliedJobList(this.PageNumber, this.from);
    this.GetAllStates();
  }
  workLocation: any = [];
  GetWorkLocation() {
    var parentid = 0;
    this.interviewService.GetCompanyWorkLocation(parentid).subscribe(res => {
      this.DbResponce = res;

      if (this.DbResponce != null) {
        this.workLocation = this.DbResponce.lstCompanyWorkLocation
      }
    });
  }
  JobListFilterSearch:boolean=false;
  GetAllAppliedJoblistWithFilter(pgno:any,scroll:any){
    this.JobListFilterSearch = true;
    this.GetAllAppliedJobList(0, '');

  }
  joblistResFilter: any = [];
  public GetAllAppliedJobList(PageNumber, from) {

    let statedid;
    let districtid;

    statedid = this.JobSearch.value.Stateid;
    districtid = this.JobSearch.value.Districtid;

    let statename = (this.lstState).filter(function (entry) {
      return entry.id == statedid;
    });

    let districtname = (this.district).filter(function (entry) {
      return entry.id == districtid;
    });


    this.ShowPushDatajob = {
      "state": statename != '' ? statename[0]['stateName'] : 'NA',
      "district": districtname != '' ? districtname[0]['districtName'] : 'NA',
      "Keyword": this.JobSearch.controls.SearchKeyJob.value ? this.JobSearch.controls.SearchKeyJob.value :'NA',
      "JobType": this.JobSearch.controls.JobType.value ?  this.JobSearch.controls.JobType.value : 'NA',
    };
    this.pushdatajob = {
      "state": this.JobSearch.controls.Stateid.value != '' ? parseInt(this.JobSearch.controls.Stateid.value) : 0,
      "district": this.JobSearch.controls.Districtid.value != '' ? parseInt(this.JobSearch.controls.Districtid.value) : 0,
      "pageNumber": PageNumber,
      "Keyword": this.JobSearch.controls.SearchKeyJob.value,
      "JobType": this.JobSearch.controls.JobType.value ? this.JobSearch.controls.JobType.value : 'ALL',
    };

    if (from == 'scroll') {
      this.spinnerService.show();
      try {
        var jobid = 0;
        this.interviewService.GetAppliedJobs(this.pushdatajob).subscribe(res => {
          this.DbResponce = res
          this.spinnerService.hide();
          // this.joblistResFilter = (this.DbResponce.lstAppliedJobsList).filter(function (entry) {
          //   return entry.totalScheduleInterview != 0;
          // });
          if (this.DbResponce.lstAppliedJobsList != null) {           
            this.joblistRes = this.DbResponce.lstAppliedJobsList;
            this.joblist = this.joblist.concat(this.joblistRes);
          }
          else {
            this.joblist = [];                 
          }
        });
      } catch  { }
      this.delay = false;
    }
    else {
      this.spinnerService.show();
      try {
        var jobid = 0;
        this.interviewService.GetAppliedJobs(this.pushdatajob).subscribe(res => {
          this.DbResponce = res
          this.spinnerService.hide();
          if (this.DbResponce.lstAppliedJobsList != null && this.DbResponce.lstAppliedJobsList.length) {
            this.joblistRes = this.DbResponce.lstAppliedJobsList;
            this.joblist = this.joblistRes;
            this.showErrorMessage=false;
          } else {
            this.joblist = [];
            this.showErrorMessage=true;
          
          }
        });
      } catch  { }
      this.delay = false;
    }

  }
  EventId:any=0;
  GetInterviewListByJobType(jobid: any, PageNo: any, from: any,JobType:any,EventId:any){
    this.JobType = JobType;
    this.EventId = EventId;
    this.JobListFilterSearch = false;
    this.GetInterviewListByJobId(jobid,PageNo,from);

  }

  GetInterviewListByJobId(jobid: any, PageNo: any, from: any) {
    if(this.JobType=="WalkIn"){
      this.GetWalkinDetail(jobid);

    }else if(this.JobType=="EVENT"){
      this.GetEventDetail(jobid);

    }
    else{
    this.JobSearch.controls['Stateid'].setValue('');
    this.JobSearch.controls['Districtid'].setValue('');
    this.JobSearch.controls['SearchKeyJob'].setValue('');
    this.ShowPushData = [];
    this.pushdata = [];
    this.PageForInterview = 0;
    this.JobId = jobid;
    this.JobCardShow = false;
    this.InterviewListValid = true;
    let statedid;
    let districtid;
    let worklocationid;

    statedid = this.InterviewSearch.value.Stateid;
    districtid = this.InterviewSearch.value.Districtid;
    worklocationid = this.InterviewSearch.value.LocationFilter;

    let statename = (this.lstState).filter(function (entry) {
      return entry.id == statedid;
    });

    let districtname = (this.district).filter(function (entry) {
      return entry.id == districtid;
    });
    let locationname = (this.workLocation).filter(function (entry) {
      return entry.id == worklocationid;
    });


    this.ShowPushData = {
      "state": statename != '' ? statename[0]['stateName'] : 'NA',
      "district": districtname != '' ? districtname[0]['districtName'] : 'NA',
      "Keyword": this.InterviewSearch.controls.SearchKeyInterview.value,
      "DateFrom": this.InterviewSearch.controls.DateFrom.value,
      "DateTo": this.InterviewSearch.controls.DateTo.value,
      "Location": locationname != '' ? locationname[0]['address'] : 'NA',
    };
    this.pushdata = {
      "stateid": this.InterviewSearch.controls.Stateid.value != '' ? parseInt(this.InterviewSearch.controls.Stateid.value) : 0,
      "districtid": this.InterviewSearch.controls.Districtid.value != '' ? parseInt(this.InterviewSearch.controls.Districtid.value) : 0,
      "InterviewDateTo": this.InterviewSearch.controls.DateTo.value != '' ? this.InterviewSearch.controls.DateTo.value : '',
      "InterviewDateFrom": this.InterviewSearch.controls.DateFrom.value != '' ? this.InterviewSearch.controls.DateFrom.value : '',
      "Workloc": this.InterviewSearch.controls.LocationFilter.value != '' ? parseInt(this.InterviewSearch.controls.LocationFilter.value) : 0,
      "pageNumber": PageNo,
      "jobid": jobid,
      "Searchkey": this.InterviewSearch.controls.SearchKeyInterview.value
    };

    if (from == 'scroll') {
      this.spinnerService.show();
      this.interviewService.getInterviewlistByJobId(this.pushdata).subscribe(res => {
        this.DbResponceInterview = res;

        this.spinnerService.hide();
        this.InterviewResfinal = this.DbResponce.lstInterviewListByJobId;
        if (this.InterviewResfinal != null || this.InterviewResfinal != '') {
          this.InterviewRes = this.InterviewRes.concat(this.InterviewResfinal);
        }
        else {
          this.InterviewRes = [];
          this.spinnerService.hide();
        }
        this.delay = false;
      });
    }
    else {
      this.spinnerService.show();
      this.interviewService.getInterviewlistByJobId(this.pushdata).subscribe(res => {
        this.DbResponceInterview = res;

        this.spinnerService.hide();
        if (this.DbResponceInterview.lstInterviewListByJobId != null) {
          this.InterviewResfinal = this.DbResponceInterview.lstInterviewListByJobId;
          this.InterviewRes = this.InterviewResfinal;
        }
        else {
          this.InterviewRes = [];
          this.spinnerService.hide();
        }
        this.delay = false;
      });
    }
  }
  }
 WalkInDetail :boolean=false;
  GetWalkinDetail(jobid:any){
    this.JobCardShow = false;
    this.CandidateList = true;
    this.InterviewListValid = false;
    this.JobCardShow = false
    this.WalkInDetail = true;
    this.BackFromJob = true;
    this.JobId = jobid;
    this.InterviewId = 0;
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
      dom: '"<"H"lfr>t<"F"ip>',
      autoWidth: true,
      displayStart: 0,
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
    this.dtTrigger = new Subject<any>();
    this.CommanCandidateList = [];
    this.FilteredResult = [];
    this.DbResponseforList = [];
    this.spinnerService.show();
    this.interviewService.CandidateListForWalkin(jobid, 0).subscribe(res => {
      this.DbResponseforList = res;
      this.spinnerService.hide();
      if (this.DbResponseforList != null) {
        this.CommanCandidateList = this.DbResponseforList.lstCandidateInfoWalkin;
        this.dtTrigger.next();
        // this.FilteredResult = (this.CommanCandidateList).filter(function (entry) {
        //   return entry.isscheduled == true;
        // });
        this.FilteredResult = this.CommanCandidateList;
      }
    });
    try {
      this.spinnerService.show();
      this.interviewService.GetWalkInDetail(jobid,0).subscribe(res => {
        this.DbResponce = res
        this.spinnerService.hide();
        if (this.DbResponce != null) {
          this.jobdetail = this.DbResponce.lstInterviewWalkList[0];
        }
      });
    } catch  { }

  }
  EventDetail:boolean=false;
  GetEventDetail(jobid:any){
    this.JobCardShow = false;
    this.CandidateList = true;
    this.InterviewListValid = false;
    this.EventDetail = true;
    this.BackFromJob = true;
    this.JobId = jobid;
    this.InterviewId = 0;
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
      dom: '"<"H"lfr>t<"F"ip>',
      autoWidth: true,
      displayStart: 0,
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
    this.dtTrigger = new Subject<any>();
    this.CommanCandidateList = [];
    this.FilteredResult = [];
    this.DbResponseforList = [];
    this.spinnerService.show();
    this.interviewService.CandidateListForEvent(jobid,0,this.EventId).subscribe(res => {
      this.DbResponseforList = res;
      // this.FilteredResult = (this.DbResponseforList).filter(function (entry) {
      //   return entry.isscheduled == true;
      // });
      this.spinnerService.hide();
      if (this.DbResponseforList != null) {
        this.FilteredResult = this.DbResponseforList.lstCandidateInfoEvent;
        this.dtTrigger.next();
       
      }
    });
    try {
      this.spinnerService.show();
      this.interviewService.GetEventDetail(this.EventId,jobid,0).subscribe(res => {
        this.DbResponce = res
        this.spinnerService.hide();
        if (this.DbResponce != null) {
          this.jobdetail = this.DbResponce.lstInterviewEventList;
        }
      });
    } catch  { }

  }
  converttime(time24) {
    var ts = time24;
    if (ts != null && ts.length == 5) {
      var H = +ts.substr(0, 2);
      var h = (H % 12) || 12;
      h = (h < 10) ? (0 + h) : h;
      var ampm = H < 12 ? " AM" : " PM";
      ts = h + ts.substr(2, 3) + ampm;
      return ts;
    } else {
      return "NA";
    }
  }
  onChange(id: any, isChecked: boolean) {
    if (isChecked) {
      this.idFormArray.push(id);
    }
    else {
      let index = this.idFormArray.indexOf(id);
      this.idFormArray.splice(index, 1);
    }
  }

  private GetAllStates() {
    try {
      this.masterService.GetAllStates().subscribe(res => {
        this.lstState = res
        this.lstState = this.lstState;
      });
    } catch  { }
  }
  onChangeState(statename: any) {
    this.GetAllDistrict(statename, "profile");
  }
  private GetAllDistrict(id: any, From: string) {
    try {
      this.masterService.GetAllDistrict(id).subscribe(res => {
        this.district = res;
      });
    } catch  { }
  }
  clist: any = [];
  GetJobDetail(JobId: any, InterviewId: any) {
    this.JobCardShow = false;
    this.CandidateList = true;
    this.InterviewListValid = false;
    this.JobInterviewListValid = true;
    this.BackFromJob = true;
    this.JobId = JobId;
    this.InterviewId = InterviewId;
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
      dom: '"<"H"lfr>t<"F"ip>',
      autoWidth: true,
      displayStart: 0,
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
    this.dtTrigger = new Subject<any>();
    this.CommanCandidateList = [];
    this.FilteredResult = [];
    this.DbResponseforList = [];
    this.spinnerService.show();
    this.interviewService.CommanCandidateListForInterview(JobId, InterviewId).subscribe(res => {
      this.DbResponseforList = res;
      this.spinnerService.hide();
      if (this.DbResponseforList != null) {
        this.CommanCandidateList = this.DbResponseforList.lstCandidateInfo;
        this.dtTrigger.next();
        this.FilteredResult = (this.CommanCandidateList).filter(function (entry) {
          return entry.isscheduled == true;
        });
      }
    });

    try {
      this.spinnerService.show();
      this.interviewService.GetAppliedJobById(JobId, this.pageNumber).subscribe(res => {
        this.DbResponce = res
        this.spinnerService.hide();
        if (this.DbResponce != null) {
          this.jobdetail = this.DbResponce.lstInterviewJobList[0];
          if(this.JobType == 'Job'){
          this.spinnerService.show();
          this.interviewService.getInterviewDetailById(InterviewId).subscribe(res => {
            this.InterviewById = res;
            this.spinnerService.hide();
            if (this.InterviewById != null) {
              this.InterviewById = this.InterviewById.interviewDetail[0];

            }
          });
        }
        }
      });
    } catch  { }
  }

  FilteredResult: any = [];
  DbResponseforList: any = [];
  CommanCandidateList: any = [];

  ngAfterViewInit(): void {
    if (this.dtTrigger != null)
      this.dtTrigger.next();
  }
  rerender(): void {
    if (this.dtTrigger != null)
      this.dtTrigger.next();
    if (this.dtTrigger != null)
      this.dtTrigger.unsubscribe();
  }

  ngOnDestroy(): void {
    // Do not forget to unsubscribe the event
    if (this.dtTrigger != null)
      this.dtTrigger.unsubscribe();
  }
  BackToInterviewList() {
    this.router.navigate(['/InterviewedCandidate']);
    this.JobInterviewListValid = false;
    this.WalkInDetail = false;
    this.InterviewListValid = true;
    this.BackFromJob = false;
    this.CandidateList = false;
  }
  BackToJobList() {
    this.InterviewResfinal = [];
    this.InterviewRes = [];
    this.InterviewSearch.controls['Stateid'].setValue('');
    this.InterviewSearch.controls['Districtid'].setValue('');
    this.InterviewSearch.controls['DateFrom'].setValue('');
    this.InterviewSearch.controls['DateTo'].setValue('');
    this.InterviewSearch.controls['LocationFilter'].setValue('');
    this.InterviewSearch.controls['SearchKeyInterview'].setValue('');
    this.JobType = '';
    this.EventId = '';
    this.ShowPushDatajob = [];
    this.pushdatajob = [];
    this.InterviewListValid = false;
    this.WalkInDetail = false;
    this.EventDetail = false;
    this.CandidateList = false;
    this.BackFromJob = false;
    this.JobCardShow = true;
  }
  last: any;
  ExistingCandidate: any = [];
  CandidateStatusIndex: any = [];
  candStatus: any
  SelectCandidate(jobid: any, interviewid: any, candidateid: any, candopeningid: any, isChecked: boolean, selectindex: any) {
    this.JobId = jobid;
    this.InterviewId = interviewid;
    this.SelectCandidateStatus = true;
    this.ExistingCandidate = [];
    this.ExistingCandidate = (this.CandidateStatus).filter(function (entry) {
      return entry.CandId == candidateid;
    });
    if (this.ExistingCandidate.length != 0) {

      let index = this.CandidateStatusIndex.indexOf(candidateid);

      this.CandidateStatus.splice(index, 1);
      this.CandidateStatusIndex.splice(index, 1);
    }
    this.CandidateStatusIndex.push(candidateid);
    this.CandidateStatus.push({
      'Jobtype': this.JobType,
      'Eventid': this.EventId ? this.EventId : 0,
      'CandId': candidateid,
      'OpeningId': candopeningid,
      'JobId': jobid,
      'InterviewId': interviewid,
      'InterviewStatus': 1,
      'Remarks': '',
    });
  }
  CandidateOpeningId: any;
  CandidateId: any
  //candStatus: any
  RejectCandidate(jobid: any, interviewid: any, candidateid: any, candopeningid: any, template5: TemplateRef<any>,rejectindex: any) {
    this.candStatus = rejectindex;
    this.modalRef = this.modalService.show(template5,
      { backdrop: 'static', keyboard: false });
      this.CandidateId = candidateid;
    this.CandidateOpeningId = candopeningid;
    this.RejectCandidateForm.controls['status'].setValue(0);
    this.RejectCandidateForm.controls['jobId'].setValue(jobid);
    this.RejectCandidateForm.controls['interviewId'].setValue(interviewid);
    this.RejectCandidateForm.controls['candId'].setValue(candidateid);
    //   $.each(this.CandidateStatus, function(e, i){
    //     if (this.CandId == candidateid){
    //       this.CandidateStatus.splice(i, 1);
    //     }
    // });
  }
  PreviousFilterResult:any;
  ResetRejectForm(){
    var cnd = this.CandidateId;
    this.PreviousFilterResult = (this.CandidateStatus).filter(function (entry) {
      return entry.CandId == cnd;
    });
    if (this.PreviousFilterResult.length != 0) {
     /// var RejectStatus = 1;
     if(this.PreviousFilterResult[0].InterviewStatus == 1){
      $("#" + "selectCand" + this.candStatus ).prop("checked", true);
    } 
    else{
      $("#" + "rejectCand" + this.candStatus ).prop("checked", false);
    } 
    }else{
     // var RejectStatus = 1; 
      $("#" + "rejectCand" + this.candStatus ).prop("checked", false);
    
    }
 // $("#+ 'selectCand'+ this.candStatusIndex").prop("checked", true);
   this.modalRef.hide()
   this.RejectCandidateForm.reset();
   //this.RejectCandidateForm.controls['remarkofrejection'].setValue('');
 }
  
  UpdateCandidate(jobid: any, interviewid: any, candidateid: any, isChecked: boolean) {
    this.SelectCandidateStatus = true;
    let candid = this.CandidateId
    this.JobId = jobid;
    this.InterviewId = interviewid;
    this.ExistingCandidate = [];
    this.ExistingCandidate = (this.CandidateStatus).filter(function (entry) {
      return entry.CandId == candid;
    });
    if (this.ExistingCandidate.length != 0) {
      let index = this.CandidateStatusIndex.indexOf(this.CandidateId);
      this.CandidateStatus.splice(index, 1);
      this.CandidateStatusIndex.splice(index, 1);
    }
    
    if (this.RejectCandidateForm.value.remarkofrejection == '') {
      this.RejectCandidateForm.controls['remarkofrejection'].setValue('');
      return false;
    }
    this.CandidateStatusIndex.push(this.RejectCandidateForm.value.candId);
    this.CandidateStatus.push({
      'Jobtype': this.JobType,
      'Eventid': this.EventId,
      'CandId': this.RejectCandidateForm.value.candId,
      'OpeningId': this.CandidateOpeningId,
      'InterviewStatus': 0,
      'JobId': this.RejectCandidateForm.value.jobId,
      'InterviewId': this.RejectCandidateForm.value.interviewId,
      'Remarks': this.RejectCandidateForm.value.remarkofrejection.trim(),
    });
    this.modalRef.hide();
    this.RejectCandidateForm.reset();

  }
  
  SubmitStatusOfCandidate() {
   
  
    try {
      this.spinnerService.show();
      this.interviewService.SetCandidateSelectionDetail(JSON.stringify(this.CandidateStatus)).subscribe(res => {
        this.DbResponce = res
        this.spinnerService.hide();
        this.toastrService.success(this.DbResponce.message);
        this.CandidateStatus = [];
        this.JobCardShow = true;
        this.JobInterviewListValid = false;
        this.WalkInDetail = false;
        this.InterviewListValid = false;
        this.CandidateList = false;
        this.SelectCandidateStatus = false;
        this.RejectCandidateForm.reset();
      });
    } catch  { }

  }
 
  CloseCandidateList() {
    this.CandidateStatus = [];
    this.JobCardShow = true;
    this.JobInterviewListValid = false;
    this.WalkInDetail = false;
    this.EventDetail = false;
    this.BackFromJob = false;
    this.InterviewListValid = false;
    this.CandidateList = false;
    this.SelectCandidateStatus = false;
    this.RejectCandidateForm.reset();
  }


  ResetSelectCandidateForm() {
    this.RejectCandidateForm.reset();
  }
  ResetRejectCandidateForm() {
    this.RejectCandidateForm.reset();
  }

  selectedRow: Number;
  setClickedRow(index) {
    this.selectedRow = index;
  }

  //////////////////////////// candiadate  view in model ////////////////////////

  PiaContacDetials: any = []
  openpiaData(temppia: TemplateRef<any>, JobID: any, JobopeningID: any, candiID: any, apitype: any) {
    if (apitype == 'MRIGS') {
      this.CandidateService.GetPiaDetail(JobID, JobopeningID, candiID).subscribe(res => {
        this.ProfileResponce = res
        this.spinnerService.hide();
        if (this.ProfileResponce.lstGetPiaDetai != null) {
          this.PiaContacDetials = this.ProfileResponce.lstGetPiaDetai[0];
          this.modaldpia = this.modalService.show(temppia,
            Object.assign({}, { class: 'candidate-view-modal modal-lg' }
            ));
        } else {
          this.PiaContacDetials = [];
        }
      });
    }

  }
  candidatedetails: any = [];
  ProfileResponce: any = [];
  postionview: any;
  scrollToX: any;
  scrollToY: any;
  candid: any;
  SetCandidateID: any;
  MrigsDataShow: boolean = false;
  CandiTempshow: any = '0';
  viewcandidateProfile(candiID: any, apitype: any) {
    this.mymodel.callMethod(candiID, apitype);
  }
  ResetFilterResult() {
    this.PageNumber = 0;
    this.InterviewSearch.controls['Stateid'].setValue('');
    this.InterviewSearch.controls['Districtid'].setValue('');
    this.InterviewSearch.controls['DateFrom'].setValue('');
    this.InterviewSearch.controls['DateTo'].setValue('');
    this.InterviewSearch.controls['LocationFilter'].setValue('');
    this.InterviewSearch.controls['SearchKeyInterview'].setValue('');
    this.GetInterviewListByJobId(this.JobId, this.PageNumber, '');

  }
  ResetFilterResultforjob() {
    this.PageNumber = 0;
    this.JobSearch.controls['Stateid'].setValue('');
    this.JobSearch.controls['Districtid'].setValue('');
    this.JobSearch.controls['SearchKeyJob'].setValue('');
    this.JobSearch.controls['JobType'].setValue('');
    this.GetAllAppliedJobList(this.PageNumber, '');
    this.district = [];

  }
}
