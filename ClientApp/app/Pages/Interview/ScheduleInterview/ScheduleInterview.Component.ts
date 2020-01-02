import { Component, HostListener, OnInit, OnDestroy, ViewChild, TemplateRef, ɵConsole, Output, EventEmitter } from '@angular/core';
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
import * as $ from 'jquery';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { CandidateService } from '../../../Services/candidate.service';
import { Subject } from 'rxjs';
import { Http, Response } from '@angular/http';
import 'rxjs/add/operator/map';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { DataTableDirective } from 'angular-datatables';
import { jsonpCallbackContext } from '@angular/common/http/src/module';
import { t } from '@angular/core/src/render3';
import { CommonViewLayoutComponent } from '../../CommonModelView/CommonView-Layout.Component';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { AppConstants } from '../../../GlobalError/app-constants';


@Component({
  selector: 'app-ScheduleInterviewComponent',
  templateUrl: './ScheduleInterview.Component.html',
})
export class ScheduleInterviewComponent implements OnInit {
  modalRef: BsModalRef;
  modalRefdesc: BsModalRef;
  modaldefualt: BsModalRef;
  modaldpia: BsModalRef;
  modalsuitable: BsModalRef;
  @ViewChild(ToastContainerDirective) toastContainer: ToastContainerDirective;
  @ViewChild(CommonViewLayoutComponent) private mymodel: CommonViewLayoutComponent;
  @Output() clicked = new EventEmitter<string>();

  dtTrigger = null;// new Subject<any>();
  dtOptions: any = {};


