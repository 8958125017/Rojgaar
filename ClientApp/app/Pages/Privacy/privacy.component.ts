import { Component, OnInit, ViewChild, ElementRef, HostListener ,TemplateRef} from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { FormBuilder,  FormGroup, FormControl, Validators } from '@angular/forms';
import { RegistrationService } from '../../Services/registration.service';
import { AuthenticationService } from '../../Services/authenticate.service';
import { CookieService } from 'ngx-cookie-service';
import { AppConfig } from '../../Globals/app.config';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
import { ToastrService, ToastContainerDirective } from 'ngx-toastr';
import { Http } from '@angular/http';
import { CustomValidators } from '../../Validators/custom-validator.directive';
import { MasterService } from '../../Services/master.service';
import * as $ from 'jquery';
import { TypeaheadMatch } from 'ngx-bootstrap';
import {Md5} from "md5-typescript";
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { BsModalService } from 'ngx-bootstrap/modal';
import { analyzeAndValidateNgModules } from '@angular/compiler';

@Component({
  selector: 'app-privacyComponent',
  templateUrl: './privacy.component.html',
})
export class PrivacyComponent implements OnInit {

  @ViewChild('mdResetPasswordOpen') mdResetPasswordOpen: ElementRef


  modalRef: BsModalRef;
  employerShowStape: number = 0;
  agencyShowStape: number = 0;
  finalShowStapeemplyer: number = 0;
  showcustomemail: number = 0;
  showcustommob: number = 0;
  showcustomtext: number = 0;
  Show: any = 1;
  temp: any = '';
  cmail: any = '';
  isFirstOpen = true;
  oneAtATime: boolean = true;
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
  DBResponce: any;
  Responce: any = {};
  EmployerForm: FormGroup;
  finalEmployerForm: FormGroup;
  agencyForm: FormGroup;
  finalagencyForm: FormGroup;
  panvalue: any = {};
  loading = false;
  ShowChangePassword: boolean = false;
  submitted = false
  result: any;
  cpass: any;
  data: any;
  LoginForm: FormGroup;
  ForgotPasswordForm: FormGroup;
  UpdatePassword: FormGroup;
  confpass: boolean = false
  otpverify: boolean = false
  checkverifymail: boolean = false
  checkverifymobile: boolean = false
  checkverifygstin: boolean = false
  checkverifypan: boolean = false
  checkverifuser: boolean = false
  modelShowStape: boolean = false
  LoginResponse: any = {};
  ckUserInfo: any = {};
  lsUserInfo: any = {};
  otpget: any;
  response: any

  constructor(
    private http: Http,
    private router: Router,
    private spinnerService: Ng4LoadingSpinnerService,
    private cookieService: CookieService,
    private authenticationService: AuthenticationService,
    private registService: RegistrationService,
    private masterService: MasterService,
    private toastrService: ToastrService,
    private forgotPasswordBuilder: FormBuilder,
    private activatedRoute: ActivatedRoute,
    private updatePasswordBuilder: FormBuilder,
    private formBuilder: FormBuilder,
    public appConfig: AppConfig,
    private _cookieService: CookieService,
    private config: AppConfig,
    private elementRef: ElementRef,
    private modalService: BsModalService,

  ) {
    this.lsUserInfo = JSON.stringify(localStorage.getItem('UserInfo'));
    var isUserVerified = JSON.parse(sessionStorage.getItem('isverified'));
    if (localStorage.getItem('UserInfo') != null) {
      if (isUserVerified) {
        this.router.navigate(['/dashboard']);
      } else {
        this.router.navigate(['/companyprofile']);
      }

    } else {
      localStorage.removeItem('UserInfo');
      this._cookieService.deleteAll('/', this.config.DomainName);
    }
  }
  SetUserName(str: string, str2: string) {
    this.temp = str;
    let userctrl = str2;
    if (userctrl == "user") {
      this.checkverifuser = true;
    }
    else {
      this.checkverifuser = false;
    }

    let ctrl = this.finalEmployerForm.get('UserName');
    this.finalEmployerForm.controls['UserName'].setValue(str);
  }
  onetimeotp: number = 0;
  SignEmployer() {
    if (this.onetimeotp == 0) {
      this.GenerateOTP(this.EmployerForm.value.phone);
    }
    this.onetimeotp++;
    if (this.employerShowStape == 1) {
      this.employerShowStape = 0;
    } else {
      this.employerShowStape = 1;
    }
    if (this.finalShowStapeemplyer == 1) {
      this.finalShowStapeemplyer = 0;
    } else {
      this.finalShowStapeemplyer = 1;
    }
  }
  finalSignEmployer() {
    if (this.finalShowStapeemplyer == 1) {
      this.finalShowStapeemplyer = 0;
    } else {
      this.finalShowStapeemplyer = 1;
    }
  }
  SignfinalEmployer(formvalue) {
    this.employeevalue.FirstName = this.EmployerForm.value.contactname;
    this.employeevalue.CompanyName = this.EmployerForm.value.orgName;
    this.employeevalue.LastName = this.EmployerForm.value.LastName;
    this.employeevalue.Email = this.EmployerForm.value.email;
    this.employeevalue.PhoneNo = this.EmployerForm.value.phone;
    this.employeevalue.UserName = this.finalEmployerForm.value.UserName;
    this.employeevalue.Password = this.finalEmployerForm.value.pass;
    this.employeevalue.LoginType = 'Employer';
    this.employeevalue.UserFrom = this.finalEmployerForm.value.email;
    this.employeevalue.Pan_Number = this.EmployerForm.value.Pan;
    this.employeevalue.Gstn = this.EmployerForm.value.gsteen;

    this.registService.Registration(this.employeevalue).subscribe(res => {
      this.Responce = res;
      if (this.Responce != null) {
        this.toastrService.success("Registration successfully.");
        this.EmployerForm.reset();
        this.finalEmployerForm.reset();
        this.modelShowStape = true;
        this.employerShowStape = 0;
        this.agencyShowStape = 0;
      } else {
        this.toastrService.error('Registration failed try again');

      }
    });

  }

