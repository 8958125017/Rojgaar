import { Component, OnInit, ViewChild, ElementRef, HostListener } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { RouterModule } from '@angular/router';
import { FormBuilder,  FormGroup, FormControl, Validators } from '@angular/forms';
import { RegistrationService } from '../../Services/registration.service';
import { AuthenticationService } from '../../Services/authenticate.service';
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
import { Alert } from 'selenium-webdriver';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';

@Component({
  selector: 'app-indexComponent',
  templateUrl: './JobSearch.component.html',
})

export class JobSearchComponent implements OnInit {
  @ViewChild('mdResetPasswordOpen') mdResetPasswordOpen: ElementRef
  employerShowStape: number = 0;
  agencyShowStape: number = 0;
  finalShowStapeemplyer: number = 0;
  showcustomemail: number = 0;
  showcustommob: number = 0;
  showcustomtext: number = 0;
  Show: any = 1;
  temp: any='';
  cmail: any = '';
  isFirstOpen = true;
  oneAtATime: boolean = true;
  range: any = 10;
  customvalue: any = {};
  employeevalue: any = {};
  FirstName: string;
  CompanyName: string;
  LastName: string;
  Email: string;
  recoveryToken: string;
  PhoneNo: string;
  UserName: string;
  Password: string;
  UserFrom: string;
  Pan_Number: string;
  Gstn: string;
  DBResponce:any;
  Responce: any = {};
  EmployerForm: FormGroup;
  finalEmployerForm: FormGroup;
  agencyForm: FormGroup;
  finalagencyForm: FormGroup;
  panvalue:any={};
  loading = false;
  ShowChangePassword: boolean = false;
  submitted = false
  result:any;
  cpass: any;
  data: any;
  LoginForm: FormGroup;
  ForgotPasswordForm: FormGroup;
  UpdatePassword: FormGroup;
  confpass:boolean=false
  otpverify:boolean=false
  checkverifymail:boolean=false
  checkverifymobile :boolean=false
  checkverifygstin:boolean=false
  checkverifypan :boolean=false
  checkverifuser :boolean=false
  modelShowStape: boolean = false
  delay: boolean = false;

  LoginResponse: any = {};

  ckUserInfo: any = {};

  Searchjobs: any = {
    FunctionAreaId: 0,
    IndustryAreaId: 0,
    StatesId: 0,
    DistrictId: 0,
    minExp: 0,
    maxExp: 0,
    minCtc: 0,
    maxCtc: 0,
  };
  lsUserInfo: any = {};

  minExp: number = 0;
  maxExp: number = 0;
  minCtc: number = 0;
  maxCtc: number = 0;
  industry:number=0;
  functionalArea:number=0;
  stateArea=0;
  ExpOptions: Options = {
    floor: 1,
    ceil: 20,
    step: 1
  };
  CtcOptions: Options = {
    floor: 0,
    ceil: 250000,
    step: 100
  };

otpget:any;
refineStatus:boolean=true;
scroll:boolean=true;
  constructor(
    private http: Http,
    private router: Router,
    private spinnerService: Ng4LoadingSpinnerService,
    private cookieService: CookieService,
    private authenticationService: AuthenticationService,
    private registService: RegistrationService,
    private masterService : MasterService,
    private toastrService:ToastrService,
    private forgotPasswordBuilder: FormBuilder,
    private activatedRoute: ActivatedRoute,
    private updatePasswordBuilder: FormBuilder,
    private formBuilder: FormBuilder,
    public appConfig: AppConfig,
    private _cookieService: CookieService,
    private config: AppConfig
  ) {
    
    this.Searchjobs = this.masterService.objSearchjobs;
    this.GetCompaniesList();
 //   this.appConfig.isverified();
  }
  PartTime: string;
  FullTime: string;
  Contractual: string;
  ResetFilter() {
    
    this.minExp  = 0;
    this.maxExp  = 0;
    this.minCtc  = 0;
    this.maxCtc  = 0;
    this.PartTime='';
    this.FullTime = '';
    this.Contractual = '';
    this.ShiftTime = [];
    this.industry = 0;
    this.functionalArea=0;
  }
  pageNumber: any = 0;
 @HostListener('window:scroll', ['$event'])
 scrollHandler(event) {
   let pos = (document.documentElement.scrollTop) + document.documentElement.offsetHeight;
   let max = document.documentElement.scrollHeight;
  //  if (pos == max) {
  //    this.pageNumber = this.pageNumber + 1;
  //    if(this.scroll){
  //     this.SearchJobHome(this.pageNumber, 'scroll',1);
  //    }
  //  }
  if (pos >=(0.8 * max)) {
    if (this.delay) {
      return
    }
    this.delay = true;
    if (this.jobList.length >0 ) {
      
      this.pageNumber = this.pageNumber + 1;
      this.SearchJobHome(this.pageNumber,'scroll',1)
    }
  }
  }
  