  UserInfo: any;
  ScheduleInterviewForm: FormGroup;
  NotSuitableCandidateForm: FormGroup;
  SearchCandidateForm: FormGroup;
  applicantListshow: any = false;
  InterviewSchedule: any = false;
  JobDetailShow: any = false;
  JobCardShow: any = false;
  InterviewListShow: any = true;
  BackFromJobDetailshow: any = false;
  createuserfomvalue: any = {};
  jobdetail: any = [];
  joblist: any = [];
  joblistRes: any = [];
  newAttribute: any = {};
  static ID: any = '';
  idFormArray: any = [];
  idFormArraycand: any = [];
  CandidateArray: any = [];
  interviewdata: any = [];
  formdata: any = [];
  DbResponce: any = {};
  DbResponceInterview: any = {};
  candidatedetail: any = [];
  candidatedetailList: any = [];
  lstState: any = [];
  district: any = [];
  interviewformValid = true;
  DateMsg = true;
  TimeMsg = true;
  TimeRange = true;
  BackButton = false;
  CreateButton = true;
  interviewid: any = {};
  jobs: any = {};
  InterviewById: any = {};
  InterviewRes: any = [];
  InterviewResfinal: any = [];
  Person: any = [];
  minDate = new Date();
  minDate1 = new Date();
  isChecked: boolean
  PageNumber: number = 0;
  PageNumberJob: number = 0;
  interviewId: any;
  from: any='';
  startDate: any;
  EndDate: any;
  backToJob: any = '0';
  delay: boolean = false;
  count: any = [];
  AddCandidateCount = 1;
  paginationjobid: number;
  viewcandidatedetails: number = 1;
  InterviewSearch: FormGroup;
  JobSearch: FormGroup;
  ShowPushData: any = [];
  pushdata: any = [];
  ShowPushDatajob: any = [];
  pushdatajob: any = [];
  workLocation: any = [];
  JobIdRecieved: any;
  PreviousStatusArray: any = [];
  redirectingFromApplication: boolean = true;
  showErrorMessage:boolean=false;
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
    , private route: ActivatedRoute
    , private modalService: BsModalService
    , private CandidateService: CandidateService
    , private http: HttpClient

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
    if (pos >= (0.8 * max)) {
      if (this.delay) {
        return
      }
      this.delay = true;
      if (this.InterviewRes.length >= 10 && this.InterviewListShow == true) {
        this.PageNumber = this.PageNumber + 1;
        this.GetInterviewList(this.PageNumber, 'scroll');
      }else if (this.joblist.length >= 10 && this.JobCardShow == true) {
        this.PageNumberJob = this.PageNumberJob + 1;
        this.GetAllAppliedJobList(this.PageNumberJob, 'scroll');
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
    var id = parseInt(this.route.snapshot.paramMap.get('jid'));//InterView Shedule
    this.JobIdRecieved = parseInt(this.route.snapshot.paramMap.get('jid'));//InterView Shedule
    var backToJob = parseInt(this.route.snapshot.paramMap.get('backToJob'));
    var BackButton = this.route.snapshot.paramMap.get('BackButton');



    this.ScheduleInterviewForm = this.formBuilder.group({
      InterviewDate: ['', [Validators.required,]],
      InterviewDateTo: ['', [Validators.required,]],
      fromtime: ['', [Validators.required,]],
      totime: ['', [Validators.required,]],
      address: ['', [Validators.nullValidator, Validators.compose([CustomValidators.removeSpaces])]],
      jobdesription: ['', [Validators.nullValidator, , Validators.compose([CustomValidators.removeSpaces])]],
      rolesresponsibility: ['', [Validators.nullValidator, , Validators.compose([CustomValidators.removeSpaces])]],
      StateID: ['', [Validators.required,]],
      DistrictID: ['', [Validators.required,]],
      Location: ['', [Validators.nullValidator,]],

    });

    if (id && backToJob && BackButton) {
      this.getinterview(id, backToJob, BackButton);
    }
    else {
    }

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
    this.NotSuitableCandidateForm = this.formBuilder.group({
      remarkforNotsuitable: ['', [Validators.required, Validators.compose([CustomValidators.removeSpaces])]],
    });



    this.GetWorkLocation();
    this.GetAllStates();
    
    this.GetInterviewList(this.PageNumber, this.from);
  }

  // Code to get company work location on the basis of user id
  GetWorkLocation() {
    var parentid = 0;
    this.interviewService.GetCompanyWorkLocation(parentid).subscribe(res => {
      this.DbResponce = res;

      if (this.DbResponce != null) {
        this.workLocation = this.DbResponce.lstCompanyWorkLocation
      }
    });
  }

  // Code to get the state distric on the basis of work location id 
  LocationResponse: any = [];
  OnLocationChange(Location: any) {
    if (Location == '') {
      this.toastrService.error('Please Select Location');
      this.ScheduleInterviewForm.controls['StateID'].setValue('');
      this.ScheduleInterviewForm.controls['DistrictID'].setValue('');
    }else{
    this.spinnerService.show();
    this.interviewService.GetCompanyWorkLocationstateDistrict(Location).subscribe(res => {
      this.DbResponce = res;
      this.spinnerService.hide();
      if (this.DbResponce != null) {
        this.LocationResponse = this.DbResponce.lstInterviewList[0]
        this.ScheduleInterviewForm.controls['StateID'].setValue(this.LocationResponse.stateid);
        this.GetAllDistrict(this.LocationResponse.stateid, "");
        this.ScheduleInterviewForm.controls['DistrictID'].setValue(this.LocationResponse.districtid);
      }
    });
    this.ScheduleInterviewForm.get('StateID').disable();
    this.ScheduleInterviewForm.get('DistrictID').disable();
  }
  }

/***Code to enter other address on other address check box click if user do not want to use company work location *****/ 
  OtherAddress: any = false;
  ChangeAddress(event: any) {

    this.district = [];
    this.ScheduleInterviewForm.get('StateID').enable();
    this.ScheduleInterviewForm.get('DistrictID').enable();

    if (event) {
      this.OtherAddress = true;
      this.ScheduleInterviewForm.controls['Location'].setValue('');
      this.ScheduleInterviewForm.controls['StateID'].setValue('');
      this.ScheduleInterviewForm.controls['DistrictID'].setValue('');

    }
    else {
      this.OtherAddress = false;
      this.ScheduleInterviewForm.controls['address'].setValue('');
      this.ScheduleInterviewForm.controls['StateID'].setValue('');
      this.ScheduleInterviewForm.controls['DistrictID'].setValue('');
    }
  }
  /***Code to get interview list on the basis of user id *****/ 
  SearchResultInterview:boolean=false;
  GetInterviewResultFilter(PageNumber, from){
    this.SearchResultInterview = true;
    this. GetInterviewList(0, '');
    //this.district = [];
    
 
  }

  GetInterviewList(PageNumber, from) {
    
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
      "Keyword": this.InterviewSearch.controls.SearchKeyInterview.value ? this.InterviewSearch.controls.SearchKeyInterview.value : 'NA',
      "DateFrom": this.InterviewSearch.controls.DateFrom.value,
      "DateTo": this.InterviewSearch.controls.DateTo.value,
      "Location": locationname != '' ? locationname[0]['address'] : 'NA',
    };

    this.pushdata = {
      "DistrictId": this.InterviewSearch.controls.Districtid.value != '' ? parseInt(this.InterviewSearch.controls.Districtid.value) : 0,
      "StateId": this.InterviewSearch.controls.Stateid.value != '' ? parseInt(this.InterviewSearch.controls.Stateid.value) : 0,
      "InterviewDateTo": this.InterviewSearch.controls.DateTo.value != '' ? this.InterviewSearch.controls.DateTo.value : '',
      "InterviewDateFrom": this.InterviewSearch.controls.DateFrom.value != '' ? this.InterviewSearch.controls.DateFrom.value : '',
      "Workloc": this.InterviewSearch.controls.LocationFilter.value != '' ? parseInt(this.InterviewSearch.controls.LocationFilter.value) : 0,
      "SearchKey": this.InterviewSearch.controls.SearchKeyInterview.value,
      "PageNumber": PageNumber,
    };
    if (from == 'scroll') {
      this.spinnerService.show();
      this.interviewService.getInterviewlist(this.pushdata).subscribe(res => {
        this.spinnerService.hide();
        this.DbResponceInterview = res;
        this.InterviewResfinal = this.DbResponceInterview.lstInterviewList;
        if (this.InterviewResfinal!=null) {
          this.InterviewRes = this.InterviewRes.concat(this.InterviewResfinal);                
        } else {         
          this.InterviewRes = [];         
        }
        this.delay = false;
      });
    }
    else {
      this.spinnerService.show();
      this.interviewService.getInterviewlist(this.pushdata).subscribe(res => {
        this.spinnerService.hide();
        this.DbResponceInterview = res;
        
        this.InterviewResfinal = this.DbResponceInterview.lstInterviewList;
        if (this.InterviewResfinal.length) {         
          this.InterviewRes = this.InterviewResfinal;
          this.showErrorMessage=false;
        }
        else {
          this.InterviewRes = []; 
          this.showErrorMessage=true;      
        }
        this.delay = false;
      });
    }
  }
/***Code to get job list on the basis of user id *****/ 
  GetAllAppliedJobList(PageNumber, from) {
    this.InterviewSearch.controls['Stateid'].setValue('');
    this.InterviewSearch.controls['Districtid'].setValue('');
    this.InterviewSearch.controls['DateFrom'].setValue('');
    this.InterviewSearch.controls['DateTo'].setValue('');
    this.InterviewSearch.controls['LocationFilter'].setValue('');
    this.InterviewSearch.controls['SearchKeyInterview'].setValue('');

    //this.InterviewSearch.reset();
    this.ShowPushData = [];
    this.pushdata = [];

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
    let locationname = (this.district).filter(function (entry) {
      return entry.id == districtid;
    });


    this.ShowPushDatajob = {
      "state": statename != '' ? statename[0]['stateName'] : 'NA',
      "district": districtname != '' ? districtname[0]['districtName'] : 'NA',
      "Keyword": this.JobSearch.controls.SearchKeyJob.value ? this.JobSearch.controls.SearchKeyJob.value : 'NA'
    };
    this.pushdatajob = {
      "StateId": this.JobSearch.controls.Stateid.value != '' ? parseInt(this.JobSearch.controls.Stateid.value) : 0,
      "DistrictId": this.JobSearch.controls.Districtid.value != '' ? parseInt(this.JobSearch.controls.Districtid.value) : 0,
      "PageNumber": PageNumber,
      "Keyword": this.JobSearch.controls.SearchKeyJob.value,
      "JobType": this.JobSearch.controls.JobType.value ? this.JobSearch.controls.JobType.value :'ALL',
    };
    if (from == 'scroll') {
      this.spinnerService.show();
      try {
        var jobid = 0;
        this.interviewService.GetAppliedJobs(this.pushdatajob).subscribe(res => {
          this.DbResponce = res
          // this.DbResponce = (this.DbResponce).filter(function (entry) {
          //   return entry.isscrap == false;
          // });
         // alert(this.DbResponce.length);
          this.spinnerService.hide();
          if (this.DbResponce.lstAppliedJobsList != null) {
            this.joblistRes = this.DbResponce.lstAppliedJobsList;
            this.joblist = this.joblist.concat(this.joblistRes);
          }
          else {
            this.joblist = [];
            this.spinnerService.hide();
          }
          this.delay = false;
        });
      } catch  { }
      this.delay = false;

    }
    else {
      this.spinnerService.show();
      this.PageNumberJob = 0;
      try {
        var jobid = 0;
        this.interviewService.GetAppliedJobs(this.pushdatajob).subscribe(res => {
          this.DbResponce = res
          this.spinnerService.hide();
          if (this.DbResponce.lstAppliedJobsList != null) {
            this.joblistRes = this.DbResponce.lstAppliedJobsList;
            this.joblist = this.joblistRes;
           // alert(this.joblist.length);

          }
          else {
            this.joblist = [];
            this.spinnerService.hide();
          }
          this.delay = false;
        });
      } catch  { }
    }
    this.delay = false;


  }
/*** Code to Change time formate 24 hour to 12 hour formate *****/ 
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
  /*** Code to get job detail on the basis of job id *****/ 

