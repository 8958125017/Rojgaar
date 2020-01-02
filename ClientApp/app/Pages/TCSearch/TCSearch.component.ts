import { Component, OnInit, ViewChild, ElementRef, HostListener, TemplateRef } from '@angular/core';
import { Router, ActivatedRoute, Params, RouterModule } from '@angular/router';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { RegistrationService } from '../../Services/registration.service';
import { AuthenticationService } from '../../Services/authenticate.service';
import { TCSearchService } from '../../Services/tcsearch.service';
import { CookieService } from 'ngx-cookie-service';
import { AppConfig } from '../../Globals/app.config';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
import { ToastrService, ToastContainerDirective } from 'ngx-toastr';
import { Http } from '@angular/http';
import { CustomValidators } from '../../Validators/custom-validator.directive';
import { strictEqual } from 'assert';
import { stringify } from 'querystring';
import { OutputType } from '@angular/core/src/view';
import { MasterService } from '../../Services/master.service';
import * as $ from 'jquery';
import * as factory from 'jquery';
import { TypeaheadMatch } from 'ngx-bootstrap';
import { Options } from 'ng5-slider';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { BsModalService } from 'ngx-bootstrap/modal';
import { CandidateService } from '../../Services/candidate.service';
import { CommonViewLayoutComponent } from '../CommonModelView/CommonView-Layout.Component';
@Component({
  selector: 'app-tcsearchComponent',
  templateUrl: './TCSearch.component.html',
})
export class TCSearchComponent implements OnInit {
  UserInfo: any;
  TCSearchForm: FormGroup;
  sector: any = [];
  states: any = [];
  searchTcDetail: any = [];
  district1: any = [];
  id: any;
  status: boolean = true;
  showTclist: boolean = false;
  searchItem: boolean = false;
  ShowPushData: any;
  pageNumber: number = 0;
  from: any;
  searchTcData: any;
  postData: any;
  DbResponce: any = {};
  tcDetails: any;
  delay: boolean = false;
  pushdata: any = [];
  GetData: any = [];
  sectors: any = [];
  TraidLists: any = [];


  Stateid: any;
  Batchid: any;
  districtid: any;
  Sector2: any;
  tcName: any;
  ShowView: boolean = false;

  constructor(
    private http: Http,
    private router: Router,
    private spinnerService: Ng4LoadingSpinnerService,
    private cookieService: CookieService,
    private authenticationService: AuthenticationService,
    private masterService: MasterService,
    private toastrService: ToastrService,
    private forgotPasswordBuilder: FormBuilder,
    private activatedRoute: ActivatedRoute,
    private updatePasswordBuilder: FormBuilder,
    private formBuilder: FormBuilder,
    public appConfig: AppConfig,
    private _cookieService: CookieService,
    private tcSearchService: TCSearchService,
    private config: AppConfig,
    private modalService: BsModalService,
    private candidateService: CandidateService,
  ) {
    this.UserInfo = appConfig.UserInfo;
    this.appConfig.isverified();
  }

  modalRef: BsModalRef;
  modalRefdesc: BsModalRef;
  modaldefualt: BsModalRef;
  viewProfile: boolean = false;
  delayed: boolean = false;
  @ViewChild(CommonViewLayoutComponent) private mymodel: CommonViewLayoutComponent;
  @HostListener('window:scroll', ['$event'])
  scrollHandler1(event) {
    if (this.ShowView) {
      let pos = (document.documentElement.scrollTop || document.body.scrollTop) + document.documentElement.offsetHeight;
      let max = document.documentElement.scrollHeight;
      if (pos >= (0.8 * max)) {
        if (this.delay) {
          return
        }
        this.delay = true;
        if (this.tcDetails.length >= 10) {
          this.pageNumber = this.pageNumber + 1;
          this.searchDataTc(this.pageNumber, 'scroll')
        }
      }
    } else if (this.batchStatus) {
      let pos = (document.documentElement.scrollTop || document.body.scrollTop) + document.documentElement.offsetHeight;
      let max = document.documentElement.scrollHeight;
      if (pos >= (0.8 * max)) {
        if (this.delay) {
          return
        }
        this.delay = true;
        if (this.batchcodeId.length >= 10) {
          //
          this.pageNumber = this.pageNumber + 1;

          this.batchCode(this.batchCodeIdReturn, this.pageNumber, 'scroll')
        }
      }
    }
    else {
      let pos = (document.documentElement.scrollTop || document.body.scrollTop) + document.documentElement.offsetHeight;
      let max = document.documentElement.scrollHeight;
      if (pos >= (0.8 * max)) {
        if (this.delay) {
          return
        }
        if (this.GetData.length > 0 && this.viewProfile == false) {
          this.pageNumber = this.pageNumber + 1;
          this.SearchCentre(this.pageNumber, 'scroll');
        }
      }
    }
  }



