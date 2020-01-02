import { Component, OnInit, ViewChild, ElementRef, HostListener,TemplateRef } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { RouterModule } from '@angular/router';
import { FormBuilder,  FormGroup, FormControl, Validators } from '@angular/forms';
import { AuthenticationService } from '../../Services/authenticate.service';
import { CookieService } from 'ngx-cookie-service';
import { AppConfig } from '../../Globals/app.config';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
import { ToastrService, ToastContainerDirective } from 'ngx-toastr';
import { Http } from '@angular/http';
import { CustomValidators } from '../../Validators/custom-validator.directive';
import { strictEqual } from 'assert';
import { stringify, parse } from 'querystring';
import { OutputType } from '@angular/core/src/view';
import { MasterService } from '../../Services/master.service';
import * as $ from 'jquery';
import * as factory from 'jquery';
import { TypeaheadMatch } from 'ngx-bootstrap';
import { Options } from 'ng5-slider';
import { PredictiveSearchService } from '../../Services/PredictiveSearch.services';
import { leave } from '@angular/core/src/profile/wtf_impl';
import { Alert } from 'selenium-webdriver';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { CandidateService } from '../../Services/candidate.service';
// import { exists } from 'fs';
import { CommonViewLayoutComponent } from '../CommonModelView/CommonView-Layout.Component';
@Component({
  selector: 'app-PredictiveSearch',
  templateUrl: './PredictiveSearch.component.html',
})
export class PredictiveSearchComponent implements OnInit {
  modalRef: BsModalRef;
  modalRefdesc: BsModalRef;
  modaldefualt: BsModalRef;  // @ViewChild('mdResetPasswordOpen') mdResetPasswordOpen: ElementRef
  @ViewChild(CommonViewLayoutComponent) private mymodel: CommonViewLayoutComponent;
  UserInfo         : any;
  states           : any   = [];
  district         : any   = [];
  id               : any;
  PredictiveSearch : FormGroup;
  sector           : any   = [];
  sectors          : any   = [];
  TraidLists       : any   = [];
  TraidList        : any   = [];
  district1        : any;
  ShwoCards        : boolean;
  GetData          : any    = [];
  pageNumber       : number = 0;
  pageNumberBatch  : number = 0;
  from             : any;
  SearchData       : any  = [];
  pushdata         : any  = [];
  status                  = true;
  response         : any  = [];
  dbResponse       : any  = [];
  batchcodeId      : any  = [];
  candidateId        : any  = {};
  newAttributeShow : any  = [];
  ShowPushData     : any=[];
  responseDb       :any   =[];
  months           :any   =[];
  batchStatus      = false;
  candiDatestatus  = false;
  ShwoCardsStatus  = false;
  viewcandidateinfo:any=[];
  delay: boolean = false;
  batchReturn       :any;
  users             :any;
  viewprofile       :boolean=false;
  batchCodeIdReturn :any;
  constructor(
    private http                      : Http,
    private router                    : Router,
    private spinnerService            : Ng4LoadingSpinnerService,
    private cookieService             : CookieService,
    private authenticationService     : AuthenticationService,
    private masterService             : MasterService,
    private toastrService             :ToastrService,
    private forgotPasswordBuilder     : FormBuilder,
    private activatedRoute            : ActivatedRoute,
    private updatePasswordBuilder     : FormBuilder,
    private formBuilder               : FormBuilder,
    public appConfig                  : AppConfig,
    private _cookieService            : CookieService,
    private PredictiveSearchService   : PredictiveSearchService,
    private config                    : AppConfig,
    private modalService: BsModalService,
    private candidateService: CandidateService,
  ) {
    this.UserInfo = appConfig.UserInfo;
    this.appConfig.isverified();
  }