  JobId: any
  UserStatus:any;
  GetJobDetail(jobid,userstatus) {
    this.UserStatus = userstatus;
    if(this.UserStatus){
    this.PageNumber = 0;
    this.JobId = jobid;
    this.applicantListshow = false;
    this.InterviewSchedule = true;
    this.JobDetailShow = true;
    this.JobCardShow = false;
    this.BackButton = false;
    this.CreateButton = false;
    this.BackFromJobDetailshow = true;
    //this.BackFromJobDetailshow = false;
    this.ScheduleInterviewForm.controls['StateID'].setValue('');
    this.ScheduleInterviewForm.controls['DistrictID'].setValue('');
    this.GetWorkLocation();
    this.spinnerService.show();
    this.interviewService.GetAppliedJobById(jobid, this.PageNumber).subscribe(res => {
      this.DbResponce = res;
      if (this.DbResponce != null) {
        this.jobs = this.DbResponce;
        this.jobs = this.jobs.lstInterviewJobList[0];
        this.minDate1 = new Date(new Date().setDate(this.minDate.getDate() + 1));
        //this.minDate = new Date(this.minDate.getDate() + 1);
        this.spinnerService.hide();
      }
    });
  }
  else{
    this.toastrService.error('Inactive user not allowed to schedule the interview.');
  }
  }

  private GetAllStates() {
    try {
      this.masterService.GetAllStates().subscribe(res => {
        this.lstState = res
      });
    } catch  { }
  }
  onChangeState(statename: any) {
    this.InterviewSearch.controls['Districtid'].setValue('');
    this.ScheduleInterviewForm.controls['DistrictID'].setValue('');
    this.district = [];
    this.GetAllDistrict(statename, "profile");
  }
  private GetAllDistrict(id: any, From: string) {
    try {
      this.masterService.GetAllDistrict(id).subscribe(res => {
        this.district = res;
      });
    } catch  { }
  }
/*** Code to select all suitable candidate when click on check all on candidate list *****/ 

