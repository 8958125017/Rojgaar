import { Component, OnInit, ViewChild,HostListener, ElementRef,AfterViewInit ,TemplateRef} from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { RouterModule } from '@angular/router';

import { FormBuilder, Validators, FormGroup, FormControl } from '@angular/forms';
import { RegistrationService } from '../../Services/registration.service';
import { AuthenticationService } from '../../Services/authenticate.service';
import { CookieService } from 'ngx-cookie-service';
import { AppConfig } from '../../Globals/app.config';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
import { ToastrService, ToastContainerDirective } from 'ngx-toastr';
import { MasterService } from '../../Services/master.service';
import { Http } from '@angular/http';
import { HttpInterceptor, HttpHandler, HttpRequest, HttpResponse, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CustomValidators } from '../../Validators/custom-validator.directive';
import { strictEqual } from 'assert';
import { stringify } from 'querystring';
import { OutputType } from '@angular/core/src/view';
import * as $ from 'jquery';
import { BsModalRef, BsModalService } from 'ngx-bootstrap';
import {Md5} from "md5-typescript";
import { s } from '@angular/core/src/render3';
import {EncrDecrService} from '../../Services/EncrDecrService';
import { AlertPromise } from 'selenium-webdriver';
import * as CryptoJS from 'crypto-js';
import { areIterablesEqual } from '@angular/core/src/change_detection/change_detection_util';
import * as moment from 'moment';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
declare var google: any;
 
interface Marker {
  lat: number;
  lng: number;
  label?: string;
  draggable: boolean;
}

declare var google: any;


@Component({
  selector: 'app-regisrationComponent',
  templateUrl: './regisration.component.html',
})
export class regisrationComponent implements HttpInterceptor,OnInit, AfterViewInit{

  @ViewChild('mdResetPasswordOpen') mdResetPasswordOpen: ElementRef
  @ViewChild('welcomeModelOpen') welcomeModelOpen: ElementRef

  employerShowStape: number = 0;
  finalShowStape: number = 0;
  employeevalue: any = {};
  modalRef: BsModalRef;
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
  DBResponce: any;
  Responce: any = {};
  ForgotPasswordForm: FormGroup;
  EmployerForm: FormGroup;
  finalEmployerForm: FormGroup;
  panvalue: any = {};
  submitted = false
  result: any;
  cpass: any;
  data: any;
  temp: any = '';
  confpass: boolean = false
  otpverify: boolean = false
  checkverifymail: boolean = false
  checkverifymobile: boolean = false
  checkverifyuser: boolean = false
  otpget: any;
  industialarea: any;
  login: string;
  lsUserInfo: any;
  LoginForm: FormGroup;
  LoginResponse: any = {};
  Welcome: string = '';
  tokenid:any;
  loginType:any;
  UserInfo:any;
  Encstring:string='';
  base64textString:any=[];
  loginTime:any;
  previousCheck:boolean=false;
  GMLtlgStatus:boolean=true;
  CityForMap:any;
  DistForMap:any;
  StateForMap:any;
  GoogleMapState:any;
  MapLatititute:any;
  MapLongitute:any;
  MapAddress:any;
  GeoLocationText:boolean=false;
  DefMapAddress:any;

  constructor(
    private http: Http,
    private router: Router,
    private spinnerService: Ng4LoadingSpinnerService,
    private cookieService: CookieService,
    private authenticationService: AuthenticationService,
    private registService: RegistrationService,
    private toastrService: ToastrService,
    private forgotPasswordBuilder: FormBuilder,
    private activatedRoute: ActivatedRoute,
    private updatePasswordBuilder: FormBuilder,
    private formBuilder: FormBuilder,
    public appConfig: AppConfig,
    private _cookieService: CookieService,
    private config: AppConfig,
    private masterService: MasterService,
    private modalService: BsModalService,
    private EncrDecrdata:EncrDecrService,
    //public window: Window


  ) {
    this.lsUserInfo = JSON.stringify(localStorage.getItem('UserInfo'));
    if (localStorage.getItem('UserInfo') != null) {
      this.router.navigate(['/dashboard']);
    } else {
      localStorage.removeItem('UserInfo');
      this._cookieService.deleteAll('/', this.config.DomainName);
    }

  }


