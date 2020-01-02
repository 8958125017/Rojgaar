import { Component, HostListener, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastContainerDirective, ToastrService } from 'ngx-toastr';
import { AppConfig } from '../../../Globals/app.config';
import { MasterService } from '../../../Services/master.service';
import { Router, ActivatedRoute } from '@angular/router';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
import { JobpostService } from '../../../Services/jobpost.service';
import * as $ from 'jquery';
import { BsModalService, BsModalRef } from 'ngx-bootstrap';
import { Options } from 'ng5-slider';
import * as moment from 'moment';
import { Subscription } from 'rxjs';
import { CommonMethodService } from '../../../Services/commonMethod.serive';
import {AppConstants} from '../../../GlobalError/app-constants'
@Component({
  selector: 'app-JobListComponent',
  templateUrl: './JobList.Component.html',
})
export class JobListComponent implements OnInit {
  @ViewChild(ToastContainerDirective) toastContainer: ToastContainerDirective;
  UserInfo: any;
  CreateUserForm: FormGroup;
  createuserfomvalue: any = {};
  jobdetail: any = [];
  newAttribute: any = {};
  static ID: any = '';
  PageNumber: number = 0;
  from: any;
  DbResponce: any = {};
  element: HTMLElement;
  modalRef: BsModalRef;
  FilterJobList: FormGroup;
  Responce: any = {};
  AreaResponce: any = {};
  ShowPushData: any = {};
  minCtc: number = 0;
  maxCtc: number = 0;
  minExp: number = 0;
  maxExp: number = 0;
  industry: number = 0;
  functionalarea: number = 0;
  minctc: number = 0;
  maxctc: number = 0;
  walkinfromdate: any = '';
  walkintodate: any = '';
  minexp: number = 0;
  maxexp: number = 0;
  PushData: any = {};
  Showpushdata: boolean;
  item: any = '';
  postData: any = {};
  IndustryArea: any = [];
  IndustryAreaSelecteds: any = null;
  IndustryAreaSelected: string;
  Industry: any = [];
  redirection: any;
  revoke: any;
  JobKeyword: any;
  searchsts: number = 1;
  searchwalkinfromdate: any = '';
  searchwalkintodate: any = '';
  loginType: any;

  CtcOptions: Options = {
    floor: 0,
    ceil: 250000,
    step: 100
  };

  ExpOptions: Options = {
    floor: 0,
    ceil: 20,
    step: 1
  };
  delay: boolean = false;
  currentDate: any
  FunctionArea: any = [];
  companyprofile: any = '';
  comapnyimage: any = 'asd';
  companresponsedb: any = [];
  response: any = [];
  jobopeningdetail: any = [];
  public subscription: Subscription;