  selectedAll: any;
  selectAll(e) {
    if (e.target.checked) {
      for (var i = 0; i < this.candidatedetail.length; i++) {
        this.candidatedetail[i].selected = this.selectedAll;
        let index = this.idFormArray.indexOf(this.candidatedetail[i].candId);

        if (this.suitabilityStatus.length != 0) {
          var cnd = this.candidatedetail[i].candId;
          this.ExistingCandidate = (this.suitabilityStatus).filter(function (entry) {
            return entry.Candid == cnd;
          });

          if (this.ExistingCandidate.length != 0) {
            this.idFormArrayOpening.push({
              "Candid": this.candidatedetail[i].candId,
              "openingid": this.candidatedetail[i].jobOpeningId
            });
            if (index < 0) {
              this.idFormArray.push(this.candidatedetail[i].candId);
            }
          } else {
            if (this.candidatedetail[i].isSutable == 1) {
              this.idFormArrayOpening.push({
                "Candid": this.candidatedetail[i].candId,
                "openingid": this.candidatedetail[i].jobOpeningId
              });
              this.suitabilityStatus.push({
                'Candid': this.candidatedetail[i].candId,
                "issuitable": this.candidatedetail[i].isSutable,
                "jobid": this.candidatedetail[i].jodId,
                "openingid": this.candidatedetail[i].jobOpeningId,
                "Sourceid": this.candidatedetail[i].sourceId,
                "SourceType": this.candidatedetail[i].apitype,
                "Remarks": ''
              });
              if (index < 0) {
                this.idFormArray.push(this.candidatedetail[i].candId);
                this.pusharray.push(this.candidatedetail[i].candId);
              }
            }
          }
        } else {

          //To maintain drop down value as previous status that is coming from back end
          var suit = this.candidatedetail[i].isSutable;
          $("#" + "myDropDown" + i).val(suit);

          if (this.candidatedetail[i].isSutable == 1) {
            this.idFormArrayOpening.push({
              "Candid": this.candidatedetail[i].candId,
              "openingid": this.candidatedetail[i].jobOpeningId
            });
            this.suitabilityStatus.push({
              'Candid': this.candidatedetail[i].candId,
              "issuitable": this.candidatedetail[i].isSutable,
              "jobid": this.candidatedetail[i].jodId,
              "openingid": this.candidatedetail[i].jobOpeningId,
              "Sourceid": this.candidatedetail[i].sourceId,
              "SourceType": this.candidatedetail[i].apitype,
              "Remarks": ''
            });
          }
          if (index < 0) {
            // if status changes first and than check all selected -- ends
            if (this.candidatedetail[i].isSutable == 1) {
              this.idFormArray.push(this.candidatedetail[i].candId);
              this.pusharray.push(this.candidatedetail[i].candId);
            }
          }
        }
      }
    } else {
      for (var i = 0; i < this.candidatedetail.length; i++) {
        this.candidatedetail[i].selected = false;
        this.idFormArray = [];
        this.idFormArrayOpening = [];
        this.pusharray = [];
        this.suitabilityStatus = [];
        this.ExistingCandidate = [];
        this.PreviousStatusArray = [];
        this.AddCandidate(this.JobId, 0);
      }
    }
  }
  /***  Functon that is called on click of check box in candidate list    *****/ 
  JobIdSuitable: any;
  OpeningIdSuitable: any;
  CandIdSuitable: any;
  SourceTypeForSuitable: any;
  SourceIdForSuitable: any;
  IsSuitable: any;
  pusharray: any = [];
  ExistingCandidate: any = [];
  idFormArrayOpening: any = [];
  onChange(id: any, isChecked: boolean, jobId: any, openingid: any, candId: any, sourceid: any, sourcetype: any, isSuitable: any, candIndex: any) {
    this.JobIdSuitable = jobId;
    this.OpeningIdSuitable = openingid;
    this.CandIdSuitable = candId;
    this.SourceTypeForSuitable = sourcetype;
    this.SourceIdForSuitable = sourceid;
    this.IsSuitable = isSuitable;
    this.ExistingCandidate = [];

    this.ExistingCandidate = (this.suitabilityStatus).filter(function (entry) {
      return entry.Candid == candId;
    });
    if (isChecked) {
      this.idFormArray.push(id);
      this.idFormArrayOpening.push({
        'Candid': this.CandIdSuitable,
        "openingid": this.OpeningIdSuitable,
      });

      if (this.IsSuitable == 1 || this.IsSuitable == 0 || this.IsSuitable == 2) {
        if (this.ExistingCandidate.length == 0) {
          this.pusharray.push(candId);
          this.suitabilityStatus.push({
            'Candid': this.CandIdSuitable,
            "issuitable": this.IsSuitable,
            "jobid": this.JobIdSuitable,
            "openingid": this.OpeningIdSuitable,
            "Sourceid": this.SourceIdForSuitable,
            "SourceType": this.SourceTypeForSuitable,
            "Remarks": ''
          });
        }
        else {

        }
      }
    }
    else {

      let index = this.idFormArray.indexOf(id);
      let indexofsuitablearray = this.pusharray.indexOf(candId);
      // if select all is checked than individual candidate unchecked
      if (this.selectedAll) {

        //if not suitable or select status candidate unchecked as on check all only 
        // suitable candidate is pushed in the array
        if (index < 0 && indexofsuitablearray < 0) {
          // no need to splice any id as it is not present in the array
        }
        else {
          this.idFormArray.splice(index, 1);
          this.idFormArrayOpening.splice(index, 1);
          this.suitabilityStatus.splice(indexofsuitablearray, 1);
          this.pusharray.splice(indexofsuitablearray, 1);
          this.ExistingCandidate.splice(indexofsuitablearray, 1);
          this.PreviousStatusArray.splice(indexofsuitablearray, 1);
          // code to select the dropdown option via screening module
          var SuitableStatus = this.IsSuitable;
          $("#" + "myDropDown" + candIndex).val(SuitableStatus);

        }
      }
      else {
        this.idFormArray.splice(index, 1);
        this.idFormArrayOpening.splice(index, 1);
        this.suitabilityStatus.splice(indexofsuitablearray, 1);
        this.pusharray.splice(indexofsuitablearray, 1);
        this.ExistingCandidate.splice(indexofsuitablearray, 1);
        this.PreviousStatusArray.splice(indexofsuitablearray, 1);
        // code to select the dropdown option via screening module
        var SuitableStatus = this.IsSuitable;
        $("#" + "myDropDown" + candIndex).val(SuitableStatus);
      }
    }
  }
  NotSuitableRemark: any;
  issuitable: number;
  suitabilityStatus: any = [];
  jobidfornotsuitable: any;
  candidfornotsuitable: any;
  openingidfornotsuitable: any;
  sourcetypefornotsuitable: any;
  sourceidfornotsuitable: any;
  NotSuitable: boolean = false;
  CandName: any;
  ListIndex: any;
/***  function call while change the suitable / not suitable drop down    *****/ 
  JobSuitability(templatefornotsuitable: TemplateRef<any>, status: number, candid: any, candname: any, jobid: any, openingid: any, sourcetype: any, sourceid: any, listindex: any) {
    this.CandName = candname;
    this.ListIndex = listindex;
    //For not suitable candidate parameter values
    this.issuitable = status;
    this.candidfornotsuitable = candid;
    this.openingidfornotsuitable = openingid;
    this.jobidfornotsuitable = jobid;
    this.sourcetypefornotsuitable = sourcetype;
    this.sourceidfornotsuitable = sourceid;



    this.ExistingCandidate = [];
    //code to check that cand id is already exist in array
    this.ExistingCandidate = (this.suitabilityStatus).filter(function (entry) {
      return entry.Candid == candid;
    });


    //if candidate already exist with check all condition 
    if (this.ExistingCandidate.length != 0) {
      //status is changed with check all of already exixsting candidate
      if (this.selectedAll) {

        if (status == 2 || status == 1) {
          let indexofsuitablearray = this.pusharray.indexOf(candid);
          this.suitabilityStatus.splice(indexofsuitablearray, 1);
          this.pusharray.splice(indexofsuitablearray, 1);

          this.pusharray.push(candid);
          this.suitabilityStatus.push({
            'Candid': candid,
            "issuitable": status,
            "jobid": jobid,
            "openingid": openingid,
            "Sourceid": sourceid,
            "SourceType": sourcetype,
            "Remarks": ''
          });
        }

        if (status == 0) {
          this.modalsuitable = this.modalService.show(templatefornotsuitable,
            { backdrop: 'static', keyboard: false });
        }

      }
      //when candidate is exist in array and check all is not checked
      else {
        if (status == 1 || status == 2) {
          let indexofsuitablearray = this.pusharray.indexOf(candid);
          this.suitabilityStatus.splice(indexofsuitablearray, 1);
          this.pusharray.splice(indexofsuitablearray, 1);

          // To push suitable candidate status in array
          this.pusharray.push(candid);
          this.suitabilityStatus.push({
            'Candid': candid,
            "issuitable": status,
            "jobid": jobid,
            "openingid": openingid,
            "Sourceid": sourceid,
            "SourceType": sourcetype,
            "Remarks": ''
          });

        }
        if (status == 0) {
          this.modalsuitable = this.modalService.show(templatefornotsuitable,
            { backdrop: 'static', keyboard: false });

        }

      }
      //check all condition ends here

      //if candidate does not exist in the array existing array lenth is zero
    }
    else {
      // existing array lenth is zero means candidate does not exist in array
      if (this.selectedAll) {
        if (status == 2 || status == 1) {
          this.idFormArray.push(candid);
          this.idFormArrayOpening.push({
            'Candid': candid,
            "openingid": openingid,
          });
          this.pusharray.push(candid);
          this.suitabilityStatus.push({
            'Candid': candid,
            "issuitable": status,
            "jobid": jobid,
            "openingid": openingid,
            "Sourceid": sourceid,
            "SourceType": sourcetype,
            "Remarks": ''
          });

        }
        if (status == 0) {
          this.modalsuitable = this.modalService.show(templatefornotsuitable,
            { backdrop: 'static', keyboard: false });
        }

      }
      // existing array lenth is zero means candidate does not exist in array and check all is not checked
      else {

        if (status == 1 || status == 2) {
          this.pusharray.push(candid);
          this.suitabilityStatus.push({
            'Candid': candid,
            "issuitable": status,
            "jobid": jobid,
            "openingid": openingid,
            "Sourceid": sourceid,
            "SourceType": sourcetype,
            "Remarks": ''
          });
        }
        if (status == 0) {
          this.modalsuitable = this.modalService.show(templatefornotsuitable,
            { backdrop: 'static', keyboard: false });
        }

      }

    }
  }
/*** while click on close in not suitable pop up    *****/ 
  CloseNotSuitableRemark() {
    this.modalsuitable.hide()
    this.PreviousStatusArray = [];
    var candIdStatus = this.candidfornotsuitable;
    this.PreviousStatusArray = (this.suitabilityStatus).filter(function (entry) {
      return entry.Candid == candIdStatus;
    });
    if (this.PreviousStatusArray.length != 0) {
      var SuitableStatus = this.PreviousStatusArray[0].issuitable;
      $("#" + "myDropDown" + this.ListIndex).val(SuitableStatus);
    }
    else if (this.PreviousStatusArray.length == 0) {
      this.PreviousStatusArray = [];
      this.PreviousStatusArray = (this.candidatedetail).filter(function (entry) {
        return entry.candId == candIdStatus;
      });

      var beforeChecked = this.PreviousStatusArray[0].isSutable;
      $("#" + "myDropDown" + this.ListIndex).val(beforeChecked);

    }
    else {
      var SuitableStatusNull = 2;
      $("#" + "myDropDown" + this.ListIndex).val(beforeChecked);
    }

  }
  /**** function that is called when not suitable remark is submitted    *****/ 
  SubmitNotSuitableRemark() {
    if (this.NotSuitableCandidateForm.value.remarkofrejection == '') {
      this.NotSuitableCandidateForm.controls['remarkofrejection'].setValue('');
      return false;
    }
    //if candidate does not exist in the array existing array lenth is zero 
    if (this.ExistingCandidate.length == 0) {
      if (this.selectedAll) {
        this.idFormArray.push(this.candidfornotsuitable);
        this.idFormArrayOpening.push({
          'Candid': this.candidfornotsuitable,
          "openingid": this.openingidfornotsuitable,
        });
        this.pusharray.push(this.candidfornotsuitable);
        this.suitabilityStatus.push({
          'Candid': this.candidfornotsuitable,
          'issuitable': this.issuitable,
          'jobid': this.jobidfornotsuitable,
          'openingid': this.openingidfornotsuitable,
          "Sourceid": this.sourceidfornotsuitable,
          "SourceType": this.sourcetypefornotsuitable,

          'Remarks': this.NotSuitableCandidateForm.value.remarkforNotsuitable.trim(),
        });

      } else {
        this.pusharray.push(this.candidfornotsuitable);
        this.suitabilityStatus.push({
          'Candid': this.candidfornotsuitable,
          'issuitable': this.issuitable,
          'jobid': this.jobidfornotsuitable,
          'openingid': this.openingidfornotsuitable,
          "Sourceid": this.sourceidfornotsuitable,
          "SourceType": this.sourcetypefornotsuitable,

          'Remarks': this.NotSuitableCandidateForm.value.remarkforNotsuitable.trim(),
        });

      }
    }

    //To splice already suitable candidate from array
    else if (this.ExistingCandidate.length != 0) {
      let indexofsuitablearray = this.pusharray.indexOf(this.candidfornotsuitable);
      this.suitabilityStatus.splice(indexofsuitablearray, 1);
      this.pusharray.splice(indexofsuitablearray, 1);


      this.pusharray.push(this.candidfornotsuitable);
      this.suitabilityStatus.push({
        'Candid': this.candidfornotsuitable,
        'issuitable': this.issuitable,
        'jobid': this.jobidfornotsuitable,
        'openingid': this.openingidfornotsuitable,
        "Sourceid": this.sourceidfornotsuitable,
        "SourceType": this.sourcetypefornotsuitable,

        'Remarks': this.NotSuitableCandidateForm.value.remarkforNotsuitable.trim(),
      });
    }
    this.modalsuitable.hide();
    this.NotSuitableCandidateForm.reset();


  }
/****     *****/ 
  InterviewRedirection() {
    this.JobSearch.controls['Stateid'].setValue('');
    this.JobSearch.controls['Districtid'].setValue('');
    this.JobSearch.controls['SearchKeyJob'].setValue('');
    this.ShowPushDatajob = [];
    this.pushdatajob = [];
    this.ScheduleInterviewForm.reset();
    this.idFormArray = [];
    this.router.navigate(['/scheduleinterview']);
    this.applicantListshow = false;
    this.InterviewSchedule = false;
    this.JobDetailShow = false;
    this.JobCardShow = false;
    this.InterviewListShow = true;
    this.CreateButton = true;
    this.BackButton = false;
  }