  ngOnInit() {

    this.feedbackFormInit();
    this.subcripFormInit();

    this.GetCompaniesList()
    this.GetJobStatics();
    this.GetAllIndustryArea();
    this.GetAllFunctionArea();
    this.GetAllStates();
    this.StatsJobsByCategories();
    $(".swapLogo1").click(function () {
      $('#view1').addClass('hideIt').removeClass('showIt');
      $('#view3').addClass('hideIt').removeClass('showIt');
      $('#view2').addClass('showIt').removeClass('hideIt');
    });
    $(".swapLogo2").click(function () {
      $('#view1').addClass('hideIt').removeClass('showIt');
      $('#view2').addClass('hideIt').removeClass('showIt');
      $('#view3').addClass('showIt').removeClass('hideIt');
    });
    $(".swapLogo3").click(function () {
      $('#view2').addClass('hideIt').removeClass('showIt');
      $('#view3').addClass('hideIt').removeClass('showIt');
      $('#view1').addClass('showIt').removeClass('hideIt');
    });

    $('.mbl-nav').click(function () {
      $('nav.dash-navigation ul').slideToggle();
    });
    $('.mbl-main-nav span').click(function () {
      $('.dash-left-part').slideToggle();
    });

    $(".mobile-tgl-menu").click(function () {
      //$('.header .main_menu_bg #bs-example-navbar-collapse-1 ul').slideToggle();
      $(this).siblings('#bs-example-navbar-collapse-1').children('ul').slideToggle();
    });
    //$(".homeNav li a").click(function () {
    //$('.header .main_menu_bg #bs-example-navbar-collapse-1 ul').slideToggle();
    //});

    //$(".mobile-tgl-search").click(function () {
    //  $('.sliderContent ul').toggle();
    //});

    this.activatedRoute.queryParams.subscribe(params => {
      if (params['recoveryToken']) {
        this.CheckTokenForgotPassword(params['recoveryToken']);
      }
    });


    this.ForgotPasswordForm = this.forgotPasswordBuilder.group({
      UserName: ['', Validators.compose([Validators.required])]
    });

    this.UpdatePassword = this.updatePasswordBuilder.group({
      NewPassword: [null, Validators.compose([Validators.required, CustomValidators.PasswordPolicy])],
      ConfirmPassword: ['', [Validators.required, CustomValidators.PasswordPolicy]]
    },
    );

    this.LoginForm = this.formBuilder.group({
      username: ['', [Validators.required,]],
      password: ['', [Validators.required,]]

    });
    this.EmployerForm = this.formBuilder.group({
      orgName: ['', [Validators.required, Validators.compose([CustomValidators.validName])]],
      Pan: ['', [Validators.required, Validators.compose([CustomValidators.validpanformate])]],
      gsteen: ['', [Validators.required, Validators.compose([CustomValidators.validgdteenformate])]],
      contactname: ['', [Validators.required, Validators.compose([CustomValidators.validName])]],
      email: ['', [Validators.required, Validators.compose([CustomValidators.vaildEmail])]],
      phone: ['', [Validators.required, Validators.compose([CustomValidators.validMobile])]],

    });
    this.finalEmployerForm = this.formBuilder.group({
      UserName: ['', [Validators.required, Validators.compose([CustomValidators.removeSpaces])]],
      pass: ['', [Validators.required,]],

      cpass: ['', [Validators.required,]],
      otp: ['', [Validators.required,]],
      termcond: ['', [Validators.required,]],

    });

    this.agencyForm = this.formBuilder.group({
      orgName: ['', [Validators.required, Validators.compose([CustomValidators.validName])]],
      Pan: ['', [Validators.required, Validators.compose([CustomValidators.validpanformate])]],
      gsteen: ['', [Validators.required, Validators.compose([CustomValidators.validgdteenformate])]],
      contactname: ['', [Validators.required, Validators.compose([CustomValidators.validName])]],
      email: ['', [Validators.required, Validators.compose([CustomValidators.vaildEmail])]],
      phone: ['', [Validators.required, Validators.compose([CustomValidators.validMobile])]],

    });

    this.finalagencyForm = this.formBuilder.group({
      UserName: ['', [Validators.required,]],
      pass: ['', [Validators.required,]],
      cpass: ['', [Validators.required,]],
      otp: ['', [Validators.required,]],
      termcond: ['', [Validators.required,]],

    });
    //   $(window).focus(function () {
    //     document.getElementById("myTextId").focus();
    //  });

  }
  get f() { return this.LoginForm.controls; }

