import { Response } from '@angular/http';
import { Component, OnInit, ViewChild , TemplateRef} from '@angular/core';
import { ToastContainerDirective, ToastrService } from 'ngx-toastr';
import { RouterModule } from '@angular/router';
import { AppConfig } from '../../../Globals/app.config';
import { UserInfoService } from '../../../Services/userInfo.service.';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { JobpostService } from '../../../Services/jobpost.service';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
import { forEach } from '@angular/router/src/utils/collection';
import { WalkinPostService } from '../../../Services/walkinpost.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CustomValidators } from '../../../Validators/custom-validator.directive';
import { MasterService } from '../../../Services/master.service';
import { Options } from 'ng5-slider';
import { AmazingTimePickerService, AmazingTimePickerModule } from 'amazing-time-picker';
import { BsModalRef, BsModalService } from 'ngx-bootstrap';
import { CompanyProfileService } from '../../../Services/companyprofile.service';
import { Subscription } from 'rxjs';
import { CommonMethodService } from '../../../Services/commonMethod.serive';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
@Component({
  selector: 'app-ViewWalkInComponent',
  templateUrl: './ViewWalkIn.Component.html',
})
export class ViewWalkInComponent implements OnInit {
  @ViewChild(ToastContainerDirective) toastContainer: ToastContainerDirective;
  UserInfo: any;
  DbResponcse: any = {};
  id: any = {};
  response: any = {};
  userdetails: any = {};
  checkverifymobile: boolean = false;
  walkinid: any = {};
  DBResponce: any = {};
  dbResponse:any={};
  dbResponse1:any={};
  walkindetails:any=[];
  walkinopening:any=[];
  EditFormShow: any = false;
  EditOpeningFormShow: any = false;
  EditWalkinForm: FormGroup;
  EditWalkinOpeningForm: FormGroup;
  minDate:any='';
  mintoDate:any='';
  WalingFormDisable: boolean = true;
  openingDisable: boolean = true;
  minExp: number = 0;
  maxExp: number = 0;
  minAge: number = 0;
  maxAge: number = 0;
  minCtc: number = 0;
  maxCtc: number = 0;
  ageOptions: Options = {
    floor: 0,
    ceil: 60,
    step: 1
  };
  ExpOptions: Options = {
    floor: 0,
    ceil: 20,
    step: 1
  };
  CtcOptions: Options = {
    floor: 5000,
    ceil: 250000,
    step: 100
  };

  city :any=[];
  Logintype:any;
  SectorForm: FormGroup;
  public subscription: Subscription;
  constructor(private appConfig: AppConfig
    , private toastrService: ToastrService
    , private spinnerService: Ng4LoadingSpinnerService
    , private jobpostService: JobpostService
    , private activatedroute: ActivatedRoute
    , private walkinService: WalkinPostService
    , private formBuilder: FormBuilder
    , private masterService: MasterService
    , private WalkinPostService: WalkinPostService
    , private modalService: BsModalService
    , private router: Router
    , private companyProfileService:CompanyProfileService
    , private commonMethodService:CommonMethodService
  ) {
    this.UserInfo = JSON.parse(localStorage.getItem('UserInfo'));
    this.Logintype = this.UserInfo.loginType;
    this.appConfig.isverified();
    this.subscription = this.commonMethodService.getMessage().subscribe(message =>
      {
        if(message.status){
          
          this.PageNumber=0;
          this.getWalkIndetails(this.walkinid);
        }
   });
  }
  dropdownSettings = {};

