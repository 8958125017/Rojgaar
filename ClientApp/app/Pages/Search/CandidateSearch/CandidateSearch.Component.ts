
import { MasterService } from './../../../Services/master.service';
import { Component, OnInit, ViewChild, HostListener,AfterContentInit, TemplateRef, EventEmitter, Output } from '@angular/core';
import { FormGroup, FormBuilder, FormControl } from '@angular/forms';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
import { ToastContainerDirective, ToastrService } from 'ngx-toastr';
import { AppConfig } from '../../../Globals/app.config';
import { UserInfoService } from '../../../Services/userInfo.service.';
import { CandidateService } from '../../../Services/candidate.service';
import * as $ from 'jquery';
import { from } from 'rxjs/observable/from';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { CommonViewLayoutComponent } from '../../CommonModelView/CommonView-Layout.Component';

@Component({
  selector: 'app-CandidateSearchComponent',
  templateUrl: './CandidateSearch.Component.html',

})
export class CandidateSearchComponent implements OnInit {
  modalRef: BsModalRef;
  modalRefdesc: BsModalRef;
  modaldefualt: BsModalRef;
  @ViewChild(ToastContainerDirective) toastContainer: ToastContainerDirective;
  @ViewChild(CommonViewLayoutComponent) private mymodel: CommonViewLayoutComponent;

  @Output() clicked = new EventEmitter<string>();
  UserInfo: any;
  candidate_form: FormGroup;
  public loginType: any;
  keywords: any = [];
  source: any;
  optionsts: boolean = false;
  states: any = [];
  districts: any = [];
  distirctssts: boolean = false;
  candidatelist: any = [];
  PageNumber: number = 0;
  dbresponse:any=[];
  open_database:any;
  constructor(private appConfig: AppConfig
    , private toastrService: ToastrService
    , private userinfoservice: UserInfoService
    , private formBuilder: FormBuilder
    , private masterService: MasterService
    , private spinnerService: Ng4LoadingSpinnerService
    , private CandidateService: CandidateService
    , private modalService: BsModalService
    , private router: Router
  ) {

    try {
      this.UserInfo = appConfig.UserInfo
      this.loginType = this.UserInfo.loginType;
    } catch  { }
    this.appConfig.isverified();

  }

  ngOnInit() {
    this.open_database='o2';
    $(document).ready(function () {
      $('.page-filters h2 a').click(function () {
        $(this).find('i').toggleClass('fa-chevron-down fa-chevron-right');
        $(this).parent().siblings('.filter-wrapper').slideToggle();
      });
    });
    this.candidate_form = this.formBuilder.group(
      {
        option_radio: ['', ''],
        schemetype: ['', ''],
        domicile_state: ['', ''],
        domicile_district: ['', ''],
        sector: ['', ''],
        trade: ['', ''],
        candage: ['', ''],
        Gender: ['', ''],
      })
    this.GetAllStates();
    this.GetAllSectors();
  }
  private GetAllStates() {
    try {
      this.masterService.GetAllStates().subscribe(res => {
        this.dbresponse = res
        if(this.dbresponse!=null && this.dbresponse.length>0)
        {
          this.states=this.dbresponse;
        }
        else
        {
          this.states='';
          this.candidate_form.controls['domicile_state'].setValue('');
          this.candidate_form.controls['domicile_district'].setValue('');
        }
      });
    } catch  { }
  }
  trangstateid: any;
  sector: any=[];
  private GetAllSectors() {
    try {
      this.CandidateService.GetAllSector().subscribe(res => {
        this.dbresponse = res
       if(this.dbresponse.lstSector!=null)
       {
       this.sector =this.dbresponse.lstSector;
       }
       else
       {
        this.candidate_form.controls['sector'].setValue('');
        this.candidate_form.controls['trade'].setValue('');
        this.sector =[];

       }
      });
    } catch  { }
  }
  trade: any = [];
  GetAllTrades(tradeid: any) {
    try {
      if (tradeid!='') {
        this.masterService.GetAllTrades(tradeid).subscribe(res => {
          this.DbResponce = res;
          if (this.DbResponce != null) {
            this.trade = this.DbResponce;
          }
          else {
            this.trade = [];
            this.candidate_form.controls['trade'].setValue('');
          }
        });
      }
      else {
        this.trade = [];
        this.candidate_form.controls['trade'].setValue('');
      }
    } catch  { }
  }

