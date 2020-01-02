import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
import { ToastContainerDirective, ToastrService } from 'ngx-toastr';
import { AppConfig } from '../../../Globals/app.config';
import { UserInfoService } from '../../../Services/userInfo.service.';


@Component({
  selector: 'app-addEditRoleComponent',
  templateUrl: './addEditRole.Component.html',
})
export class addEditRoleComponent implements OnInit {
  @ViewChild(ToastContainerDirective) toastContainer: ToastContainerDirective;
  UserInfo: any;
  

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
   
  }

}  