  ngOnInit() {
    this.GetAllState();
    this.GetAllSector();
    // this.batchCode(this.batchCodeIdReturn,this.pageNumber,this.from);
    $('.page-filters h2 a').click(function () {
   
      $(this).find('i').toggleClass('fa-chevron-down fa-chevron-right');
      $(this).parent().parent().find('.filter-wrapper').slideToggle();      
    });
    $('.filter-toggle').click(function () {
      $('.filter-wrapper').slideToggle();
    });
  
    this.PredictiveSearch = this.formBuilder.group({
          Stateid         : ['', [Validators.required]],
          Districtid      : ['', ''],
         Sector          : ['', [Validators.nullValidator]],
          // Sector          : ['', ''],
          Trade           : ['',''],
         // Availability    : ['', [Validators.required]], 
          Availability    : ['', ''], 
    });
  
    for(var i=1;i<=12;i++){
      this.months.push(i);
    }
    
  }

@HostListener('window:scroll', ['$event'])
scrollHandler(event) {
  let pos = (document.documentElement.scrollTop || document.body.scrollTop) + document.documentElement.offsetHeight;
  let max = document.documentElement.scrollHeight;
  if (pos == max) {
   if(this.batchcodeId.length > 0 && this.viewprofile==false){
    this.pageNumberBatch = this.pageNumberBatch + 1;
    this.batchCode(this.batchCodeIdReturn,this.pageNumberBatch,'scroll');
   }else if(this.GetData.length>0 && this.delay==false){
    this.pageNumber = this.pageNumber + 1;
     this.predictiveSearch(this.pageNumber,'scroll');
   }  
  }
}

  GetAllState() {​
    this.masterService.GetAllStates().subscribe(res => {
      this.states = res
      if (this.states != null && this.states.length > 0) {
        this.states = this.states;
      }
    });

  }

   GetDistrict(event: any) {
    this.delay = false;
    this.pageNumber=0;
    this.spinnerService.show();
    this.PredictiveSearch.controls['Districtid'].setValue('');
    this.id = event.target.value;
    this.masterService.GetAllDistrict(this.id).subscribe(res => {
      this.district1 = res;
      this.spinnerService.hide();
      if (this.district1 != null && this.district1.length > 0) {
        this.district1 = this.district1;
      }
    });
  }