  postData :any={};
  isJobPushed:any;
  isScrap:any;
  isClosed:any;
  ngOnInit() {
    this.GetAllFunctionArea();
    this.GetAllIndustryArea();
    this.GetAllSector();
    this.dropdownSettings = {
      singleSelection: false,
      idField: 'id',
      textField: 'name',
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      itemsShowLimit: 6,
      allowSearchFilter: true
    };
    this.isJobPushed = localStorage.getItem('isJobPushed');
    this.walkinid = localStorage.getItem('walkInId');
    this.isScrap  = localStorage.getItem('isScrap');
    this.isClosed =localStorage.getItem('isClosed');
    if(this.isJobPushed=="true" && this.isScrap=="false" && this.isClosed=="true"){
       this.isJobPushed =  true
       this.isScrap  =   false
       this.isClosed = true
    }else if(this.isJobPushed=="false" && this.isScrap=="true" && this.isClosed=="false"){
      this.isJobPushed =  true
      this.isScrap  =    false
      this.isClosed =    true
    }

    this.getWalkIndetails(this.walkinid);
        this.EditWalkinForm = this.formBuilder.group({
          JobTitle: ['', [Validators.required, Validators.compose([CustomValidators.removeSpaces])]],
          CompanyName: ['', [Validators.required, Validators.compose([CustomValidators.removeSpaces])]],
          PersonName: ['', [Validators.required, Validators.compose([CustomValidators.removeSpaces])]],
          Designation: ['', [Validators.required, Validators.compose([CustomValidators.removeSpaces])]],
          JobDescription: ['', [Validators.required, Validators.compose([CustomValidators.removeSpaces])]],
          Mobile: ['', [Validators.nullValidator, Validators.compose([CustomValidators.validMobile])]],
          Email: ['', [Validators.required, Validators.compose([CustomValidators.vaildEmail])]],
          EmailPublic: ['false', [Validators.nullValidator,]],
          RolesresPonsiblty: ['', [Validators.required, Validators.compose([CustomValidators.removeSpaces])]],
          Keyword: ['', [Validators.nullValidator, Validators.compose([CustomValidators.removeSpaces])]],
          LandlineNumber: ['', [Validators.nullValidator,]],
          MinExp: ['', [Validators.nullValidator,]],
          MaxExp: ['', [Validators.nullValidator,]],
          AgeMin: ['', [Validators.nullValidator,]],
          AgeMax: ['', [Validators.nullValidator,]],
          OtherDetail: ['', [Validators.nullValidator, Validators.compose([CustomValidators.removeSpaces])]],
          ISprobationtime: ['', [Validators.required,]],
          ProbationDuration: ['',Validators.nullValidator,],
          MinEducation: ['', [Validators.required,]],
          ValidDate: ['', [Validators.required,]],
          VenuDetail: ['', [Validators.required,]],
          ShiftTime: ['FullTime', [Validators.nullValidator,]],
          ojtDuration: ['', [Validators.nullValidator,]],
          IsOjt: ['',  [Validators.nullValidator,]],
          walkinStateVenuID: ['', [Validators.required,]],
          walkinDistrictID: ['', [Validators.required,]],
          feet: ['', [Validators.nullValidator,]],
          inch: ['', [Validators.nullValidator,]],
          Transgender: ['', [Validators.nullValidator,]],
          Female: ['', [Validators.nullValidator,]],
          Male: ['', [Validators.nullValidator,]],
          weight: ['', [Validators.nullValidator,]],
          walkintodate:['',[Validators.required]],
          walkinfromtime:['',[Validators.required]],
          walkintotime:['',[Validators.required]],
          industry:['',[Validators.required]],
          functionalarea:['',[Validators.required]],
          Specialization:['', [Validators.nullValidator,]]
        });

        this.EditWalkinOpeningForm=this.formBuilder.group({
          MinCtc: ['', [Validators.nullValidator]],
          MaxCtc: ['', [Validators.nullValidator]],
          LanguageId:['',[Validators.nullValidator]],
          NoOfVacancy: ['', [Validators.nullValidator]],
          OpeningDistrictID:['',[Validators.nullValidator]],
          OpeningStateID:['',[Validators.required]],
          OpeningCityID:[''],
        });

        this.GetAllStates();
        this.GetMinEducation();
        this.GetAllLanguage();
        this.minDate=new Date();
        this.mintoDate=new Date();
        this.mintoDate.setDate(this.mintoDate.getDate() + 1);

      this.SectorForm = this.formBuilder.group({
      SectorID: ['',Validators.nullValidator,],
      TradeID: ['', [Validators.nullValidator,]],

      });
  }
  Sector:any=[];
  GetAllSector() {
    try {
      this.masterService.GetAllMrigsSector().subscribe(res => {
        this.DBResponce = res;
        if(this.DBResponce.lstSector!=null)
        {
        this.Sector = this.DBResponce.lstSector;
        }
        else
        {
        this.Sector = [];
        }
      });
    } catch  { }
  }
  Trade:any=[];
  Getalltrade(trade:any) {
    // try {
      
      if(trade != ''){
        this.SectorForm.controls['TradeID'].setValue('');
        this.masterService.GetAllMrigsTrade(trade).subscribe(res => {
          this.DBResponce = res;
          if(this.DBResponce.lstTrade!=null)
          {
          this.Trade = this.DBResponce.lstTrade;
          }
          else
          {
          this.Trade = [];
          }
        });
      }else{
        this.Trade = [];
        this.SectorForm.controls['TradeID'].setValue('');

      }
     
    // } catch  { }
  }
  
  lstFunctionalArea: any = [];
  lstIndustryArea: any = [];
  respIndustryArea: any = {};
  respFunctionalArea: any = {};
  private GetAllIndustryArea() {
    try {
      this.masterService.GetAllIndustryArea().subscribe(res => {
        this.lstIndustryArea = res

        if (this.respIndustryArea != null && this.respIndustryArea.length > 0) {
          this.lstIndustryArea = this.lstIndustryArea;
        }
      });
    } catch  { }
  }
  private GetAllFunctionArea() {
    try {
      this.masterService.GetAllFunctionArea().subscribe(res => {
        this.lstFunctionalArea = res

        if (this.respFunctionalArea != null && this.respFunctionalArea.length > 0) {
          this.lstFunctionalArea = this.lstFunctionalArea;
        }
      });
    } catch  { }
  }


  walinid:any=[];
  PageNumber: number = 0;

  sectorTrade:any=[];
  sectorstatus:boolean=true;
  openingstatus:boolean=true;