  ngOnInit() {
    $(document).ready(function () {
      $(".info-item .switchIt").click(function () {
        $(".loginWrapper").toggleClass("log-in");
      });
    });
    $(document).ready(function () {
      $("#welcomeModel .switchIt").click(function () {
        $(".loginWrapper").toggleClass("log-in");
      });
      $(".mobile-tgl-menu").click(function () {
        //$('.header .main_menu_bg #bs-example-navbar-collapse-1 ul').slideToggle();
        $(this).siblings('#bs-example-navbar-collapse-1').children('ul').slideToggle();
      });
    });
    this.LoginForm = this.formBuilder.group({
      username: ['', [Validators.required,]],
      password: ['', [Validators.required,]]

    });


    this.LoginForm = this.formBuilder.group({
      username: ['', [Validators.required,]],
      password: ['', [Validators.required,]]

    });
    this.ForgotPasswordForm = this.forgotPasswordBuilder.group({
      UserName: ['', Validators.compose([Validators.required])]
    });
    this.activatedRoute.queryParams.subscribe(params => {
      if (params['for'] == "Registration") {
        this.login = "log-in";
      }
      if (params['for'] == "login") {
        this.login = "sign-up";
      }

    });

    this.EmployerForm = this.formBuilder.group({
      UsernameType: ['', [Validators.required,]],
      contactname: ['', [Validators.required, Validators.compose([CustomValidators.validName,CustomValidators.removeSpaces])]],
      designation: ['', [Validators.required,Validators.compose([CustomValidators.removeSpaces])]],
      email: ['', [Validators.required, Validators.compose([CustomValidators.vaildEmail])]],
      phone: ['', [Validators.required, ]],
      orgName: ['', [Validators.required,Validators.compose([CustomValidators.removeSpaces])]],
      gsteen_pan: ['', [Validators.required, Validators.compose([CustomValidators.validformatePan])]],
      industrytype: ['',],
      geolocation:['','']

    });

    this.finalEmployerForm = this.formBuilder.group({
      typeUserName: ['', [Validators.nullValidator,]],
      UserName: ['', [Validators.required,Validators.compose([CustomValidators.removeSpaces])]],
      pass: ['', [Validators.required,Validators.compose([CustomValidators.PasswordPolicy])]],
      cpass: ['', [Validators.required,,Validators.compose([CustomValidators.PasswordPolicy])]],
      otp: ['', [Validators.required,]]


    });
    this.feedbackFormInit();
    this.subcripFormInit();

  }
  clickMe() {
    this.spinnerService.getMessage();
  }
  ngAfterViewInit() {
  }


  ForgotPassword() {
    this.spinnerService.show();
    this.authenticationService.ForgotPassword(this.ForgotPasswordForm.value.UserName).subscribe(res => {
      this.DBResponce = res;
      this.spinnerService.hide();
      this.result = this.DBResponce;
      this.LoginForm.reset();
      //this.mdResetPasswordOpen.nativeElement.click();
    });
  }

  reset_forgot(){

      this.ForgotPasswordForm.reset();
      this.LoginForm.reset();
  }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
   // console.log(`${req.url} has been intercepted!`);
    return next.handle(req);
  };



  get f() { return this.LoginForm.controls; }
  myIp:any;
  latitude :any;
  longitude:any;


  systemInfo:any
  UserLogin() {
    localStorage.clear();
    sessionStorage.clear();
    this.spinnerService.show();
    var local=localStorage.getItem("UserInfo");
    var session =sessionStorage.getItem("usertoken");    
    let pwd = Md5.init(this.f.password.value);    
      let first= keyGen(7);
      let last = keyGen(4);
      if(first.length!=7)
      {
        first= first+'c'
      }
      if(last.length!=4)
      {
        last= last+'z'
      }
      let PWD=first+pwd+last;

      this.authenticationService.Authenticate(this.f.username.value,PWD).subscribe(res => {
      this.LoginResponse = res;
      this.spinnerService.hide();
      if(this.LoginResponse.status=="INACTIVE"){
        this.toastrService.error(this.LoginResponse.message);        
      }else{
        if(this.LoginResponse.result!=false)
        {
        if(this.LoginResponse.info=="Encrypted")
        {
          var encrypted = CryptoJS.enc.Base64.parse(this.LoginResponse.userInfo);
          this.LoginResponse = encrypted.toString(CryptoJS.enc.Utf8)         
        }
        if(this.LoginResponse.info=="")        {
        
            this.LoginResponse.userInfo.token = 'Bearer ' + this.LoginResponse.userInfo.token;
            localStorage.setItem('UserInfo', JSON.stringify(this.LoginResponse.userInfo));
            const date = new Date(this.LoginResponse.userInfo.tokenExpiry);
            this.cookieService.set('UserInfo', JSON.stringify(this.LoginResponse.userInfo), date, "/", this.appConfig.DomainName);
            this.tokenid=this.LoginResponse.userInfo.token;
            this.loginType=this.LoginResponse.userInfo.loginType;          
            sessionStorage.setItem('loginType',this.loginType)
            sessionStorage.setItem('usertoken',this.tokenid)
            sessionStorage.setItem('isverified',this.LoginResponse.userInfo.isVerified)
          }
          this.appConfig.UserInfoDetails();
               if(window.navigator.geolocation){
                 window.navigator.geolocation.getCurrentPosition(this.setPosition.bind(this));
               }
               this.systemInfo={
                'loginTime':this.LoginResponse.logintime,
                'loginType':this.loginType,
             }
             localStorage.setItem('userLogs',JSON.stringify(this.systemInfo));
            if(this.LoginResponse.userInfo.isVerified){
              this.router.navigate(['/dashboard']);
            }else{
              this.router.navigate(['/companyprofile']);
            }
        }
       else {
        this.toastrService.error(this.LoginResponse.message);       
      }
      }
      
});
}

setPosition(position){
     this.latitude = position.coords.latitude;
     localStorage.setItem('lat',this.latitude);
     this.longitude = position.coords.longitude;
     localStorage.setItem('lang',this.longitude)
    }