  GetAllSector(){
    this.PredictiveSearchService.GetAllSector().subscribe(res => {
      this.sector = res
      this.sectors = this.sector.lstSector
      });
  }
  onChangeSector(name:any){
    this.GetAllTraidList(name);
   }
   GetAllTraidList(event: any) {
     
     this.PredictiveSearch.controls['Trade'].setValue('');
     if(event){
      this.PredictiveSearchService.GetAllTraidList(event).subscribe(res => {
        this.TraidList = res
        this.TraidLists = this.TraidList.lstTrade;
     
       });
     }else{
      this.PredictiveSearch.controls['Trade'].setValue('');
      this.TraidLists = [];

     }

   }


predictiveSearch(pageNumber:any,from:any) {
//  alert(pageNumber);
//  alert(this.pageNumber);
  this.ShwoCards = true;
  this.status    = false;
  this.batchcodeId = [];
  this.pageNumberBatch = 0;
  this.ShwoCardsStatus = true;
  this.batchStatus = false;
  this.candiDatestatus = false;
 this.spinnerService.show();
  let statedid;
  let districtid;
  let sectorid;
  let traidid;
  statedid       = this.PredictiveSearch.value.Stateid;
  districtid     = this.PredictiveSearch.value.Districtid;
  sectorid       = this.PredictiveSearch.value.Sector;
  traidid        = this.PredictiveSearch.value.Trade;
 
  let statename = (this.states).filter(function (entry){
    return entry.id == statedid;
  });

  let districtname = (this.district1).filter(function (entry){
    return entry.id == districtid;
  });

  let sectorname   = (this.sectors).filter(function(entry){
    return entry.id == sectorid;
  });

  let tradename = (this.TraidLists).filter(function(entry){
    return entry.id == traidid;
  });
  
  
  this.ShowPushData={
      "TC_state": statename!=''?statename[0]['stateName']:'NA',
      "TC_district":districtname!=''?districtname[0]['districtName']:'NA',
      "Sector":sectorname!=''?sectorname[0]['name']:'NA',
      "Trade":tradename!=''?tradename[0]['name']:'NA',
      "avalibility":this.PredictiveSearch.controls.Availability.value ,
      "TC_name":"", 
  };
  this.pushdata = {
    "TC_state": this.PredictiveSearch.controls.Stateid.value != '' ? parseInt(this.PredictiveSearch.controls.Stateid.value):0,
    "TC_district": this.PredictiveSearch.controls.Districtid.value!=''?parseInt(this.PredictiveSearch.controls.Districtid.value):0,
    "Sector":this.PredictiveSearch.controls.Sector.value!=''?this.PredictiveSearch.controls.Sector.value:0,
    "Trade": this.PredictiveSearch.controls.Trade.value != '' ? this.PredictiveSearch.controls.Trade.value:'',
    "avalibility":this.PredictiveSearch.controls.Availability.value,
    "TC_name":"", 
    "pageNumber": this.pageNumber,
    "Tcid":0,
  };


    if(from == 'scroll') {
    this.PredictiveSearchService.GetFilterData(this.pushdata).subscribe( res => {
    this.dbResponse = res;
    //this.GetData = this.GetData.lstGetRojgaarBatchSearch;
   
      this.spinnerService.hide();
    if(this.dbResponse!= null){
   
     // this.GetData = this.GetData.concat(this.GetData);
     this.GetData = this.GetData.concat(this.dbResponse.lstGetRojgaarBatchSearch);

      //  this.from='scroll';
    }else{
      this.GetData = [];
    }
  });
}else{
  this.masterService.saveUserLogs('Candidate/GetRojgaarBatchSearch/','Predictive search');
  this.PredictiveSearchService.GetFilterData(this.pushdata).subscribe( res => {
    this.GetData = res;
    this.GetData = this.GetData.lstGetRojgaarBatchSearch;
     this.spinnerService.hide();
    if(this.GetData!= null){
       this.GetData = this.GetData;
      //  this.from='scroll';
    }else{
      this.GetData = [];
    }
    this.viewprofile==false;
  });
}
    // this.PredictiveSearch.reset('');
    // this.PredictiveSearch.controls['Stateid'].setValue('');
    // this.PredictiveSearch.controls['Districtid'].setValue('');
    // this.PredictiveSearch.controls['Sector'].setValue('');
    // this.PredictiveSearch.controls['Trade'].setValue('');
    // this.PredictiveSearch.controls['Availability'].setValue('');
}



batchCode(batchCodeIdReturn:any,pageNumberBatch:any,from:any){  
    localStorage.setItem("batchCodeIdReturn", JSON.stringify(batchCodeIdReturn));
    this.batchCodeIdReturn = JSON.parse(localStorage.getItem("batchCodeIdReturn") || "[]");
    this.ShwoCardsStatus = false;
    this.candiDatestatus = false;
    this.batchStatus = true;
        if (from == 'scroll') {
          this.spinnerService.show();
          this.PredictiveSearchService.batchCode(batchCodeIdReturn,pageNumberBatch).subscribe(res => {
          this.response = res;
          this.spinnerService.hide();
          if (this.response.lstJobSeachDtl!= null) {
            this.batchcodeId = this.batchcodeId.concat(this.response.lstJobSeachDtl);           
            this.from='scroll';
          }else{
            this.batchcodeId = [];
            this.from='';
          }
          });
      }else{         
          this.PredictiveSearchService.batchCode(batchCodeIdReturn,pageNumberBatch).subscribe(res => {
          this.response = res;
          this.spinnerService.hide();
          if(this.batchcodeId = this.response.lstJobSeachDtl!=null)  
          {
            this.batchcodeId = this.response.lstJobSeachDtl;            
            this.from='';
          }
          else
          {
            this.batchcodeId=[];
            this.from='';
          }
        });
      }
      this.delay=true;
  }

  candid:any;
  viewCandidateDetails(template:TemplateRef<any>,candidateIdView:any)
  { 
    
    this.mymodel.callMethod(candidateIdView,'DDUGKY');    

  }
  batchCodeReturn(){
    this.batchcodeId = [];
    this.delay = false;
    this.pageNumber=0;
    this.ShwoCardsStatus = true;
    this.candiDatestatus = false;
    this.batchStatus = false;
  }

  batchCodeReturnView(){
    this.ShwoCardsStatus = false;
    this.candiDatestatus = false;
    this.batchStatus = true;
    this.viewprofile=false;
    this.delay = false;
    this.pageNumber=0;
  }

  mobilests: any = '0';
  phone: any;
  mobshow(phone1: any) {
    this.mobilests = '1';
    this.phone = phone1;
  }
  ResetFilterResult() {
    this.PredictiveSearch.controls['Stateid'].setValue('');
    this.PredictiveSearch.controls['Districtid'].setValue('');
    this.PredictiveSearch.controls['Sector'].setValue('');
    this.PredictiveSearch.controls['Trade'].setValue('');
    this.PredictiveSearch.controls['Availability'].setValue('');
  
    this.district1 = [];
    this.pushdata.TC_state = 0;
    this.TraidLists = [];

  }
 
///////////////   candiate details ///////////////
} 
