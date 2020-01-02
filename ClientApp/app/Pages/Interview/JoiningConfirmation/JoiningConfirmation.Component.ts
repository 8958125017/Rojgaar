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
import { JobApplicantReceivedService } from '../../../Services/JobApplicantReceived.service';
import * as moment from 'moment';
import { Subject } from 'rxjs';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { CandidateService } from '../../../Services/candidate.service';
import { DataTableDirective } from 'angular-datatables';
import { CommonViewLayoutComponent } from '../../CommonModelView/CommonView-Layout.Component';
import { AppConstants } from '../../../GlobalError/app-constants';

@Component({
  selector: 'app-JoiningConfirmationComponent',
  templateUrl: './JoiningConfirmation.Component.html',
})
export class JoiningConfirmationComponent implements OnInit {
  modalRef: BsModalRef;
  modalRefdesc: BsModalRef;
  modaldefualt: BsModalRef;
  modaldpia: BsModalRef;
  @ViewChild(ToastContainerDirective) toastContainer: ToastContainerDirective;
  @ViewChild(CommonViewLayoutComponent) private mymodel: CommonViewLayoutComponent;

  @Output() clicked = new EventEmitter<string>();

  dtTrigger = null;// new Subject<any>();
  dtOptions: any = {};

  SearchCandidateForm: FormGroup;
  DbResponce: any = {};
  DbResponceInterview: any = {};
  joblistRes: any = [];
  joblist: any = [];
  JobCardShow: any = true;
  InterviewCard: any = false;
  JobDetailShow: any = false;
  UserInfo: any;
  delay: boolean = false;
  from: any;
  InterviewById: any = {};
  lstState: any = [];
  district: any = [];
  InterviewRes: any = [];
  InterviewResfinal: any = [];
  interviewid: any = {};
  TimeMsg: any = true;
  TimeRange: any = true;
  InterviewReschedule: any = true;
  idFormArray: any = [];
  RescheduleDetail: any = {};
  interviewId: any;
  JobId: any;
  candidatedetail: any = [];
  candidatedetailList: any = [];
  candidatedetailById: any = [];
  jobdetail: any = [];
  OfferletterDetail: any = [];
  PageNumber: number = 0;
  PageForInterview: number = 0;
  startDate: any;
  EndDate: any;
  count: any = [];
  paginationjobid: number;
  CandidateArray: any = [];
  JoiningConfirmation: any = [];
  selectedCand: any = [];
  selectedCandList: any = [];
  viewcandidatedetails: number = 1;
  ImgName: any;
  interviewformValid = true;
  SelectCandidateStatus = false;
  minDate = new Date();
  InterviewSearch: FormGroup;
  JobSearch: FormGroup;
  ShowPushData: any = [];
  pushdata: any = [];
  ShowPushDatajob: any = [];
  pushdatajob: any = [];
  workLocation: any = [];
  showErrorMessage: boolean = false;
  errormsg = AppConstants.generalError_NodataFound;
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
    , private route: ActivatedRoute
    , private modalService: BsModalService
    , private CandidateService: CandidateService
  ) {
    try {
      this.UserInfo = appConfig.UserInfo
    } catch  { }
    this.appConfig.isverified();
  }
  @HostListener('window:scroll', ['$event'])
  scrollHandler(event) {
    let pos = (document.documentElement.scrollTop || document.body.scrollTop) + document.documentElement.offsetHeight;
    let max = document.documentElement.scrollHeight;

    if (pos == max) {
      if (this.joblist.length >= 10 && this.JobCardShow == true) {
        this.PageNumber = this.PageNumber + 1;
        this.GetAllAppliedJobList(this.PageNumber, 'scroll');
      }
      else if (this.InterviewResfinal.length >= 10 && this.InterviewCard == true) {
        this.PageForInterview = this.PageForInterview + 1;
        this.GetInterviewListByJobId(this.JobId, this.PageForInterview, 'scroll');
      }
    }
  }

  open() {
    const amazingTimePicker = this.atp.open();
    amazingTimePicker.afterClose().subscribe(time => {
    });
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
  GetWorkLocation() {
    var parentid = 0;
    this.interviewService.GetCompanyWorkLocation(parentid).subscribe(res => {
      this.DbResponce = res;

      if (this.DbResponce != null) {
        this.workLocation = this.DbResponce.lstCompanyWorkLocation
      }
    });
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
      "Keyword": this.JobSearch.controls.SearchKeyJob.value
    };
    this.pushdatajob = {
      "StateId": this.JobSearch.controls.Stateid.value != '' ? parseInt(this.JobSearch.controls.Stateid.value) : 0,
      "DistrictId": this.JobSearch.controls.Districtid.value != '' ? parseInt(this.JobSearch.controls.Districtid.value) : 0,
      "PageNumber": PageNumber,
      "Keyword": this.JobSearch.controls.SearchKeyJob.value,
      "JobType": this.JobSearch.controls.JobType.value ? this.JobSearch.controls.JobType.value : 'ALL',
    };
    if (from == 'scroll') {
      this.spinnerService.show();
      try {
        var jobid = 0;
        this.interviewService.GetAppliedJobs(this.pushdatajob).subscribe(res => {
          this.DbResponce = res
          // this.joblistResFilter = (this.DbResponce.lstJobListByCompanyId).filter(function (entry) {
          //   return entry.totalScheduleInterview != 0;
          // });
          this.spinnerService.hide();
          if (this.DbResponce.lstAppliedJobsList != null) {
            this.joblistRes = this.DbResponce.lstAppliedJobsList;
            this.joblist = this.joblist.concat(this.joblistRes);
          } else {
            this.joblist = [];
          }
        });
      } catch  { }
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
            this.showErrorMessage = false;
          } else {
            this.joblist = [];
            this.showErrorMessage = true;
          }
        });
      } catch  { }
    }

  }
  JobType: any = '';
  EventId:any=0;
  GetInterviewListByJobType(jobid: any, PageNo: any, from: any, JobType: any,EventId:any) {
    this.JobType = JobType;
    this.EventId = EventId;
    this.GetInterviewListByJobId(jobid, PageNo, from);

  }

  GetInterviewListByJobId(jobid: any, PageNo: any, from: any) {
    if (this.JobType == "WalkIn") {

      this.GetWalkinDetail(jobid);

    } else if (this.JobType == "EVENT") {

      this.GetEventDetail(jobid);

    }
    else {
      this.JobSearch.controls['Stateid'].setValue('');
      this.JobSearch.controls['Districtid'].setValue('');
      this.JobSearch.controls['SearchKeyJob'].setValue('');
      this.ShowPushData = [];
      this.pushdata = [];
      this.JobId = jobid;
      this.JobCardShow = false;
      this.InterviewCard = true;

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
  WalkInDetail: boolean = false;
  GetWalkinDetail(jobid: any) {
    this.PageNumber = 0;
    this.InterviewCard = false;
    this.JobCardShow = false;
    this.WalkInDetail = true;
    this.dtOptions = null;
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
    this.selectedCandList = [];
    this.selectedCand = [];
    this.FilteredResult = [];
    this.spinnerService.show();

    this.interviewService.CandidateListForWalkin(jobid, 0).subscribe(res => {
      this.selectedCand = res;
      this.FilteredResult = (this.selectedCand.lstCandidateInfoWalkin).filter(function (entry) {
        return entry.offerletterstatus == 1;
      });

      this.spinnerService.hide();
      if (this.selectedCand != null) {
        this.selectedCandList = this.FilteredResult;
       
        this.dtTrigger.next();

      }
    });
    try {
      this.spinnerService.show();
      this.interviewService.GetWalkInDetail(jobid, this.PageNumber).subscribe(res => {
        this.DbResponce = res
        this.spinnerService.hide();
        if (this.DbResponce != null) {
          this.jobdetail = this.DbResponce.lstInterviewWalkList[0];
        }
      });
    } catch  { }

  }
  EventDetail:boolean=false;
  GetEventDetail(jobid: any) {
    this.PageNumber = 0;
    this.InterviewCard = false;
    this.JobCardShow = false;
    this.EventDetail = true;
    this.dtOptions = null;
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
    this.selectedCandList = [];
    this.selectedCand = [];
    this.FilteredResult = [];
    this.spinnerService.show();
    this.interviewService.CandidateListForEvent(jobid,0,this.EventId).subscribe(res => {
      this.selectedCand = res;

      this.spinnerService.hide();
      if (this.selectedCand != null) {
        this.selectedCandList = this.selectedCand.lstCandidateInfoEvent;
        this.FilteredResult = (this.selectedCandList).filter(function (entry) {
          return entry.offerletterstatus == 1;
        });
       // this.FilteredResult = this.selectedCandList;
        this.dtTrigger.next();

      }
    });

    try {
      this.spinnerService.show();
      this.interviewService.GetEventDetail(this.EventId,jobid,0).subscribe(res => {
        this.DbResponce = res
        this.spinnerService.hide();
        if (this.DbResponce != null) {
          this.jobdetail = this.DbResponce.lstInterviewJobList;
        }
      });
    } catch  { }

  }

  private GetAllStates() {
    try {
      this.masterService.GetAllStates().subscribe(res => {
        this.lstState = res
        this.lstState = this.lstState;
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


  BackToJobList() {
    this.InterviewSearch.controls['Stateid'].setValue('');
    this.InterviewSearch.controls['Districtid'].setValue('');
    this.InterviewSearch.controls['DateFrom'].setValue('');
    this.InterviewSearch.controls['DateTo'].setValue('');
    this.InterviewSearch.controls['LocationFilter'].setValue('');
    this.InterviewSearch.controls['SearchKeyInterview'].setValue('');
    //this.InterviewSearch.reset();
    this.InterviewResfinal = [];
    this.InterviewRes = [];
    this.ShowPushDatajob = [];
    this.pushdatajob = [];
    this.PageForInterview = 0;
    this.JobCardShow = true;
    this.WalkInDetail = false;
    this.EventDetail = false;
    this.InterviewCard = false;


  }

  GetJobInterviewDetail(jobid: any, interviewid: any) {
    this.JobId = jobid;
    this.PageNumber = 0;
    this.InterviewCard = false;
    this.JobDetailShow = true;
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

    this.interviewService.CommanCandidateListForInterview(this.JobId, interviewid).subscribe(res => {
      this.selectedCand = res;

      this.spinnerService.hide();
      if (this.selectedCand != null) {
        this.selectedCandList = this.selectedCand.lstCandidateInfo;
        this.dtTrigger.next();
        this.FilteredResult = (this.selectedCandList).filter(function (entry) {
          return entry.offerletterstatus == 1;
        });

      }
    });

    try {
      this.spinnerService.show();
      this.interviewService.GetAppliedJobById(jobid, this.PageNumber).subscribe(res => {
        this.DbResponce = res
        this.spinnerService.hide();
        if (this.DbResponce != null) {
          this.jobdetail = this.DbResponce.lstInterviewJobList[0];
          this.minDate = new Date(this.jobdetail.jobPushedDate);
        }
        this.spinnerService.show();
        this.interviewService.getInterviewDetailById(interviewid).subscribe(res => {
          this.InterviewById = res;
          this.spinnerService.hide();
          if (this.InterviewById != null) {
            this.InterviewById = this.InterviewById.interviewDetail[0];
          }
        });

      });
    } catch  { }
  }
  FilteredResult: any = [];
  GetConfirmedCandidateList(interviewid: any) {
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

    this.interviewService.CommanCandidateListForInterview(this.JobId, interviewid).subscribe(res => {
      this.selectedCand = res;

      this.spinnerService.hide();
      if (this.selectedCand != null) {
        this.selectedCandList = this.selectedCand.lstCandidateInfo;
        this.dtTrigger.next();
        this.FilteredResult = (this.selectedCandList).filter(function (entry) {
          return entry.offerletterstatus == 1;
        });

      }
    });

  }
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
    this.InterviewSearch.controls['Stateid'].setValue('');
    this.InterviewSearch.controls['Districtid'].setValue('');
    this.InterviewSearch.controls['DateFrom'].setValue('');
    this.InterviewSearch.controls['DateTo'].setValue('');
    this.InterviewSearch.controls['LocationFilter'].setValue('');
    this.InterviewSearch.controls['SearchKeyInterview'].setValue('');
    this.InterviewCard = true;
    this.JobDetailShow = false;
    this.WalkInDetail = false;
    this.EventDetail = false;
  }

  modalRefForOffer: BsModalRef;
  GetOfferLetterDetail(jobId: any, interviewId: any, CandId: any, template6: TemplateRef<any>) {
    this.modalRefForOffer = this.modalService.show(template6,
      { backdrop: 'static', keyboard: false });
    try {
      this.interviewService.getCandidateOfferLetterDetail(jobId, interviewId, CandId).subscribe(res => {
        this.DbResponce = res
        if (this.DbResponce != null) {
          this.OfferletterDetail = this.DbResponce.lstCandidateOfferLette[0];
        }
      });
    } catch  { }
  }

  CloseOfferLetter() {
    this.modalRefForOffer.hide()
  }
  JoinedCandidate(jobid: any, interviewid: any, candidateid: any, candopeningid: any, OfferLetterId: any) {
    this.JobId = jobid;
    this.SelectCandidateStatus = true;

    this.JoiningConfirmation.push({
      'Jobtype': this.JobType,
      'Eventid': this.EventId,
      'offerletterid': OfferLetterId,
      'candidateid': candidateid,
      'OpeningId': candopeningid,
      'jobid': jobid,
      'interviewid': interviewid,
      'Isjoiningstatus': 1,
    });
  }
  SubmitStatusOfCandidate() {
    try {
      this.spinnerService.show();
      this.interviewService.SetJoinedCandidateList(JSON.stringify(this.JoiningConfirmation)).subscribe(res => {
        this.DbResponce = res
        this.spinnerService.hide();
        this.toastrService.success(this.DbResponce.message);
        this.JoiningConfirmation = [];
        this.InterviewCard = false;
        this.JobCardShow = true;
        this.JobDetailShow = false;
        this.WalkInDetail = false;
        this.EventDetail = false;
        this.SelectCandidateStatus = false;
      });
    } catch  { }

  }
  CloseStatusOfCandidate() {
    this.JoiningConfirmation = [];
    this.InterviewCard = false;
    this.JobCardShow = true;
    this.JobDetailShow = false;
    this.WalkInDetail = false;
    this.EventDetail = false;
    this.SelectCandidateStatus = false;
  }


  selectedRow: Number;
  setClickedRow(index) {
    //alert(index);
    this.selectedRow = index;
  }

  /////////////////// End candiate details //////////

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