  /* function that is called on click on submit button while scheduling interview */
  SuitableCandidate: any = [];
  FilteredResult: any = [];
  filteredCandidateArray: any = [];

  ScheduleInterview(jobid: any) {
    var str = this.ScheduleInterviewForm.value.InterviewDate;
    this.startDate = this.ScheduleInterviewForm.value.InterviewDate;
    this.EndDate = this.ScheduleInterviewForm.value.InterviewDateTo;
    this.startDate = moment(this.startDate).format('MM/DD/YYYY');
    this.EndDate = moment(this.EndDate).format('MM/DD/YYYY');
    let MinTime = this.ScheduleInterviewForm.value.fromtime;
    let Maxtime = this.ScheduleInterviewForm.value.totime;
    if (this.idFormArray.length > 0 && this.suitabilityStatus.length > 0) {
      if ((this.ScheduleInterviewForm.value.address == null || this.ScheduleInterviewForm.value.address == '') &&
        (this.ScheduleInterviewForm.value.Location == 0 || this.ScheduleInterviewForm.value.Location == null || this.ScheduleInterviewForm.value.Location == '')) {
        this.interviewformValid = true;                                                                                                                                                                                                                                                                                                                                                                                                            
        this.toastrService.error('Please Enter Address');
        return false;
      }
      if (this.startDate > this.EndDate) {
        this.interviewformValid = true;
        this.toastrService.error('To Date Can Not be Less than From Date.');
        //this.DateMsg = false;
        return false;
      } else {
        this.interviewformValid = false;
        this.DateMsg = true;
      }

      if (MinTime < '06.00' || Maxtime > '23.00') {
        this.interviewformValid = true;
        this.toastrService.error('Please enter interview time between 6 AM to 10 PM.');
        //this.TimeRange = false;
        return false;
      }
      else {
        this.interviewformValid = false;
        this.TimeRange = true;
      }

      if (MinTime > Maxtime) {
        this.interviewformValid = true;
        this.TimeMsg = false;
       this.toastrService.error('Please enter interview time between 6 AM to 10 PM.');
        return false;
      } else {
        this.interviewformValid = false;
        this.TimeMsg = true;
      }

      for (var i = 0; i < this.suitabilityStatus.length; i++) {

        for (var j = 0; j < this.idFormArray.length; j++) {

          var a = this.suitabilityStatus[i].Candid;
          if (this.idFormArray[j] == a) {
            this.SuitableCandidate.push({
              "candId": this.suitabilityStatus[i].Candid,
              "jobId": this.suitabilityStatus[i].jobid,
              "jobOpeningId": this.suitabilityStatus[i].openingid,
              "isSuitable": parseInt(this.suitabilityStatus[i].issuitable),
              "Sourceid": this.suitabilityStatus[i].Sourceid,
              "SourceType": this.suitabilityStatus[i].SourceType,
              "Remarks": this.suitabilityStatus[i].Remarks
            });
          }
        }
      }
      if (this.SuitableCandidate.length != 0) {
        this.interviewformValid = false;
        this.FilteredResult = (this.SuitableCandidate).filter(function (entry) {
          return entry.isSuitable == 1;
        });

        if (this.FilteredResult.length != 0) {
          this.SuitableCandidate = (this.SuitableCandidate).filter(function (entry) {
            return entry.isSuitable != 2;
          });
          this.interviewformValid = false;
          this.interviewService.UpdateSuitabilityStatusOfAppliedCandidate(this.SuitableCandidate).subscribe(res => {
            this.DbResponce = res
          });
        } else {
          this.toastrService.error('Please select atleast one suitable candidate.');
          this.SuitableCandidate = [];
          this.CandidateArray = [];
          this.interviewformValid = true;
          return false;
        };
      }
      this.filteredCandidateArray = (this.SuitableCandidate).filter(function (entry) {
        return entry.isSuitable == 1;
      });

      for (let index = 0; index < this.idFormArrayOpening.length; index++) {
        for (let index1 = 0; index1 < this.filteredCandidateArray.length; index1++) {
          var b = this.idFormArrayOpening[index].Candid;
          if (this.filteredCandidateArray[index1].candId == b) {
            this.CandidateArray.push({
              "CandId": this.idFormArrayOpening[index].Candid,
              "jobOpeningId": this.idFormArrayOpening[index].openingid,
              "InterviewDateFrom": this.startDate,
              "InterviewDateTo": this.EndDate,
              "InterviewTo": this.ScheduleInterviewForm.value.totime,
              "InterviewFrom": this.ScheduleInterviewForm.value.fromtime
            });
          }
        }
      }

      this.interviewId = 0;
      var scheduleinterviewdetail = {};
      scheduleinterviewdetail = JSON.stringify({
        "StateId": this.ScheduleInterviewForm.value.StateID ? this.ScheduleInterviewForm.value.StateID : this.LocationResponse.stateid,
        "DistrictId": this.ScheduleInterviewForm.value.DistrictID ? this.ScheduleInterviewForm.value.DistrictID : this.LocationResponse.districtid,
        "InterviewDateFrom": this.startDate,
        "InterviewDateTo": this.EndDate,
        "InterviewTo": this.ScheduleInterviewForm.value.totime,
        "InterviewFrom": this.ScheduleInterviewForm.value.fromtime,
        "Address": this.ScheduleInterviewForm.value.address,
        "Workloc": this.ScheduleInterviewForm.value.Location ? this.ScheduleInterviewForm.value.Location : 0,
        "JobDescription": this.ScheduleInterviewForm.value.jobdesription,
        "RolesAndResponsibility": this.ScheduleInterviewForm.value.rolesresponsibility,
        "interviewId": this.interviewId,
        "CandidateList": this.CandidateArray,
        "UserId": this.UserInfo.id,
        "JobId": jobid,
      });
      try {
        this.spinnerService.show();
        this.interviewService.addInterviewschedule(scheduleinterviewdetail).subscribe(res => {
          this.DbResponce = res
          this.spinnerService.hide();
          this.toastrService.success(this.DbResponce.message);

          this.formdata = [];
          this.ScheduleInterviewForm.reset();
          this.router.navigate(['/scheduleinterview']);
          this.GetInterviewList(this.PageNumber, this.from);
          this.JobDetailShow = false;
          this.InterviewSchedule = false;
          this.interviewformValid = true;
          this.AddCandidateCount = 1;
          this.idFormArray = [];
          this.FilteredResult = [];
          this.filteredCandidateArray = [];
          this.idFormArrayOpening = [];
          this.SuitableCandidate = [];
          this.suitabilityStatus = [];
          this.ExistingCandidate = [];
          this.PreviousStatusArray = [];
          this.pusharray = [];
          this.applicantListshow = false;
          this.BackFromJobDetailshow = false;
          this.JobCardShow = false;
          this.InterviewListShow = true;
          this.AddCandidateButton = true;
          this.BackButton = false;
          this.CreateButton = true;
        });
      } catch  { }



    }
    else {
      this.toastrService.error("Please select atleast one suitable candidate.");
      return false;
    }

  }
  InterviewSchedulePage() {
    this.PageNumberJob = 0;
    this.showErrorMessage=false;
    this.GetAllAppliedJobList(this.PageNumberJob, this.from);
    this.JobCardShow = true;
    this.InterviewListShow = false;
    this.BackButton = true;
    this.BackFromJobDetailshow = false;
    this.CreateButton = false;
    //this.InterviewSearch.reset();
    this.InterviewSearch.controls['Stateid'].setValue('');
    this.InterviewSearch.controls['Districtid'].setValue('');
    this.InterviewSearch.controls['DateFrom'].setValue('');
    this.InterviewSearch.controls['DateTo'].setValue('');
    this.InterviewSearch.controls['LocationFilter'].setValue('');
    this.InterviewSearch.controls['SearchKeyInterview'].setValue('');
    this.ScheduleInterviewForm.reset();
  }
  BackToJobList() {
    this.AddCandidateCount = 1;
    this.JobCardShow = true;
    this.AddCandidateButton = true;
    this.applicantListshow = false;
    this.JobDetailShow = false;
    this.InterviewListShow = false;
    this.BackButton = true;
    this.CreateButton = false;
    this.BackFromJobDetailshow = false;
    this.InterviewSchedule = false;
    this.OtherAddress = false;
    this.formdata = [];
    this.idFormArray = [];
    this.candidatedetail = [];
    this.suitabilityStatus = [];
    this.idFormArrayOpening = [];
    this.pusharray = [];
    this.ExistingCandidate = [];
    this.PreviousStatusArray = [];
    this.SerialNumber = 1;
    this.selectedAll = false;
    this.ScheduleInterviewForm.reset();
  }