otpcount:number=0;
prevUsername:boolean=false;
SignEmployer() {
  this.registService.CheckMobile(this.mobvalues).subscribe(res => {
    this.Responce = res;
    if (this.Responce != null) {
      if (this.Responce.responseResult) {
        this.checkverifymobile = true;
        if (this.EmployerForm.valid && this.checkverifymail==true && this.checkverifymobile==true) {
          //if(this.checkverifygstin==true || this.checkverifypan==true)
          //{
           if(this.otpcount==0)
           {
            this.GenerateOTP(this.EmployerForm.value.phone);
           }
           this.otpcount++;
            this.finalShowStape = 1;
            this.employerShowStape = 1;
            this.checkverifymail = true;
            this.checkverifymobile = true;
            this.checkverifyuser = true;
            
            if(this.prevUsername==true){
              if(this.finalEmployerForm.value.typeUserName =='Mobile'){
                this.finalEmployerForm.controls['UserName'].setValue(this.EmployerForm.value.phone);
              }else if(this.finalEmployerForm.value.typeUserName =='Email'){
                this.finalEmployerForm.controls['UserName'].setValue(this.EmployerForm.value.email);
              }
            }
         
            // }
         // else
         // {
            //this.toastrService.error('Enter Valid GSTIN/PAN');
         // }
        }
        else {
          this.toastrService.error('All fields are required');
        }
      }
      else {}
    } else {
      this.toastrService.error(this.Responce.message);
      this.checkverifymobile = false;
      //this.EmployerForm.controls['phone'].setValue('');
    }
  });
}

  prev_form() {
    // checkverifymobile
    //this.CheckMobile(event);
    this.prevUsername=true;
    this.finalShowStape = 0;
    this.employerShowStape = 0;
    this.checkverifymobile = true;
    //this.EmployerForm.controls['phone'].setValue('');

  }

  SetUserName(str: string, str2: string) {
    this.temp = str;
    let userctrl = str2;
    if (userctrl == "user") {
      this.checkverifyuser = true;
    }
    else {
      this.checkverifyuser = false;
    }
    let ctrl = this.finalEmployerForm.get('UserName');
    this.finalEmployerForm.controls['UserName'].setValue(str);
  }

  pandatavalue:any;
  gstinatavalue:any;
  count:boolean=true;
  finalCount = 1;

  SignfinalEmployer() {

    // this.count=false;
    if(this.finalCount == 1){
    if (this.finalEmployerForm.valid && this.checkverifyuser==true && this.confpass==true && this.otpverify==true) {
      if(this.EmployerForm.value.gsteen_pan.length>10)
      {
           this.gstinatavalue=this.EmployerForm.value.gsteen_pan;
      }
      else
      {
          this.pandatavalue=this.EmployerForm.value.gsteen_pan;
      }
      this.employeevalue.FirstName = this.EmployerForm.value.contactname;
      this.employeevalue.CompanyName = this.EmployerForm.value.orgName
      this.employeevalue.LastName = this.EmployerForm.value.LastName;
      this.employeevalue.Email = this.EmployerForm.value.email;
      this.employeevalue.PhoneNo = this.EmployerForm.value.phone;
      this.employeevalue.UserName = this.finalEmployerForm.value.UserName;
      let pwd1 = Md5.init(this.finalEmployerForm.value.pass);
      //alert(this.f.password.value);
        let first1= keyGen(7);
        let last1 = keyGen(4);

        if(first1.length!=7)
        {
          first1= first1+'c'
        }
        if(last1.length!=4)
        {
          last1= last1+'z'
        }
        let PWD1=first1+pwd1+last1;


      this.employeevalue.Password = PWD1
      //this.finalEmployerForm.value.pass;
      this.employeevalue.LoginType     = this.EmployerForm.value.UsernameType;
      this.employeevalue.Designation   = this.EmployerForm.value.designation;
      this.employeevalue.Pan_Number    = this.pandatavalue;
      this.employeevalue.Gstn          =  this.gstinatavalue;
      this.employeevalue.userLocMapAddress =  this.MapAddress?this.MapAddress:'';//BY NEERAJ SINGH CREATED DATE 23/05/2019
      this.employeevalue.latitude      =  this.MapLatititute?this.MapLatititute:'';//BY NEERAJ SINGH CREATED DATE 23/05/2019
      this.employeevalue.longitude     =  this.MapLongitute?this.MapLongitute:'';//BY NEERAJ SINGH CREATED DATE 23/05/2019
      this.spinnerService.show();
      this.registService.Registration(this.employeevalue).subscribe(res => {
        this.spinnerService.show();
        this.Responce = res;
        this.count=true;
        if (this.Responce != null) {
           this.finalShowStape = 0;
           this.employerShowStape = 0;
           this.isname=false;
           this.temp="";
           this.EmployerForm.reset();
           this.finalEmployerForm.reset();
           this.welcomeModelOpen.nativeElement.click();
           this.toastrService.success("Registration successfully.");
        } else {
           this.toastrService.error('Registration failed try again');
        }
      });
      }
    else {
          this.count=true;
          this.toastrService.error('All fields are required');
    }
  }
  this.finalCount++;
  }
  GenerateOTP(mobno: any) {
    this.PhoneNo = mobno;
    this.registService.GenerateOTP(this.PhoneNo).subscribe(res => {
      this.Responce = res;
      if (this.Responce != null) {
      } else {
      }
    });
  }

  counter: number;
  status:boolean=false;
  timer:boolean=false;
  intervalId:any
  ResendOTP(mobno: any) {
    this.isCheckOtp=false;
    this.finalEmployerForm.controls.otp.reset()
    this.counter=20;
    this.status=true;
    this.PhoneNo = mobno;
    this.registService.GenerateOTP(this.PhoneNo).subscribe(res => {
      this.Responce = res;
      if(this.Responce){
      this.toastrService.success("OTP has been sent successfully!");
       this.timer=true;
       this.intervalId = setInterval(() => {
        this.counter = this.counter - 1;
        if(this.counter === 0){
          clearInterval(this.intervalId)
          if(this.isCheckOtp){
           this.status=true;
           this.timer=false;
          }
        }

        }, 1000)
        this.status=true;
      setTimeout (() => {
         if(this.isCheckOtp){
          this.status=true;
          this.timer=false;
         }      else{
          this.status=false;
          this.timer=false;
         }
       }, 20000)
      }

    });
  }