  ngOnInit() {
    this.tcsearchFormInit();
    this.GetAllSector();
    this.GetAllState();
    $('.page-filters h2 a').click(function () {
      $(this).find('i').toggleClass('fa-chevron-down fa-chevron-right');
      $(this).parent().parent().find('.filter-wrapper').slideToggle();
    });
    $('.filter-toggle').click(function () {
      $('.filter-wrapper').slideToggle();
    });
  }

  //form control

  tcsearchFormInit() {
    this.TCSearchForm = this.formBuilder.group({
      Stateid: ['', [Validators.required]],
      Districtid: ['0', ''],
      Sector: ['', ''],
      tcName: ['', ''],
    });
    this.ShowPushData = {
      "TC_state":'',
      "TC_district":'-',
      "Sector": '-',
      "tcName": '-',
    }
  }

  // gat all sector
  GetAllSector() {
    this.tcSearchService.GetAllSector().subscribe(res => {
      this.sector = res
      this.sectors = this.sector.lstSector
    });
  }

  // get all state
  GetAllState() {
    this.masterService.GetAllStates().subscribe(res => {
      this.states = res
      if (this.states != null && this.states.length > 0) {
        this.states = this.states;
      }
    });
  }

  // get district
  GetDistrict(event: any) {
    this.spinnerService.show();
    this.TCSearchForm.controls['Districtid'].setValue('0');
    this.id = event.target.value;
    this.masterService.GetAllDistrict(this.id).subscribe(res => {
      this.district1 = res;
      this.spinnerService.hide();
      if (this.district1 != null && this.district1.length > 0) {
        this.district1 = this.district1;
      }
    });
  }