  GetInterviewId(InterviewId: any, JobId: any) {
    localStorage.setItem('Interviewid', InterviewId);
    localStorage.setItem('JobId', JobId);
  }
/* Fonction that is called on click og add candidate button to show candidate list */
  AddCandidateButton: boolean = true;
  AddCandidate(jobid: any, totalAppliedCandidate: any) {
    if (this.AddCandidateCount == 1) {
      this.AddCandidateButton = false;
      if (this.dtTrigger != null)
        this.dtTrigger.unsubscribe();
      this.candidatedetailList = null;
      this.candidatedetail = null;
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
      let InterviewId = 0;
      this.applicantListshow = true;
      let postData = {
        "JobId": jobid,
        "InterviewId": InterviewId,
      };
      this.candidatedetail = [];
      this.spinnerService.show();
      this.interviewService.GetCandidateList(postData).subscribe(res => {
        this.DbResponce = res;
        this.spinnerService.hide();
        this.candidatedetailList = this.DbResponce.lstAppliedCandForInterview;
        if (this.candidatedetailList != null) {
          this.candidatedetail = this.candidatedetailList;
          this.dtTrigger.next();
        }
      });
    }
    this.AddCandidateCount++;
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
    if (this.dtTrigger != null)
      this.dtTrigger.unsubscribe();
  }
  SerialNumber: number = 1;

