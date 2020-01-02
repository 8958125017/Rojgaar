import { Component, HostListener, OnInit, ViewChild, TemplateRef , Output, EventEmitter} from '@angular/core';
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


@Component({
  selector: 'app-UpdateInterviewComponent',
  templateUrl: './UpdateInterview.Component.html',
})
export class UpdateInterviewComponent implements OnInit {
  modalRef: BsModalRef;
  modalRefdesc: BsModalRef;
  modaldpia: BsModalRef;
  modaldefualt: BsModalRef; 
  modalRefReschedule: BsModalRef;
  @ViewChild(ToastContainerDirective) toastContainer: ToastContainerDirective;
  @ViewChild(CommonViewLayoutComponent) private mymodel: CommonViewLayoutComponent;

  @Output() clicked = new EventEmitter<string>();

  CandidateListForm: FormGroup;
  UserInfo: any;
  DbResponce: any = {};
  DbResponceLocation: any = {};
  DbResponceForCand: any = {};
  InterviewById: any = {};
  lstState: any = [];
  district: any = [];
  DbResponseforList: any = [];
  interviewid: any = {};
  TimeMsg: any = true;
  TimeRange: any = true;
  DateMsg: any = true;


  UpdateScheduleInterviewForm: FormGroup;
  RescheduleInterviewForm: FormGroup;
  SearchCandidateForm: FormGroup;
  interviewformValid = true;
  InterviewSchedule: any = false;
  InterviewReschedule: any = true;
  idFormArray: any = [];
  RescheduleDetail: any = {};

  bsRangeValue: Date[];
  maxDate = new Date();


  formdata: any = [];
  applicantListshow: any = true;
  CandidateList: any = false;
  BackToInterviewList: any = true;
  interviewId: any;
  JobId: any;
  candidatedetail: any = [];
  candidatedetailList: any = [];
  candidatedetailById: any = [];
  jobdetail: any = [];
  JobInterviewListValid: any = true;
  PageNumber: number = 0;
  minDate = new Date();
  startDate: any;
  EndDate: any;
  count: any = [];
  paginationjobid: number;
  CandidateArray: any = [];
  viewcandidatedetails: number = 1;
  workLocation: any = [];
  CommanCandidateList: any = [];
  RescheduleCount = 1;

