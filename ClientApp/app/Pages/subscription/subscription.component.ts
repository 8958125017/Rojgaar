import { Component, OnInit, ViewChild, ElementRef, HostListener, TemplateRef } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
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
import { Md5 } from "md5-typescript";
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { BsModalService } from 'ngx-bootstrap/modal';
import { analyzeAndValidateNgModules } from '@angular/compiler';

@Component({
  selector: 'app-subscriptionComponent',
  templateUrl: './subscription.component.html',
})
export class SubscriptionComponent implements OnInit {
 
 // @ViewChild('mdResetPasswordOpen') mdResetPasswordOpen: ElementRef
 
  response: any

  constructor(
    private spinnerService: Ng4LoadingSpinnerService,
    private registService: RegistrationService,
    private masterService: MasterService,
    private toastrService: ToastrService,
    private formBuilder: FormBuilder,
    public appConfig: AppConfig,
    private modalService: BsModalService,
  ) {
    
  }
  ngOnInit(){
    this.GetAllIndustryArea();
    this.GetAllFunctionArea();
    this.subcripFormInit();
    $(".mobile-tgl-menu").click(function () {
      //$('.header .main_menu_bg #bs-example-navbar-collapse-1 ul').slideToggle();
      $(this).siblings('#bs-example-navbar-collapse-1').children('ul').slideToggle();
    });
   }
  //////////////////   subscripform data   //////////////
  btnstsubcrip: boolean = true;
  subcripForm: FormGroup;
  dropdownSettings: any = {};
  dropdownSettings2: any = {};
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
    // this.GetAllFunctionArea();
 //   this.GetAllIndustryArea();
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
    if(this.subcripForm.value.mobile.length > 0 &&this.checkmobvalsuscribe==false){
      this.toastrService.error('Entered mobile number already exit');
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
        "ComapnyId": this.subcripForm.value.employer != '' ? this.subcripForm.value.employer : 0        
      }
     
      this.spinnerService.show();
      this.registService.SetEmpSubscriptionDetails(subscribData).subscribe(res => {
        this.spinnerService.hide();
        this.btnstsubcrip = true;
        this.response = res;
        if (this.response.responseResult) {          
          this.toastrService.success(this.response.message);          
          this.subcripclose();
        } else {
               this.toastrService.error(this.response.message);
        }
      })
    }
    else {
      this.toastrService.error('all subscribe should not be blank ');
    }
  }
  selectedIndustry:any;
  selectedFunctionalarea:any;
  subcripclose() {  
    this.subcripForm.reset();
    this.subcripForm.controls.name.reset();
    this.subcripForm.controls.email.reset();
    this.subcripForm.controls.mobile.reset();
    this.subcripForm.controls.industry.reset();
    this.subcripForm.controls.functionalarea.reset();
    this.subcripForm.controls.zones.reset();
    this.subcripForm.controls.regional.reset();
    this.subcripForm.controls.subregional.reset();
    this.subcripForm.controls.employer.reset();   
    this.subcripForm.controls['name'].setValue('');
    this.subcripForm.controls['email'].setValue('');
    this.subcripForm.controls['mobile'].setValue('');
    this.subcripForm.controls['industry'].setValue('');
    this.subcripForm.controls['functionalarea'].setValue('');
    this.FunctionalFormArray = [];
    this.selectedIndustry = []; 
    this.selectedFunctionalarea = []; 
    this.IndustFormArray = [];
    this.subcripForm.controls['zones'].setValue('');
    this.subcripForm.controls['regional'].setValue('');
    this.subcripForm.controls['subregional'].setValue('');
    this.subcripForm.controls['employer'].setValue('');
    this.subcripForm.controls['captcha'].setValue('');
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

  resolved(captchaResponse: string) {

  }


  scroll(el) {
    el.scrollIntoView();
  }

  FunctionalononDeSelectAll(items: any) {
    this.FunctionalFormArray = [];
  }
  ////////////////// method for suscribe ///////////////
  checkmobvalsuscribe: boolean = false;
  subscibemob: any = '';
  Responce: any = {};
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
      //  this.feedbackForm.controls.landlineNumber.setValue('');
        return false;
      }
    }

  }
  decimals(e){
    if (e.keyCode === 190 || e.keyCode == 110) {
        return false;
    }
    if (e.keyCode === 189 ) {
        return false;
    }
  }
  ////////////////////// End Landline Char ////////////////

  





  
}