  redirection: any = '';
  CandidateListing: number = 0;
  BackToAppliedJob() {
    this.router.navigate(['/AppliedJob2', { jid: parseInt(this.JobIdRecieved), ViewJob: 1, CandidateListing: 1 }]);
}

  getinterview(id, backToJob, BackButton) {
    this.applicantListshow = true;
    this.JobDetailShow = true;
    this.backToJob = '1';
    this.JobCardShow = true;
    this.InterviewListShow = false;
    this.CreateButton = true;
    this.BackFromJobDetailshow = false;
    this.BackButton = false;
    this.redirectingFromApplication = false;
    this.GetJobDetail(id,true);


  }

  CandidateId: any;
  selectedRow: any;
  setClickedRow(index) {
    this.selectedRow = index;
  }

  SelectCandidateFromModal() {
    this.candidatedetail[this.selectedRow].selected = true;
    this.idFormArray.push(this.CandidateId);
  }
/**   */
  openpiaData(JobID: any, JobopeningID: any, candiID: any, apitype: any) {
    this.mymodel.GetPiaContactDetails(JobID, JobopeningID, candiID, apitype);
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
    this.district = [];
    this.GetInterviewList(this.PageNumber, '');

  }
  ResetFilterResultforjob() {
    this.PageNumberJob = 0;
    this.JobSearch.controls['Stateid'].setValue('');
    this.JobSearch.controls['Districtid'].setValue('');
    this.JobSearch.controls['SearchKeyJob'].setValue('');
    this.district = [];
    this.GetAllAppliedJobList(this.PageNumberJob, '');

  }
  scroll(el) {
    el.scrollIntoView();
  }