  showErrorMessage:boolean=false;
  errormsg=AppConstants.generalError_NodataFound;
  constructor(
    private appConfig: AppConfig
    , private toastrService: ToastrService
    , private masterService: MasterService
    , private jobpostService: JobpostService
    , private spinnerService: Ng4LoadingSpinnerService
    , private router: Router
    , private route: ActivatedRoute
    , private formBuilder: FormBuilder
    , private modalService: BsModalService
    , private commonMethodService: CommonMethodService
  ) {
    this.UserInfo = appConfig.UserInfo;
    this.appConfig.isverified();
    this.subscription = this.commonMethodService.getMessage().subscribe(message => {
      if (message.status) {
        this.PageNumber = 0;
        this.from = '';
        this.getJobList();
      }
    });
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
      if (this.jobdetail.length >= 10) {
        this.PageNumber = this.PageNumber + 1;
        this.GetFilterJobsList1(this.PageNumber, 'scroll')
      }
    }
  }

  ngOnInit() {
    
    this.currentDate = moment(new Date()).format("YYYY-MM-DDTHH:mm:00Z");
    this.loginType = sessionStorage.getItem('loginType');
    this.redirection = this.route.snapshot.paramMap.get('Redirection');
    if (this.redirection != null) {
      //  this.revoke='singh';
      $('.filter-wrapper').slideToggle();
      this.Showpushdata = true;
      this.ShowPushData = JSON.parse(localStorage.getItem('PushData'));
      this.getJobList();
    }
    $('.page-filters h2 a').click(function () {
      $(this).find('i').toggleClass('fa-chevron-down fa-chevron-right');
      $(this).parent().parent().find('.filter-wrapper').slideToggle();
    });
    $('.filter-toggle').click(function () {
      $('.filter-wrapper').slideToggle();
    });
    this.filterjobInit();
    this.GetAllIndustryArea();
    this.GetAllFunctionArea();
    this.GetFilterJobsList1(this.PageNumber, '');
  }

  AlertBox(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template, { class: 'modal-sm' });
  }
  RevokeTemplate(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template, { class: 'modal-sm' });
  }
  scrapTemplate(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template, { class: 'modal-sm' });
  }
  PushedTemplate(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template, { class: 'modal-sm' });
  }
  declineBox(): void {
    this.modalRef.hide();
  }
  RcreateTemplate(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template, { class: 'modal-sm' });
  }



  GetAllIndustryArea() {
    this.masterService.GetAllIndustryArea().subscribe(res => {
      this.Industry = res;
      if (this.Industry != null) {
        this.IndustryArea = this.Industry;
      }
    });
  }


  GetAllFunctionArea() {
    this.masterService.GetAllFunctionArea().subscribe(res => {
      this.AreaResponce = res;
      if (this.AreaResponce != null) {
        this.FunctionArea = this.AreaResponce;
      }

    });
  }

  // job not post in yuva sampark


  postJob: any
  jobid: any;

  performJobAction(job: any, item: any) {
    this.jobid = job.jobId;
    this.spinnerService.show();
    this.modalRef.hide();
    if (item == 'postjob') {
      this.commonMethodService.post(this.jobid, 'job');   // for post job
    } else if (item == 'scrapjob') {
      this.commonMethodService.scrap(this.jobid, 'job');   // for scrap job
    } else if (item == 'closeJob') {
      this.commonMethodService.close(this.jobid, 'job'); // for close job
    }
  }


  //revokejob

  RevokeJob(id: any) {
    this.PageNumber = 0;
    this.from = '';
    this.spinnerService.show();
    this.jobpostService.RevokeJob(id).subscribe(res => {
      this.DbResponce = res
      this.spinnerService.hide();
      if (this.DbResponce.responseResult) {
        this.postToYs(id);
        this.jobdetail = [];
        this.toastrService.success(this.DbResponce.message);
        this.modalRef.hide();
        if (this.redirection != null) {
          this.getJobList();
        }
        else {
          this.GetFilterJobsList1(this.PageNumber, this.from);
        }
      } else {
        this.toastrService.error(this.DbResponce.message);
      }
    });
  }

  openingResponse     : any;
  postToYs(jobId:any){   
    this.jobpostService.postToYs(jobId).subscribe(res=>{
      
        this.openingResponse=res;
    })            
}

  setId(id: any, Ispushed: any, isScrap: any, isClosed) {
    
    localStorage.setItem('viewid', id);
    localStorage.removeItem('isRecreate');
    localStorage.removeItem('validNot');
    localStorage.setItem('isdateDisable', 'true');
  }

  setId1(id: any, Ispushed: any, isScrap: any) {
    localStorage.setItem('viewid', id);
    localStorage.setItem('validNot', 'true')
    localStorage.removeItem('isdateDisable');
  }
  GetFilterJobsList(){
   this.GetFilterJobsList1(this.PageNumber, '');
   this.searchsts = 1;
  }

  
