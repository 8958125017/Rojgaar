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
  selector: 'app-OfferLetterComponent',
  templateUrl: './OfferLetter.Component.html',
})
export class OfferLetterComponent implements OnInit {
  modalRefForOffer: BsModalRef;
  modalRef: BsModalRef;
  modalRefdesc: BsModalRef;
  modaldefualt: BsModalRef;
  modaldpia: BsModalRef;
  @ViewChild(ToastContainerDirective) toastContainer: ToastContainerDirective;
  @ViewChild(CommonViewLayoutComponent) private mymodel: CommonViewLayoutComponent;

  @Output() clicked = new EventEmitter<string>();


  dtTrigger = null;// new Subject<any>();
  dtOptions: any = {};

  SelectedCandidateForm: FormGroup;
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
  selectedCand: any = [];
  selectedCandList: any = [];
  viewcandidatedetails: number = 1;
  ImgName: any;
  interviewformValid = true;
  minDate = new Date();
  InterviewSearch: FormGroup;
  JobSearch: FormGroup;
  ShowPushData: any = [];
  pushdata: any = [];
  ShowPushDatajob: any = [];
  pushdatajob: any = [];
  workLocation: any = [];
  offerImagevalid = false;
  offerImage: any;
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
    if (pos >= (0.8 * max)) {
      if (this.delay) {
        return
      }
      this.delay = true;
      if (this.joblist.length >= 10 && this.JobCardShow == true) {
        this.PageNumber = this.PageNumber + 1;
        this.GetAllAppliedJobList(this.PageNumber, 'scroll');
      }
      else if (this.InterviewRes.length >= 10 && this.InterviewCard == true) {
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

    this.SelectedCandidateForm = this.formBuilder.group({
      companyName: ['', [Validators.nullValidator]],
      Location: ['', [Validators.required]],
      CandidateName: ['', [Validators.nullValidator]],
      Designation: ['', [Validators.required, Validators.compose([CustomValidators.removeSpaces])]],
      StateID: ['', [Validators.required,]],
      DistrictID: ['', [Validators.required,]],
      offerDate: ['', [Validators.required,]],
      joiningDate: ['', [Validators.required,]],
      ctc: ['', [Validators.required]],
      // , Validators.compose([CustomValidators.valideCtcNumber])
      jobId: ['', [Validators.nullValidator,]],
      interviewId: ['', [Validators.nullValidator,]],
      candId: ['', [Validators.nullValidator,]],
      ImgName: ['', [Validators.required]],
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
  GetWorkLocation() {
    var parentid = 0;
    this.interviewService.GetCompanyWorkLocation(parentid).subscribe(res => {
      this.DbResponce = res;

      if (this.DbResponce != null) {
        this.workLocation = this.DbResponce.lstCompanyWorkLocation
      }
    });
  }
  joblistResFilter:any=[];
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
          // this.joblistResFilter = (this.DbResponce.lstAppliedJobsList).filter(function (entry) {
          //   return entry.totalAppliedCandidate != 0;
          // });
          this.spinnerService.hide();
          if (this.DbResponce.lstAppliedJobsList != null) {
            //this.joblistRes = this.joblistResFilter
            this.joblistRes = this.DbResponce.lstAppliedJobsList;
            this.joblist = this.joblist.concat(this.joblistRes);
          } else {
            this.joblist = [];
          }
          this.delay = false;
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
          // this.joblistResFilter = (this.DbResponce.lstAppliedJobsList).filter(function (entry) {
          //   return entry.totalAppliedCandidate != 0;
          // });
          this.spinnerService.hide();
          if (this.DbResponce.lstAppliedJobsList != null && this.DbResponce.lstAppliedJobsList.length) {
            //this.joblistRes = this.joblistResFilter
            this.joblistRes = this.DbResponce.lstAppliedJobsList;
            this.joblist = this.joblistRes;
            this.showErrorMessage = false;
          } else {
            this.joblist = [];
            this.showErrorMessage = true;
          }
          this.delay = false;
        });
      } catch  { }
      this.delay = false;
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
      //this.JobSearch.reset();
      this.ShowPushDatajob = [];
      this.pushdatajob = [];
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
          if (this.DbResponceInterview.lstInterviewListByJobId != null) {
            this.InterviewResfinal = this.DbResponceInterview.lstInterviewListByJobId;
            this.InterviewRes = this.InterviewRes.concat(this.InterviewResfinal);
          } else {
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
          //console.log(this.DbResponceInterview);
          //alert(JSON.stringify(this.DbResponceInterview));
          //alert(this.DbResponceInterview.lstInterviewListByJobId.length);
          this.spinnerService.hide();
          if (this.DbResponceInterview.lstInterviewListByJobId.length != 0) {
            this.InterviewResfinal = this.DbResponceInterview.lstInterviewListByJobId;
            this.InterviewRes = this.InterviewResfinal;
          } else {
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

      this.spinnerService.hide();
      if (this.selectedCand != null) {
        this.selectedCandList = this.selectedCand.lstCandidateInfoWalkin;
        this.FilteredResult = (this.selectedCandList).filter(function (entry) {
          return entry.interviewresultstatus == 1;
        });
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
          return entry.interviewresultstatus == 1;
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
    this.InterviewResfinal = [];
    this.InterviewRes = [];
    this.ShowPushData = [];
    this.pushdata = [];
    this.PageForInterview = 0;
    this.JobCardShow = true;
    this.InterviewCard = false;
    this.WalkInDetail = false;
    this.EventDetail = false;

  }

  FilteredResult: any = [];
  GetJobInterviewDetail(jobid: any, interviewid: any) {
    this.PageNumber = 0;
    this.InterviewCard = false;
    this.JobDetailShow = true;
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

    this.interviewService.CommanCandidateListForInterview(jobid, interviewid).subscribe(res => {
      this.selectedCand = res;

      this.spinnerService.hide();
      if (this.selectedCand != null) {
        this.selectedCandList = this.selectedCand.lstCandidateInfo;
        this.FilteredResult = (this.selectedCandList).filter(function (entry) {
          return entry.interviewresultstatus == 1;
        });
        this.dtTrigger.next();

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
    this.WalkInDetail = false;
    this.EventDetail = false;
    this.JobDetailShow = false;
  }
  ResetSelectCandidateForm() {
    this.modalRef.hide()
    this.SelectedCandidateForm.reset();
    this.SelectedCandidateForm.controls['StateID'].setValue('');
    this.SelectedCandidateForm.controls['DistrictID'].setValue('');
  }
  

 

  base64textString: any = [];
  imagename: string = '';
  currentFile: any;
  ValidImageTypes: any = [];
  onUploadChange(evt: any) {
    //this.img = selectFile;
    this.base64textString = [];
    var file: File = evt.target.files[0];
    this.currentFile = file;
    this.ValidImageTypes = ["image/jpeg", "image/png", "image/jpg", , "application/pdf"];

    var mimetypereader = new FileReader();
    mimetypereader.onloadend = this.CheckMimeType.bind(this);
    const Eblob = file.slice(0, 4);
    var data = mimetypereader.readAsArrayBuffer(Eblob);
  }
  CheckMimeType(e) {
    var res = e.target.result;
    let bytes = [];
    const uint = new Uint8Array(res);
    uint.forEach((byte) => {
      bytes.push(byte.toString(16));
    })
    const hex = bytes.join('').toUpperCase();
    var fileType = this.getMimetype(hex);
    if ($.inArray(fileType, this.ValidImageTypes) < 0) {

      this.toastrService.error("Only formats are allowed : jpg, jpeg, png & pdf");
      this.SelectedCandidateForm.controls.ImgName.setValue('');

      return false
    } else {

      var reader = new FileReader();
      var size = Math.round(this.currentFile.size / 1024);
      if (size > 2000) {
        this.toastrService.error("File Size must be less then 2 MB", null, { enableHtml: true });

        this.SelectedCandidateForm.controls.ImgName.setValue('');

        return false;
      }

      reader.onloadend = this.handleReaderLoaded.bind(this);
      var data = reader.readAsBinaryString(this.currentFile);
    }
  }

  getMimetype(signature) {
    switch (signature) {
      case '89504E47':
        return 'image/png'
      case '47494638':
        return 'image/gif'
      case '25504446':
        return 'application/pdf'
      case 'FFD8FFDB':
      case 'FFD8FFE0':
        return 'image/jpeg'
      case '504B0304':
        return 'application/zip'
      default:
        return 'Unknown filetype'
    }
  }
  imgDownloadName: any;
  DownLoadImage: boolean = false;
  ImageExtension: any;
  handleReaderLoaded(e) {
    // this.offerImage = 'data:image/png;base64,' + btoa(e.target.result);
    // this.base64textString.push('data:image/png;base64,' + btoa(e.target.result));
    // for (var i = 0; i < this.base64textString.length; i++) {
    //   this.imagename = '';
    //   this.imagename = this.base64textString[i]
    // }
    var imn = this.currentFile.name;

    var imn2 = imn.split('.');
    // var imn2= imn.split('.');

    this.ImageExtension = imn2[1];
    this.imgDownloadName = imn;
    this.offerImage = 'data:image/png;base64,' + btoa(e.target.result);
    this.base64textString.push('data:image/png;base64,' + btoa(e.target.result));
    for (var i = 0; i < this.base64textString.length; i++) {
      this.imagename = '';
      this.imagename = this.base64textString[i];
    }
    this.DownLoadImage = true;
  }
  CandidateOpeningId: any;
  minOfferDate = new Date();
  DbResponseLocation:any=[];
  GenerateOfferLetter(companyName: any, jobid: any, interviewid: any, candidateid: any, candopeningid: any, candname: any, interviewdate: any, template5: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template5,
      { backdrop: 'static', keyboard: false });
    this.CandidateOpeningId = candopeningid;
    this.minOfferDate = new Date(interviewdate);
    this.SelectedCandidateForm.controls['Location'].setValue(0);
    if(this.JobType == 'Job' || this.JobType == 'WalkIn'){
      this.SelectedCandidateForm.controls['companyName'].setValue(this.jobdetail.companyName);
  
    }else{
      this.SelectedCandidateForm.controls['companyName'].setValue(companyName);

    }
   
    this.SelectedCandidateForm.controls['CandidateName'].setValue(candname);
    this.SelectedCandidateForm.controls['jobId'].setValue(jobid);
    this.SelectedCandidateForm.controls['interviewId'].setValue(interviewid);
    this.SelectedCandidateForm.controls['candId'].setValue(candidateid);
    var parentid = 0;
    this.interviewService.GetCompanyWorkLocation(parentid).subscribe(res => {
      this.DbResponseLocation = res;
      if (this.DbResponseLocation != null) {
        this.workLocation = this.DbResponseLocation.lstCompanyWorkLocation
      }
    });
  }
  LocationResponse: any
  OnLocationChange(Location: any) {

    if (this.SelectedCandidateForm.value.Location == 0 || this.SelectedCandidateForm.value.Location == '') {
      this.SelectedCandidateForm.controls['Location'].setValue(0);
      this.SelectedCandidateForm.controls['StateID'].setValue('');
      this.SelectedCandidateForm.controls['DistrictID'].setValue('');
      return false;
    }
    this.spinnerService.show();
    this.interviewService.GetCompanyWorkLocationstateDistrict(Location).subscribe(res => {
      this.LocationResponse = res;

      if (this.LocationResponse != null) {
        this.LocationResponse = this.LocationResponse.lstInterviewList[0]
        this.SelectedCandidateForm.controls['StateID'].setValue(this.LocationResponse.stateid);
        this.GetAllDistrict(this.LocationResponse.stateid, "");
        this.SelectedCandidateForm.controls['DistrictID'].setValue(this.LocationResponse.districtid);
        this.spinnerService.hide();
      }
    });
    this.SelectedCandidateForm.get('StateID').disable();
    this.SelectedCandidateForm.get('DistrictID').disable();

  }
  GetSelectedcandidateformvalue() {
    var offerDate = this.SelectedCandidateForm.value.offerDate;
    var joiningdate = this.SelectedCandidateForm.value.joiningDate;


    if (this.SelectedCandidateForm.value.Location == '' || this.SelectedCandidateForm.value.Location == null || this.SelectedCandidateForm.value.Location == 0) {
      this.SelectedCandidateForm.controls['Location'].setValue('');
      return false;
    }
    if (this.SelectedCandidateForm.value.Designation == '') {
      this.SelectedCandidateForm.controls['Designation'].setValue('');
      return false;
    }
    if (offerDate > joiningdate) {
      this.interviewformValid = true;
      // this.TimeMsg = false;
      this.toastrService.error("Offer letter date can not be greater than joining date");
      return false;
    } else {
      this.interviewformValid = false;
      this.TimeMsg = true;
    }
    var offerdetails = {};
    offerdetails = JSON.stringify({
      'CompanyName': this.SelectedCandidateForm.value.companyName.trim(),
      'Location': this.SelectedCandidateForm.value.Location.trim(),
      'CandidateName': this.SelectedCandidateForm.value.CandidateName.trim(),
      'Designation': this.SelectedCandidateForm.value.Designation.trim(),
      'StateId': this.SelectedCandidateForm.value.StateID ? this.SelectedCandidateForm.value.StateID : this.LocationResponse.stateid,
      'DistrictId': this.SelectedCandidateForm.value.DistrictID ? this.SelectedCandidateForm.value.StateID : this.LocationResponse.districtid,
      'OfferLetterDate': this.SelectedCandidateForm.value.offerDate,
      'JoiningDate': this.SelectedCandidateForm.value.joiningDate,
      'Ctc': this.SelectedCandidateForm.value.ctc.trim(),
      'JobId': this.SelectedCandidateForm.value.jobId,
      'InterviewId': this.SelectedCandidateForm.value.interviewId,
      'CandId': this.SelectedCandidateForm.value.candId,
      'OpeningId': this.CandidateOpeningId,
      //'imageName': "",
      'imgName': "",
      'Image': this.base64textString[0],
      'Imageexten': this.ImageExtension,
      'InterviewStatus': 1,
      'OfferLetterStatus': 1,
      'Jobtype': this.JobType,
      'Eventid': this.EventId,
    });
     //console.log(offerdetails);

    try {
      this.spinnerService.show();
      this.interviewService.SetCandidateOfferLetterDetail(offerdetails).subscribe(res => {
        this.DbResponce = res
        this.spinnerService.hide();
        this.toastrService.success(this.DbResponce.message);

        if(this.JobType == 'Job'){
        this.interviewService.getSelectedCandidateListByIterviewId(this.SelectedCandidateForm.value.interviewId).subscribe(res => {
          this.selectedCand = res;
          this.selectedCandList = this.selectedCand.lstInterviewListByJobId[0];
        });
       
        this.GetJobInterviewDetail(this.SelectedCandidateForm.value.jobId, this.SelectedCandidateForm.value.interviewId);
        this.SelectedCandidateForm.reset();
        this.interviewformValid = true;
        }
        else if(this.JobType == 'EVENT'){
          this.interviewService.CandidateListForEvent(this.SelectedCandidateForm.value.jobId,0,this.EventId).subscribe(res => {
          //this.interviewService.CandidateListForWalkin(this.SelectedCandidateForm.value.jobId, 0).subscribe(res => {
            this.selectedCand = res;
      
            this.spinnerService.hide();
            if (this.selectedCand != null) {
              this.selectedCandList = this.selectedCand.lstCandidateInfoWalkin;
              this.FilteredResult = (this.selectedCandList).filter(function (entry) {
                return entry.interviewresultstatus == 1;
              });
              this.dtTrigger.next();
      
            }
          });
          this.GetEventDetail(this.SelectedCandidateForm.value.jobId);

        }

        else{
          this.interviewService.CandidateListForWalkin(this.SelectedCandidateForm.value.jobId, 0).subscribe(res => {
            this.selectedCand = res;
      
            this.spinnerService.hide();
            if (this.selectedCand != null) {
              this.selectedCandList = this.selectedCand.lstCandidateInfoWalkin;
              this.FilteredResult = (this.selectedCandList).filter(function (entry) {
                return entry.interviewresultstatus == 1;
              });
              this.dtTrigger.next();
      
            }
          });
          this.GetWalkinDetail(this.SelectedCandidateForm.value.jobId);
        }
       
      });
      this.modalRef.hide();
      this.DownLoadImage = false;
      this.imgDownloadName = '';
      this.SelectedCandidateForm.get('StateID').enable();
      this.SelectedCandidateForm.get('DistrictID').enable();
    } catch  { }
  }
  OfferDoc: any
  DbOfferDetailRes:any=[];
  GetOfferLetterDetail(jobId: any, interviewId: any, CandId: any, template6: TemplateRef<any>) {
    this.modalRefForOffer = this.modalService.show(template6,
      { backdrop: 'static', keyboard: false });
    try {
      this.spinnerService.show();
      this.interviewService.getCandidateOfferLetterDetail(jobId, interviewId, CandId).subscribe(res => {
        this.DbOfferDetailRes = res
        this.spinnerService.hide();
        if (this.DbOfferDetailRes != null) {
          this.OfferletterDetail = this.DbOfferDetailRes.lstCandidateOfferLette[0];
          this.OfferDoc = this.DbOfferDetailRes.lstCandidateOfferLette[0].image;

        }
      });
    } catch  { }
  }
  CloseOfferLetter() {
    this.modalRefForOffer.hide()
    // this.SelectedCandidateForm.reset();
    // this.SelectedCandidateForm.controls['StateID'].setValue('');
    // this.SelectedCandidateForm.controls['DistrictID'].setValue('');
  }


  selectedRow: Number;
  setClickedRow(index) {
    alert(index);
    this.selectedRow = index;
  }


  PiaContacDetials: any = []
  openpiaData(temppia: TemplateRef<any>, JobID: any, JobopeningID: any, candiID: any, apitype: any) {
    //alert(apitype);
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
    this.district = [];
    this.GetAllAppliedJobList(this.PageNumber, '');

  }
  sortF: any;
  changeSort(event) {
    if (!event.order) {
      this.sortF = 'year';
    } else {
      this.sortF = event.field;
    }
  }
}