  getWalkIndetails(walinid:any) {
     this.spinnerService.show();
      this.postData = {
      'FunctionalAreaId':0,
      'IndustryId':0,
      'Maxctc':0,
      'Minctc':0,
      'MaxExp':0,
      'MinExp':0,
      "WalkInId":walinid,
      'PageNumber':0
    };
        this.walkinService.GetAllWalkin(this.postData).subscribe(res => {
                  this.dbResponse1=res;
                  this.spinnerService.hide();
                  if(this.dbResponse1.lstCandidateWalkInt[0]!=null)  {
                    this.walkindetails=this.dbResponse1.lstCandidateWalkInt[0];
                    var sectorTrade=this.walkindetails.sectorTradeList;
                    if(sectorTrade.length){
                      this.sectorstatus=true;
                      this.sectorTrade=this.walkindetails.sectorTradeList;
                    }
                    else{
                      this.sectorstatus=false;
                    }
                    // console.log(this.walkindetails.sectorTradeList)
                    for(let i=0;i<this.walkindetails.sectorTradeList.length;i++){

                       let obj = {
                                  "id":this.walkindetails.sectorTradeList[i].id,
                                  "sectorName":this.walkindetails.sectorTradeList[i].sectorName,
                                  "tradeName":this.walkindetails.sectorTradeList[i].tradeName,
                                  "sectorId": this.walkindetails.sectorTradeList[i].sectorId,
                                  "tradeId": this.walkindetails.sectorTradeList[i].tradeId,
                                  "isActive":this.walkindetails.sectorTradeList[i]. isActive
                      }
                      this.NewSectorShow.push(obj);
                    }
                  }

                  if(this.closeWalkins || this.scrapWalkins){
                      this.isJobPushed =  true
                      this.isScrap  =   false
                      this.isClosed = true
                  }
        });

        this.walkinService.getWalkinDetails(this.walkinid).subscribe(res=>{
              this.dbResponse=res;

              if(this.dbResponse.lstWalkInOpening!=null){
                this.walkinopening=this.dbResponse.lstWalkInOpening;
                this.openingstatus=this.walkinopening.length>0?true:false;

              }
        });
  }


DeletOpeningJob(item) {
    try {
      this.walkinService.DeletWalkin(item.jobdetailsid).subscribe(res => {
        this.DBResponce = res
        if (this.DBResponce.responseResult) {
          this.toastrService.success(this.DBResponce.message);
          this.getWalkIndetails(this.walkinid);
          this.modalRef.hide();

        } else {
          this.toastrService.error(this.DBResponce.message);
        }

      });
    } catch  { }
}

ojt: boolean = false;
probation: boolean = false;

GetEditWalkin(obj: any) {

  this.NewSectorShow=[];
  this.EditFormShow = true;
    this.EditWalkinForm.controls['JobTitle'].setValue(obj.jobTitle);
    this.EditWalkinForm.controls['CompanyName'].setValue(obj.companyName);
    this.EditWalkinForm.controls['PersonName'].setValue(obj.name);
    this.EditWalkinForm.controls['Designation'].setValue(obj.designation);
    this.EditWalkinForm.controls['JobDescription'].setValue(obj.jobDescription);
    this.EditWalkinForm.controls['Mobile'].setValue(obj.mobile);
    this.EditWalkinForm.controls['Email'].setValue(obj.email);
    this.EditWalkinForm.controls['EmailPublic'].setValue(obj.emailPublic);
    this.EditWalkinForm.controls['RolesresPonsiblty'].setValue(obj.rolesresPonsiblty);
    this.EditWalkinForm.controls['Keyword'].setValue(obj.keyword);
    this.EditWalkinForm.controls['LandlineNumber'].setValue(obj.landlineNumber);
    this.EditWalkinForm.controls['MinExp'].setValue(obj.minExp);
    this.minExp = obj.minExp;
    this.EditWalkinForm.controls['MaxExp'].setValue(obj.maxExp);
    this.maxExp = obj.maxExp;
    this.EditWalkinForm.controls['AgeMin'].setValue(obj.ageMin);
    this.minAge = obj.ageMin;
    this.EditWalkinForm.controls['AgeMax'].setValue(obj.ageMax);
    this.maxAge = obj.ageMax;
    this.EditWalkinForm.controls['OtherDetail'].setValue(obj.otherDetail);
    this.EditWalkinForm.controls['VenuDetail'].setValue(obj.venueDetail);
    this.probation = obj.iSprobationtime ? true : false;
    this.EditWalkinForm.controls['ISprobationtime'].setValue(obj.iSprobationtime ? 'true' : 'false');
    this.EditWalkinForm.controls['walkinStateVenuID'].setValue(obj.walkinStatedId);
    this.GetAllDistrictvenu(obj.walkinStatedId);
    this.EditWalkinForm.controls['walkinDistrictID'].setValue(obj.walkinDistrictId);
    this.EditWalkinForm.controls['Male'].setValue(obj.male);
    this.EditWalkinForm.controls['Female'].setValue(obj.female);
    this.EditWalkinForm.controls['Transgender'].setValue(obj.transgender);
    this.EditWalkinForm.controls['ProbationDuration'].setValue(obj.probationDuration);
    this.EditWalkinForm.controls['MinEducation'].setValue(obj.minEducation);
    //this.EditWalkinForm.controls['ValidDate'].setValue(obj.walkInDate);
    this.EditWalkinForm.controls['ojtDuration'].setValue(obj.ojtDuration);
    this.ojt = obj.isOjt ? true : false;
    this.EditWalkinForm.controls['IsOjt'].setValue(obj.isOjt ? 'true' : 'false');
    this.EditWalkinForm.controls['weight'].setValue(obj.weight);
    this.EditWalkinForm.controls['feet'].setValue(obj.heightFeet);
    this.EditWalkinForm.controls['inch'].setValue(obj.heightInch);
    this.EditWalkinForm.controls['ShiftTime'].setValue(obj.shiftTime);
    this.EditWalkinForm.controls['ValidDate'].setValue(new Date(obj.walkInDate));
    this.EditWalkinForm.controls['walkintodate'].setValue(new Date(obj.walkinToDate));
    this.EditWalkinForm.controls['walkinfromtime'].setValue(obj.walkinFromTime);
    this.EditWalkinForm.controls['walkintotime'].setValue(obj.walkinToTime);
    this.EditWalkinForm.controls["industry"].setValue(obj.industryId);
    this.EditWalkinForm.controls["functionalarea"].setValue(obj.functionalAreaId);
    this.EditWalkinForm.controls["Specialization"].setValue(obj.specialization);
    for(let i=0;i<obj.sectorTradeList.length;i++){
      let obj1 = {
                 "id":obj.sectorTradeList[i].id,
                 "sectorName":obj.sectorTradeList[i].sectorName,
                 "tradeName":obj.sectorTradeList[i].tradeName,
                 "sectorId": obj.sectorTradeList[i].sectorId,
                 "tradeId": obj.sectorTradeList[i].tradeId,
                 "isActive":obj.sectorTradeList[i]. isActive
     }
     this.NewSectorShow.push(obj1);
   }
    this.ProbationDuration= obj.probationDuration;
    this.ojtDuration=obj.ojtDuration;
}

ExitWalkinDetails() {
  this.EditFormShow = false;

}


lstState: any = [];
StatesSelected: string;
stateRes:any;
GetAllStates() {
  this.masterService.GetAllStates().subscribe(res => {
    this.stateRes = res;
    if(this.stateRes!=null && this.stateRes.length>0){
      this.lstState = this.stateRes;
    }
  });
}

mineducations:any={};
minEduRes:any;
private GetMinEducation() {
  try {
    this.masterService.GetAllMinEducation().subscribe(res => {
      this.minEduRes=res;
      if(this.minEduRes!=null && this.minEduRes.length>0){
        this.mineducations = this.minEduRes
      }
    });
  } catch  { }
}

jobFromvalid = true;
ExpMsg = true;

ValidateExperience(expfrom , expto  ) {
      if (parseInt(expfrom) > parseInt(expto)) {
        this.jobFromvalid = false ;
        this.ExpMsg = false;
      }else
      {
        this.jobFromvalid =true;
        this.ExpMsg = true;
      }
  }
  AgeMsg = true;
  ValidateAge(Max , Min  ) {
    if (parseInt(Max) > parseInt(Min)) {
      this.AgeMsg = false;
      this.jobFromvalid = false ;
    }else
    {
      this.jobFromvalid =true;
      this.AgeMsg = true;
    }

  }