  screeningAnswer: any = [];
  modalScreening: BsModalRef;
  appliedCandidate: any;
  index: any;
  result: any;
  ScrStatus: any;
  openscreeningModal(templateSector: TemplateRef<any>, appliedjob, i) {

    this.appliedCandidate = appliedjob;
    this.ScrStatus = appliedjob.isSutable;
    this.index = i;
    let postScrData = {
      'jobid': appliedjob.jodId,
      'jobopeningid': appliedjob.jobOpeningId,
      'candid': appliedjob.candId
    };
    this.spinnerService.show();
    this.screeningAnswer = [];
    this.interviewService.getScreeningAnswer(appliedjob.jodId, appliedjob.jobOpeningId, appliedjob.candId).subscribe(res => {
      this.spinnerService.hide();
      this.result = res
      if (this.result.getquestiongroup[0].groupList.length) {
        this.modalScreening = this.modalService.show(templateSector, { class: 'modal-md' });
        this.screeningAnswer = this.result.getquestiongroup[0];
      } else {
        this.toastrService.error('server error')
      }
    });
  }


  closeScreeningModal() {
    this.modalScreening.hide();
  }
  CandDetail: any = [];
  selectSuitable(templatefornotsuitable: TemplateRef<any>, value: any, appliedjob: any, i: any) {
    this.CandDetail = appliedjob;
    this.modalScreening.hide();

    // code to select the dropdown option via screening module
    var SuitableStatus = value;
    $("#" + "myDropDown" + i).val(SuitableStatus);
    //this.candidatedetail[i].suitableCand = value;
    this.JobSuitability(templatefornotsuitable, value, this.CandDetail.candId, this.CandDetail.candName, this.CandDetail.jodId, this.CandDetail.jobOpeningId, this.CandDetail.apitype, this.CandDetail.sourceId, i);
  }
}