  ///////////////////
  traingcenter: any = [];
  GetAlltraingcenter(disticid: any) {
    try {
      if (disticid) {
        this.CandidateService.GetTrainingCenter(this.trangstateid, disticid).subscribe(res => {
          this.DbResponce = res;
          if (this.DbResponce != null) {
            this.traingcenter = this.DbResponce;
          }
          else {
            this.traingcenter = [];
          }
        });
      }
      else {
        this.traingcenter = [];
      }
    } catch  { }
  }


  addtolist(event) {
    if (event.key == 'Enter') {
      event.preventDefault();
      if (event.target.value.length > 0) {
        this.keywords.push(event.target.value);
        event.target.value = '';
      }
    }
  }
  removefromlist(keyword: any) {

    const index: number = this.keywords.indexOf(keyword);
    this.keywords.splice(index, 1);
  }
  ctype: any;
  ctypelist: any = '0';
  schemetypeshow:boolean=true;
  addradiovalue(event: any, ctype: any) {
    this.optionsts = true;
    this.PageNumber = 0;
    if(ctype == 'r1' || ctype == 'm3') {
      this.candidate_form.controls['schemetype'].setValue('');
      this.PageNumber = 0;
      this.delay = false;
      this.schemetypeshow=false;
    }
    else
    {
      this.schemetypeshow=true;
    }
  }

  viewProfile: boolean = false;
  delay: boolean = false;
  @HostListener('window:scroll',['$event'])
  scrollHandler(event) {
    let pos = (document.documentElement.scrollTop || document.body.scrollTop) + document.documentElement.offsetHeight;
    let max = document.documentElement.scrollHeight;
   if (pos >=(0.8 * max)) {
      if (this.delay) {
        return
      }
      this.delay = true;
      if (this.candidatelist.length >=10 && this.viewProfile == false) {
        this.PageNumber = this.PageNumber + 1;
        this.submit(this.PageNumber, 'scroll');
      }
    }
  }
  candidatedata: any = {};
  genderdata: any = [];
  StateID: any;
  DistrictID: any;
  certification: any;
  SectorID: any;
  TradeID: any;
  gender: any = {};
  Malevalue: any;;
  Femalevalue: any;;
  Transgendervalue: any;
  DbResponce: any = {};
  Tcid: any;
  Schemetype: any;
  candage: any;
  MinCandAge: any;
  MaxCandAge: any;
  showsearchresult:any=[];
  statename:any=[];
  districtname:any=[];
  sectorname:any=[];
  tradename:any=[];
  scheamfilter:any=[];
  scheamname:any=[];

