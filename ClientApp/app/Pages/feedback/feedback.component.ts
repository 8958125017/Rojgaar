import { Component, OnInit, ViewChild, ElementRef  } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup,  Validators } from '@angular/forms';
import { RegistrationService } from '../../Services/registration.service';
import { AuthenticationService } from '../../Services/authenticate.service';
import { CookieService } from 'ngx-cookie-service';
import { AppConfig } from '../../Globals/app.config';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
import { ToastrService,  } from 'ngx-toastr';
import { CustomValidators } from '../../Validators/custom-validator.directive';
import { MasterService } from '../../Services/master.service';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { BsModalService } from 'ngx-bootstrap/modal';
import * as $ from 'jquery';

@Component({
  selector: 'app-feedbackComponent',
  templateUrl: './feedback.component.html',
})

export class FeedbackComponent implements OnInit {
 
  
  Responce: any = {};
  constructor(    
    private router: Router,
    private spinnerService: Ng4LoadingSpinnerService,  
    private registService: RegistrationService,
    private masterService: MasterService,
    private toastrService: ToastrService,   
    private formBuilder: FormBuilder,
    public appConfig: AppConfig, 
  ) {
  
   
  }

  resolved(captchaResponse: string) {

  }

  scroll(el) {
    el.scrollIntoView();
  }

  ngOnInit() {
    this.feedbackFormInit();
    $(".mobile-tgl-menu").click(function () {
      //$('.header .main_menu_bg #bs-example-navbar-collapse-1 ul').slideToggle();
      $(this).siblings('#bs-example-navbar-collapse-1').children('ul').slideToggle();
    });
    this.GetFeedbackType();
  }


  // Start Feed Back form work Done By Pankaj Joshi

  btnsts: boolean = true;
  feedbackForm: FormGroup;
  feedbackResponse: any;

  feedbackFormInit() {
    this.feedbackForm = this.formBuilder.group({
      // ClientType:  ['', [Validators.required]],
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
      // "feedbackTypeId":this.feedbackForm.value.ClientType,
      "feedbackTypeId":'',
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
        this.toastrService.success("feedback submit successfully.");
        this.closeFeedback();
      } else {
        this.toastrService.error('feedback submit failed try again');
      }
    })
  }

  closeFeedback() {
    this.feedbackForm.controls.usertype.reset();
    this.feedbackForm.controls.name.reset();
    this.feedbackForm.controls.companyName.reset();
    this.feedbackForm.controls.mobile.reset();
    this.feedbackForm.controls.email.reset();
    this.feedbackForm.controls.landlineNumber.reset();
    this.feedbackForm.controls.feedback.reset();
    this.feedbackForm.controls['usertype'].setValue('');
    this.feedbackForm.controls['name'].setValue('');
    this.feedbackForm.controls['companyName'].setValue('');
    this.feedbackForm.controls['mobile'].setValue('');
    this.feedbackForm.controls['landlineNumber'].setValue('');
    this.feedbackForm.controls['feedback'].setValue('');
    this.feedbackForm.controls['captcha'].setValue('');
    // this.feedbackForm.controls['ClientType'].setValue('');


  }

 

  // End Feedback form functionality

 



  //////////////////   subscripform data   //////////////
  btnstsubcrip: boolean = true;
  subcripForm: FormGroup;
  dropdownSettings: any = {};
  dropdownSettings2: any = {};
  subsSubmitCount: any = 1;



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
  decimals(e){
    if (e.keyCode === 190 || e.keyCode == 110) {
        return false;
    }
    if (e.keyCode === 189 ) {
        return false;
    }
  }
  dbresponse:any={};
  FeedbackType:any=[];
  GetFeedbackType(){
    
    this.masterService.GetFeedbackType().subscribe(res => {
      this.dbresponse = res
      if(this.dbresponse !=null)
      this.FeedbackType = this.dbresponse.lstFeedbackType
    })
  }
}

