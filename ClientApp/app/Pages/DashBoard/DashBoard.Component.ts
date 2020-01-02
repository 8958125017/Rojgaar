import { Component, OnInit, TemplateRef, ViewChild, HostListener } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
import { BsModalRef, BsModalService } from 'ngx-bootstrap';
import { ToastContainerDirective, ToastrService } from 'ngx-toastr';
import { AppConfig } from '../../Globals/app.config';
import { UserInfoService } from '../../Services/userInfo.service.';
import { Pipe, PipeTransform } from '@angular/core';
import { MasterService } from '../../Services/master.service';
import { Subject } from 'rxjs/Subject';

declare var jquery: any;
declare var $: any;


@Component({
  selector: 'app-DashBoardComponent',
  templateUrl: './DashBoard.Component.html',
})
export class DashBoardComponent implements OnInit {


  likeByMe: boolean = false;
  UserInfo: any;
  dbResponse:any=[];
  totalNumber:any;
  PlacedResponse:any=[];
  showplacedtablestatus:boolean=false;
  detailstable:boolean=false;
  dtOptions: DataTables.Settings = {};
  dtTrigger =null;

  constructor(private appConfig: AppConfig
    , public router: Router
    , private toastrService: ToastrService
    , private userinfoservice: UserInfoService
    , private masterService: MasterService
    , private formBuilder: FormBuilder
    , private modalService: BsModalService
    , private spinnerService: Ng4LoadingSpinnerService
  ) {
     this.UserInfo = appConfig.UserInfo;
     this.appConfig.isverified();
  }

  placedjsondata:any={};

  ngOnInit() {

    this.appConfig.isverified();
   // this.spinnerService.show();
    this.masterService.GetEmpDashboardValue().subscribe(res => {
      this.dbResponse  = res;
      this.totalNumber = this.dbResponse[0];
      // console.log(JSON.stringify(this.dbResponse));
   });


  }

  showplacedtable(){

    this.placedjsondata =
    {
        'jobid':0,
        'interviewid':0,
        'candid':0,
        'offerletterid':0,
        'joiningstatus':1,
        'jobopeningid':0
    }

    //this.exportAsXLSX();

    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 10,
      responsive: true,
      jQueryUI: true,
      destroy: true,
      retrieve: false,
      processing: true,
      deferRender: true,
      stateSave: false,
     // dom:'"<"H"lfr>t<"F"ip>',
      autoWidth:true,
      displayStart:0,
    };
    this.dtTrigger=new Subject<any>();

    this.masterService.GetPlaceddata(this.placedjsondata).subscribe(res => {
      //console.log(res)
      this.PlacedResponse  = res;
      this.PlacedResponse = this.PlacedResponse.lstdashboardregdemptot;
      console.log(this.PlacedResponse)
      this.dtTrigger.next();

   });
      this.showplacedtablestatus = true;
      this.detailstable = false;
  }
jobResponse:any=[];
  getdetails(id)  {

    this.masterService.GetPlaceddataList(id).subscribe(res => {
      this.jobResponse  = res;
      this.jobResponse = this.jobResponse.lstdashboardregdemptot;
      console.log(this.jobResponse)
   });
      this.detailstable = true;
      this.showplacedtablestatus = false;
  }

  exportAsXLSX():void {

    this.masterService.exportAsExcelFile(this.PlacedResponse, 'Placed Candidate');
  }

  exportAsXLSX1():void {
    this.masterService.exportAsExcelFile(this.jobResponse, 'Candidate Details');
  }

  JobPost(postdata:any){    
    this.router.navigate(['/PlacedCandidate',{postdata}]);
  }

}