  Exit() {
    this.refineStatus = true;
    this.showHide = '';
  }

  ngAfterViewInit() {

  }

  scrollContact(el) {
    el.scrollIntoView();
  }
  scollZero()
  {
    window.scroll(0, 0);
  }
  jobiD:any;
  ngOnInit() {
    
    this.jobiD = this.activatedRoute.snapshot.paramMap.get("id");
    if (this.jobiD>0){     
     this.getsubscribeJobDetails(this.jobiD)
    }
    //filter toggle
    $(".mobile-tgl-menu").click(function () {
      $('.search-result-filter').toggleClass('active-search-filter');
    });


    //add fixed class on extra content

    $(window).scroll(function () {
      var y = $(this).scrollTop();
      if (y >= 220) {
        $('.search-result-filter, .ext-content-wrapper').addClass('ps-fixed');
      }
      else {
        $('.search-result-filter, .ext-content-wrapper').removeClass('ps-fixed');
        $('.ext-content-wrapper, .search-result-filter').removeClass('ps-2-fixed');
      }
      });


    $(window).scroll(function () {
      //var x = $(this).scrollTop();
      //if ($(window).scrollTop() + $(window).height() == $(document).height()) {
      //if (x >= 500) {
      //var z = ($(document).height() - 1000);
      if ($(window).scrollTop() + $(window).height() > $(document).height() - 170) {
        $('.ext-content-wrapper, .search-result-filter').removeClass('ps-fixed');
        $('.ext-content-wrapper, .search-result-filter').addClass('ps-2-fixed');
       //$('.ext-content-wrapper').css({ "position": "unset", "width": "auto", "margin-top" : z});
      }
      else {
        $('.ext-content-wrapper, .search-result-filter').removeClass('ps-2-fixed');
      }
    });


    this.scollZero();
     function resize() {
      var x = window.innerHeight;
       $('#scrolldiv').css({ "height" : x });
    };
    resize();
    window.onresize = function () {
      resize();
    };
    this.GetAllIndustryArea();
    this.GetAllFunctionArea();
    this.GetAllStates();
    this.GetCompaniesList()
    this.GetJobStatics();
    this.SearchJobHome(this.pageNumber,'scroll',1);

  }

  FunctionAreaSelectedclears() {
     this.functId=0;
    this.FunctionAreaSelected = null;
    this.jobDetails
    this.Searchjobs.FunctionAreaId = 0;
  }

  IndustryAreaSelectedclears() {
    this.IndusId=0;     
    this.IndustryAreaSelected = null;
    this.Searchjobs.IndustryAreaId = 0;
  }

  StatesSelectedclears() {
    this.stateId=0
    this.StatesSelected = null;
    this.Searchjobs.StatesId = 0;
  }

IndexPage()
{
  this.router.navigate(['/index?']);
  this.jobList = [];
}
  jobList: any = [];
  SearchJobHome(pageNumber, from,src) {   
    if( src==0 ){
      this.ShiftTime='';
      this.minCtc=0;
      this.maxCtc=0;
      this.minExp=0;
      this.maxExp=0;
      if(this.functId > 0 || this.IndusId > 0||this.stateId>0){
        this.industry= this.IndusId ? this.IndusId:'0';
        this.functionalArea=this.functId ? this.functId:'0'; 
        this.stateArea=this.stateId?this.stateId:'0';
      }else{
        this.industry=0;
        this.functionalArea=0;
        this.stateArea=0;
      }      
    }
    if (from == 'click') {      
      // this.IndusId=0;
      // this.functId=0;
      this.pageNumber=0;
      this.Searchjobs.ShiftTime = this.ShiftTime;
      this.Searchjobs.minCtc = this.minCtc;
      this.Searchjobs.maxCtc = this.maxCtc;
      this.Searchjobs.minExp = this.minExp;
      this.Searchjobs.maxExp = this.maxExp;
      this.Searchjobs.IndustryAreaId =  this.industry;
      this.Searchjobs.FunctionAreaId= this.functionalArea;
      this.Searchjobs.StatesId= this.stateArea;
      this.spinnerService.show();
      this.jobList = [];
      this.masterService.SearchJobHome(pageNumber, this.Searchjobs).subscribe(res => {
        this.Responce = res;
        this.spinnerService.hide();
        if (this.Responce != null) {
          this.jobList = this.Responce.lstDashboardJobs;         
        } else {
          this.jobList = [];
        }
        this.delay=false;
      });
    }
    else if (from == 'scroll') {      
      this.spinnerService.show();
      this.masterService.SearchJobHome(pageNumber, this.Searchjobs).subscribe(res => {
        this.spinnerService.hide();
        this.Responce = res;
        if (this.Responce != null) {
          this.jobList = this.jobList.concat(this.Responce.lstDashboardJobs);
        } else {
          this.jobList = [];
        }
        this.delay=false;
      });
    }
    else {

    }
  }
  jobDetails: any[];
  jobs: any;
  showHide: any = '';