  UserLogin() {
    this.spinnerService.show();
    this.authenticationService.Authenticate(this.f.username.value, this.f.password.value).subscribe(res => {
      this.LoginResponse = res;
      if (this.LoginResponse.result) {
        this.LoginResponse.userInfo.token = 'Bearer ' + this.LoginResponse.userInfo.token;
        localStorage.setItem('UserInfo', JSON.stringify(this.LoginResponse.userInfo));
        const date = new Date(this.LoginResponse.userInfo.tokenExpiry);
        this.cookieService.set('UserInfo', JSON.stringify(this.LoginResponse.userInfo), date, "/", this.appConfig.DomainName);
        sessionStorage.setItem('usertoken', this.LoginResponse.userInfo.token)
        this.appConfig.UserInfoDetails();
        this.router.navigate(['/dashboard']);
        this.spinnerService.hide();
      } else {
        this.toastrService.error(this.LoginResponse.message);
      }

    });
  }

  SetUserNameagency(str: string, str2: string) {
    this.temp = str;
    let userctrl = str2;
    if (userctrl == "user") {
      this.checkverifuser = true;
    }
    else {
      this.checkverifuser = false;
    }
    let ctrl = this.finalEmployerForm.get('UserName');
    this.finalagencyForm.controls['UserName'].setValue(str);
  }

  Signagency() {
    this.GenerateOTP(this.agencyForm.value.phone);

    if (this.agencyShowStape == 1) {
      this.agencyShowStape = 0;
    } else {
      this.agencyShowStape = 1;
    }

    if (this.finalShowStapeemplyer == 1) {
      this.finalShowStapeemplyer = 0;
    } else {
      this.finalShowStapeemplyer = 1;
    }
  }

  finalSignagency() {
    if (this.finalShowStapeemplyer == 1) {
      this.finalShowStapeemplyer = 0;
    } else {
      this.finalShowStapeemplyer = 1;
    }
  }

