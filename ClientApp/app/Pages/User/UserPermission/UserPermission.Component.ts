import { Response } from '@angular/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
import { ToastContainerDirective, ToastrService } from 'ngx-toastr';
import { AppConfig } from '../../../Globals/app.config';
import { UserInfoService } from '../../../Services/userInfo.service.';


@Component({
  selector: 'app-UserPermissionComponent',
  templateUrl: './UserPermission.Component.html',
})
export class UserPermissionComponent implements OnInit {
  //@ViewChild(ToastContainerDirective) toastContainer: ToastContainerDirective;
  UserInfo: any;
  showForm = 0;
  UserPermissionForm: FormGroup;
  Response: any = [];
  read_write: any = [];
  permissionform: FormGroup;
  userpermission: any = [];

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

    this.UserPermissionForm = this.formBuilder.group({
    userpermission: ['',]
    });
    var parentid = this.UserInfo.id;
    this.userinfoservice.GetUserList(parentid).subscribe(res => {
    this.Response = res;
    this.Response = this.Response.lstUser;
    })
  }

  createUserPermission() {
  }

  //call api to get userpermission details

  getId(id: any) {
    this.userinfoservice.GetPermissionDetails(id).subscribe(res => {
    this.userpermission = res;
    this.userpermission = this.userpermission.lstUser;
    });
  }

}