  checkCtc() {
    var max = this.maxCtc;
    var min = this.minCtc;
    if (max > 0) {
      if (min == 0) {
        this.toastrService.error('Please Select Minimum CTC 5000');
      }
    }
  }


  ojtvalidsts=true;
  validateOjt(ojt){

    if(ojt!=''){

      if (ojt.length>2){
         this.ojtvalidsts=false;
      }else{
        this.ojtvalidsts=true;
      }
    }
  }


  ojtcondition: any;
  ojtDuration:any;
  SetOjt(ojtcon: any) {

    if (ojtcon == 1) {
      this.ojt = true;
    } else {
      this.ojt = null;
      this.ojtDuration=''
      this.EditWalkinForm.value.ojtDuration="";
      this.ojtvalidsts=true;
    }
    this.ojtcondition = ojtcon;
  }


  probationcondition: any;
  ProbationDuration:any;
  SetProbation(probcon: any) {

    if (probcon == 1) {
      this.probation = true;
    } else {
      this.probation = null;
      this.ProbationDuration='';
      this.EditWalkinForm.value.ProbationDuration="";
    }
    this.probationcondition = probcon;
  }

  onChangeStateVenu(statename: any) {
    // EditWalkinForm
    this.EditWalkinForm.controls['walkinDistrictID'].setValue('');
    

    this.EditWalkinOpeningForm.controls['OpeningDistrictID'].setValue('');
    this.EditWalkinOpeningForm.controls['OpeningCityID'].setValue('');
    this.GetAllDistrictvenu(statename);
    this.GetAllCity(statename);
  }
  GetAllCity(id:any){
    if(id != ''){
      this.masterService.GetAllCity(id).subscribe(res => {
        this.city = res
        if (this.city != null && this.city.length > 0) {
         this.city = this.city;
         }
     });
    }else{
      this.city  = []
    }
 
  }

  district: any = [];
  statevenu: any = [];

  GetAllDistrictvenu(id: any) {
    if (id != '') {
      try {
        this.EditWalkinOpeningForm.controls['OpeningDistrictID'].setValue('');
        this.masterService.GetAllDistrictvenu(id).subscribe(res => {
          this.statevenu = res
          if (this.statevenu != null && this.statevenu.length > 0) {
            this.statevenu = this.statevenu;
          }
  
        });
      } catch  { }
    }else {
      this.statevenu = [];
    }
   
  }