  tcSearch() {    
    this.from = "";
    this.tcDetails = [];
    this.Stateid = "";
    this.districtid = "";
    this.Sector2 = "";
    this.tcName = "";
    this.pageNumber = 0;
    this.showTclist = true;
    this.searchItem = true;
    this.ShowView = true;
    this.ShowView2 = false;
    let statedid = this.TCSearchForm.value.Stateid;
    let districtid = isNaN(this.TCSearchForm.value.Districtid) ? 0 : parseInt(this.TCSearchForm.value.Districtid);

    let sectorid = this.TCSearchForm.value.Sector;
    let tcName = this.TCSearchForm.value.tcName;
    this.spinnerService.show();
    let statename = (this.states).filter(function (entry) {
      return entry.id == statedid;
    });
    let districtname = "";
    if (this.district1 != null && this.district1.length > 0) {
      districtname = (this.district1).filter(function (entry) {
        return entry.id == districtid;
      });
    }
    let sectorname = ""
    if (this.sectors != null && this.sectors.length > 0) {
      sectorname = (this.sectors).filter(function (entry) {
        return entry.id == sectorid;
      });
    }
    this.ShowPushData = {
      "TC_state": statename[0]['stateName'],
      "TC_district": districtname != '' ? districtname[0]['districtName'] : 'NA',
      "Sector": sectorname != '' ? sectorname[0]['name'] : 'NA',
      "tcName": tcName?tcName:"NA",
    };

    this.Stateid = parseInt(this.TCSearchForm.value.Stateid);
    this.districtid = isNaN(this.TCSearchForm.value.Districtid) ? 0 : parseInt(this.TCSearchForm.value.Districtid);
    this.Sector2 = this.TCSearchForm.controls.Sector.value;
    this.tcName = this.TCSearchForm.value.tcName;
    this.searchDataTc(this.pageNumber, this.from);
  }
  // Search Batch partner
  SearchCentre(pageNumber: any, from: any) {
    if (from == 'scroll') {
      let pushdata = {
        "TC_state": 0,
        "TC_district": 0,
        "Sector": 0,
        "Trade": '',
        "avalibility": 0,
        "TC_name": "",
        "pageNumber": pageNumber,
        "TcId": this.Batchid,
      };

      this.tcSearchService.GetBatchrData(pushdata).subscribe(res => {
        this.DbResponce = res
        if (this.DbResponce != null) {
          this.GetData = this.GetData.concat(this.DbResponce.lstGetRojgaarBatchSearch);
          this.spinnerService.hide();
          this.from = 'scroll';
        } else {
          this.GetData = [];
          this.from = '';
        }
        this.delay = false;
        this.ShowView = false;
        this.showTclist = false;
        this.ShowView2 = true;
      });
    } else {
      let pushdata = {
        "TC_state": 0,
        "TC_district": 0,
        "Sector": 0,
        "Trade": '',
        "avalibility": 0,
        "TC_name": "",
        "pageNumber": pageNumber,
        "TcId": this.Batchid,
      };

      this.masterService.saveUserLogs('Candidate/GetRojgaarBatchSearch/','TC search')
      this.tcSearchService.GetBatchrData(pushdata).subscribe(res => {
        this.DbResponce = res
        if (this.DbResponce != null) {
          this.GetData = this.GetData.concat(this.DbResponce.lstGetRojgaarBatchSearch);
          this.spinnerService.hide();
          this.from = 'scroll';
        }       
      });
    }
    this.ShowView = false;
    this.showTclist = false;
    this.ShowView2 = true;
  }
  //
  // get search data from db by api
  searchDataTc(pageNumber: any, from: any) {

    if (from == 'scroll') {
      this.showTclist = true;
      this.ShowView2 = false;
      this.batchStatus = false;
      this.pushdata = {
        "TC_state": 0,
        "TC_district": 0,
        "Sector": 0,
        "Trade": '',
        "avalibility": 0,
        "TC_name": "",
        "pageNumber": this.pageNumber,
        "TcId": this.tcDetails.id
      };
      this.tcSearchService.GetBatchrData(this.pushdata).subscribe(res => {
        this.GetData = res;
        this.spinnerService.hide();
        this.GetData = this.GetData.lstGetRojgaarBatchSearch;
        this.delay = false;
        //this.searchDataTc(this.pageNumber,'scroll')
      });
      let postData = {
        "StateID": this.Stateid,
        "District": isNaN(this.districtid) ? 0 : this.districtid,
        "SectorID": this.TCSearchForm.controls.Sector.value != '' ? this.TCSearchForm.controls.Sector.value : 0,
        "Tcname": this.TCSearchForm.value.tcName,
        "pageNumber": pageNumber,
        "pageSize": 10,
        "PIAID":0
      };
      
      this.tcSearchService.GetFilterData(postData).subscribe(res => {
        this.DbResponce = res
        this.spinnerService.hide();
        if (this.DbResponce != null) {
          this.tcDetails = this.tcDetails.concat(this.DbResponce.lstTrainingCentre);      
          this.from = 'scroll';
        } else {
          this.tcDetails = [];
          this.from = '';
        }
        this.delay = false;
      });
    } else {
      this.showTclist = true;
      this.ShowView2 = false;
      this.batchStatus = false;
      let postData = {
        "StateID": this.Stateid,
        "District": isNaN(this.districtid) ? 0 : parseInt(this.districtid),
        "SectorID": this.TCSearchForm.controls.Sector.value != '' ? this.TCSearchForm.controls.Sector.value : 0,
        "Tcname": this.TCSearchForm.value.tcName,
        "pageNumber": pageNumber,
        "pageSize": 10,
        "PIAID":0
      };
      // this.masterService.saveUserLogs('MrigsRojgaar/GetTrainingCentreDetail/','TC search').subscribe(res=>{        
      //   var result=res
      // });
      debugger
      this.masterService.saveUserLogs('Candidate/GetRojgaarBatchSearch/','TC search')
      this.tcSearchService.GetFilterData(postData).subscribe(res => {
        this.ShowView = true;
        this.spinnerService.hide();
        this.DbResponce = res;
        if (this.DbResponce != null) {
          this.tcDetails = this.DbResponce.lstTrainingCentre;        
          this.from = '';
        }
        else {
          this.tcDetails = [];
          this.from = '';
        }
      });
    }
  }