  Signfinalagency(formvalue) {
    this.employeevalue.FirstName = this.agencyForm.value.contactname;
    this.employeevalue.CompanyName = this.agencyForm.value.orgName;
    this.employeevalue.LastName = this.agencyForm.value.LastName;
    this.employeevalue.Email = this.agencyForm.value.email;
    this.employeevalue.PhoneNo = this.agencyForm.value.phone;
    this.employeevalue.UserName = this.finalagencyForm.value.UserName;
    this.employeevalue.Password = this.finalagencyForm.value.pass;
    this.employeevalue.LoginType = 'Agency';
    this.employeevalue.UserFrom = this.finalagencyForm.value.email;
    this.employeevalue.Pan_Number = this.agencyForm.value.Pan;
    this.employeevalue.Gstn = this.agencyForm.value.gsteen;
    this.registService.Registration(this.employeevalue).subscribe(res => {
      this.Responce = res;
      if (this.Responce != null) {
        this.toastrService.success("Registration successfully.");
        this.finalagencyForm.reset();
        this.agencyForm.reset();
        this.modelShowStape = true;
        this.employerShowStape = 0;
        this.agencyShowStape = 0;

      } else {
        this.toastrService.error("Registration failed try again.");
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
            this.toastrService.success(this.Responce.message);
            this.checkverifuser = true;

          }
          else {
            this.toastrService.error(this.Responce.message);
            this.checkverifuser = false;
          }
        } else {
          this.toastrService.error(this.Responce.message);
          this.checkverifuser = false;

        }
      });
    }
  };


  pvalues = '';
  onKeychangepan(event: any) {
    this.pvalues = event.target.value;
    if (this.pvalues.length > 0) {
      this.registService.CheckPanCard(this.pvalues).subscribe(res => {
        this.Responce = res;
        if (this.Responce != null) {
          if (this.Responce.responseResult) {
            this.toastrService.success(this.Responce.message);
            this.checkverifypan = true;
          }
          else {
            this.toastrService.error(this.Responce.message);
            this.checkverifypan = false;
          }
        } else {
          this.toastrService.error(this.Responce.message);
          this.checkverifypan = false;
        }
      });
    }
  };
  gsteenvalues = '';
  onKeychangegsteen(event: any) {
    this.gsteenvalues = event.target.value;
    if (this.gsteenvalues.length > 0) {
      this.registService.CheckGstn(this.gsteenvalues).subscribe(res => {
        this.Responce = res;
        if (this.Responce != null) {
          if (this.Responce.responseResult) {
            this.toastrService.success(this.Responce.message);
            this.checkverifygstin = true;
          }
          else {
            this.toastrService.error(this.Responce.message);
            this.checkverifygstin = false;
          }
        } else {
          this.toastrService.error(this.Responce.message);
          this.checkverifygstin = false;
        }
      });
    }
  };
  mobvalues = '';
  CheckMobile(event: any) {
    this.mobvalues = event.target.value;
    if (this.mobvalues.length > 0) {
      this.registService.CheckMobile(this.mobvalues).subscribe(res => {
        this.Responce = res;
        if (this.Responce != null) {
          if (this.Responce.responseResult) {
            this.toastrService.success(this.Responce.message);
            this.checkverifymobile = true;

          }
          else {
            this.toastrService.error(this.Responce.message);
            this.checkverifymobile = false;
          }
        } else {
          this.toastrService.error(this.Responce.message);
          this.checkverifymobile = false;
        }
      });
    }
  };
  emailvalues = '';
  CheckEmail(event: any) {
    this.emailvalues = event.target.value;
    if (this.emailvalues.length > 0) {
      this.registService.CheckEmail(this.emailvalues).subscribe(res => {
        this.Responce = res;
        if (this.Responce != null) {
          if (this.Responce.responseResult) {
            this.toastrService.success(this.Responce.message);
            this.checkverifymail = true;
          }
          else {
            this.toastrService.error(this.Responce.message);
            this.checkverifymail = false;
          }
        } else {
          this.toastrService.error(this.Responce.message);
          this.checkverifymail = false;
        }
      });
    }
  };
  ValidatePasswordMacht(pass: string, confpass: string) {
    let password = pass;
    let confirmPassword = confpass;
    if (password != confirmPassword) {
      this.confpass = false;
      this.toastrService.error("PassWord not match.");
    }
    if (password == confirmPassword) {
      this.confpass = true;
      this.toastrService.success("PassWord successfully.");
    }
  }
  otpMacht(otp: string, otpenter: string) {
    let otpget = otp = '1234';
    let otpuserenter = otpenter;
    if (otpget != otpuserenter) {
      this.otpverify = false;
      this.toastrService.error("Otp not match.");
    }
    if (otpget == otpuserenter) {
      this.otpverify = true;
      this.toastrService.success("Otp successfully.");
    }
  }

  ForgotPassword() {
    this.spinnerService.show();
    this.authenticationService.ForgotPassword(this.ForgotPasswordForm.value.UserName).subscribe(res => {
      this.DBResponce = res;
      this.spinnerService.hide();
      if (this.DBResponce != null) {
        this.result = this.DBResponce;
      }
      this.mdResetPasswordOpen.nativeElement.click();
    });
  }

  CheckTokenForgotPassword(recoveryToken: string) {

    this.authenticationService.CheckTokenForgotPassword(recoveryToken).subscribe(res => {
      this.DBResponce = res;
      this.result = this.DBResponce;
      if (this.result != null && this.result.responseResult) {
        this.ShowChangePassword = true;
      }
      else if (this.result != null) {
        this.ShowChangePassword = false;
      }
      this.mdResetPasswordOpen.nativeElement.click();

    });
  }

  UpdateUserPassword() {
    this.activatedRoute.queryParams.subscribe(params => {
      this.recoveryToken = params['recoveryToken'];
    });
    var first = this.keyGen(7);
    var last = this.keyGen(4);
    if (first.length != 7) {
      first = first + 'c'
    }
    if (last.length != 4) {
      last = last + 'z'
    }
    var newPass = Md5.init(this.UpdatePassword.value.NewPassword);
    var newPassword = first + newPass + last;
    var confirmPass = Md5.init(this.UpdatePassword.value.ConfirmPassword);
    var confirmPassword = first + confirmPass + last;

    this.authenticationService.UpdateUserPassword(newPassword, confirmPassword, this.recoveryToken).subscribe(res => {
      this.DBResponce = res;
      this.result = this.DBResponce;
      if (this.result != null && this.result.responseResult) {
        this.ShowChangePassword = false;
      }
      else if (this.result != null) {
        this.ShowChangePassword = true;
      }
    });

  }
  modelshow() {
    this.EmployerForm.reset();
    this.finalEmployerForm.reset();
    this.finalagencyForm.reset();
    this.agencyForm.reset();
    this.modelShowStape = false;
    this.employerShowStape = 0;
    this.agencyShowStape = 0;
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


  CheckOTP(otpno: any) {
    this.otpget = otpno;
    this.registService.CheckOTP(this.otpget, this.PhoneNo).subscribe(res => {
      this.Responce = res;
      if (this.Responce != null) {
        if (this.Responce.responseResult) {
          this.toastrService.success(this.Responce.message);
          this.otpverify = true;
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
  jobList: any = [];
  pageNumber: any = 0;
  IndexPage() {
    this.router.navigate(['/index?']);
    this.jobList = [];

  }
  jobSearch(item: any) {
    let funId = {
      'id': item.functionid
    }
    this.FunctionAreaSelecteds = funId
    this.SearchJobHome(0)
  }

  Searchjobs: any = {};
  SearchJobHome(pageNumber) {
    this.spinnerService.show();
    if (this.FunctionAreaSelecteds != 'undefined') {
      this.Searchjobs.FunctionAreaId = this.FunctionAreaSelecteds.id ? this.FunctionAreaSelecteds.id : 0;
      this.Searchjobs.IndustryAreaId = this.IndustryAreaSelecteds.id ? this.IndustryAreaSelecteds.id : 0;
      this.Searchjobs.StatesId = this.StatesSelecteds.id ? this.StatesSelecteds.id : 0;
      this.Searchjobs.DistrictId = 0;
      this.router.navigate(['/JobSearch', btoa(pageNumber)]);
      this.spinnerService.hide();
      this.masterService.objSearchjobs = this.Searchjobs;
    } else {
      this.spinnerService.hide();
      this.masterService.objSearchjobs = this.Searchjobs;
      this.router.navigate(['/JobSearch', btoa(pageNumber)]);
    }

  }


  JobStatics: any = [];
  CompaniesList: any = [];
  GetJobStatics() {
    this.masterService.GetJobStatics().subscribe(res => {
      this.Responce = res;
      if (this.Responce != null) {
        this.JobStatics = this.Responce[0];
      } else {
        this.JobStatics = this.Responce;
        //alert(JSON.stringify(this.JobStatics))
      }

    });
  }
  cmpListRes: any;
  GetCompaniesList() {
    this.masterService.GetCompaniesList().subscribe(res => {
      this.cmpListRes = res;
      if (this.cmpListRes != null && this.cmpListRes.length > 0) {
        this.CompaniesList = this.cmpListRes;
      }
    });
  }

  JobsCategoriesList: any;
  stateCategoryRes: any
  StatsJobsByCategories() {
    this.masterService.StatsJobsByCategories().subscribe(res => {
      this.stateCategoryRes = res;
      if (this.stateCategoryRes != null && this.stateCategoryRes.length > 0) {
        this.JobsCategoriesList = this.stateCategoryRes;
      }
    });
  }
  IndustryAreaSelected: string;
  IndustryArea: any = [];
  Industry: any;
  GetAllIndustryArea() {
    this.masterService.GetAllIndustryArea().subscribe(res => {
      this.Industry = res;
      if (this.Industry != null && this.Industry.length > 0) {
        this.IndustryArea = this.Industry;
      }
    });
  }
  FunctionArea: any = [];
  FunctionAreaSelected: string;
  AreaResponce: any;

  GetAllFunctionArea() {
    this.masterService.GetAllFunctionArea().subscribe(res => {
      this.AreaResponce = res;
      if (this.AreaResponce != null && this.AreaResponce.length > 0) {
        this.FunctionArea = this.AreaResponce;
      }
    });
  }

  States: any = [];
  StatesSelected: string;
  stateRes: any;
  GetAllStates() {
    this.masterService.GetAllStates().subscribe(res => {
      this.stateRes = res;
      if (this.stateRes != null && this.stateRes.length > 0) {
        this.States = this.stateRes;
      }

    });
  }
  FunctionAreaSelecteds: any = 0;
  IndustryAreaSelecteds: any = 0;
  StatesSelecteds: any = 0;
  IndustryAreaOnSelect(event: TypeaheadMatch): void {
    this.IndustryAreaSelecteds = event.item;
  }

  FunctionAreaOnSelect(event: TypeaheadMatch): void {
    this.FunctionAreaSelecteds = event.item;
  }

  StatesOnSelect(event: TypeaheadMatch): void {
    this.StatesSelecteds = event.item;
  }

  keyGen(keyLength: any) {
    var i, key = "", characters = "abcdefghijklmnopqrstuvwxyzabcdefghijklmnopqrstuvwxyz0123456789";
    var charactersLength = characters.length;

    for (i = 0; i < keyLength; i++) {
      key += characters.substr(Math.floor((Math.random() * charactersLength) + 1), 1);
    }

    return key;
  }


  // Start Feed Back form work Done By Pankaj Joshi

  btnsts: boolean = true;
  feedbackForm: FormGroup;
  feedbackResponse: any;
  feedback(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template,
      Object.assign({}, { class: 'feedback-modal' }
      ));
    this.feedbackForm.controls.usertype.reset();
    this.feedbackForm.controls['usertype'].setValue('');

  }


  feedbackFormInit() {
    this.feedbackForm = this.formBuilder.group({
      name: ['', [Validators.required, , Validators.compose([CustomValidators.removeSpaces])]],
      companyName: ['', [Validators.required, , Validators.compose([CustomValidators.removeSpaces])]],
      email: ['', [Validators.required, Validators.compose([CustomValidators.vaildEmail])]],
      mobile: ['', [Validators.required, Validators.compose([CustomValidators.validMobile])]],
      landlineNumber: ['', [Validators.nullValidator,]],
      feedback: ['', [Validators.required, , Validators.compose([CustomValidators.removeSpaces])]],
      usertype: ['', [Validators.required]],
      captcha: ['', [Validators.required]],
    });
  }

  submit() {
    if (this.feedbackForm.value.feedback.trim().length == '0') {
      this.toastrService.error('feedback should not be blank');
      return false
    }
    this.btnsts = false;
    let postData = {
      "UserType": this.feedbackForm.value.usertype,
      "Name": this.feedbackForm.value.name.trim(),
      "CompanyName": this.feedbackForm.value.companyName.trim(),
      "Email": this.feedbackForm.value.email.trim(),
      "MobileNo": this.feedbackForm.value.mobile,
      "LandLineNo": this.feedbackForm.value.landlineNumber,
      "UserFeedback": this.feedbackForm.value.feedback.trim(),
    }
    this.spinnerService.show();
    this.masterService.sendFeedback(postData).subscribe(res => {
      this.spinnerService.hide();
      this.btnsts = true;
      this.feedbackResponse = res;
      if (this.feedbackResponse) {
        this.modalRef.hide();
        this.toastrService.success("feedback submit successfully.");
        this.closeFeedback();
      } else {
        this.toastrService.error('feedback submit failed try again');
      }
    })
  }

  closeFeedback() {
    this.modalRef.hide();
    this.feedbackForm.controls.name.reset();
    this.feedbackForm.controls.companyName.reset();
    this.feedbackForm.controls.mobile.reset();
    this.feedbackForm.controls.email.reset();
    this.feedbackForm.controls.landlineNumber.reset();
    this.feedbackForm.controls.feedback.reset();
    //  this.feedbackForm.controls.captcha.reset();
    this.feedbackForm.controls['name'].setValue('');
    this.feedbackForm.controls['companyName'].setValue('');
    this.feedbackForm.controls['mobile'].setValue('');
    this.feedbackForm.controls['landlineNumber'].setValue('');
    this.feedbackForm.controls['feedback'].setValue('');
    // this.feedbackForm.controls['captcha'].setValue('');


  }

  resolved(captchaResponse: string) {

  }

  // End Feedback form functionality

  scroll(el) {
    el.scrollIntoView();
  }



  //////////////////   subscripform data   //////////////
  btnstsubcrip: boolean = true;
  subcripForm: FormGroup;
  dropdownSettings: any = {};
  dropdownSettings2: any = {};
  subcrip(subcription: TemplateRef<any>) {
    //this.subcripForm.reset();
    this.modalRef = this.modalService.show(subcription,
      Object.assign({}, { class: 'feedback-modal' }
      ));

  }

  subcripFormInit() {

    this.subcripForm = this.formBuilder.group({
      // name: ['', [Validators.required, , Validators.compose([CustomValidators.removeSpaces])]],
      name: ['', [Validators.required, Validators.compose([CustomValidators.validName, CustomValidators.removeSpaces])]],
      email: ['', [Validators.required, Validators.compose([CustomValidators.vaildEmail])]],
      mobile: ['', [Validators.required, Validators.compose([CustomValidators.validMobile])]],
      industry: ['', [Validators.nullValidator,]],
      functionalarea: ['', [Validators.nullValidator,]],
      zones: ['', [Validators.nullValidator,]],
      regional: ['', [Validators.nullValidator,]],
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

  subcripresponse: any
  subcripsubmit() {
    if (!this.subcripForm.valid) {
      this.toastrService.error('Subscribe should not be blank');
      return false
    }
    if (this.IndustFormArray.length == 0) {
      this.toastrService.error('Please select industry');
      return false
    }
    if (this.FunctionalFormArray.length == 0) {
      this.toastrService.error('Please select functional area');
      return false
    }
    var regexEmail = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (this.subcripForm.value.email.length > 0 && !regexEmail.test(this.subcripForm.value.email)) {
      this.toastrService.error('Entered email not valid');
      return false
    }
    if (this.subcripForm.value.email.length > 0 && this.checkemailvalsuscribe == false) {
      this.toastrService.error('Entered email already exit');
      return false
    }
    this.btnstsubcrip = false;
    if (this.subcripForm.valid && this.checkmobvalsuscribe == true) {
      let subscribData = {
        "Name": this.subcripForm.value.name.trim(),
        "Email": this.subcripForm.value.email.trim(),
        "Mobile": this.subcripForm.value.mobile,
        "IndustryList": this.IndustFormArray,
        "FunctionalList": this.FunctionalFormArray,
        "RegionId": this.subcripForm.value.regional != '' ? this.subcripForm.value.regional : 0,
        "SubregionId": this.subcripForm.value.regional != '' ? this.subcripForm.value.regional : 0,
        "zones": this.subcripForm.value.zones != '' ? this.subcripForm.value.zones : 0,
        "ComapnyId": this.subcripForm.value.employer != '' ? this.subcripForm.value.employer : 0,
        // "subzones":this.subcripForm.value.subzones,
      }
      console.log(subscribData);

      this.spinnerService.show();
      this.registService.SetEmpSubscriptionDetails(subscribData).subscribe(res => {
        this.spinnerService.hide();
        this.btnstsubcrip = true;
        this.response = res;
        if (this.response.responseResult) {
          //this.modalRef.hide();
          this.toastrService.success(this.response.message);
          //this.subcripForm.reset();
          this.subcripclose();
        } else {
          //alert();
          this.toastrService.error(this.response.message);
        }
      })
    }
    else {
      this.toastrService.error('all subscribe should not be blank ');
    }
  }

  subcripclose() {
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
    this.FunctionalFormArray = [];
    this.IndustFormArray = [];
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
        "IndustrialAreaId": data
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
          "IndustrialAreaId": data
        }
      );
    }
  }
  onDeSelectAll(items: any) {
    this.IndustFormArray = [];
  }

  FunctionalFormArray: any = [];
  FunctionalonItemSelect(item: any) {
    var data = item.id;
    this.FunctionalFormArray.push(
      {
        "FunctionalareaId": data
      }
    );
  }

  FunctionalonItemDeSelect(item: any) {
    let index = this.FunctionalFormArray.indexOf(item.id);
    this.FunctionalFormArray.splice(index, 1);
  }
  FunctionalonSelectAll(items: any) {
    for (var i = 0; i < items.length; i++) {
      var data = items[i].id;
      this.FunctionalFormArray.push(
        {
          "FunctionalareaId": data
        }
      );
    }
  }
  FunctionalononDeSelectAll(items: any) {
    this.FunctionalFormArray = [];
  }
  ////////////////// method for suscribe ///////////////
  checkmobvalsuscribe: boolean = false;
  subscibemob: any = '';
  CheckMobileSub(event: any) {
    this.subscibemob = event.target.value;
    var IndNum = /^[0]?[6789]\d{9}$/;
    if (this.subscibemob.length == 10 && IndNum.test(this.subscibemob)) {
      this.registService.CheckMobileSubscription(this.subscibemob).subscribe(res => {
        this.Responce = res;
        if (this.Responce != null) {
          if (this.Responce.responseResult) {
            this.checkmobvalsuscribe = true;
          }
          else {
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
  checkemailvalsuscribe: boolean = false;
  subscibeemail: any = '';
  CheckEmailSub(event: any) {
    this.subscibeemail = event.target.value;
    var regexEmail = /\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*/;
    if (this.subscibeemail.length > 0 && regexEmail.test(this.subscibeemail)) {
      this.registService.CheckEmailSubscription(this.subscibeemail).subscribe(res => {
        this.Responce = res;
        if (this.Responce != null) {
          if (this.Responce.responseResult) {
            this.checkemailvalsuscribe = true;
          }
          else {
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
  AllRegion: any = []
  zoneid: any;

  GetAllRegion(zoneid: any) {
    this.zoneid = zoneid;
    if (this.zoneid != '') {
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
    else {
      this.AllRegion = [];
      this.SubAllRegion = [];
      this.subcripForm.controls.regional.setValue('');
      this.subcripForm.controls.subregional.setValue('');

    }

  }

  SubAllRegion: any = []
  GetAllSubRegion(reginionid: any) {
    if (reginionid != '') {
      this.masterService.GetAllSubRegion(this.zoneid, reginionid).subscribe(res => {
        this.Responce = res;
        if (this.Responce != null) {
          this.SubAllRegion = this.Responce;
        } else {
          this.SubAllRegion = [];
          this.subcripForm.controls.subregional.setValue('');

        }
      });
    }
    else {
      this.SubAllRegion = [];
      this.subcripForm.controls.subregional.setValue('');
    }

  }
  Getallemployer: any = [];
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

  ///////////// Remove Specail Char //////////////
  removeSpecialnamechar(event) {
    var regex = new RegExp("^[0-9+?=.*!;:,/><}`~{|)(_'@#$%^&*]+$");
    var key = String.fromCharCode(event.charCode ? event.which : event.charCode);
    if (regex.test(key)) {
      // event.preventDefault();
      return false;
    }
    var keycode = event.which;
    if (keycode == 34 || keycode == 92 || keycode == 45 || keycode == 91 || keycode == 93) {
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
    if (keycode == 34 || keycode == 92 || keycode == 45 || keycode == 91 || keycode == 93) {
      // event.preventDefault();
      return false;
    }
  }
  ////////////////////// End Reomve Special Char ////////////////

  ///////////// Landline Specail Char //////////////
  Validationforlandline(event: any) {
    var phoneno = event;
    if (phoneno) {
      var myregex = /^\(?([0-9]{1})\)?[-. ]?([1-9]{1})[-. ]?([0-9]{4})[-. ]?([0-9]{4,6})$/;
      if (!myregex.test(phoneno)) {
        //event.preventDefault();
        this.toastrService.error("Landline Number Is Not Valid");
        this.feedbackForm.controls.landlineNumber.setValue('');
        return false;
      }
    }

  }
  ////////////////////// End Landline Char ////////////////
}