isCheckOtp:boolean=false;

  CheckOTP(otpno: any) {
    this.otpget = otpno;
    this.timer=false;
    this.registService.CheckOTP(this.otpget,this.PhoneNo).subscribe(res => {
      this.Responce = res;

     // this.toastrService.clear();
      if (this.Responce != null) {
        if (this.Responce.responseResult) {
          this.toastrService.success(this.Responce.message);
          this.otpverify = true;
          this.isCheckOtp=true;
          this.status=true;
        }
        else {
          this.toastrService.error(this.Responce.message);
          this.otpverify = false;
        }
      } else {
        this.toastrService.error(this.Responce.message);
        this.otpverify = false;
      }
    });
  }
  uservalues = '';
  onKeychangeuser(event: any) {
    this.uservalues = event.target.value;
    if (this.uservalues.length > 0) {
      this.registService.usercheck(this.uservalues).subscribe(res => {
        this.Responce = res;
        if (this.Responce != null) {
          if (this.Responce.responseResult) {
            this.checkverifyuser = true;
          }
          else {
            this.toastrService.error(this.Responce.message);
            this.checkverifyuser = false;
            this.finalEmployerForm.controls['UserName'].setValue('');
          }
        } else {
          this.toastrService.error(this.Responce.message);
          this.checkverifyuser = false;
          this.finalEmployerForm.controls['UserName'].setValue('');
        }
      });
    }
  };

  mobvalues = '';
  CheckMobile(event: any) {
    this.mobvalues = event.target.value;
    var IndNum = /^[0]?[6789]\d{9}$/;

    if (this.mobvalues.length == 10 && IndNum.test(this.mobvalues)) {
      this.registService.CheckMobile(this.mobvalues).subscribe(res => {
        this.Responce = res;
        if (this.Responce != null) {
          if (this.Responce.responseResult) {
            this.checkverifymobile = true;
          }
          else {
            this.toastrService.error(this.Responce.message);
            this.checkverifymobile = false;
            this.EmployerForm.controls['phone'].setValue('');
          }
        } else {
          this.toastrService.error(this.Responce.message);
          this.checkverifymobile = false;
          this.EmployerForm.controls['phone'].setValue('');
        }
      });
    }else{
      this.checkverifymobile = false;
      this.toastrService.error('Invalid Mobile Number');
      return false;
    }
  };
  emailvalues = '';
  CheckEmail(event: any) {
    this.emailvalues = event.target.value;
    var regexEmail = /\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*/;
    if (this.emailvalues.length > 0 && regexEmail.test(this.emailvalues)) {
      this.registService.CheckEmail(this.emailvalues).subscribe(res => {
        this.Responce = res;
        if (this.Responce != null) {
          if (this.Responce.responseResult) {
            this.checkverifymail = true;
          }
          else {
            this.toastrService.error(this.Responce.message);
            this.checkverifymail = false;
            this.EmployerForm.controls['email'].setValue('');
          }
        } else {
          this.toastrService.error(this.Responce.message);
          this.checkverifymail = false;
          this.EmployerForm.controls['email'].setValue('');
        }
      });
    }
  };
  ValidatePasswordMacht(pass: string, confpass: string) {
    let password = pass;
    let confirmPassword = confpass;
    if (password != confirmPassword) {
      this.confpass = false;
      this.toastrService.error("Password not match.");
      this.finalEmployerForm.controls['cpass'].setValue('');

    }
    if (password == confirmPassword) {
      this.confpass = true;
    }
  }
  GoToLogin() {
    this.login = "sign-up";
  }

  pvalues: any= '';
  checkverifypan:boolean=false;
// onKeychangepan(event: any) {
//     this.pvalues = event.target.value;
//     var regpan = /^([a-zA-Z]){5}([0-9]){4}([a-zA-Z]){1}?$/;