GetFilterJobsList1(PageNumbers, from) {
    this.redirection = null;
    this.searchsts = 0;
    if (this.FilterJobList.value.industry != '') {
      this.industry = this.FilterJobList.value.industry;
    } else {
      this.industry = 0;
    }
    if (this.FilterJobList.value.functionalarea != '') {
      this.functionalarea = this.FilterJobList.value.functionalarea;
    } else {
      this.functionalarea = 0;
    }
    if (this.FilterJobList.value.walkInFromDate != '') {
      this.searchwalkinfromdate = this.FilterJobList.value.walkInFromDate;
      this.searchwalkinfromdate = new Date(this.searchwalkinfromdate);
    } else {
      this.searchwalkinfromdate = '';
    }

    if (this.FilterJobList.value.walkInToDate != undefined) {
      this.searchwalkintodate = this.FilterJobList.value.walkInToDate;
    } else {
      this.searchwalkintodate = '';
    }
    if (this.searchwalkinfromdate != '' && this.searchwalkintodate != '') {
      if (this.searchwalkinfromdate > this.searchwalkintodate) {
        this.toastrService.error('Please select valid date');
        this.searchsts = 0;
        $('.filter-wrapper').slideToggle();
        return false;
      }
    }


    if (this.FilterJobList.value.MinCtc != '') {
      this.minctc = this.FilterJobList.value.MinCtc;
    } else {
      this.minctc = 0;
    }

    if (this.FilterJobList.value.MaxCtc != '') {
      this.maxctc = this.FilterJobList.value.MaxCtc;
    } else {
      this.maxctc = 0;
    }

    if (this.FilterJobList.value.MinExp != '') {
      this.minexp = this.FilterJobList.value.MinExp;
    } else {
      this.minexp = 0;
    }

    if (this.FilterJobList.value.MaxExp != '') {
      this.maxexp = this.FilterJobList.value.MaxExp;
    } else {
      this.maxexp = 0;
    }

    this.spinnerService.show();
    let functionalarea;
    let industry;
    industry = this.FilterJobList.value.industry;
    functionalarea = this.FilterJobList.value.functionalarea;
    let IndustryName = (this.IndustryArea).filter(function (entry) {
      return entry.id == industry
    });

    let FunctionalAreaname = (this.FunctionArea).filter(function (entry) {
      return entry.id == functionalarea
    });

    // Show Selected Data
    this.ShowPushData = {};
    this.ShowPushData = {
      "industry": IndustryName != '' ? IndustryName[0]['industryName'] : 'NA',
      "functionalarea": FunctionalAreaname != '' ? FunctionalAreaname[0]['functionalAreaName'] : 'NA',
      "Maxctc": this.maxCtc > 0 ? this.maxCtc : 'NA',
      "Minctc": this.minCtc > 0 ? this.minCtc : 'NA',
      "MaxExp": this.maxExp > 0 ? this.maxExp : 'NA',
      "MinExp": this.minExp > 0 ? this.minExp : 'NA',
      "JobKeyword": this.FilterJobList.value.JobKeyword != '' ? this.FilterJobList.value.JobKeyword : 'NA',
      "searchwalkinfromdate": this.searchwalkinfromdate != '' ? this.searchwalkinfromdate : 'NA',
      "searchwalkintodate": this.searchwalkintodate != '' ? this.searchwalkintodate : 'NA'
    };
    localStorage.setItem('PushData', JSON.stringify(this.ShowPushData));
    if (from == 'scroll') {
      this.PushData = {
        'FunctionalAreaId': this.functionalarea,
        'IndustryId': this.industry,
        'Maxctc': this.maxCtc,
        'Minctc': this.minCtc,
        'MaxExp': this.maxExp,
        'MinExp': this.minExp,
        'PageNumber': this.PageNumber,
        'JobId': 0,
        'JobKeyword': this.FilterJobList.value.JobKeyword,
        'JobInDate': this.FilterJobList.value.walkInFromDate != '' ? this.FilterJobList.value.walkInFromDate : '2019-01-22T00:30:37.000Z',
        'JobToDate': this.FilterJobList.value.walkInToDate != '' ? this.FilterJobList.value.walkInToDate : '2019-01-22T00:30:37.000Z'
      };


      localStorage.setItem('IsSend', JSON.stringify(this.PushData));
      
      this.jobpostService.GetAllJobs(this.PushData).subscribe(res => {
        this.DbResponce = res
        this.spinnerService.hide();
        if (this.DbResponce.lstJobRequest != null && this.DbResponce.lstJobRequest!= '') {
          this.jobdetail = this.jobdetail.concat(this.DbResponce.lstJobRequest);         
        } 
        else {
         // this.jobdetail = [];          
        }
        this.delay = false;
      });
    }
    else {
      this.PageNumber = 0;
      this.PushData = {
        'FunctionalAreaId': this.functionalarea,
        'IndustryId': this.industry,
        'Maxctc': this.maxCtc,
        'Minctc': this.minCtc,
        'MaxExp': this.maxExp,
        'MinExp': this.minExp,
        'PageNumber': this.PageNumber,
        'JobId': 0,
        'JobKeyword': this.FilterJobList.value.JobKeyword,
        'JobInDate': this.searchwalkinfromdate != '' ? this.searchwalkinfromdate : '2019-01-22T00:30:37.000Z',
        'JobToDate': this.searchwalkintodate != '' ? this.searchwalkintodate : '2019-01-22T00:30:37.000Z'
      };
      localStorage.setItem('IsSend', JSON.stringify(this.PushData));
      this.masterService.saveUserLogs('Job/GetJobList/', 'job search')
      this.jobdetail = [];
      this.jobpostService.GetAllJobs(this.PushData).subscribe(res => {
        this.spinnerService.hide();
        this.DbResponce = res              
        if (this.DbResponce.lstJobRequest != null && this.DbResponce.lstJobRequest!= ''&& this.DbResponce.lstJobRequest.length) {
          this.showErrorMessage = false;
          this.jobdetail = this.DbResponce.lstJobRequest;
        } else {
          this.jobdetail = [];
          this.showErrorMessage = true;
        }
        this.delay = false;
      });
    }
    this.Showpushdata = true;
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

  result: any;

  reCreateJob(item) {
    
    let postData = {
      JobId: item.jobId
    }
    this.from = '';
    this.spinnerService.show();
    localStorage.removeItem('viewid');
    localStorage.removeItem('Ispushed');
    localStorage.removeItem('isScrap');
    localStorage.removeItem('isdateDisable');
    localStorage.removeItem('validNot');
    this.jobpostService.reCreateJobs(postData).subscribe(res => {
      this.spinnerService.hide();
      this.result = res
      this.DbResponce = this.result.lstRecreateJob[0]
      if (this.DbResponce != null) {
        this.toastrService.success("Job replicated successfully please edit valid upto date.");
        localStorage.setItem('viewid', this.DbResponce.jobId);
        localStorage.setItem('Ispushed', this.DbResponce.isJobPushed);
        localStorage.setItem('isScrap', this.DbResponce.isScrap);
        localStorage.setItem('isRecreate', 'true');
        localStorage.setItem('isdateDisable', 'true');
        this.router.navigate(['/ViewJob'])
      }
    });
  }


  getJobList() {
    let PushData = JSON.parse(localStorage.getItem('IsSend'));
    this.postData = {
      'FunctionalAreaId': PushData.FunctionalAreaId,
      'IndustryId': PushData.IndustryId,
      'Maxctc': PushData.Maxctc,
      'Minctc': PushData.Minctc,
      'MaxExp': PushData.MaxExp,
      'MinExp': PushData.MinExp,
      'PageNumber': 0,
      'JobId': 0,
      'JobKeyword': PushData.JobKeyword,
    };
    this.spinnerService.show();
    this.jobpostService.GetAllJobs(this.postData).subscribe(res => {
      this.spinnerService.hide();
      this.DbResponce = res
      if (this.DbResponce.lstJobRequest != null && this.DbResponce.lstJobRequest.length) {
        this.showErrorMessage = false;
        if (this.from == 'scroll') {
          this.jobdetail = this.jobdetail.concat(this.DbResponce.lstJobRequest);
        } else {
          this.jobdetail = [];
          if (this.DbResponce.lstJobRequest.length) {
              this.showErrorMessage = false;
              this.jobdetail = this.DbResponce.lstJobRequest;
           }
        }
      } else {
        this.showErrorMessage = true;
        this.jobdetail = [];
      }
      this.delay = false;
    });
  }

  filterjobInit() {
    this.FilterJobList = this.formBuilder.group({
      industry: ['', Validators.nullValidator],
      functionalarea: ['', Validators.nullValidator],
      date: ['', Validators.nullValidator],
      ctc: ['', Validators.nullValidator],
      exp: ['', Validators.nullValidator],
      MinCtc: ['', Validators.nullValidator],
      MaxCtc: ['', Validators.nullValidator],
      MinExp: ['', Validators.nullValidator],
      MaxExp: ['', Validators.nullValidator],
      JobKeyword: ['', Validators.nullValidator],
      walkInFromDate: ['', Validators.nullValidator],
      walkInToDate: ['', Validators.nullValidator]
    })
  }
  ResetFilterResult() {
    
    this.minCtc = 0;
    this.maxCtc = 0;
    this.minExp = 0;
    this.maxExp = 0;
  
    this.FilterJobList.controls['industry'].setValue('');
    this.FilterJobList.controls['functionalarea'].setValue('');
    this.FilterJobList.controls['MinCtc'].setValue(this.minCtc);
    this.FilterJobList.controls['MaxCtc'].setValue(this.maxCtc);
    this.FilterJobList.controls['MinExp'].setValue(this.minExp);
    this.FilterJobList.controls['MaxExp'].setValue(this.maxExp);
    this.FilterJobList.controls['JobKeyword'].setValue('');
    this.jobdetail = [];
    this.searchsts = 0;
    this.GetFilterJobsList1(this.PageNumber, '');

  }

}