  ExitJobDetails() {
    this.EditFormShow = false;
    this.NewSectorShow=[];
    this.NewSectorData=[];
    this.NewSecterTempData = [];

  }
  Response:any={};
  walkindetail:any={};
  dbresponse:any={};
  gendersts:boolean=false;
  updatewalkin(formvalue){

    if(this.EditWalkinForm.value.ValidDate==''){
      this.toastrService.error('Please select walkin from date');
      window.scroll(0,0);
      return false;
    }

    if(this.EditWalkinForm.value.walkintodate==''){
      this.toastrService.error('Please select walkin to date');
      window.scroll(0,0);
      return false;
    }

    if(this.EditWalkinForm.value.ValidDate>this.EditWalkinForm.value.walkintodate){
      //this.toastrService.error('Please Select Valid Walkin From And To Date');
      this.toastrService.error('Walkin From date must be less than walkin To date');
      window.scroll(0,0);
      return false;
    }

    if(this.minAge > 0 || this.maxAge > 0){
        if(this.minAge < 15){
          this.toastrService.error('Min age must be greater then 15');
          window.scroll(0,0);
          return false;
        } 
}


  var CurrentDate = new Date();

  if(this.EditWalkinForm.value.walkintodate <= CurrentDate){
    this.toastrService.error('Walkin to date is must be greater than the current date');
    window.scroll(0,0);
    return false;
  }



    if(this.EditWalkinForm.value.walkinfromtime==''){
      this.toastrService.error('Please Select Walkin From Time');
      window.scroll(0,0);
      return false;
    }

    if(this.EditWalkinForm.value.walkintotime==''){
      this.toastrService.error('Please Select Walkin To Time');
      window.scroll(0,0);
      return false;
    }

    let walkinfromtime = this.EditWalkinForm.value.walkinfromtime;
    let walkintotime = this.EditWalkinForm.value.walkintotime;

    if (walkintotime < walkinfromtime) {
      this.toastrService.error('Invalid Walkin To Time');
      window.scroll(0,0);
      return false;
    }

    if(walkinfromtime <'06'){
      this.toastrService.error('Invalid Walkin From  Time');
      window.scroll(0,0);
      return false;
    }

    if(this.probation){
      if(this.EditWalkinForm.value.ProbationDuration==''){
        this.toastrService.error('Please add Probation Duration');
         window.scroll(0,0);
        return false;
      }else if(this.EditWalkinForm.value.ProbationDuration<1){
        this.toastrService.error('Probation Duration should be greater then 0');
        window.scroll(0,0);
       return false;
      }
    }

    if(this.ojt){
      if(this.EditWalkinForm.value.ojtDuration==''){
        this.toastrService.error('Please add OJT Duration');
        window.scroll(0,0);
        return false;
      }else if(this.EditWalkinForm.value.ojtDuration<1){
        this.toastrService.error('OJT Duration should be greater then 0');
        window.scroll(0,0);
       return false;
      }
    }

    if(walkintotime >'22:00'){
      this.toastrService.error('Invalid Walkin To  Time');
      window.scroll(0,0);
      return false;
    }


    if(this.EditWalkinForm.value.Male=='1'||this.EditWalkinForm.value.Female=='2'||this.EditWalkinForm.value.Transgender=='3')
    {
      this.gendersts=true;
    }else{
      this.gendersts=false;
    }
    if(this.gendersts==true){
      this.walkindetail.PostedBy = this.UserInfo.loginType;
      this.walkindetail.JobTitle = this.EditWalkinForm.value.JobTitle;
      this.walkindetail.CompanyName = this.EditWalkinForm.value.CompanyName;
      this.walkindetail.CompanyName = this.EditWalkinForm.value.CompanyName;
      this.walkindetail.AgeMax = this.maxAge;
      this.walkindetail.AgeMin = this.minAge;
      this.walkindetail.Designation = this.EditWalkinForm.value.Designation;
      this.walkindetail.Email = this.EditWalkinForm.value.Email;
      this.walkindetail.EmailPublic = this.EditWalkinForm.value.EmailPublic;
      this.walkindetail.Female = this.EditWalkinForm.value.Female ? 2 : 0
      this.walkindetail.ISprobationtime = this.EditWalkinForm.value.ISprobationtime;
      if(this.EditWalkinForm.value.IsOjt=="true"){
        this.walkindetail.IsOjt=true;
      }else{
        this.walkindetail.IsOjt=false;
      }
      this.walkindetail.JobDescription = this.EditWalkinForm.value.JobDescription;
      this.walkindetail.Keyword = this.EditWalkinForm.value.Keyword;
      this.walkindetail.LandlineNumber = this.EditWalkinForm.value.LandlineNumber;
      this.walkindetail.Male = this.EditWalkinForm.value.Male ? 1 : 0;
      this.walkindetail.MinExp = this.minExp;
      this.walkindetail.MaxExp = this.maxExp;
      this.walkindetail.MinEducation = this.EditWalkinForm.value.MinEducation;
      this.walkindetail.Mobile = this.EditWalkinForm.value.Mobile;
      this.walkindetail.Name = this.EditWalkinForm.value.PersonName;
      this.walkindetail.OtherDetail = this.EditWalkinForm.value.OtherDetail;
      this.walkindetail.ProbationDuration = this.EditWalkinForm.value.ProbationDuration ? this.EditWalkinForm.value.ProbationDuration : 0;
      this.walkindetail.RolesresPonsiblty = this.EditWalkinForm.value.RolesresPonsiblty;
      this.walkindetail.ShiftTime = this.EditWalkinForm.value.ShiftTime;
      this.walkindetail.Transgender = this.EditWalkinForm.value.Transgender ? 3 : 0;
      this.walkindetail.VenueDetail = this.EditWalkinForm.value.VenuDetail;
      this.walkindetail.WalkinStatedId=this.EditWalkinForm.value.walkinStateVenuID;
      this.walkindetail.WalkinDistrictId=this.EditWalkinForm.value.walkinDistrictID;
      this.walkindetail.jobId=localStorage.getItem('walkInId')
      this.walkindetail.ojtDuration = this.EditWalkinForm.value.ojtDuration!=''?this.EditWalkinForm.value.ojtDuration:0;
      this.walkindetail.HeightFeet=this.EditWalkinForm.value.feet?this.EditWalkinForm.value.feet:0;
      this.walkindetail.HeightInch=this.EditWalkinForm.value.inch?this.EditWalkinForm.value.inch:0;
      this.walkindetail.Weight=this.EditWalkinForm.value.weight?this.EditWalkinForm.value.weight:0;
      this.walkindetail.WalkInDate=this.EditWalkinForm.value.ValidDate;
      this.walkindetail.WalkinToDate=this.EditWalkinForm.value.walkintodate;
      this.walkindetail.WalkinFromTime=this.EditWalkinForm.value.walkinfromtime;
      this.walkindetail.WalkinToTime=this.EditWalkinForm.value.walkintotime;
      this.walkindetail.IndustryArea=this.EditWalkinForm.value.industry;
      this.walkindetail.FunctionalArea=this.EditWalkinForm.value.functionalarea;
      this.walkindetail.Specialization=this.EditWalkinForm.value.Specialization;
      this.walkindetail.sectorTradeList=this.NewSectorData;
      
      this.spinnerService.show();
      this.WalkinPostService.AddWalkinId(this.walkindetail).subscribe(res => {
      this.Response=res;
      if (this.Response.responseResult==true) {
        this.spinnerService.hide();
          this.toastrService.success(this.Response.message);
          this.EditWalkinForm.reset();
          this.EditFormShow = false;
          this.NewSectorShow=[];
          this.NewSectorData=[];
          this.NewSecterTempData = [];
          this.NewSectorShow=[];
          this.getWalkIndetails(this.walkinid);
      }

      });
    }else{
      this.toastrService.error('Select gender');
    }
  }

langRes:any;
   GetAllLanguage() {
    try {
      this.masterService.GetAllLanguage().subscribe(res => {
        this.langRes=res;
        if(this.langRes!=null&&this.langRes.length>0)
          this.lstAllLanguage = this.langRes;
      });
    } catch  { }
  }