  submit(PageNumbers:number, from) {
   this.viewProfile=false;
   if(this.candidate_form.value.option_radio.trim().length == 0) {
    this.toastrService.error('Please checked database type');
    return false;
  }
   
   if (this.candidate_form.value.option_radio == 'o2' && this.candidate_form.value.schemetype.trim().length == 0) {
      this.toastrService.error('Select scheme type');
      return false;
    }
    else {
      let posage = this.candidate_form.value.candage.indexOf('-');
      if (posage > 0) {
        let splitdata = this.candidate_form.value.candage.split('-');
        this.MinCandAge = splitdata[0];
        this.MaxCandAge = splitdata[1];
      }
      else {
        this.MinCandAge = this.candidate_form.value.candage;
        this.MaxCandAge = 0;
      }
    
      this.candidatedata.StateID = this.candidate_form.value.domicile_state != '' ? this.candidate_form.value.domicile_state : 0;
      this.candidatedata.DistrictID = this.candidate_form.value.domicile_district != '' ? this.candidate_form.value.domicile_district : 0;
      this.candidatedata.SectorID = this.candidate_form.value.sector != '' ? this.candidate_form.value.sector : 0;
      this.candidatedata.TradeID = this.candidate_form.value.trade != '' ? this.candidate_form.value.trade : 0;
      this.candidatedata.gender = this.candidate_form.value.Gender;
      this.candidatedata.PageNo = PageNumbers;
      this.candidatedata.certification =0;
      this.candidatedata.Tcid =0;
      this.candidatedata.MaxCandAge = this.MaxCandAge != '' ? this.MaxCandAge : 0;
      this.candidatedata.MinCandAge = this.MinCandAge != '' ? this.MinCandAge : 0;
       ////////////////// show search result data ////////////////////////////////
       this.scheamfilter= [
        {id: 1, text: 'DDUGKY'},
        {id: 2, text: 'Other'},
       ];         
      
       let schemid
       let statedid;
       let districtid;
       let sectorid;
       let tradtid;
  schemid= this.candidate_form.value.schemetype;
  statedid     = this.candidate_form.value.domicile_state;
  districtid   = this.candidate_form.value.domicile_district;
  sectorid   = this.candidate_form.value.sector;
  tradtid   = this.candidate_form.value.trade;
  if(this.candidate_form.value.schemetype!='')
  {
   this.scheamname = (this.scheamfilter).filter(function (entry){
     return entry.id == schemid;
   });
   this.scheamname=this.scheamname[0].text;
 
  }
  else
  {
   this.scheamname='';
  }
 if(this.candidate_form.value.domicile_state!='')
 {
  this.statename = (this.states).filter(function (entry){
    return entry.id == statedid;
  });
  this.statename=this.statename[0].stateName;

 }
 else
 {
  this.statename='';
 }
  if(this.candidate_form.value.domicile_district!='' && statedid!='')
  {
     this.districtname = (this.districts).filter(function (entry) {
      return entry.id == districtid;
    });
  this.districtname=this.districtname[0].districtName;

  }
  else
 {
  this.districtname='';
 }

 if(this.candidate_form.value.sector!='')
 {
  this.sectorname = (this.sector).filter(function (entry){
    return entry.id == sectorid;
  });
  this.sectorname=this.sectorname[0].name;
 }
 else
 {
  this.sectorname=''
 }
  if(this.candidate_form.value.trade!='' && sectorid!='')
  { this.tradename = (this.trade).filter(function (entry){
    return entry.tradeCode == tradtid;
  });
  this.tradename=this.tradename[0].tradeName;
  }
  else
 {
  this.tradename='' ;
 }
  
       this.showsearchresult=[];
       this.showsearchresult=({
      "Scheme":this.scheamname!=''?this.scheamname:'NA',
      "State": this.statename!=''?this.statename:'NA',
      "District":this.districtname!=''?this.districtname:'NA',
      "Sector": this.sectorname!=''? this.sectorname:'NA',
      "Trade": this.tradename!=''?this.tradename:'NA',
      "Age":this.candidate_form.value.candage!=''?this.candidate_form.value.candage:'NA',
      "Gender":this.candidate_form.value.Gender!=''?this.candidate_form.value.Gender:'NA',

       });
      ////////////////////  method of  Registered Pool   source  //////////////////
      if (this.candidate_form.value.option_radio == 'r1') {
        if (from == 'scroll') {
          this.spinnerService.show();
          this.CandidateService.GetCandidateSearchRegisteredPool(this.candidatedata).subscribe(res => {
            this.DbResponce = res
            this.spinnerService.hide();
            if (this.DbResponce.lstSearchFriend != null) {
              this.candidatelist = this.candidatelist.concat(this.DbResponce.lstSearchFriend);
            } else {
              this.candidatelist = [];
            }
            this.delay = false;
          });
        } else {
          this.spinnerService.show();
          this.candidatelist = [];

          this.masterService.saveUserLogs('Candidate/GetCandidateSearchRegisteredPool/','Candidate Search');
          this.CandidateService.GetCandidateSearchRegisteredPool(this.candidatedata).subscribe(res => {
            this.DbResponce = res
            this.spinnerService.hide();
            if (this.DbResponce.lstSearchFriend != null) {
              this.candidatelist = this.DbResponce.lstSearchFriend;
            }
            else {
              this.candidatelist = [];
            }
            this.delay = false;
            $('.filter-wrapper').slideToggle();
          });
        }
      }
      ////////////////////  method of open source  //////////////////
      else if (this.candidate_form.value.option_radio == 'o2') {
        if (from == 'scroll') {
          this.spinnerService.show();
          if (this.candidate_form.value.schemetype == '2' || this.candidate_form.value.schemetype == 'undefined' || this.candidate_form.value.schemetype == '') {
            this.CandidateService.SearchFriendForRojgaar(this.candidatedata).subscribe(res => {
              this.DbResponce = res
              this.spinnerService.hide();
              if (this.DbResponce.lstSearchFriend != null) {
                this.candidatelist = this.candidatelist.concat(this.DbResponce.lstSearchFriend);

              } else {
                this.candidatelist = [];
              }
              this.delay = false;

            });
          }
          else {    
            this.CandidateService.GetCandidateSearchOpenDatabase(this.candidatedata).subscribe(res => {
              this.DbResponce = res
              this.spinnerService.hide();
              if (this.DbResponce.lstSearchFriend != null) {
                this.candidatelist = this.candidatelist.concat(this.DbResponce.lstSearchFriend);
              } else {
                this.candidatelist = [];
              }
              this.delay = false;
            });
            
          }

        } else {
          this.spinnerService.show();
          this.candidatelist = [];
          if (this.candidate_form.value.schemetype == '2' || this.candidate_form.value.schemetype == 'undefined' || this.candidate_form.value.schemetype == '') {
            this.CandidateService.SearchFriendForRojgaar(this.candidatedata).subscribe(res => {
              this.DbResponce = res
              this.spinnerService.hide();
              if (this.DbResponce.lstSearchFriend != null) {
                this.candidatelist = this.DbResponce.lstSearchFriend;

              }
              else {
                this.candidatelist = [];
              }
              this.delay = false;
              $('.filter-wrapper').slideToggle();
            });
          }
          else {
            this.masterService.saveUserLogs('Candidate/GetCandidateSearchOpenDatabase/','Candidate Search');
            this.CandidateService.GetCandidateSearchOpenDatabase(this.candidatedata).subscribe(res => {
              this.DbResponce = res
              this.spinnerService.hide();
              if (this.DbResponce.lstSearchFriend != null) {
                this.candidatelist = this.DbResponce.lstSearchFriend;
              }
              else {
                this.candidatelist = [];
              }
              this.delay = false;
              $('.filter-wrapper').slideToggle();
            });
          }
         // $('.filter-wrapper').slideToggle();
        }
      }
      ////////////////////  method of My Database source  //////////////////
      else if (this.candidate_form.value.option_radio == 'm3') {
        if (from == 'scroll') {
          this.spinnerService.show();
          this.CandidateService.GetCandidateSearchMyDatabase(this.candidatedata).subscribe(res => {
            this.DbResponce = res
            this.spinnerService.hide();
            if (this.DbResponce.lstSearchFriend != null) {
              this.candidatelist = this.candidatelist.concat(this.DbResponce.lstSearchFriend);
            } else {
              this.candidatelist = [];
            }
            this.delay = false;
          });
        } else {
          this.spinnerService.show();
          this.candidatelist = [];
          this.masterService.saveUserLogs('Candidate/GetCandidateSearchMyDatabase/','Candidate Search');
          this.CandidateService.GetCandidateSearchMyDatabase(this.candidatedata).subscribe(res => {
            this.DbResponce = res
            this.spinnerService.hide();
            if (this.DbResponce.lstSearchFriend != null) {
              this.candidatelist = this.DbResponce.lstSearchFriend;
            }
            else {
              this.candidatelist = [];
            }
            this.delay = false;
          });
          $('.filter-wrapper').slideToggle();

        }
      }

      else {
        return false;
      }
    }
    /////////////////////  End method for My Database source ///////////////////
  }
  reset_value(event: any, src: any) {
    if (!event.target.checked && src == 'd') {
      this.candidate_form.controls['domicile_state'].setValue('');
      this.candidate_form.controls['domicile_district'].setValue('');
    }
    // if(!event.target.checked && src=='c')
    // { 
    //   this.candidate_form.controls['Certifications'].setValue('');
    // }
    if (!event.target.checked && src == 't') {
      this.candidate_form.controls['sector'].setValue('');
      this.candidate_form.controls['trade'].setValue('');
    }
    if (!event.target.checked && src == 'tc') {
      this.candidate_form.controls['sector'].setValue('');
    }
    if (!event.target.checked && src == 'scheme') {
      this.candidate_form.controls['schemetype'].setValue('');
    }
    if (!event.target.checked && src == 'cage') {
      this.candidate_form.controls['candage'].setValue('');
    }
    if (!event.target.checked && src == 'g') {
      this.candidate_form.controls['Male'].setValue('');
      this.candidate_form.controls['Female'].setValue('');
      this.candidate_form.controls['Transgender'].setValue('');
    }
  }
  candidatedetails:any =[];
  ProfileResponce: any = [];
  postionview:any;
  scrollToX:any;
  scrollToY:any;
  candid:any;
  SetCandidateID:any;
  MrigsDataShow:boolean=false;
  CandiTempshow:any='0';
  viewcandidateProfile(candiID:any,apitype:any) {
   this.mymodel.callMethod(candiID,apitype);
  }
  exitcandidateprofileForm() {
    this.viewProfile = false;
    this.candidatedetails = [];
  this.delay = false;

  }

