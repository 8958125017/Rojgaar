import { HttpClient } from '@angular/common/http';
import { Component, TemplateRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup ,Validators} from '@angular/forms';
import { Router, RouterEvent, NavigationEnd, NavigationCancel, NavigationError, NavigationStart } from '@angular/router';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { CookieService } from 'ngx-cookie-service';
import { ToastContainerDirective, ToastrService } from 'ngx-toastr';
import { MasterService } from '../../../../Services/master.service';
import { AppConfig } from '../../../../Globals/app.config';
import { AuthenticationService } from '../../../../Services/authenticate.service';
import { NgProgress } from 'ngx-progressbar';
import { Md5} from "md5-typescript";
import { CustomValidators } from '../../../../Validators/custom-validator.directive';
import { Alert } from 'selenium-webdriver';
import { IfObservable } from 'rxjs/observable/IfObservable';
@Component({
  selector: 'app-SecureHeader',
  templateUrl: './Secure-Header.Component.html'
})
export class SecureHeaderComponent {
  UserInfo: any={};
  Response: any = {};
  UpdatePasswordForm:FormGroup;
  sts:boolean=false;
  errmsg:any='';

  constructor(private http: HttpClient
    , private router: Router
    , private config: AppConfig
    , private _cookieService: CookieService
    , private toastrService: ToastrService
    , private modalService: BsModalService
    , private authenticationService: AuthenticationService
    , private spinnerService: Ng4LoadingSpinnerService
    , private appConfig: AppConfig
    , private formBuilder: FormBuilder
    , public ngProgress: NgProgress
    ,private masterService : MasterService
  ) {


  }


  ngOnInit() {
    this.UserInfo = this.appConfig.UserInfo
    if(this.UserInfo){

    }
    this.feedbackFormInit();
    this.GetFeedbackType();
    this.UpdatePasswordForm = this.formBuilder.group({
      current_password:['',[Validators.required]],
      new_password:['',[Validators.required,CustomValidators.PasswordPolicy]],
      reenter_new_password:['',[Validators.required,CustomValidators.PasswordPolicy]]

    });

  }
  