//     if (this.pvalues.length > 0 && regpan.test(this.pvalues)) {
//     this.registService.CheckPanCard(this.pvalues).subscribe(res => {
//       this.Responce = res;
//       if (this.Responce != null) {
//         if(this.Responce.responseResult)
//         {
//           this.toastrService.success(this.Responce.message);
//           this.checkverifypan = true;
//         }
//         else
//         {
//           this.toastrService.error(this.Responce.message);
//           this.checkverifypan = false;
//         }
//       } else {
//         this.toastrService.error(this.Responce.message);
//         this.checkverifypan = false;
//       }
//     });
//   }
//   else
//   {
//     this.toastrService.error("PAN is invalid");
//     this.checkverifypan = false;
//   }
//   }
///////////////////// specail case for gstin or pan ////////////////

values :any = '';
isname:boolean=false;
checkverifygstin:boolean=false;
onKeychangegsteen_pan(event: any) {
 this.toastrService.clear();
  this.isname=false;
    this.values = event.target.value;
    var regpan = /^([a-zA-Z]){5}([0-9]){4}([a-zA-Z]){1}?$/;
    var reggstin = /^([0]{1}[1-9]{1}|[1-2]{1}[0-9]{1}|[3]{1}[0-7]{1})([a-zA-Z]{5}[0-9]{4}[a-zA-Z]{1}[1-9a-zA-Z]{1}[zZ]{1}[0-9a-zA-Z]{1})+$/;
      if (this.values.length > 0 && regpan.test(this.values)) {
      this.registService.getcompanyName(this.values).subscribe(res=>{
        if(res){
             var compName=res['companyName'];
             var UserType=res['loginType'];
             this.EmployerForm.controls['orgName'].setValue(compName);
             this.EmployerForm.controls['UsernameType'].setValue(UserType);
             this.toastrService.info('You are already Registered. Please fill details to create your login');
             this.isname=true;
             this.EmployerForm.controls['orgName'].disable();
             this.EmployerForm.controls['UsernameType'].disable();
           } else{
             this.isname=false;
             this.EmployerForm.controls['orgName'].enable();
             this.EmployerForm.controls['UsernameType'].enable();
             this.EmployerForm.controls['orgName'].setValue('');
             this.EmployerForm.controls['UsernameType'].setValue('');
          }
         })
        }
        else if(this.values.length > 0 && this.values.length<11)
        {
          this.toastrService.error("PAN is invalid");
          this.checkverifypan = false;
        }

    else if (this.values.length > 10 && reggstin.test(this.values)) {
    this.registService.getcompanyName(this.values).subscribe(res=>{
      if(res){
             var compName=res['companyName'];
             var UserType=res['loginType'];
             this.EmployerForm.controls['orgName'].setValue(compName);
             this.EmployerForm.controls['UsernameType'].setValue(UserType);
             this.toastrService.info('You are already Registered. Please fill details to create your login');
             this.EmployerForm.controls['orgName'].disable();
             this.EmployerForm.controls['UsernameType'].disable();
             this.isname=true;
      } else{
             this.isname=false;
             this.EmployerForm.controls['orgName'].enable();
             this.EmployerForm.controls['UsernameType'].enable();
             this.EmployerForm.controls['orgName'].setValue('');
             this.EmployerForm.controls['UsernameType'].setValue('');
      }
   })
  }
   else if(this.values.length < 15 && this.values.length >10)
   {
     this.toastrService.error("GSTIN is invalid");
     this.checkverifygstin = false;
  }


}
RestrictSpace(event) {
  if (event.keyCode == 32) {
      return false;
  }
}


btnsts:boolean=true;
feedbackForm : FormGroup;
feedback(template: TemplateRef<any>){
  //this.feedbackForm.reset();
  this.modalRef = this.modalService.show(template,
    Object.assign({}, { class: 'feedback-modal' }
    ));
}

