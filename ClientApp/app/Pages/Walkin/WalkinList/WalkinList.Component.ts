import { Component, OnInit, ViewChild, TemplateRef, HostListener } from '@angular/core';
import { ToastContainerDirective, ToastrService } from 'ngx-toastr';
import { AppConfig } from '../../../Globals/app.config';
import { UserInfoService } from '../../../Services/userInfo.service.';
import { WalkinPostService } from '../../../Services/walkinpost.service';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
import { BsModalRef, BsModalService } from 'ngx-bootstrap';
import { JobpostService } from '../../../Services/jobpost.service';
import { CompanyProfileService } from '../../../Services/companyprofile.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Options } from 'ng5-slider';
import { MasterService } from '../../../Services/master.service';
import { Router, ActivatedRoute, RouterPreloader } from '@angular/router';
import { Subscription } from 'rxjs';
import { CommonMethodService } from '../../../Services/commonMethod.serive';
@Component({
  selector: 'app-WalkinListComponent',
  templateUrl: './WalkinList.Component.html',
})
export class WalkinListComponent implements OnInit {
  @ViewChild(ToastContainerDirective) toastContainer: ToastContainerDirective;

  UserInfo: any;
  walkindetail: any = [];
  static ID: any = '';
  dbresponse: any = {};
  // jobdetail: any = {};
  DbResponce: any = {};
  pageNumber: number = 0;
  companyprofile: any = '';
  comapnyimage: any = '';


  wlakinListStatus: boolean = false;
  WalkingFilterForm: FormGroup;
  minExp: number = 0;
  maxExp: number = 0;
  minCtc: number = 0;
  maxCtc: number = 0;

  ExpOptions: Options = {
    floor: 0,
    ceil: 20,
    step: 1
  };

  CtcOptions: Options = {
    floor: 0,
    ceil: 250000,
    step: 100
  };

  searchWalkins: any = {
    FunctionAreaId: 0,
    IndustryAreaId: 0,
    minExp: 0,
    maxExp: 0,
    minCtc: 0,
    maxCtc: 0,
  };

  industry = 0;
  functionalarea = 0;
  minctc: number = 0;
  maxctc: number = 0;
  minexp: number = 0;
  maxexp: number = 0;

  Responce: any = {};
  IndustryArea: any = [];
  IndustryAreaSelected: string;
  IndustryAreaSelecteds: any = null;
  FunctionArea: any = [];
  FunctionAreaSelected: string;
  FunctionAreaSelecteds: any = null;
  AreaResponce: any = {};
  from: any;
  delay: boolean = false;
  searchwalkinfromdate: any = '';
  searchwalkintodate: any = '';
  searchsts: number = 1;
  walkinfromdate: any = '';
  walkintodate: any = '';
  public subscription: Subscription;
  minDate: any = '';
  mintoDate: any = '';
   errormsg:any='';

  constructor(private appConfig: AppConfig

    , private toastrService: ToastrService
    , private walkinService: WalkinPostService
    , private spinnerService: Ng4LoadingSpinnerService
    , private modalService: BsModalService
    , private jobpostService: JobpostService
    , private companyProfileService: CompanyProfileService
    , private masterService: MasterService
    , private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router
    , private commonMethodService: CommonMethodService
  ) {
    this.UserInfo = appConfig.UserInfo;
    this.appConfig.isverified();
  }