  confirmBox(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template, { class: 'modal-sm' });
  }

  declineBox(): void {
    this.modalRef.hide();
  }

  logout() {
    localStorage.clear();
    sessionStorage.clear();
    this._cookieService.deleteAll('UserInfo');
    this._cookieService.deleteAll();
    sessionStorage.removeItem('usertoken');
    localStorage.removeItem('UserInfo');
    this._cookieService.deleteAll('UserInfo', this.config.DomainName);
    this.modalRef.hide();
    this.router.navigate(['index']);

  }

  checkCurrentPassword(event:any){
      var value = event.target.value;
      var first= this.keyGen(7);
      var last = this.keyGen(4);
      var currentPass=Md5.init(value);
      var currentpassword = first + currentPass + last;
      
      if(value){
      
        this.authenticationService.CheckPassword(currentpassword)
        .subscribe(res => {
          this.Response = res;
          if(this.Response.responseResult==false){
            this.errmsg='Wrong current password';
            this.sts=false;
            return false;
          }else{
            this.errmsg='';
            this.sts=true;
          }
        });
      }else{
        this.errmsg="";
      }
  

  }

    UpdatePassword(resetpasswordformvalue){
      if(resetpasswordformvalue.new_password!=resetpasswordformvalue.reenter_new_password){
       this.toastrService.error('Password and Confirm Password Did Not Matched');
       this.sts=false;
       return false;

     }else{
       this.sts=true;
     }

     var first= this.keyGen(7);
     var last = this.keyGen(4);
     if(first.length!=7)
     {
       first= first+'c'
     }
     if(last.length!=4)
     {
       last= last+'z'
     }
     var currentPass=Md5.init(resetpasswordformvalue.current_password);
     var currentPassword=first+currentPass+last;
     var newPass=Md5.init(resetpasswordformvalue.new_password);
     var newPassword=first+newPass+last;
     var confirmPass=Md5.init(resetpasswordformvalue.reenter_new_password);
     var confirmPassword=first+confirmPass+last;
      this.authenticationService.ChangePassword(currentPassword,newPassword,confirmPassword)
      .subscribe(res => {
        var response = res;
        if(response!=null){
          this.toastrService.success("Password has been updated successfully.");
          this.UpdatePasswordForm.reset();
          this.logout();
        }else{
          this.toastrService.error('something went wrong');
        }
      });

    }

    keyGen(keyLength :any) {
      var i, key = "", characters = "abcdefghijklmnopqrstuvwxyzabcdefghijklmnopqrstuvwxyz0123456789";
        var charactersLength = characters.length;

      for (i = 0; i < keyLength; i++) {
          key += characters.substr(Math.floor((Math.random() * charactersLength) + 1), 1);
      }

      return key;
    }

    clearUpdatePasswordForm(){

         this.UpdatePasswordForm.reset();
    }

    modalRef: BsModalRef;
    btnsts:boolean=true;
    feedbackForm     :  FormGroup;
    response:any
    feedback(template: TemplateRef<any>){
      this.modalRef = this.modalService.show(template,
        Object.assign({}, { class: 'feedback-modal in-dashboard' }
        ));
        this.filldefault();
    }

    feedbackFormInit(){
      this.feedbackForm = this.formBuilder.group({
        ClientType:  ['', [Validators.required]],
        name: ['', [Validators.required, , Validators.compose([CustomValidators.removeSpaces])]],
        companyName: ['', [Validators.required, , Validators.compose([CustomValidators.removeSpaces])]],
        email: ['', [Validators.required, Validators.compose([CustomValidators.vaildEmail])]],
        mobile: ['', [Validators.required, Validators.compose([CustomValidators.validMobile])]],
        landlineNumber: [''],
        feedback : ['', [Validators.required, , Validators.compose([CustomValidators.removeSpaces])]],
        usertype:[''],
       });
      }

      submit(){

        if(this.feedbackForm.value.feedback.trim().length=='0'){
          this.toastrService.error('feedback should not be blank');
          return false
        }
         this.btnsts=false;
         let postData={
             "feedbackTypeId":this.feedbackForm.value.ClientType,
              "UserType":this.UserInfo.loginType,
              "Name":this.feedbackForm.value.name,
              "CompanyName":this.feedbackForm.value.companyName,
              "Email":this.feedbackForm.value.email,
              "MobileNo":this.feedbackForm.value.mobile,
              "LandLineNo":this.feedbackForm.value.landlineNumber,
              "UserFeedback":this.feedbackForm.value.feedback,
         }
         this.spinnerService.show();
         this.masterService.sendFeedbackWithLogin(postData).subscribe(res=>{
          this.btnsts=true;
          this.spinnerService.hide();
          this.response=res;
           if(this.response.responseResult){
            this.modalRef.hide();
            this.feedbackForm.reset();
            this.feedbackForm.controls['ClientType'].setValue('');
            this.toastrService.success(this.response.message);
           }else{
            this.toastrService.error('feedback submit failed try again');
           }
         })

      }
    userStatus:boolean=true;
    companyStatus:boolean=true;
    mobileStatus:boolean=true;
    emailStatus:boolean=true;


    filldefault() {
      if(this.UserInfo.fullName){
        this.userStatus=false;
        this.feedbackForm.controls['name'].setValue(this.UserInfo.fullName);
      }
      this.feedbackForm.controls['usertype'].setValue(this.UserInfo.loginType);
      if(this.UserInfo.companyName){
        this.companyStatus=false
        this.feedbackForm.controls['companyName'].setValue(this.UserInfo.companyName);
      }
      if(this.UserInfo.mobile){
        this.mobileStatus=false
        this.feedbackForm.controls['mobile'].setValue(this.UserInfo.mobile);
      }
      if(this.UserInfo.email){
        this.emailStatus=false
        this.feedbackForm.controls['email'].setValue(this.UserInfo.email);
      }

    }


    close(){
      this.modalRef.hide();
      this.feedbackForm.reset();
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