feedbackFormInit(){
  this.feedbackForm = this.formBuilder.group({
    name: ['', [Validators.required, , Validators.compose([CustomValidators.removeSpaces])]],
    companyName: ['', [Validators.required, , Validators.compose([CustomValidators.removeSpaces])]],
    email: ['', [Validators.required, Validators.compose([CustomValidators.vaildEmail])]],
    mobile: ['', [Validators.required, Validators.compose([CustomValidators.validMobile])]],
    landlineNumber: ['', [Validators.nullValidator,]],
    feedback: ['', [Validators.required, , Validators.compose([CustomValidators.removeSpaces])]],
    usertype:['',[Validators.required]],
    captcha: ['', [Validators.required]],
   });
  }

  response:any
  submit(){
    if(this.feedbackForm.value.feedback.trim().length=='0'){
      this.toastrService.error('feedback should not be blank');
      return false
    }
     this.btnsts=false;
     let postData={
          "UserType":this.feedbackForm.value.usertype,
          "Name":this.feedbackForm.value.name.trim(),
          "CompanyName":this.feedbackForm.value.companyName.trim(),
          "Email":this.feedbackForm.value.email.trim(),
          "MobileNo":this.feedbackForm.value.mobile,
          "LandLineNo":this.feedbackForm.value.landlineNumber,
          "UserFeedback":this.feedbackForm.value.feedback.trim(),
     }
     this.spinnerService.show();
     this.masterService.sendFeedback(postData).subscribe(res=>{
      this.spinnerService.hide();
      this.btnsts=true;
       this.response=res;
       if(this.response){
        this.modalRef.hide();
        this.toastrService.success("feedback submit successfully.");
        this.close();

       }else{
        this.toastrService.error('feedback submit failed try again');
       }
     })
  }
  close(){
    this.modalRef.hide();
    this.feedbackForm.controls.name.reset();
    this.feedbackForm.controls.companyName.reset();
    this.feedbackForm.controls.mobile.reset();
    this.feedbackForm.controls.email.reset();
    this.feedbackForm.controls.landlineNumber.reset();
    this.feedbackForm.controls.feedback.reset();
    this.feedbackForm.controls['name'].setValue('');
    this.feedbackForm.controls['companyName'].setValue('');
    this.feedbackForm.controls['mobile'].setValue('');
    this.feedbackForm.controls['landlineNumber'].setValue('');
    this.feedbackForm.controls['feedback'].setValue('');
  }
  //////////////////   subscripform data   //////////////
  IndustryAreaSelected: string;
  IndustryArea: any = [];
  GetAllIndustryArea() {
    this.masterService.GetAllIndustryArea().subscribe(res => {
      this.Responce = res;
      this.IndustryArea = this.Responce;
    });
  }
  FunctionArea: any = [];
  FunctionAreaSelected: string;
  GetAllFunctionArea() {
    this.masterService.GetAllFunctionArea().subscribe(res => {
      this.Responce = res;
      this.FunctionArea = this.Responce;
    });
  }
  States: any = [];
  StatesSelected: string;
  GetAllStates() {
    this.masterService.GetAllStates().subscribe(res => {
      this.Responce = res;
      this.States = this.Responce;
    });
  }
  btnstsubcrip:boolean=true;
  subcripForm : FormGroup;
  dropdownSettings:any ={};
  dropdownSettings2:any ={};
subcrip(subcription: TemplateRef<any>){
    //this.feedbackForm.reset();
    this.GetAllIndustryArea();
    this.GetAllFunctionArea();
    this.GetAllStates();
    this.modalRef = this.modalService.show(subcription,
      Object.assign({}, { class: 'feedback-modal' }
      ));
  }


  subcripFormInit(){

    this.subcripForm = this.formBuilder.group({
      // name: ['', [Validators.required, , Validators.compose([CustomValidators.removeSpaces])]],
      name: ['', [Validators.required, Validators.compose([CustomValidators.validName,CustomValidators.removeSpaces])]],
      email: ['', [Validators.nullValidator, Validators.compose([CustomValidators.vaildEmail1])]],
      mobile: ['', [Validators.required, Validators.compose([CustomValidators.validMobile])]],
      industry: ['', [Validators.nullValidator,]],
      functionalarea: ['', [Validators.nullValidator,]],
      zones: ['', [Validators.nullValidator, ]],
      regional: ['', [ Validators.nullValidator,]],
      subregional: ['', [Validators.nullValidator,]],
      employer: ['', [Validators.nullValidator,]],

      // subzones: ['', [Validators.required,]],
      captcha: ['', [Validators.required]],
     });
     this.GetAllFunctionArea();
     this.GetAllIndustryArea();
     this.GetAllZone();
     this.GetAllemployer();
     this.dropdownSettings = {
      singleSelection: false,
      idField: 'id',
      textField: 'industryName',
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      itemsShowLimit: 6,
      allowSearchFilter: true

    };

    this.dropdownSettings2 = {
      singleSelection: false,
      idField: 'id',
      textField: 'functionalAreaName',
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      itemsShowLimit: 3,
      allowSearchFilter: true
    };
    }

    subcripresponse:any
    subcripsubmit(){
      if(!this.subcripForm.valid){
        this.toastrService.error('Subscribe should not be blank');
        return false
      }
      if(this.IndustFormArray.length==0){
        this.toastrService.error('Please select industry');
        return false
      }
      if(this.FunctionalFormArray.length==0){
        this.toastrService.error('Please select functional area');
        return false
      }
      var regexEmail = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (this.subcripForm.value.email.length > 0 && !regexEmail.test(this.subcripForm.value.email)) {
      this.toastrService.error('Entered email not valid');
      return false
    }
    if (this.subcripForm.value.email.length > 0 && this.checkemailvalsuscribe==false) {
      this.toastrService.error('Entered email already exit');
      return false
    }
       this.btnstsubcrip=false;
       if(this.subcripForm.valid && this.checkmobvalsuscribe==true)
       {
                    let subscribData={
                      "Name":this.subcripForm.value.name.trim(),
                      "Email":this.subcripForm.value.email.trim(),
                      "Mobile":this.subcripForm.value.mobile,
                      "IndustryList":this.IndustFormArray,
                      "FunctionalList":this.FunctionalFormArray,
                      "RegionId":this.subcripForm.value.regional!=''?this.subcripForm.value.regional:0,
                      "SubregionId":this.subcripForm.value.regional!=''?this.subcripForm.value.regional:0,
                      "zones":this.subcripForm.value.zones!=''?this.subcripForm.value.zones:0,
                      "ComapnyId":this.subcripForm.value.employer!=''?this.subcripForm.value.employer:0,
                      // "subzones":this.subcripForm.value.subzones,
                       }
                  this.spinnerService.show();
                  this.registService.SetEmpSubscriptionDetails(subscribData).subscribe(res=>{
                    this.spinnerService.hide();
                    this.btnstsubcrip=true;
                    this.response=res;
                    if(this.response.responseResult){
                      //this.modalRef.hide();
                      this.toastrService.success(this.response.message);
                      //this.subcripForm.reset();
                      this.subcripclose();
                    }else{
                      this.toastrService.error(this.response.message);
                    }
                  })
       }
       else
       {
        this.toastrService.error('all subscribe should not be blank ');
       }

    }
    subcripclose(){
     this.modalRef.hide();
     // this.subcripForm.reset();
     this.subcripForm.controls.name.reset();
     this.subcripForm.controls.email.reset();
     this.subcripForm.controls.mobile.reset();
     this.subcripForm.controls.industry.reset();
     this.subcripForm.controls.functionalarea.reset();
     this.subcripForm.controls.zones.reset();
     this.subcripForm.controls.regional.reset();
     this.subcripForm.controls.subregional.reset();
     this.subcripForm.controls.employer.reset();
      this.FunctionalFormArray=[];
      this.IndustFormArray=[];
      this.subcripForm.controls['name'].setValue('');
      this.subcripForm.controls['email'].setValue('');
      this.subcripForm.controls['mobile'].setValue('');
      this.subcripForm.controls['industry'].setValue('');
      this.subcripForm.controls['functionalarea'].setValue('');
      this.subcripForm.controls['zones'].setValue('');
      this.subcripForm.controls['regional'].setValue('');
      this.subcripForm.controls['subregional'].setValue('');
      this.subcripForm.controls['employer'].setValue('');
     // this.subcripForm.controls['captcha'].setValue('');

    }

    IndustFormArray: any = [];
    onItemSelect(item: any) {
      var data = item.id;
      this.IndustFormArray.push(
        {
          "IndustrialAreaId":data
        }
      );
    }

    onItemDeSelect(item: any) {
      let index = this.IndustFormArray.indexOf(item.id);
      this.IndustFormArray.splice(index, 1);
    }

    onSelectAll(items: any) {
      for (var i = 0; i < items.length; i++) {
       var data = items[i].id;
        this.IndustFormArray.push(
          {
            "IndustrialAreaId":data
          }
        );
      }
   }
   onDeSelectAll(items: any)
   {
    this.IndustFormArray=[];
   }

   FunctionalFormArray: any = [];
   FunctionalonItemSelect(item: any) {
     var data = item.id;
     this.FunctionalFormArray.push(
       {
         "FunctionalareaId":data
       }
     );
   }

   FunctionalonItemDeSelect(item: any) {
    let index =this.FunctionalFormArray.indexOf(item.id);
     this.FunctionalFormArray.splice(index, 1);
   }
   FunctionalonSelectAll(items: any) {
    for (var i = 0; i < items.length; i++) {
      var data = items[i].id;
      this.FunctionalFormArray.push(
        {
          "FunctionalareaId":data
        }
      );
    }
 }
 FunctionalononDeSelectAll(items: any) {
   this.FunctionalFormArray=[];
  }
