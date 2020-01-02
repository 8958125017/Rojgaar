import { Component, OnInit, ViewChild } from '@angular/core';
import { ToastContainerDirective, ToastrService } from 'ngx-toastr';
import { AppConfig } from '../../../Globals/app.config';
import { UserInfoService } from '../../../Services/userInfo.service.';
import { CustomValidators } from '../../../Validators/custom-validator.directive';
import { MasterService } from '../../../Services/master.service';
import { identifierModuleUrl } from '@angular/compiler';
import { debug } from 'util';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
import { AgencyjobpostService } from '../../../Services/agencyjobpost.service';
import { Router, ActivatedRoute, Params } from '@angular/router';
@Component({
  selector: 'app-AgencyJobApplyComponent',
  templateUrl: './AgencyJobApply.Component.html',
})

export class AgencyJobApplyComponent implements OnInit {
  @ViewChild(ToastContainerDirective) toastContainer: ToastContainerDirective;

    UserInfo: any;
    names:any=[];
    selectedAll: any;
    jobTitle:any;
    companyName:any;
    jobDescription:any;

  constructor(private appConfig: AppConfig
    , private toastrService: ToastrService
    , private masterService: MasterService
    ,private agencyjobpostService:AgencyjobpostService
    ,private spinnerService:Ng4LoadingSpinnerService
    ,private router :Router
    )
  {
      this.UserInfo = appConfig.UserInfo;
      this.appConfig.isverified();
  }

  ngOnInit() {

      var parentid=this.UserInfo.id;
      this.jobTitle=localStorage.getItem('jobTitle');
      this.companyName=localStorage.getItem('companyName');
      this.jobDescription=localStorage.getItem('jobDescription');

  }



}
