import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder ,FormGroup, Validators} from '@angular/forms';
import { ToastContainerDirective, ToastrService } from 'ngx-toastr';
import { AppConfig } from '../../../Globals/app.config';
import { UserInfoService } from '../../../Services/userInfo.service.';
import { CustomValidators } from '../../../Validators/custom-validator.directive';
import { RegistrationService } from '../../../Services/registration.service';


@Component({
  selector: 'app-addUserComponent',
  templateUrl: './addUser.Component.html',
})
export class addUserComponent implements OnInit {
  @ViewChild(ToastContainerDirective) toastContainer: ToastContainerDirective;
  UserInfo: any;
  CreateUserForm:FormGroup;
  createuserfomvalue:any={};
  user_name:string;
  response: any = {};
  userdetails:any={};
  userresponse:any ={};
  cnfpass=true;
  usernameavail:string='0';
  usernamevalue:any;
  checkverifymail:boolean=false
  emailvalues:any = '';
  mobvalues:any = '';
  checkverifymobile:boolean=false;



  constructor(private appConfig: AppConfig
    , private toastrService: ToastrService
    , private formBuilder: FormBuilder
    , private registService: RegistrationService,
    )
 {

  try {

    this.UserInfo = appConfig.UserInfo
  } catch  { }

 }

  ngOnInit() {

        this.CreateUserForm = this.formBuilder.group({
          UserName: ['', [Validators.required]],
          FirstName: ['', [Validators.required]],
          Email: ['', [Validators.required, Validators.compose([CustomValidators.vaildEmail])]],
          PhoneNo: ['', [Validators.required, Validators.compose([CustomValidators.validMobile])]],
          Password:['',[Validators.required]],
          ConfirmPassword:['',[Validators.required]]

        });


  }

  createUser(){

    this.registService.Registration(this.CreateUserForm.value).subscribe(res => {
          this.response = res;
          if (this.response != null) {
             var parentid=this.UserInfo.id;
             this.userdetails={ParentUserId:parentid,ChildUserId:this.response.id} ;
            this.registService.CreateUser(this.userdetails).subscribe(userres=>{

                  this.userresponse=userres;
                   this.toastrService.success(this.userresponse.message);
            });

          this.CreateUserForm.reset();

          } else {

              this.toastrService.error(this.userresponse.message);
          }

    });

  }

  onKeychangeuser(event: any) {
      this.usernamevalue = event.target.value;
        if(this.usernamevalue != null || this.usernamevalue!='undefined') {
            this.registService.usercheck(this.usernamevalue).subscribe(res => {
                this.response = res;
                if (this.response != null) {

                   if(this.response.responseResult){

                    this.toastrService.success(this.response.message);
                    this.usernameavail = '1';

                   }else{
                     this.toastrService.error(this.response.message);
                     this.usernameavail = '0';
                 }
          } else {
                this.toastrService.error(this.response.message);
                this.usernameavail = '0';
          }
      });
    }
  };

CheckEmail(event: any) {
    this.emailvalues = event.target.value;
   var  regexEmail = /\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*/;
    if (this.emailvalues.length >0 && regexEmail.test(this.emailvalues) ) {
    this.registService.CheckEmail(this.emailvalues).subscribe(res => {
      this.response = res;
      if (this.response != null) {
        if(this.response.responseResult)
        {
         this.toastrService.success(this.response.message);
          this.checkverifymail = true;

        }
        else
        {

          this.toastrService.error(this.response.message);
          this.checkverifymail = false;

        }
      } else {
        this.toastrService.error(this.response.message);
        this.checkverifymail = false;


      }
    });
 }
};

CheckMobile(event: any) {
    this.mobvalues = event.target.value;
    var IndNum = /^[0]?[6789]\d{9}$/;
    if(this.mobvalues.length == 10 && IndNum.test(this.mobvalues)) {
    this.registService.CheckMobile(this.mobvalues).subscribe(res => {
      this.response = res;
      if (this.response != null) {
        if(this.response.responseResult)
        {
          this.toastrService.success(this.response.message);
          this.checkverifymobile = true;

        }
        else
        {

          this.toastrService.error(this.response.message);
          this.checkverifymobile = false;

        }
      } else {
        this.toastrService.error(this.response.message);
        this.checkverifymobile = false;


      }
    }); 
  }
  }
  confpass:boolean=false;
  ValidatePasswordMacht(pass: string, confpass: string) {
    let password = pass;      
    let confirmPassword = confpass;       
    if (password != confirmPassword) {
      this.confpass = false;
      this.toastrService.error("PassWord not match.");
      this.CreateUserForm.controls['ConfirmPassword'].setValue('');

    }
    if (password == confirmPassword) {
      this.confpass = true;
    }
  }

}