////////////////// method for suscribe ///////////////
checkmobvalsuscribe:boolean = false;
subscibemob:any='';
CheckMobileSub(event: any) {
    this.subscibemob = event.target.value;
    var IndNum = /^[0]?[6789]\d{9}$/;
    if (this.subscibemob.length == 10 && IndNum.test(this.subscibemob)) {
    this.registService.CheckMobileSubscription(this.subscibemob).subscribe(res => {
      this.Responce = res;
      if (this.Responce != null) {
        if(this.Responce.responseResult)
        {
         // this.toastrService.success(this.Responce.message);
          this.checkmobvalsuscribe = true;

        }
        else
        {

          this.toastrService.error(this.Responce.message);
          this.checkmobvalsuscribe = false;

        }
      } else {
        this.toastrService.error(this.Responce.message);
        this.checkmobvalsuscribe = false;


      }
    });
  }
  }
checkemailvalsuscribe:boolean =false;
subscibeemail:any='';
CheckEmailSub(event: any) {
    this.subscibeemail = event.target.value;
    var regexEmail = /\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*/;
    if (this.subscibeemail.length > 0 && regexEmail.test(this.subscibeemail)) {
    this.registService.CheckEmailSubscription(this.subscibeemail).subscribe(res => {
      this.Responce = res;
      if (this.Responce!= null) {
        if(this.Responce.responseResult)
        {
         //this.toastrService.success(this.Responce.message);
          this.checkemailvalsuscribe = true;
        }
        else
        {
          this.toastrService.error(this.Responce.message);
          this.checkemailvalsuscribe = false;
        }
      } else {
        this.toastrService.error(this.Responce.message);
        this.checkemailvalsuscribe = false;

      }
    });
 }
}