  @HostListener('window:scroll', ['$event'])
  scrollHandler1(event) {
    let pos = (document.documentElement.scrollTop || document.body.scrollTop) + document.documentElement.offsetHeight;
    let max = document.documentElement.scrollHeight;

    if (pos >= (0.8 * max)) {
      if (this.delay) {
        return
      }
      this.delay = true;
      if (this.walkindetail.length >= 10) {
        this.pageNumber = this.pageNumber + 1;
        this.GetAllWalkins(this.pageNumber, 'scroll')
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

    window.scroll(0, 0);
    var parentid = this.UserInfo.id;

    var redirect = this.route.snapshot.paramMap.get('Redirection');
    var redirection = atob(redirect);
    var wlakinListStatus = atob(this.route.snapshot.paramMap.get('wlakinListStatus'));
    if (redirection == '1') {
      localStorage.removeItem('passData');
      $('.filter-wrapper').slideToggle();
      this.wlakinListStatus = true;
      this.spinnerService.show();
      this.searchWalkins = JSON.parse(localStorage.getItem('searchWalkins'));
      let PushData = JSON.parse(localStorage.getItem('postData'));
      const postData = {
        'FunctionalAreaId': PushData.FunctionalAreaId,
        'IndustryId': PushData.IndustryId,
        'Maxctc': PushData.Maxctc,
        'Minctc': PushData.Minctc,
        'MaxExp': PushData.MaxExp,
        'MinExp': PushData.MinExp,
        "WalkInDate": PushData.searchwalkinfromdate != '' ? PushData.searchwalkinfromdate : '2019-01-22T00:30:37.000Z',
        "WalkinToDate": PushData.searchwalkintodate ? PushData.searchwalkintodate : '2019-01-22T00:30:37.000Z',
        "WalkInId": 0,
        'PageNumber': 0
      };

      this.walkindetail = [];
      this.walkinService.GetFilterData(postData).subscribe(res => {
        this.spinnerService.hide();
        this.DbResponce = res
        if (this.DbResponce != null) {
          this.walkindetail = this.DbResponce.lstCandidateWalkInt;
          localStorage.removeItem('Redirection');
          localStorage.removeItem('Showpushdata');
        } else {
          this.walkindetail = [];
        }
      });
    }

    this.walkingFormInit();
    this.GetAllIndustryArea();
    this.GetAllFunctionArea();
    this. GetFilterWalkins1();
    this.subscription = this.commonMethodService.getMessage().subscribe(message => {
      if (message.status) {
        this.pageNumber = 0;
        this.from = '';
        this.GetAllWalkins(this.pageNumber, this.from);
      }
    });
  }

  walkingFormInit() {
    this.WalkingFilterForm = this.formBuilder.group({
      industry: ['', Validators.nullValidator],
      functionalarea: ['', Validators.nullValidator],
      MinCtc: ['', Validators.nullValidator],
      MaxCtc: ['', Validators.nullValidator],
      MinExp: ['', Validators.nullValidator],
      MaxExp: ['', Validators.nullValidator],
      walkInFromDate: ['', Validators.nullValidator],
      walkInToDate: ['', Validators.nullValidator]
    })
  }

  GetAllIndustryArea() {
    this.masterService.GetAllIndustryArea().subscribe(res => {
      this.Responce = res;
      this.IndustryArea = this.Responce;

      for (var i = 0; i < this.IndustryArea.length; i++) {
        if (this.IndustryArea[i].id == this.searchWalkins.IndustryAreaId) {
          this.IndustryAreaSelected = this.IndustryArea[i].industryName;
          this.IndustryAreaSelecteds = this.IndustryArea[i].industryName;
        }
      }

    });
  }

  GetAllFunctionArea() {
    this.masterService.GetAllFunctionArea().subscribe(res => {
      this.Responce = res;
      this.FunctionArea = this.Responce;
      for (var i = 0; i < this.FunctionArea.length; i++) {
        if (this.FunctionArea[i].id == this.searchWalkins.FunctionAreaId) {
          this.FunctionAreaSelected = this.FunctionArea[i].functionalAreaName;
          this.FunctionAreaSelecteds = this.FunctionArea[i].functionalAreaName;
        }
      }
    });
    this.minDate = new Date();
    this.mintoDate = new Date();
    this.mintoDate.setDate(this.mintoDate.getDate() + 1);
  }






  setId(item) {
    localStorage.setItem('isJobPushed', item.isJobPushed);
    localStorage.setItem('walkInId', item.walkInId);
    localStorage.setItem('isScrap', item.isScrap);
    localStorage.setItem('isClosed', item.isClosed);
    let passData = {
      'walkInDate': item.walkInDate,
      'walkinToDate': item.walkinToDate,
      'keyword': item.keyword,
      'maxExp': item.maxExp,
      'minExp': item.minExp,
      'jobTitle': item.jobTitle,
      'companyName': item.companyName,
      'jobDescription': item.jobDescription,
      'walkinFromTime': item.walkinFromTime,
      'walkinToTime': item.walkinToTime,
      'email': item.email,
      'mobile': item.mobile,
      'venueDetail': item.venueDetail
    };
    localStorage.setItem('passData', JSON.stringify(passData));
  }

  modalRef: BsModalRef;

  AlertBox(template: TemplateRef<any>) {

    this.modalRef = this.modalService.show(template, { class: 'modal-sm' });
  }
  RevokeTemplate(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template, { class: 'modal-sm' });
  }
  PushedTemplate(template: TemplateRef<any>) {

    this.modalRef = this.modalService.show(template, { class: 'modal-sm' });

  }
  declineBox(): void {
    this.modalRef.hide();
  }

  RevokeJob(id: any) {
    this.spinnerService.show();
    this.jobpostService.RevokeJob(id).subscribe(res => {
      this.DbResponce = res
      this.spinnerService.hide();
      if (this.DbResponce.responseResult) {
        this.toastrService.success(this.DbResponce.message);
        this.modalRef.hide();
        this.walkindetail = [];
        this.pageNumber = 0;
        this.from = '';
        this.GetAllWalkins(this.pageNumber, this.from);
      } else {
        this.toastrService.error(this.DbResponce.message);
      }
    });
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
  GetFilterWalkins(){
    this.GetFilterWalkins1() ;
    this.searchsts = 1;
  }

  pageno: any = '';
  from1: any = '';
  postdata: any = {};

  GetFilterWalkins1() {
    this.searchWalkins = [];
    this.walkindetail = [];
    this.pageNumber = 0;
    this.from = '';
    this.searchsts = 0;
    this.wlakinListStatus = true;
    if (this.WalkingFilterForm.value.industry != '') {
      this.industry = parseInt(this.WalkingFilterForm.value.industry);
    } else {
      this.industry = 0;
    }

    if (this.WalkingFilterForm.value.functionalarea != '') {

      this.functionalarea = parseInt(this.WalkingFilterForm.value.functionalarea);
    } else {
      this.functionalarea = 0;
    }



    if (this.WalkingFilterForm.value.walkInFromDate != '') {

      this.searchwalkinfromdate = this.WalkingFilterForm.value.walkInFromDate;
      this.searchwalkinfromdate = new Date(this.searchwalkinfromdate);


    } else {
      this.searchwalkinfromdate = ' ';
    }

    if (this.WalkingFilterForm.value.walkInToDate != '') {

      this.searchwalkintodate = this.WalkingFilterForm.value.walkInToDate;
    } else {
      this.searchwalkintodate = ' ';
    }


    if (this.searchwalkinfromdate != '' && this.searchwalkintodate != '') {
      if (this.searchwalkinfromdate > this.searchwalkintodate) {
        this.toastrService.error('Please Select Valid Date');
        this.searchsts = 0;
        $('.filter-wrapper').slideToggle();
        return false;
      }
    }


    if (this.WalkingFilterForm.value.MinCtc != '') {
      this.minctc = this.WalkingFilterForm.value.MinCtc;
    } else {
      this.minctc = 0;
    }

    if (this.WalkingFilterForm.value.MaxCtc != '') {
      this.maxctc = this.WalkingFilterForm.value.MaxCtc;
    } else {
      this.maxctc = this.maxCtc;
    }

    if (this.WalkingFilterForm.value.MinExp != '') {

      this.minexp = this.WalkingFilterForm.value.MinExp;
    } else {
      this.minexp = 0;
    }
    if (this.WalkingFilterForm.value.MaxExp != '') {

      this.maxexp = this.WalkingFilterForm.value.MaxExp;
    } else {
      this.maxexp = 0;
    }

    let functionalarea;
    let industry;

    industry = this.WalkingFilterForm.value.industry;
    functionalarea = this.WalkingFilterForm.value.functionalarea;

    let IndustryName = (this.IndustryArea).filter(function (entry) {
      return entry.id == industry
    });

    let FunctionalAreaname = (this.FunctionArea).filter(function (entry) {
      return entry.id == functionalarea
    });

    this.searchWalkins = {
      FunctionAreaId: FunctionalAreaname != '' ? FunctionalAreaname[0]['functionalAreaName'] : 'NA',
      IndustryAreaId: IndustryName != '' ? IndustryName[0]['industryName'] : 'NA',
      minExp: this.minExp > 0 ? this.minExp : 'NA',
      maxExp: this.maxExp > 0 ? this.maxExp : 'NA',
      minCtc: this.minCtc > 0 ? this.minCtc : 'NA',
      maxCtc: this.maxCtc > 0 ? this.maxCtc : 'NA',
      searchwalkinfromdate: this.searchwalkinfromdate != '' ? this.searchwalkinfromdate : 'NA',
      searchwalkintodate: this.searchwalkintodate != '' ? this.searchwalkintodate : 'NA'
    };



    localStorage.setItem('searchWalkins', JSON.stringify(this.searchWalkins))
    this.GetAllWalkins(this.pageNumber, this.from);
    // this.WalkingFilterForm.reset();
    // this.WalkingFilterForm.controls['industry'].setValue('');
    // this.WalkingFilterForm.controls['functionalarea'].setValue('');
    // this.WalkingFilterForm.controls['MinCtc'].setValue('');
    // this.WalkingFilterForm.controls['MaxCtc'].setValue('');
    // this.WalkingFilterForm.controls['MinExp'].setValue('');
    // this.WalkingFilterForm.controls['MaxExp'].setValue('');

  }




  GetAllWalkins(pageNumber: any, from: any) {

    this.spinnerService.show();
    if (from == 'scroll') {
      let postData = {
        'FunctionalAreaId': this.functionalarea,
        'IndustryId': this.industry,
        'Maxctc': this.maxCtc,
        'Minctc': this.minCtc,
        'MaxExp': this.maxExp,
        'MinExp': this.minExp,
        "WalkInId": 0,
        "WalkInDate": this.walkinfromdate != '' ? this.walkinfromdate : '2019-01-22T00:30:37.000Z',
        "WalkinToDate": this.walkintodate ? this.walkintodate : '2019-01-22T00:30:37.000Z',
        'PageNumber': pageNumber
      };
      localStorage.setItem('postData', JSON.stringify(postData))
      this.walkinService.GetFilterData(postData).subscribe(res => {
        this.spinnerService.hide();
        this.DbResponce = res
        if (this.DbResponce != null) {
          this.walkindetail = this.walkindetail.concat(this.DbResponce.lstCandidateWalkInt);
          this.from = 'scroll';
        } else {
          this.walkindetail = [];
          this.from = '';
        }
        this.delay = false;
      });
    } else {

      let postData = {
        'FunctionalAreaId': this.functionalarea,
        'IndustryId': this.industry,
        'Maxctc': this.maxCtc,
        'Minctc': this.minCtc,
        'MaxExp': this.maxExp,
        'MinExp': this.minExp,
        "WalkInId": 0,
        'PageNumber': this.pageNumber,
        "WalkInDate": this.WalkingFilterForm.value.walkInFromDate != '' ? this.WalkingFilterForm.value.walkInFromDate : '2019-01-22T00:30:37.000Z',
        "WalkinToDate": this.WalkingFilterForm.value.walkInToDate != '' ? this.WalkingFilterForm.value.walkInToDate : '2019-01-22T00:30:37.000Z'
      };

      localStorage.removeItem('postData');
      localStorage.setItem('postData', JSON.stringify(postData))
      this.masterService.saveUserLogs('CandidateWalkIn/GetCandidateWalkIn/', 'Walkin Search');
      this.walkinService.GetFilterData(postData).subscribe(res => {

        this.spinnerService.hide();
        this.dbresponse = res;
        if (this.dbresponse != null) {

          if (this.dbresponse.lstCandidateWalkInt != null && this.dbresponse.lstCandidateWalkInt!= '') {
          this.errormsg='';
        }else{
          this.errormsg='No Data Found !';
        }
          this.walkindetail = this.dbresponse.lstCandidateWalkInt;
          this.from = '';
        }

        this.delay = false;
      });
    }

  }
  scrapTemplate(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template, { class: 'modal-sm' });
  }

  scrapWalkinTemplate(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template, { class: 'modal-sm' });
  }

