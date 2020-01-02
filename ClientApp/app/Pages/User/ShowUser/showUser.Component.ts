import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder ,FormGroup, Validators} from '@angular/forms';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
import { ToastContainerDirective, ToastrService } from 'ngx-toastr';
import { AppConfig } from '../../../Globals/app.config';
import { UserInfoService } from '../../../Services/userInfo.service.';


@Component({
  selector: 'app-showUserComponent',
  templateUrl: './showUser.Component.html',
})
export class showUserComponent implements OnInit {
  //@ViewChild(ToastContainerDirective) toastContainer: ToastContainerDirective;
  UserInfo: any;
  showForm=0;
  CreateUserForm:FormGroup;
  createuserfomvalue:any={};
  user_name:string;

  constructor(private appConfig: AppConfig
    , private toastrService: ToastrService
    , private userinfoservice: UserInfoService
    , private formBuilder: FormBuilder
    , private spinnerService: Ng4LoadingSpinnerService) {

    try {
      this.UserInfo = appConfig.UserInfo

    } catch  { }

  }
  ngOnInit() {

        this.showForm=0;
        this.CreateUserForm = this.formBuilder.group({
            user_name: ['', [Validators.required]]

        });
  }

  // addEditUserForm(){

  //       this.createuserfomvalue.user_name=this.CreateUserForm.value.user_name
  // }

  showState(){

      this.showForm=1;
  }

  createUser(){

      this.showForm=0;
  }
}