  GetHomeJobDetails(item)
  {
       
    this.scroll = false;
    this.refineStatus=false
    this.showHide = 'hide';
    window.scroll(0, 250)
    
    this.jobs = item;
    this.spinnerService.show();
    this.masterService.GetHomeJobDetails(item.jobId).subscribe(res => {
      this.spinnerService.hide();      
      this.Responce = res;
      
      if(this.Responce.lstJobSeachDtl){

        this.jobDetails = this.Responce.lstJobSeachDtl;      
      }         
    });
  }
  
  JobStatics: any = [];
  CompaniesList: any = [];
  GetJobStatics() {
    this.masterService.GetJobStatics().subscribe(res => {
      this.Responce = res;
      if (this.Responce!= null) {
        this.JobStatics = this.Responce[0];
      }

    });
  }
  GetCompaniesList() {
    this.masterService.GetCompaniesList().subscribe(res => {
      this.Responce = res;
      if(this.Responce){
        
        this.CompaniesList= this.Responce;
      }      
    });
  } 

  IndustryAreaSelected: string;
  IndustryArea: any = [];
  GetAllIndustryArea() {
    this.masterService.GetAllIndustryArea().subscribe(res => {
      this.Responce = res;
      this.IndustryArea = this.Responce;
      for (var i = 0; i < this.IndustryArea.length; i++) {
        if (this.IndustryArea[i].id == this.Searchjobs.IndustryAreaId) {
          this.IndustryAreaSelected = this.IndustryArea[i].industryName;
          this.IndustryAreaSelecteds = this.IndustryArea[i].industryName;
        }
      }

    });
  }
  FunctionArea: any = [];
  FunctionAreaSelected: string;
  GetAllFunctionArea() {
    this.masterService.GetAllFunctionArea().subscribe(res => {
      this.Responce = res;
      this.FunctionArea = this.Responce;
      for (var i = 0; i < this.FunctionArea.length; i++) {
        if (this.FunctionArea[i].id == this.Searchjobs.FunctionAreaId) {
          this.FunctionAreaSelected = this.FunctionArea[i].functionalAreaName;
          this.FunctionAreaSelecteds = this.FunctionArea[i].functionalAreaName;
        }
      }
    });
  }
  States: any = [];
  StatesSelected: string;
  GetAllStates() {
    this.masterService.GetAllStates().subscribe(res => {
      this.Responce = res;
      this.States = this.Responce;
      for (var i = 0; i < this.States.length; i++) {
        if (this.States[i].id == this.Searchjobs.StatesId) {
          this.StatesSelected = this.States[i].stateName;
          this.StatesSelecteds = this.States[i].stateName;
        }
      }
    });
  }
  FunctionAreaSelecteds: any = null;
  IndustryAreaSelecteds: any = null;
  StatesSelecteds: any = null;
  
  IndusId:any;
  IndustryAreaOnSelect(event: TypeaheadMatch): void {
    
    this.FunctionAreaSelecteds = event.item;
    this.IndusId = this.FunctionAreaSelecteds.id;


  }
  functId:any
  FunctionAreaOnSelect(event: TypeaheadMatch): void {
    this.IndustryAreaSelecteds = event.item;
    this.functId = this.IndustryAreaSelecteds.id;
    }
  stateId:any;
  StatesOnSelect(event: TypeaheadMatch): void {
    this.StatesSelecteds = event.item;
    this.Searchjobs.DistrictId = 0;
    this.stateId= this.StatesSelecteds.id;

  }


  ShiftTime: any = [];
  onChange(email: string, isChecked: boolean) {
    if (isChecked) {
      this.ShiftTime.push(email);
    } else {
      let index = this.ShiftTime.indexOf(email);
      this.ShiftTime.splice(index, 1);
    }
  }

  getsubscribeJobDetails(jobID:any){
    this.refineStatus = false;  
    this.scroll = false;
    this.showHide = 'hide';   
     // this.jobs = item;
      window.scroll(0, 250)
      this.spinnerService.show();    
      this.masterService.getsubscribeJobDetails(jobID).subscribe(res => {
      this.spinnerService.hide();
      this.Responce = res;      
      if(this.Responce.lstDashboardSearch[0]){   
                            
        this.jobs=this.Responce.lstDashboardSearch[0];
        this.jobDetails = this.Responce.lstDashboardSearch[0].lstHomeJobDetails;      
      }         
    });
  }
  scroll1(el: HTMLElement) {
    el.scrollIntoView();
  }
}