zoneList: any = [];
GetAllZone() {
  this.masterService.GetAllZone().subscribe(res => {
    this.Responce = res;
    if (this.Responce != null) {
      this.zoneList = this.Responce;
    } else {
      this.zoneList = [];
      this.AllRegion = [];
      this.SubAllRegion = [];
      this.subcripForm.controls.zones.setValue('');
      this.subcripForm.controls.regional.setValue('');
      this.subcripForm.controls.subregional.setValue('');

    }
  });
}
AllRegion:any=[]
zoneid:any;
GetAllRegion(zoneid:any) {
  this.zoneid=zoneid;
  if(this.zoneid!='')
  {
  this.masterService.GetAllRegion(zoneid).subscribe(res => {
    this.Responce = res;
    if (this.Responce != null) {
      this.AllRegion = this.Responce;
    } else {
      this.AllRegion = [];
      this.SubAllRegion = [];
      this.subcripForm.controls.regional.setValue('');
      this.subcripForm.controls.subregional.setValue('');

    }
  });
}
else
{
  this.AllRegion = [];
  this.SubAllRegion = [];
  this.subcripForm.controls.regional.setValue('');
  this.subcripForm.controls.subregional.setValue('');

}
}

ResetFinalCount(){
  this.finalCount = 1;
  this.otpverify = false;
}

SubAllRegion:any=[]
GetAllSubRegion(reginionid:any) {
  if(reginionid!='')
  {
  this.masterService.GetAllSubRegion(this.zoneid,reginionid).subscribe(res => {
    this.Responce = res;
    if (this.Responce != null) {
      this.SubAllRegion = this.Responce;
    } else {
      this.SubAllRegion = [];
      this.subcripForm.controls.subregional.setValue('');

    }
  });
}
else
{
  this.SubAllRegion = [];
  this.subcripForm.controls.subregional.setValue('');
}
}

Getallemployer:any=[];
GetAllemployer() {
  this.masterService.GetVerifiedCompanyEmployerList().subscribe(res => {
    this.Responce = res;
    if (this.Responce != null) {
      this.Getallemployer = this.Responce.lstVerifiedCompanyEmployerList;
    } else {
      this.Getallemployer = [];
    }
  });
  }

  resolved(captchaResponse: string) {

}
///////////// Remove Specail Char //////////////
removeSpecialnamechar(event) {
  var regex = new RegExp("^[0-9+?=.*!;:,/><}`~{|)(_'@#$%^&*]+$");
   var key = String.fromCharCode(event.charCode ? event.which : event.charCode);
   if (regex.test(key)) {
      // event.preventDefault();
       return false;
   }
   var keycode = event.which;              
   if (keycode == 34 || keycode == 92 || keycode == 45 || keycode == 91 || keycode == 93){
       //event.preventDefault();
       return false;
   }
}
////////////////////// End Reomve Special Char ////////////////

///////////// Remove Specail Char //////////////
removeSpecialemailchar(event) {
  var regex = new RegExp("^[+?=*!;:,/><}`~{|)(_'#$%^&*]+$");
   var key = String.fromCharCode(event.charCode ? event.which : event.charCode);
   if (regex.test(key)) {
      // event.preventDefault();
       return false;
   }
   var keycode = event.which;              
   if (keycode == 34 || keycode == 92 || keycode == 45 || keycode == 91 || keycode == 93){
       //event.preventDefault();
       return false;
   }
}
////////////////////// End Reomve Special Char ////////////////

///////////// Landline Specail Char //////////////
Validationforlandline(event:any) {
  var phoneno=event;
  if(phoneno){
    var myregex =  /^\(?([0-9]{1})\)?[-. ]?([1-9]{1})[-. ]?([0-9]{4})[-. ]?([0-9]{4,6})$/;  
    if (!myregex.test(phoneno) || phoneno=="0") {
        //event.preventDefault();
        this.toastrService.error(" Entered Landline Number Not Valid");
        this.feedbackForm.controls.landlineNumber.setValue('');
        return false;
    }
  }
}
////////////////////// End Landline Char ////////////////

/****************************************************************
 *ADD GOOGLE MAP LOCATIONBY NEERAJ SINGH CREATED DATE 23/05/2019*
*****************************************************************/

openingModelRef: BsModalRef;
geoLocation(template: TemplateRef<any>,item:any) {  
  this.GeoLocationText=true;

  if(this.GMLtlgStatus==true){
    // localStorage.removeItem("lattlngt");
  }
  this.openingModelRef = this.modalService.show(template, { class: 'modal-sm-md' });
}

closeViewModal(){
  this.openingModelRef.hide(); 
}

AddGoogleMapLocation(){
  
  var MpAddress=localStorage.getItem("address");
  var LatitLangt=localStorage.getItem("latlnggg");
  var GoogleMapAdd=localStorage.getItem("GoogleMapAdd");

  var SpliteLatLng=LatitLangt.split(',');
  this.MapLatititute=SpliteLatLng[0];
  this.MapLongitute=SpliteLatLng[1];
  this.MapAddress=GoogleMapAdd;
  this.EmployerForm.controls['geolocation'].setValue(this.MapAddress);
  this.openingModelRef.hide(); 
}
//END OF GOOGLE MAP LOCATION

}


function keyGen(keyLength :any) {
  let i=0,
  key = "",
 characters = "abcdefghijklmnopqrstuvwxyzabcdefghijklmnopqrstuvwxyz0123456789";

  let charactersLength = characters.length;

  for (i ; i < keyLength; i++) {
      key += characters.substr(Math.floor((Math.random() * charactersLength) + 1), 1);
  }

  return key;


}