  dtTrigger = new Subject<any>();// new Subject<any>();
  dtOptions: any = {};
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
  open() {
    const amazingTimePicker = this.atp.open();
    amazingTimePicker.afterClose().subscribe(time => {
    });
  }
  ngOnInit() {

    var userLogin = JSON.parse(localStorage.getItem('UserInfo'));
    if (!userLogin.isVerified) {
      this.router.navigate(['/companyprofile']);
    }
    if(localStorage.getItem('Interviewid')&&localStorage.getItem('JobId')){
      this.interviewid = localStorage.getItem('Interviewid');
      this.JobId = localStorage.getItem('JobId');
    }else{
      this.router.navigate(['/dashboard'])
    }

    this.CandidateListForm = this.formBuilder.group({
      candidatecheck: ['', [Validators.nullValidator,]],
    });
    this.UpdateScheduleInterviewForm = this.formBuilder.group({
      InterviewDate: ['', [Validators.required,]],
      InterviewDateTo: ['', [Validators.required,]],
      fromtime: ['', [Validators.required,]],
      totime: ['', [Validators.required,]],
      address: ['', [Validators.nullValidator, Validators.compose([CustomValidators.removeSpaces])]],
      jobdesription: ['', [Validators.nullValidator, , Validators.compose([CustomValidators.removeSpaces])]],
      rolesresponsibility: ['', [Validators.nullValidator, , Validators.compose([CustomValidators.removeSpaces])]],
      StateID: ['', [Validators.required,]],
      DistrictID: ['', [Validators.required,]],
      interviewid: ['', [Validators.nullValidator,]],
      Location: ['', [Validators.nullValidator,]],
    });
    this.RescheduleInterviewForm = this.formBuilder.group({
      InterviewDate: ['', [Validators.required,]],
      InterviewDateTo: ['', [Validators.required,]],
      fromtime: ['', [Validators.required,]],
      totime: ['', [Validators.required,]],
      jobid: ['', [Validators.nullValidator,]],
      candidateid: ['', [Validators.nullValidator,]],
      interviewid: ['', [Validators.nullValidator,]],
      remarks: ['', [Validators.nullValidator, Validators.compose([CustomValidators.removeSpaces])]],
    });
    this.SearchCandidateForm = this.formBuilder.group({
      searchinput: ['', [Validators.nullValidator]],
    });

    this.GetJobDetail(this.JobId, this.interviewid);

  }
  GetWorkLocation() {
    var parentid = 0;
    this.interviewService.GetCompanyWorkLocation(parentid).subscribe(res => {
      this.DbResponceLocation = res;

      if (this.DbResponce != null) {
        this.workLocation = this.DbResponceLocation.lstCompanyWorkLocation
      }
    });
  }
  LocationResponse: any = [];
  OnLocationChange(Location: any) {
    if (Location == '') {
      this.toastrService.error('Please Select Location');
      this.UpdateScheduleInterviewForm.controls['StateID'].setValue('');
      this.UpdateScheduleInterviewForm.controls['DistrictID'].setValue('');
    }
    this.spinnerService.show();
    this.interviewService.GetCompanyWorkLocationstateDistrict(Location).subscribe(res => {
      this.DbResponce = res;

      if (this.DbResponce != null) {
        this.LocationResponse = this.DbResponce.lstInterviewList[0]
        this.UpdateScheduleInterviewForm.controls['StateID'].setValue(this.LocationResponse.stateid);
        this.GetAllDistrict(this.LocationResponse.stateid, "");
        this.UpdateScheduleInterviewForm.controls['DistrictID'].setValue(this.LocationResponse.districtid);
        this.spinnerService.hide();
      }
    });

  }
  OtherAddress: any = false;
  ChangeAddress(event: any) {
    if (event) {
      this.OtherAddress = true;
      this.UpdateScheduleInterviewForm.controls['Location'].setValue('');
      this.UpdateScheduleInterviewForm.controls['StateID'].setValue('');
      this.UpdateScheduleInterviewForm.controls['DistrictID'].setValue('');

    }
    else {
      this.OtherAddress = false;
      this.UpdateScheduleInterviewForm.controls['address'].setValue('');
      this.UpdateScheduleInterviewForm.controls['StateID'].setValue('');
      this.UpdateScheduleInterviewForm.controls['DistrictID'].setValue('');
    }
  }
  FilteredResult: any = [];
  GetJobDetail(JobId: any, InterviewId: any) {
   
    try {

      this.spinnerService.show();
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
      this.DbResponseforList = [];
      this.CommanCandidateList = [];
      this.FilteredResult = [];
      this.interviewService.CommanCandidateListForInterview(JobId, InterviewId).subscribe(res => {
        this.DbResponseforList = res;
        if (this.DbResponseforList != null) {
          this.CommanCandidateList = this.DbResponseforList.lstCandidateInfo;
          this.dtTrigger.next();
          this.FilteredResult = (this.CommanCandidateList).filter(function (entry) {
            return entry.isscheduled == true;
          });
         
        }
        else {
          this.CommanCandidateList = [];
          this.FilteredResult=[];

        }
      });
      this.interviewService.GetAppliedJobById(JobId, this.PageNumber).subscribe(res => {
        this.DbResponce = res
        this.spinnerService.hide();
        if (this.DbResponce != null) {
          this.jobdetail = this.DbResponce.lstInterviewJobList;
         // this.minDate = new Date(this.jobdetail[0].jobPushedDate);

        }
        else {
          this.jobdetail = [];
          this.spinnerService.hide();
        }
        this.InterviewById = [];
        this.spinnerService.show();
        this.interviewService.getInterviewDetailById(InterviewId).subscribe(res => {
          this.InterviewById = res;
          this.spinnerService.hide();
          if (this.InterviewById != null) {
            this.InterviewById = this.InterviewById.interviewDetail[0];
          }
          else {
            this.InterviewById = [];
            this.spinnerService.hide();
          }
        });
        this.JobInterviewListValid = true;
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
  GetApplicantList() {
    if (this.idFormArray.length > 0) {
      this.applicantListshow = true;
    }
    else {
      this.toastrService.error("please Select Candidate.")
    }
  }

  ValidateTime(fromtime, totime) {

    let MinTime = fromtime;// to get value in input tag
    let Maxtime = totime; // to get value in input tag
    if (MinTime > Maxtime) {
      this.interviewformValid = false;
      this.TimeMsg = false;
    } else {
      this.interviewformValid = true;
      this.TimeMsg = true;
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
  OtherLocation: any;
  UpdateInterview(obj: any) {
    this.GetWorkLocation();
    if (obj.workloc == '0') {
      this.OtherAddress = true;
    }
    else {

      this.OtherAddress = false;
    }
    this.startDate = obj.interviewDateFrom;
    this.EndDate = obj.interviewDateTo;
    this.startDate = new Date(obj.interviewDateFrom);
    this.EndDate = new Date(obj.interviewDateTo);
    this.bsRangeValue = [this.startDate, this.EndDate];
    this.CandidateList = false;
    this.GetAllStates();
    this.InterviewSchedule = true;
    this.UpdateScheduleInterviewForm.controls['InterviewDate'].setValue(this.startDate);
    this.UpdateScheduleInterviewForm.controls['InterviewDateTo'].setValue(this.EndDate);
    this.UpdateScheduleInterviewForm.controls['fromtime'].setValue(obj.interviewFrom);
    this.UpdateScheduleInterviewForm.controls['totime'].setValue(obj.interviewTo);
    this.UpdateScheduleInterviewForm.controls['Location'].setValue(obj.workloc);
    this.UpdateScheduleInterviewForm.controls['StateID'].setValue(obj.stateId);
    this.GetAllDistrict(obj.stateId, "");
    this.UpdateScheduleInterviewForm.controls['DistrictID'].setValue(obj.districtId);
    this.UpdateScheduleInterviewForm.controls['address'].setValue(obj.address);
    this.UpdateScheduleInterviewForm.controls['jobdesription'].setValue(obj.jobDescription);
    this.UpdateScheduleInterviewForm.controls['rolesresponsibility'].setValue(obj.rolesAndResponsibility);
    this.UpdateScheduleInterviewForm.controls['interviewid'].setValue(obj.interviewId);
  }
  ScheduleInterview(jobid: any) {
    var str = this.UpdateScheduleInterviewForm.value.InterviewDate;
    this.startDate = this.UpdateScheduleInterviewForm.value.InterviewDate;
    this.EndDate = this.UpdateScheduleInterviewForm.value.InterviewDateTo;
    let MinTime = this.UpdateScheduleInterviewForm.value.fromtime;
    let Maxtime = this.UpdateScheduleInterviewForm.value.totime;
    var mint = '06.00';
    var maxt = '23.00';

    if (this.idFormArray.length > 0) {
      if (this.UpdateScheduleInterviewForm.value.address == null &&
        (this.UpdateScheduleInterviewForm.value.Location == 0 || this.UpdateScheduleInterviewForm.value.Location == null)) {
        this.interviewformValid = true;
        this.toastrService.error('Please Enter Address');
        return false;
      }
      if (this.startDate > this.EndDate) {
        this.interviewformValid = true;
        this.DateMsg = false;
        return false;
      } else {
        this.interviewformValid = false;
        this.TimeMsg = true;
      }
      if (MinTime < '06.00' || Maxtime > '23.00') {
        this.interviewformValid = true;
        this.TimeRange = false;
        return false;
      }
      else {
        this.interviewformValid = false;
        this.TimeRange = true;
      }
      if (MinTime > Maxtime) {
        this.interviewformValid = true;
        this.TimeMsg = false;
        return false;
      } else {
        this.interviewformValid = false;
        this.TimeMsg = true;
      }
      for (let index = 0; index < this.idFormArray.length; index++) {
        this.CandidateArray.push({
          "CandId": this.idFormArray[index],
          "InterviewDateFrom": this.startDate,
          "InterviewDateTo": this.EndDate,
          "InterviewTo": this.UpdateScheduleInterviewForm.value.totime,
          "InterviewFrom": this.UpdateScheduleInterviewForm.value.fromtime
        });
      }
      var scheduleinterviewdetail = {};
      scheduleinterviewdetail = JSON.stringify({
        "StateId": this.UpdateScheduleInterviewForm.value.StateID,
        "DistrictId": this.UpdateScheduleInterviewForm.value.DistrictID,
        "InterviewDateFrom": this.startDate,
        "InterviewDateTo": this.EndDate,
        "InterviewTo": this.UpdateScheduleInterviewForm.value.totime,
        "InterviewFrom": this.UpdateScheduleInterviewForm.value.fromtime,
        "Address": this.UpdateScheduleInterviewForm.value.address,
        "Workloc": this.UpdateScheduleInterviewForm.value.Location ? this.UpdateScheduleInterviewForm.value.Location : 0,
        "JobDescription": this.UpdateScheduleInterviewForm.value.jobdesription,
        "RolesAndResponsibility": this.UpdateScheduleInterviewForm.value.rolesresponsibility,
        "interviewId": this.UpdateScheduleInterviewForm.value.interviewid,
        "CandidateList": this.CandidateArray,
        "UserId": this.UserInfo.id,
        "JobId": jobid,
      });
      try {
        this.interviewService.addInterviewschedule(scheduleinterviewdetail).subscribe(res => {
          this.DbResponce = res
          this.toastrService.success(this.DbResponce.message);
          this.formdata = [];
          this.UpdateScheduleInterviewForm.reset();
          this.router.navigate(['/scheduleinterview']);
        });
      } catch  { }
    }
    else {
      if (this.UpdateScheduleInterviewForm.value.address == null && (this.UpdateScheduleInterviewForm.value.Location == 0 || this.UpdateScheduleInterviewForm.value.Location == null)) {
        this.interviewformValid = true;
        this.toastrService.error('Please Enter Address');
        return false;
      }
      if (this.startDate > this.EndDate) {
        this.interviewformValid = true;
        this.DateMsg = false;
        return false;
      } else {
        this.interviewformValid = false;
        this.DateMsg = true;
      }
      
      if (MinTime < '06.00' || Maxtime > '23.00') {
        this.interviewformValid = true;
        this.TimeRange = false;
        return false;
      }
      else {
        this.interviewformValid = false;
        this.TimeRange = true;
      }
      if (MinTime > Maxtime) {
        this.interviewformValid = true;
        this.TimeMsg = false;
        return false;
      } else {
        this.interviewformValid = false;
        this.TimeMsg = true;
      }
      var scheduleinterviewdetail = {};
      scheduleinterviewdetail = JSON.stringify({
        "StateId": this.UpdateScheduleInterviewForm.value.StateID,
        "DistrictId": this.UpdateScheduleInterviewForm.value.DistrictID,
        "InterviewDateFrom": this.startDate,
        "InterviewDateTo": this.EndDate,
        "InterviewTo": this.UpdateScheduleInterviewForm.value.totime,
        "InterviewFrom": this.UpdateScheduleInterviewForm.value.fromtime,
        "Address": this.UpdateScheduleInterviewForm.value.address,
        "Workloc": this.UpdateScheduleInterviewForm.value.Location ? this.UpdateScheduleInterviewForm.value.Location : 0,
        "JobDescription": this.UpdateScheduleInterviewForm.value.jobdesription,
        "RolesAndResponsibility": this.UpdateScheduleInterviewForm.value.rolesresponsibility,
        "interviewId": this.UpdateScheduleInterviewForm.value.interviewid,
        "CandidateList": this.CandidateArray,
        "UserId": this.UserInfo.id,
        "JobId": jobid,
      });
      try {
        this.interviewService.addInterviewschedule(scheduleinterviewdetail).subscribe(res => {
          this.DbResponce = res
          this.toastrService.success(this.DbResponce.message);
          this.formdata = [];
          this.UpdateScheduleInterviewForm.reset();
          this.router.navigate(['/scheduleinterview']);
        });
      } catch  { }

    }
  }
  BackToJobList() {
    this.router.navigate(['/scheduleinterview']);
  }

  ExitProfileform() {
    this.InterviewSchedule = false;
  }
  selectedAll: any;
  selectAll(e) {
    if (e.target.checked) {
      for (var i = 0; i < this.candidatedetail.length; i++) {
        this.candidatedetail[i].selected = this.selectedAll;
        let index = this.idFormArray.indexOf(this.candidatedetail[i]);
        if (index < 0) {
          this.idFormArray.push(this.candidatedetail[i].candId);
        }
      }
    } else {
      for (var i = 0; i < this.candidatedetail.length; i++) {
        this.candidatedetail[i].selected = false;
        this.idFormArray = [];
      }
    }
  }

  selectedRow: Number;
  setClickedRow(index) {
    this.selectedRow = index;
  }

 CandidateJobOpeningId:any;
  ViewRescheduleInterview(jobid: any, interviewid: any, candidateid: any, candidateopeningid: any, datefrom: any, dateto: any, timefrom: any, timeto: any, template5: TemplateRef<any>) {
    this.modalRefReschedule = this.modalService.show(template5,
      { backdrop: 'static', keyboard: false });

    this.CandidateJobOpeningId = candidateopeningid;
    this.startDate = datefrom;
    this.EndDate = dateto;
    this.startDate = new Date(datefrom);
    this.EndDate = new Date(dateto);
    this.bsRangeValue = [this.startDate, this.EndDate];
    this.CandidateList = false;
   // this.RescheduleInterviewForm.controls['InterviewDate'].setValue(this.startDate);
   // this.RescheduleInterviewForm.controls['InterviewDateTo'].setValue(this.EndDate);
   // this.RescheduleInterviewForm.controls['fromtime'].setValue(timefrom);
   // this.RescheduleInterviewForm.controls['totime'].setValue(timeto);
    this.RescheduleInterviewForm.controls['jobid'].setValue(jobid);
    this.RescheduleInterviewForm.controls['candidateid'].setValue(candidateid);
    this.RescheduleInterviewForm.controls['interviewid'].setValue(interviewid);
  }
  SubmitRescheduleInterview() {

    this.startDate = this.RescheduleInterviewForm.value.InterviewDate;
    this.EndDate = this.RescheduleInterviewForm.value.InterviewDateTo;
    this.startDate = moment(this.startDate).format('MM/DD/YYYY');
    this.EndDate = moment(this.EndDate).format('MM/DD/YYYY');
    let MinTime = this.RescheduleInterviewForm.value.fromtime;
    let Maxtime = this.RescheduleInterviewForm.value.totime;
    if (this.startDate > this.EndDate) {
      this.interviewformValid = true;
      this.DateMsg = false;
      return false;
    } else {
      this.interviewformValid = false;
      this.DateMsg = true;
    }
    
    if (MinTime < '06.00' || Maxtime > '23.00') {
      this.TimeRange = false;
       this.toastrService.error("Please enter interview time between 6 AM to 10 PM.");
      return false;
    }
    else {
      this.TimeRange = true;
    }
    if (MinTime > Maxtime) {
      this.TimeMsg = false;
      this.toastrService.error('Please enter interview time between 6 AM to 10 PM.');
      return false;
    } else {
      this.TimeMsg = true;
    }
    this.RescheduleDetail.InterviewId = this.RescheduleInterviewForm.value.interviewid;
    this.RescheduleDetail.CandId = this.RescheduleInterviewForm.value.candidateid;
    this.RescheduleDetail.OpeningId = this.CandidateJobOpeningId;
    this.RescheduleDetail.JobId = this.RescheduleInterviewForm.value.jobid;
    this.RescheduleDetail.InterviewDateFrom = this.startDate;
    this.RescheduleDetail.InterviewDateTo = this.EndDate;
    this.RescheduleDetail.InterviewTo = this.RescheduleInterviewForm.value.totime;
    this.RescheduleDetail.InterviewFrom = this.RescheduleInterviewForm.value.fromtime;
    this.RescheduleDetail.Remarks = this.RescheduleInterviewForm.value.remarks;
    if (this.RescheduleCount == 1) {
    try {
      this.spinnerService.show();
      this.interviewService.SetCandidateRescheduleDetail(this.RescheduleDetail).subscribe(res => {
        this.DbResponce = res
        if(this.DbResponce.responseResult == true){
        this.modalRefReschedule.hide();
        //this.toastrService.success(this.DbResponce.message);
        this.toastrService.success('Interview has been Rescheduled Successfully.');
        this.GetJobDetail(this.RescheduleInterviewForm.value.jobid, this.RescheduleInterviewForm.value.interviewid);
        this.RescheduleInterviewForm.reset();
        this.router.navigate(['/updateinterview']);
        }
        else{
          this.spinnerService.hide();
          this.toastrService.error(this.DbResponce.message);

        }
        
      });
    } catch  { }
  }
    this.RescheduleCount++;
 
  }
  ResetRescheduleform(){
    this.RescheduleInterviewForm.reset();
  }
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
}