  changeStatus() {
    this.status = true;
  }
  ShowView2: boolean = false;
  Getbatchcandidate(canid: any) {

    this.pushdata = {
      "TC_state": 0,
      "TC_district": 0,
      "Sector": 0,
      "Trade": '',
      "avalibility": 0,
      "TC_name": "",
      "pageNumber": 0,
      "TcId": canid
    };

    this.tcSearchService.GetBatchrData(this.pushdata).subscribe(res => {
      this.GetData = res;
      this.GetData = this.GetData.lstGetRojgaarBatchSearch;
      this.Batchid = canid;
      this.ShowView = false;
      this.showTclist = false;
      this.ShowView2 = true;
      this.delay = false;

    });
    this.ShowView = false;
  }
  ListRedirection() {
    this.ShowView = true;
    this.showTclist = true;
    this.ShowView2 = false;
    this.batchStatus = false;
    // alert("this.ShowView 12= = "+this.ShowView);
  }

  response: any;
  batchcodeId: any = [];
  batchStatus = false;
  batchCodeIdReturn: any;

  batchCode(batchCodeIdReturn: any, pageNumberBatch: any, from: any) {

    localStorage.setItem("batchCodeIdReturn", JSON.stringify(batchCodeIdReturn));
    this.batchCodeIdReturn = JSON.parse(localStorage.getItem("batchCodeIdReturn") || "[]"); this.ShowView = false;
    this.showTclist = false;
    this.ShowView = false;
    this.showTclist = false;
    this.ShowView2 = false;
    this.pageNumber = pageNumberBatch;
    let postData = {
      'BatchId': batchCodeIdReturn,
      'PageNumber': this.pageNumber
    }
    if (from == 'scroll') {
      this.spinnerService.show();

      this.tcSearchService.batchData(postData).subscribe(res => {
        this.spinnerService.hide();
        this.batchStatus = true;
        this.response = res;
        if (this.response.lstJobSeachDtl != null) {
          this.batchcodeId = this.batchcodeId.concat(this.response.lstJobSeachDtl);
          this.from = 'scroll';
        } else {
          this.batchcodeId = [];
          this.from = '';
        }
        this.delay = false;
      });
    } else {
      this.tcSearchService.batchData(postData).subscribe(res => {
        this.spinnerService.hide();

        this.response = res;
        this.batchStatus = true;
        if (this.batchcodeId = this.response.lstJobSeachDtl != null) {
          this.batchcodeId = this.response.lstJobSeachDtl;
          this.from = '';
        }
        else {
          this.batchcodeId = [];
          this.from = '';
        }
        this.delay = false;
      });
    }
    this.delay = true;
  }

  batchCodeReturn() {
    this.ShowView = false;
    // alert("this.ShowView = = "+this.ShowView);
    this.showTclist = false;
    this.ShowView2 = true;
    this.batchStatus = false;
  }

  candid: any;
  responseDb: any = [];
  
  viewCandidateDetails(template: TemplateRef<any>, candidateIdView: any) {
    this.mymodel.callMethod(candidateIdView,'DDUGKY');
  }
  ResetFilterResult() {
    this.TCSearchForm.controls['Stateid'].setValue('');
    this.TCSearchForm.controls['Districtid'].setValue('');
    this.TCSearchForm.controls['Sector'].setValue('');
    this.TCSearchForm.controls['tcName'].setValue('');
  
    this.district1 = [];
    this.tcDetails = [];
    this.searchItem = false;

  }

  ///////////////   candiate details ///////////////
}