  editopeningid:any='';
  converttime(time24){
    var ts = time24;
    if(ts!=null && ts.length==5){
    var H = +ts.substr(0, 2);
    var h = (H % 12) || 12;
    h = (h < 10)?(0+h):h;
    var ampm = H < 12 ? " AM" : " PM";
    ts = h + ts.substr(2, 3) + ampm;
    return ts;
    }else{
      return "NA";
    }
  }
  GetEditOpening(item) {
    this.EditOpeningFormShow = true;
    this.editopeningid = localStorage.getItem('openingid');
    localStorage.setItem('openingid', item.jobdetailsid);
    this.EditWalkinOpeningForm.controls['OpeningStateID'].setValue(item.stateID == null ? '' : item.stateID);
    this.GetAllDistrictvenu(item.stateID);
    if(item.districtID){
      this.EditWalkinOpeningForm.controls['OpeningDistrictID'].setValue(item.districtID);
    }
    this.GetAllCity(item.stateID);
    if(item.cityId){
      this.EditWalkinOpeningForm.controls['OpeningCityID'].setValue(item.cityId);
    }
    this.EditWalkinOpeningForm.controls['MinCtc'].setValue(item.minCtc);
    this.minCtc = item.minCtc;
    this.EditWalkinOpeningForm.controls['MaxCtc'].setValue(item.maxCtc);
    this.maxCtc=item.maxCtc;
    this.EditWalkinOpeningForm.controls['LanguageId'].setValue(item.languageId);
    this.EditWalkinOpeningForm.controls['NoOfVacancy'].setValue(item.noOfVacancy);
  }

  lstAllLanguage: any = [];
  LangFormArray: any = [];
  onItemSelect(item: any) {
    this.LangFormArray.push(item.name);
  }


  onItemDeSelect(item: any) {
    this.LangFormArray.splice(item.name, 1)
  }

  onSelectAll(items: any) {
    for (var i = 0; i < items.length; i++) {
      this.LangFormArray.push(items[i].name);
    }

  }

  onDeSelectAll(){
    this.LangFormArray=[];
  }

  ExitOpeningDetails() {
    this.EditOpeningFormShow = false;
    this.EditWalkinOpeningForm.reset();
    this.EditWalkinOpeningForm.controls.OpeningStateID.setValue('');
    this.EditWalkinOpeningForm.controls.OpeningDistrictID.setValue('');
  }

  openingdetail:any={};
  response1:any={};