  mobilests: any = '0';
  phone: any;
  mobshow(phone1: any) {
    this.mobilests = '1';
    this.phone = phone1;
  }
  schemtype() {
    this.PageNumber = 0;
    this.delay = false;
  }
   ///////////////   min education details ///////////////


addressdistirct:any;
workexpdistics:any;
GetAllDistrict(stateid:any){
      if(stateid)
      {
      this.masterService.GetAllDistrict(stateid).subscribe(res=>{this.districts=res;
      });
      }
}
GetAllDistrictaddress(stateid:any){
  if(stateid)
  {
  this.masterService.GetAllDistrict(stateid).subscribe(res=>{this.addressdistirct=res;
  this.addressdistirct=this.addressdistirct;
  });
  }
}
GetAllDistrictwork(stateid:any){
  if(stateid)
  {
  this.masterService.GetAllDistrict(stateid).subscribe(res=>{this.workexpdistics=res;
  this.workexpdistics=this.workexpdistics;
  });
  }
}
cdistricaddress:any;
GetAllcDistrictaddress(stateid:any){
  if(stateid)
  {
  this.masterService.GetAllDistrict(stateid).subscribe(res=>{this.cdistricaddress=res;
  this.cdistricaddress=this.cdistricaddress;
  });
  }
}
rel :any=[];
GetAllRelationdetails()
{
  this.CandidateService.GetAllRelation().subscribe(res=>{this.rel=res;
  });
}

religions:any=[];
GetAllReligions_details()
{
  this.CandidateService.GetAllReligions().subscribe(res=>{this.religions=res;
  });
}
ResetFilterResult() {

  this.candidate_form.controls['schemetype'].setValue('');
  this.candidate_form.controls['domicile_state'].setValue('');
  this.candidate_form.controls['domicile_district'].setValue('');
  this.candidate_form.controls['sector'].setValue('');
  this.candidate_form.controls['trade'].setValue('');
  this.candidate_form.controls['candage'].setValue('');
  this.candidate_form.controls['Gender'].setValue('');
  this.candidatelist = [];
  this.districts = [];
  this.showsearchresult = [];
  this.showsearchresult.Scheme = 'NA'

 // this.FilterForm.controls['JobKeyword'].setValue('');
 // this.GetFilterJobsList(this.PageNumber, '');

}

}