  repostWalkin(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template, { class: 'modal-sm' });
  }

  walkinId: any;
  //  closeWalkins:any;
  //  scrapWalkins:any

  //  postWalkin1(id: any,item:any){
  //    this.closeWalkins='';
  //    this.scrapWalkins='';
  //    this.PublishJob(id,item);
  //  }
  // job not post in yuva sampark



  walkinid: any;

  performJobAction(walkinid: any, item: any) {
    this.walkinid = walkinid;
    this.spinnerService.show();
    this.modalRef.hide();
    if (item == 'postwalkin') {
      this.spinnerService.hide();
      this.commonMethodService.post(this.walkinid, 'walkin');   // for post walkin
    } else if (item == 'scrapWalkin') {
      this.commonMethodService.scrap(this.walkinid, 'walkin');   // for scrap walkin
    } else if (item == 'closeWalkin') {
      this.commonMethodService.close(this.walkinid, 'walkin'); // for close walkin
    }
  }

  fromdate: any = '';
  todate: any = '';
  walkindateresponse = '';

  updateWalkinDate(walkinid) {

    var CurrentDate = new Date();

    if (this.fromdate == '') {

      this.toastrService.error('Please select from date');
      return false;
    }

    if (this.todate == '') {

      this.toastrService.error('Please select to date');
      return false;
    }

    if (this.fromdate >= this.todate) {

      this.toastrService.error('Invalid Walkin From Date');
      return false;
    } if (this.todate <= CurrentDate) {
      this.toastrService.error('Walkin to date is must be greater than the current date');
      return false;
    } else {

      let walkindatedata = {
        'WalkInDate': this.fromdate,
        'WalkinToDate': this.todate,
        'WalkInId': walkinid
      }

      this.walkinService.updateWalkinDate(walkindatedata).subscribe(res => {
        if (res) {

          if (res.responseResult == true) {
            this.toastrService.success(res.message);
            this.GetAllWalkins(this.pageNumber, '');
          }
        }

      });
      this.modalRef.hide();
      this.fromdate = '';
      this.todate = '';
    }
  }

  ResetFilterResult() {
    this.minCtc = 0;
    this.maxCtc = 0;
    this.minExp = 0;
    this.maxExp = 0;
    this.WalkingFilterForm.controls['industry'].setValue('');
    this.WalkingFilterForm.controls['functionalarea'].setValue('');
    this.WalkingFilterForm.controls['MinCtc'].setValue(this.minCtc);
    this.WalkingFilterForm.controls['MaxCtc'].setValue(this.maxCtc);
    this.WalkingFilterForm.controls['MinExp'].setValue(this.minExp);
    this.WalkingFilterForm.controls['MaxExp'].setValue(this.maxExp);
    this.walkindetail = [];
    this.wlakinListStatus = true;
    this.GetAllWalkins(this.pageNumber, '');

  }
}