  updateopening(formvalue1) {
    if (this.maxCtc == 0 && this.minCtc == 0) {
      this.toastrService.error('Please Enter Min CTC and Max CTC');
      return false;
    }
    if(this.maxCtc>0){
      if(this.minCtc==0){
        this.toastrService.error('Please Select Minimum CTC 5000');
        return false;
        }
      }
    if (parseInt(this.EditWalkinOpeningForm.value.NoOfVacancy) > 0) {
      this.openingDisable = false;
      this.openingdetail.StateID = this.EditWalkinOpeningForm.value.OpeningStateID;
      this.openingdetail.DistrictID = this.EditWalkinOpeningForm.value.OpeningDistrictID?this.EditWalkinOpeningForm.value.OpeningDistrictID:0;
      this.openingdetail.CityID = this.EditWalkinOpeningForm.value.OpeningCityID?this.EditWalkinOpeningForm.value.OpeningCityID:0;
      this.openingdetail.NoOfVacancy = this.EditWalkinOpeningForm.value.NoOfVacancy;
      this.openingdetail.MaxCtc = this.maxCtc;
      this.openingdetail.MinCtc = this.minCtc;
      this.openingdetail.jobdetailsid = localStorage.getItem('openingid') ? localStorage.getItem('openingid') : 0;
      this.openingdetail.LanguageId = this.EditWalkinOpeningForm.value.LanguageId?this.EditWalkinOpeningForm.value.LanguageId:'';
      this.openingdetail.NetSalary = '';

      this.WalkinPostService.updateWalkinListing(this.openingdetail, this.walkinid).subscribe(res => {
        if (res) {
          this.response1 = res;
          this.WalingFormDisable = true;
          if (this.response1.responseResult = 'true') {
            
            this.toastrService.success(this.response1.message);
            this.EditWalkinOpeningForm.reset();
            this.EditOpeningFormShow = false;
            this.getWalkIndetails(this.walkinid);
          }
          this.openingDisable = true;
        }
        else{
          this.toastrService.success('something went wrong');
        }
      });
    } else {
      this.toastrService.error("Please Enter Valid No Of Vacancy ");
      this.openingDisable = true;
    }

}
Showform(){
  this.EditWalkinOpeningForm.controls.OpeningStateID.setValue('');
  this.EditWalkinOpeningForm.controls.OpeningDistrictID.setValue('');
  this.minCtc=0;
  this.maxCtc=0;
  this.EditWalkinOpeningForm.controls.MinCtc.setValue('');
  this.EditWalkinOpeningForm.controls.MaxCtc.setValue('');
  this.EditOpeningFormShow = true;
  localStorage.removeItem('openingid');
  this.editopeningid = localStorage.getItem('openingid');
  if(this.editopeningid==null){
    this.editopeningid='';
  }

}

ctcerrmsg:boolean=true;
ValidateCtc(ctcmin, ctcmax ) {
  if (parseInt(ctcmin) >= parseInt(ctcmax) || parseInt(ctcmin)==0 || parseInt(ctcmax)==0) {
    this.ctcerrmsg=false;
  }else{
    this.ctcerrmsg=true;
  }

}

clear(){
   this.EditWalkinForm.controls['ProbationDuration'].setValue('0');
}

clear1(){
  this.EditWalkinForm.controls['ojtDuration'].setValue('0');
}



modalRef: BsModalRef;
PushedTemplate(template: TemplateRef<any>) {
  this.modalRef = this.modalService.show(template, { class: 'modal-sm' });
}

declineBox(): void {
  this.modalRef.hide();
}

goBack(){
  this.router.navigate(['/WalkinList',{Redirection:btoa('1'),wlakinListStatus:btoa('true')}]);
}

companresponsedb:any=[];
companyprofile:any='';
comapnyimage:any='';
DBResponce1: any = {};
repost:any;

scrapTemplate(template: TemplateRef<any>) {
  this.modalRef = this.modalService.show(template, { class: 'modal-sm' });
}

scrapWalkinTemplate(template: TemplateRef<any>) {
  this.modalRef = this.modalService.show(template, { class: 'modal-sm' });
}

repostWalkin(template: TemplateRef<any>) {
  this.modalRef = this.modalService.show(template, { class: 'modal-sm' });
}

closeTemplate(template: TemplateRef<any>) {
  this.modalRef = this.modalService.show(template, { class: 'modal-sm' });
}


closeWalkins:any;
scrapWalkins:any;

decimals(e){
  if (e.keyCode === 190 || e.keyCode == 110 ) {
      return false;
  }
  if (e.keyCode === 189 ) {
      return false;
  }
}


// walkin post ,scrap and close

performJobAction(walkinid:any,item:any) {
  this.walkinid=walkinid;
  this.spinnerService.show();
  if(item=='postwalkin' || item=="repostwalkin"){
    if(this.walkinopening.length!=0){
      this.commonMethodService.post(this.walkinid,'walkin');   // for post walkin.
    }else{
      this.toastrService.error("Please add opening.");
      this.spinnerService.hide();
    }
  }else if(item=='scrapwalkin'){
    this.scrapWalkins=item;
    this.modalRef.hide();
    this.commonMethodService.scrap(this.walkinid,'walkin') ;   // for scrap walkin
  }else if(item=='closewalkin'){
    this.closeWalkins=item;
    this.modalRef.hide();
    this.commonMethodService.close(this.walkinid,'walkin') ; // for close walkin
  }
  if(item=="repostwalkin"){
    this.modalRef.hide();
  }
  if(item=="postwalkin"){
    this.modalRef.hide();
  }
}


//job post to YS
openingResponse:any;
postToYs(walkinId:any){
  this.jobpostService.postToYs(walkinId).subscribe(res=>{
      this.openingResponse=res;
    })
   }
////////////////  sector section //////////
NewSectorShow:any=[];
NewSectorData:any=[];
NewSecterTempData:any=[];

AddSectorValue()
{
       if(this.SectorForm.value.SectorID=='')
       {
         this.toastrService.error('Please Select Training Sector');
        return false;
       }
       if(this.SectorForm.value.TradeID=='')
       {
        this.toastrService.error('Please Select Training Trade');
        return false;
       }

        let sectorid;
        let tradeid;
        sectorid=this.SectorForm.value.SectorID;
        tradeid = this.SectorForm.value.TradeID;

        let sectorname = (this.Sector).filter(function (entry) {
          return entry.id == sectorid;
        });

        let tradename = (this.Trade).filter(function (entry) {
          return entry.id == tradeid;
        });

        var hasMatch =false;

        for (var index = 0; index < this.NewSectorShow.length; ++index) {

         var sector = this.NewSectorShow[index];

          if((sector.sectorName == sectorname[0].name) && (sector.tradeName == tradename[0].name)){
            hasMatch = true;
            break;
          }
        }

if(!hasMatch)
{
      this.NewSectorShow.push({
        "sectorName": sectorname!=''?sectorname[0].name:'N/A',
        "tradeName":tradename!=''?tradename[0].name:'N/A',
      });

      this.NewSectorData.push({
            "sectorId": this.SectorForm.value.SectorID,
            "sectorName":sectorname[0].name,
            "tradeId": this.SectorForm.value.TradeID,
            "tradeName":tradename[0].name,
            "isActive":1
      }
    );
}else{

    this.toastrService.error('Training Sector and Trade are already exist');
    return false;
}

this.NewSecterTempData = [];
this.SectorForm.controls['SectorID'].setValue("");
this.SectorForm.controls['TradeID'].setValue("");

}
modalRefSector: BsModalRef;
modalRefDelSector: BsModalRef;


deleteSector(index:number){
  if(this.NewSectorShow[index].id>0){
    this.DeletSector(this.walkinid,this.NewSectorShow[index].id,this.NewSectorShow[index].sectorId,this.NewSectorShow[index].tradeId);
  }

  this.NewSectorShow.splice(index,1);
    this.modalRefSector.hide();
}


declineBoxSecor(): void {
  this.modalRefSector.hide();
}
PusTemplateSector(templateSector: TemplateRef<any>) {
  this.modalRefSector = this.modalService.show(templateSector, { class: 'modal-sm' });
}
PusTemplatedelSector(tempdelsector: TemplateRef<any>) {
  this.modalRefDelSector = this.modalService.show(tempdelsector, { class: 'modal-sm' });
}
BoxDelsectordecline(): void {
  this.modalRefDelSector.hide();
}
DeletSector(JobId:any,TblID:any,secID:any,TradID)
{
  this.walkinService.DeleteSectorWalking(JobId,TblID,secID,TradID).subscribe(res=>
    {
      this.dbResponse=res;
      if(this.dbResponse!=null)
      {
       this.toastrService.success(this.dbResponse.message);
       this.modalRefDelSector.hide();
       this.getWalkIndetails(this.walkinid);
      }
      else
      {
        this.toastrService.error(this.dbResponse.message);
      }
    }


  );
}
////////////////  End Sector Section //////////////
fromdate:any='';
todate:any='';
walkindateresponse='';

updateWalkinDate(walkinid){

  var CurrentDate = new Date();
  if(this.fromdate==''){

      this.toastrService.error('Please select from date');
      return false;
  }

  if(this.todate==''){

    this.toastrService.error('Please select to date');
    return false;
  }

  if(this.fromdate>=this.todate){

      this.toastrService.error('Invalid Walkin From Date');
      return false;
  }if(this.todate <= CurrentDate){
    this.toastrService.error('Walkin to date is must be greater than the current date');
    return false;
  }else{

    let walkindatedata={
        'WalkInDate':this.fromdate,
        'WalkinToDate':this.todate,
        'WalkInId':walkinid
    }

    this.walkinService.updateWalkinDate(walkindatedata).subscribe(res => {
      if (res) {

        if (res.responseResult == true) {
          this.toastrService.success(res.message);
          this.getWalkIndetails(walkinid);
        }
      }

    });
    this.modalRef.hide();
    this.fromdate='';
    this.todate='';

  }


}

onlyNumber(evt) {

  evt = (evt) ? evt : window.event;
  var charCode = (evt.which) ? evt.which : evt.keyCode;
  if (charCode > 31 && (charCode < 48 || charCode > 57)) {
    return false;
  }
  return true;
}

Validationforlandline(event: any) {
  var phoneno = event;
  if (phoneno) {
    var myregex = /^\(?([0-9]{1})\)?[-. ]?([1-9]{1})[-. ]?([0-9]{4})[-. ]?([0-9]{4,6})$/;
    if (!myregex.test(phoneno)) {
      //event.preventDefault();
      this.toastrService.error("Landline Number Is Not Valid");
      this.EditWalkinForm.controls.LandlineNumber.setValue('');
      return false;
    }
  }

}



 }









