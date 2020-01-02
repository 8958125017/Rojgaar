import { Component, OnInit, ViewChild ,TemplateRef,AfterViewInit, Input, NgZone} from '@angular/core';
import { Router} from '@angular/router';
import { FormBuilder, Validators, FormGroup} from '@angular/forms';
import { MasterService } from '../../../Services/master.service';
import { JobpostService } from '../../../Services/jobpost.service';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
import { ToastContainerDirective, ToastrService } from 'ngx-toastr';
import { AppConfig } from '../../../Globals/app.config';
import { UserInfoService } from '../../../Services/userInfo.service.';
import { CustomValidators } from '../../../Validators/custom-validator.directive';
import { Location } from '@angular/common';
import { Options } from 'ng5-slider';
import { BsModalRef, BsModalService } from 'ngx-bootstrap';
import { ScreeningQuestionService } from '../../../Services/screeningQuestion.service';
import *as moment from 'moment';
declare var google: any;
 
interface Marker {
  lat: number;
  lng: number;
  label?: string;
  draggable: boolean;
}

declare var google: any;
@Component({
  selector: 'app-CreateJobComponent',
  templateUrl: './CreateJob.Component.html',
})
export class CreateJobComponent implements OnInit {
  @ViewChild(ToastContainerDirective) toastContainer: ToastContainerDirective;
  @ViewChild('JobForms') JobForms: HTMLFormElement;
  CurrentDate: Date = new Date();
  AgeMsg = true;
  ExpMsg = true;
  CtcMsg = true;
  openingformValid = true;
  jobFromvalid = true;
  UserInfo: any;
  Responce: any = {};
  DBResponce: any = {};
  lstState: any = [];
  lstAllLanguage: any = [];
  joiningpriority: any = [];
  mineducation: any = [];
  district: any = [];
  city :any=[];
  openingdetail: any = {};
  jobdetail: any = {};
  jobopeningdetail: any = {};
  newAttribute: any = [];
  newAttributeShow: any = [];
  lstFunctionalArea: any = [];
  lstIndustryArea: any = [];
  respIndustryArea: any = {};
  respFunctionalArea: any = {};
  JobForm: FormGroup;
  joblist: any = {};
  lstGender: any;
  status = true;
  statusAge = true;

  dropdownList = [];
  selectedItems = [];
  dropdownSettings = {};
  mintoDate:any;
  minDate = new Date();

  Logintype: string = "";
  JobFormDesable: boolean = true;
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
    floor: 0,
    ceil: 250000,
    step: 1
  };
  lttt:any;
  lngtt:any;
  btnsts:boolean=true;
  SectorForm: FormGroup;
  CityForMap:any;
  DistForMap:any;
  StateForMap:any;
  GMLtlgStatus:boolean=true;
  GoogleMapState:any;
  MapLatititute:any;
  MapLongitute:any;
  MapAddress:any;
  DefMapAddress:any;
  // google map 

  

  constructor( private screeningService:  ScreeningQuestionService
    , private appConfig: AppConfig
    , private toastrService: ToastrService
    , private userinfoservice: UserInfoService
    , private masterService: MasterService
    , private jobpostService: JobpostService
    , private modalService: BsModalService
    , private formBuilder: FormBuilder
    , private _location: Location
    , private router: Router
    , private spinnerService: Ng4LoadingSpinnerService) {
    try {
      this.UserInfo = JSON.parse(localStorage.getItem('UserInfo'));
      this.Logintype = this.UserInfo.loginType;
    } catch  { }
      this.appConfig.isverified();
  }

  Genderformarray: any = [];
  onchangeGender(Gender: string, ischecked: boolean) {
    if (ischecked) {
      this.Genderformarray.push(Gender);
    } else {
      let index = this.Genderformarray.indexOf(Gender);
      this.Genderformarray.splice(index, 1);
    }
  }

  LangFormArray: any = [];
  onItemSelect(item: any) {
    this.LangFormArray.push(item.name);
  }

  onItemDeSelect(item: any) {
    
    // this.LangFormArray = [];
    // this.openingdetail.LanguageId.splice(item.id, 1)
    // this.LangFormArray.splice(item.name, 1)
    let index = this.LangFormArray.indexOf(item.name);
    this.LangFormArray.splice(index, 1);
  }

  onDeSelectAll(item: any){    
    this.LangFormArray=[];
  }

  onSelectAll(items: any) {
    
    for (var i = 0; i < items.length; i++) {
      this.LangFormArray.push(items[i].name);
    }
 }
mandatorySign:boolean=true;
 onChangeJobType(jobType:any)
 {
   if(jobType!= "Freelancer") {
     this.mandatorySign=true;
   }
   else{
     this.mandatorySign=false;
   }
 }

 
  addFieldValue() {
    
    if(this.JobForm.value.ShiftTime != "Freelancer"){
      if(this.minCtc==0&&this.maxCtc==0){
        this.toastrService.error("Add CTC min and max option");
        return false;
      }

    }
    if(this.maxCtc > 0 || this.minCtc>=5000){
      this.status = true;
    }
    if(this.JobForm.value.ShiftTime != "Freelancer"){
    if(this.minCtc < 5000){
      this.toastrService.error("Please select minimum CTC 5000.");
      return false;
    }
  }

    if(this.JobForm.value.NetSalary>this.maxCtc){
      this.toastrService.error("In hand salary should not be greater than ctc");
      return false;
    }

    if(this.JobForm.value.ShiftTime != "Freelancer"){
    if(this.status == false || (this.maxCtc > 0 && this.minCtc==0)){
      this.toastrService.error("Please select minimum CTC 5000.");
      return false;
    }
  }




    if (this.ValidatePubilcReg()) {
      this.openingdetail.StateId = this.JobForm.value.StateID;
      this.openingdetail.DistrictId = this.JobForm.value.DistrictID == '' ? 0 : this.JobForm.value.DistrictID;

      this.openingdetail.CityId = this.JobForm.value.CityID == '' ? 0 : this.JobForm.value.CityID;
      this.openingdetail.NoOfVacancy = this.JobForm.value.NoOfVacancy;
      this.openingdetail.LanguageId = this.JobForm.value.LanguageId;
      this.openingdetail.MinCtc = this.minCtc;
      this.openingdetail.MaxCtc = this.maxCtc;
      this.openingdetail.NetSalary = parseInt(this.JobForm.value.NetSalary);

      // for contact person for opening
      this.openingdetail.ContactName = this.JobForm.value.ContactName;
      this.openingdetail.ContactDesignation = this.JobForm.value.ContactDesignation;
      this.openingdetail.ContactMobile = this.JobForm.value.ContactMobile;
      this.openingdetail.ContactLandlineNumber = this.JobForm.value.ContactLandlineNumber;
      this.openingdetail.ContactEmail = this.JobForm.value.ContactEmail;
      this.openingdetail.isContactSharedPublic = this.JobForm.value.ContactEmailPublic ? this.JobForm.value.ContactEmailPublic:false;
      this.openingdetail.Contactid=0;

      var ltlg=localStorage.getItem("lattlngt");
      if(this.MapLatititute && this.MapLongitute && this.MapAddress){
        this.openingdetail.Latitude=this.MapLatititute;
        this.openingdetail.Longtitute=this.MapLongitute;
        this.openingdetail.Locationmapaddress=this.MapAddress;
      }else if(this.DefMapAddress && ltlg){
        var ltlgsplit=ltlg.split(',');
        this.openingdetail.Latitude=ltlgsplit[0];
        this.openingdetail.Longtitute=ltlgsplit[1];
        this.openingdetail.Locationmapaddress=this.DefMapAddress;
      }
      
      // end  
      let statedid;
      let districtid;
      let cityid;
      let languageid;
      statedid = this.JobForm.value.StateID;
      districtid = this.JobForm.value.DistrictID;
      cityid = this.JobForm.value.CityID;
      languageid = this.JobForm.value.LanguageId;

      let statename = (this.lstState).filter(function (entry) {
        return entry.id == statedid;
      });
      let districtname = (this.district).filter(function (entry) {
        return entry.id == districtid;
      });

      let cityname = (this.city).filter(function (entry) {
        return entry.id == cityid;
      });
      
      this.newAttributeShow.push({
        "statename": statename[0]['stateName'] = '' ? '' : statename[0]['stateName'],
        "districtname": districtname == '' ? '' : districtname[0]['districtName'],
        "cityname": cityname == '' ? '' : cityname[0]['cityname'],
        "languageanme": this.LangFormArray,
        "vacancycount": this.JobForm.value.NoOfVacancy,
        "MaxCtc": this.maxCtc,
        "MinCtc": this.minCtc,
        "NetSalary": this.JobForm.value.NetSalary,

        // for contact person for opening
        "ContactName" : this.JobForm.value.ContactName,
        "ContactDesignation":this.JobForm.value.ContactDesignation,
        "ContactMobile":this.JobForm.value.ContactMobile,
        "ContactLandlineNumber":this.JobForm.value.ContactLandlineNumber,
        "ContactEmail" : this.JobForm.value.ContactEmail,
        "ContactEmailPublic":this.JobForm.value.ContactEmailPublic
        
      });
     this.showAddButton=true;
     this.showviewButton=false;
      this.newAttribute.push(this.openingdetail);
      this.openingdetail = {};
       this.JobForm.controls['StateID'].setValue("");
      this.JobForm.controls['DistrictID'].setValue("");
      this.JobForm.controls['CityID'].setValue("");
      this.JobForm.controls['NoOfVacancy'].setValue("");
      this.JobForm.controls['LanguageId'].setValue("");
      this.LangFormArray = [];
      this.JobForm.controls['NetSalary'].setValue("");
     
      this.JobForm.controls['MaxCtc'].setValue("");
      this.JobForm.controls['MinCtc'].setValue("");

      // for contact person for opening
      this.JobForm.controls['ContactName'].setValue("");
      this.JobForm.controls['ContactDesignation'].setValue("");
      this.JobForm.controls['ContactMobile'].setValue("");
      this.JobForm.controls['ContactEmail'].setValue("");
      this.JobForm.controls['ContactLandlineNumber'].setValue("");
      this.JobForm.controls['ContactEmailPublic'].setValue("");
      this.minCtc=0;
      this.maxCtc=0;
      this.CtcOptions = {
        floor: 0,
        ceil: 250000,
        step: 100
      };
    }
  }
  filldefault() {
    this.JobForm.controls['CompanyName'].setValue(this.UserInfo.companyName);
    this.JobForm.controls['Mobile'].setValue(this.UserInfo.mobile);
    this.JobForm.controls['Name'].setValue(this.UserInfo.fullName);
    this.JobForm.controls['Email'].setValue(this.UserInfo.email);
    this.JobForm.controls['Designation'].setValue(this.UserInfo.designation);
  }
  
  
  ngOnInit() {
    window.scroll(0, 0);
   
     
   // this.mintoDate=new Date();
   // this.mintoDate.setDate(this.mintoDate.getDate() + 1);
    this.GetGender();
    this.JobForm = this.formBuilder.group({
      JobTitle: ['', [Validators.required, , Validators.compose([CustomValidators.removeSpaces])]],
      CompanyName: ['', [Validators.required, , Validators.compose([CustomValidators.removeSpaces])]],
      Specialization: ['', [Validators.nullValidator, , Validators.compose([CustomValidators.removeSpaces])]],
      ShiftTime: ['FullTime', [Validators.nullValidator,]],
      ojtDuration: ['', [Validators.nullValidator,]],
      IsOjt: ['false', [Validators.nullValidator,]],
      Weight: ['', [Validators.nullValidator,]],
      heightFeet: ['', [Validators.nullValidator,]],
      heightInch: ['', [Validators.nullValidator,]],
      JoiningPriorityId: ['', [Validators.required,]],
      Name: ['', [Validators.required, , Validators.compose([CustomValidators.removeSpaces])]],
      Designation: ['', [Validators.required, , Validators.compose([CustomValidators.removeSpaces])]],
      JobDescription: ['', [Validators.required, , Validators.compose([CustomValidators.removeSpaces])]],
      Mobile: ['', [Validators.required, Validators.compose([CustomValidators.validMobile])]],
      Email: ['', [Validators.required, Validators.compose([CustomValidators.vaildEmail])]],
      EmailPublic: ['false', [Validators.nullValidator,]],
      RolesresPonsiblty: ['', [Validators.required, , Validators.compose([CustomValidators.removeSpaces])]],
      Keyword: ['', [Validators.nullValidator, , Validators.compose([CustomValidators.removeSpaces])]],
      LandlineNumber: ['', [Validators.nullValidator,]],
      MinExp: ['', [Validators.nullValidator,]],
      MaxExp: ['', [Validators.nullValidator,]],
      AgeMin: ['', [Validators.nullValidator,]],
      AgeMax: ['', [Validators.nullValidator,]],
      OtherDetail: ['', [Validators.nullValidator, Validators.compose([CustomValidators.removeSpaces])]],
      ISprobationtime: ['false', [Validators.nullValidator,]],
      Transgender: ['', [Validators.nullValidator,]],
      Female: ['', [Validators.nullValidator,]],
      Male: ['', [Validators.nullValidator,]],
      ProbationDuration: ['', Validators.nullValidator,],
      MinEducation: ['', [Validators.required,]],
      ValidDate: ['', [Validators.required,]],
      JobId: ['', [Validators.nullValidator,]],
      StateID: ['', [Validators.nullValidator,]],
      DistrictID: ['', [Validators.nullValidator,]],
      CityID: ['', [Validators.nullValidator,]],
      NoOfVacancy: ['', [Validators.nullValidator, Validators.compose([CustomValidators.removeSpaces])]],
      LanguageId: ['', [Validators.nullValidator,]],
      NetSalary: ['', [Validators.nullValidator,]],
      MaxCtc: ['', [Validators.nullValidator,]],
      MinCtc: ['', [Validators.nullValidator,]],
      IndustryArea: ['', [Validators.required]],
      FunctionalArea: ['', [Validators.required]],
      Isscreening:['', [Validators.nullValidator,]],
      screening : ['', [Validators.nullValidator,]],
      question : ['', [ Validators.compose([CustomValidators.removeSpaces])]],

      // for contact in job opening

      ContactName: ['', [ , Validators.compose([CustomValidators.removeSpaces])]],
      ContactDesignation: ['', [ Validators.compose([CustomValidators.removeSpaces])]],
      // contactJobDescription: ['', [Validators.required, , Validators.compose([CustomValidators.removeSpaces])]],
      ContactMobile: ['', [Validators.compose([CustomValidators.validMobile])]],
      ContactEmail: ['', [Validators.compose([CustomValidators.vaildEmail])]],
      ContactEmailPublic: ['false', [Validators.nullValidator,]],
      ContactLandlineNumber: ['', [Validators.nullValidator,]]
    });


    this.filldefault()
    this.getJobTitleList();
    this.GetAllStates();
    this.GetAllLanguage();
    this.GetAllJoiningPriority();
    this.GetMinEducation();
    this.GetAllFunctionArea();
    this.GetAllIndustryArea();
    this.GetAllSector();
    // this.getPreviousQuestionList();
    this.dropdownSettings = {
      singleSelection: false,
      idField: 'id',
      textField: 'name',
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      itemsShowLimit: 6,
      allowSearchFilter: true
    };
    this.SectorForm = this.formBuilder.group({
      SectorID: ['',Validators.nullValidator,],
      TradeID: ['', [Validators.nullValidator,]],

  });
  this.serverDateTime();
  }

  Sector:any=[];

  serverDate:any;
  serverDateTime(){
    this.masterService.GetServerDateTime().subscribe(res=>{
      if(res){
          this.serverDate=res;        
          this.mintoDate=moment.utc(this.serverDate).toDate();
          this.mintoDate.setDate(this.mintoDate.getDate() + 1);
      }     else{
          this.mintoDate=new Date();
          this.mintoDate.setDate(this.mintoDate.getDate() + 1);
      }
    })
  }
  
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
  Getalltrade(trade: any) {
    try {
      if(trade!=null && trade!='')
      {
        this.masterService.GetAllMrigsTrade(trade).subscribe(res => {
          this.DBResponce = res;
          if (this.DBResponce.lstTrade != null) {
            this.Trade = this.DBResponce.lstTrade;
          }
          else {
            this.Trade = [];
          }
        });
      }
      else
      {
        this.Trade = [];
      }      
    } catch  { }
  }

  private GetAllStates() {
    try {
      this.masterService.GetAllStates().subscribe(res => {
        this.lstState = res
        this.lstState = this.lstState;
      });
    } catch  { }
  }

  private GetAllLanguage() {
    try {

      this.masterService.GetAllLanguage().subscribe(res => {
        this.lstAllLanguage = res;
      });
    } catch  { }
  }
  validateWeight(weight){

  }


  private GetAllJoiningPriority() {
    try {
      this.masterService.GetJoiningPrority().subscribe(res => {
        this.joiningpriority = res

        if (this.DBResponce != null && this.DBResponce.length > 0) {
          this.joiningpriority = this.joiningpriority;
        }
      });
    } catch  { }
  }

  private GetMinEducation() {
    try {
      this.masterService.GetAllMinEducation().subscribe(res => {
        this.mineducation = res

        if (this.mineducation != null && this.mineducation.length > 0) {
          this.mineducation = this.mineducation;
        }
      });
    } catch  { }
  }


  onChangeState(statename: any) {

    this.GetAllDistrict(statename);
    this.GetAllCity(statename);
  }

  // private GetAllDistrict(id: any) {
  //   try {

  //     this.masterService.GetAllDistrict(id).subscribe(res => {
  //       this.district = res
  //       if (this.district != null && this.district.length > 0) {
  //         this.district = this.district;

  //       }
  //     });
  //   } catch  { }
  // }

  GetAllDistrict(id: any) {
    try {
      if(id!=null && id!='')
      {
        this.masterService.GetAllDistrict(id).subscribe(res => {
          this.district = res;
          if (this.district != null && this.district.length > 0) {
            this.district = this.district;
  
          }
          else {
            this.district = [];
          }
        });
      }
      else
      {
        this.district = [];
      }      
    } catch  { }
  }

  districtValid:boolean=false;

  GetAllCity(id:any){
    try {
      if(id!=null && id!='')
      {
        this.masterService.GetAllCity(id).subscribe(res => {
          this.city = res;
          if (this.city != null && this.city.length > 0) {
            this.city = this.city;
  
          }
          else {
            this.city = [];
          }
        });
      }
      else
      {
        this.city = [];
      }      
    } catch  { }
   
  }

  ValidateExperience(expfrom, expto) {

    let experiencefrom = expfrom;
    let experienceto = expto;
    if (this.minExp > this.maxExp) {
      this.jobFromvalid = false;
      this.ExpMsg = false;
    } else {
      this.jobFromvalid = true;
      this.ExpMsg = true;
    }
  }
  ValidateAge(Max, Min) {

    if (this.maxAge < this.minAge) {
      this.AgeMsg = false;
      this.jobFromvalid = false;

    } else {
      this.jobFromvalid = true;
      this.AgeMsg = true;
    }
  }
  ValidateCtc(minctc, maxctc) {

    if (this.minCtc > this.maxCtc) {
      this.openingformValid = false;
      this.CtcMsg = false;
    } else {
      this.openingformValid = true;
      this.CtcMsg = true;
    }

  }


  changeSiider(e : any){

     if (e.keyCode === 189 ) {
                return false;
            }
       else if(e.target.value){
      this.CtcOptions.floor=e.target.value;
      this.minCtc=e.target.value;
     }
  }

  probation: boolean = false;
  probationcondition: any;
  SetProbation(probcon: any) {

    if (probcon == 1) {
      this.probation = true;
      this.jobFromvalid = false;
    } else {
      this.probation = null;
      this.jobFromvalid = true;
      this.JobForm.controls['ProbationDuration'].setValue("");this.saveQuestion( this.jobids);
    }
    this.probationcondition = probcon;
  }

  ojt: boolean = false;
  SetOjt(probcon: any) {
    if (probcon == 1) {
      this.ojt = true;
      this.jobFromvalid = false;
    } else {
      this.ojt = null;
      this.jobFromvalid = true;
      this.JobForm.controls['ojtDuration'].setValue("");
    }
  }


  Back() {
    this._location.back();
  }

  GetGender() {
    this.masterService.GetGender().subscribe(res => {
      this.lstGender = res

    });
  }
 newJobId:any;
  postjob() {

    // if(this.maxAge > 0 || this.minAge>=15){
    //   this.statusAge = true;
    // }
    // if(this.statusAge == false || (this.maxAge>0 && this.minAge==0)){
    //   this.toastrService.error("Please select minimum age 15.");
    //   return false;
    // }
    if(this.minAge > 0 || this.maxAge > 0){
      if(this.minAge < 15){
        this.toastrService.error('Min age must be greater then 15');
        window.scroll(0,0);
        return false;
      } 
}
    var CurrentDate = new Date();

    if(this.JobForm.value.ValidDate <= CurrentDate){
      this.toastrService.error('Valid to date is must be greater than the current date');
    
      window.scroll(0,0);
      return false;
    }
    this.JobFormDesable = false;
    if (this.newAttribute.length > 0 && this.jobFromvalid) {
      this.btnsts=false;
      this.jobdetail.PostedBy = this.UserInfo.loginType;
      this.jobdetail.JobTitle = this.JobForm.value.JobTitle;
      this.jobdetail.CompanyName = this.JobForm.value.CompanyName;
      this.jobdetail.Name = this.JobForm.value.Name;
      this.jobdetail.Designation = this.JobForm.value.Designation;
      this.jobdetail.JobDescription = this.JobForm.value.JobDescription;
      this.jobdetail.Mobile = this.JobForm.value.Mobile;
      this.jobdetail.Email = this.JobForm.value.Email;
      this.jobdetail.EmailPublic = this.JobForm.value.EmailPublic;
      this.jobdetail.RolesresPonsiblty = this.JobForm.value.RolesresPonsiblty;
      this.jobdetail.Keyword = this.JobForm.value.Keyword;
      this.jobdetail.LandlineNumber = this.JobForm.value.LandlineNumber;
      this.jobdetail.MinExp = this.minExp;
      this.jobdetail.MaxExp = this.maxExp;
      this.jobdetail.AgeMin = this.minAge;
      this.jobdetail.AgeMax = this.maxAge;
      this.jobdetail.jobId = this.JobForm.value.jobId;
      this.jobdetail.OtherDetail = this.JobForm.value.OtherDetail;
      this.jobdetail.Male = this.JobForm.value.Male ? 1 : 0;
      this.jobdetail.Female = this.JobForm.value.Female ? 2 : 0
      this.jobdetail.Transgender = this.JobForm.value.Transgender ? 3 : 0
      this.jobdetail.ProbationDuration = parseInt(this.JobForm.value.ProbationDuration) ? parseInt(this.JobForm.value.ProbationDuration):0;
      this.jobdetail.MinEducation = this.JobForm.value.MinEducation;
      this.jobdetail.Specialization=this.JobForm.value.Specialization;
      this.jobdetail.ValidDate = this.JobForm.value.ValidDate;
      this.jobdetail.ISprobationtime = this.JobForm.value.ISprobationtime;
      this.jobdetail.ojtDuration = parseInt(this.JobForm.value.ojtDuration) ? parseInt(this.JobForm.value.ojtDuration):0;
      this.jobdetail.IsOjt = this.JobForm.value.IsOjt;
      this.jobdetail.Weight = this.JobForm.value.Weight == '' ? '0' : this.JobForm.value.Weight;
      this.jobdetail.heightFeet = this.JobForm.value.heightFeet == '' ? '0' : this.JobForm.value.heightFeet;
      this.jobdetail.heightInch = this.JobForm.value.heightInch == '' ? '0' : this.JobForm.value.heightInch;
      this.jobdetail.ShiftTime = this.JobForm.value.ShiftTime;
      this.jobdetail.JoiningPriorityId = this.JobForm.value.JoiningPriorityId;
      this.jobdetail.FunctionalArea = this.JobForm.value.FunctionalArea;
      this.jobdetail.IndustryArea = this.JobForm.value.IndustryArea;
      this.jobdetail.sectorTradeList=this.NewSectorData;
      if(this.isChecked){
        this.jobdetail.Isscreening=true;
      }else{
        this.jobdetail.Isscreening=false;
      }     
        this.spinnerService.show();         
        this.jobpostService.AddJobId(this.jobdetail).subscribe(res => {
        this.spinnerService.hide();
        this.Responce = res;
        this.btnsts=true;
        if (this.Responce.responseResult != true) {          
            this.toastrService.error(this.Responce.message);
        } else {
            this.jobopeningdetail = this.newAttribute;         
            this.spinnerService.show()
            this.newJobId=this.Responce.id;
            this.jobpostService.GetJobOpening(this.jobopeningdetail, this.Responce.id).subscribe(res => {
            this.spinnerService.hide();
            this.Responce = res;
            if (this.Responce.responseResult != true) {
                   this.JobFormDesable = true;
                   this.toastrService.error(this.Responce.message);
            } else {
                    if(this.isChecked){
                      this.saveQuestion(this.newJobId);
                    }                  
                   this.toastrService.success(this.Responce.message);
                   this.JobForm.reset();
                   this.router.navigate(['/JobList']);
            }
          });
        }
      });
    } else {
      this.toastrService.error("Please add opening details");
    }
  }

  jobListRedirection() {
    this.router.navigate(['/JobList']);
  }

  private ValidatePubilcReg() {
    var IsValid = true;
    var errorMsg = "";
    var regEmail = /^([\w-\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([\w-]+\.)+))([a-zA-Z]{2,4}|[0-9]{1,3})(\]?)$/;
    if (IsValid) {
      if (this.JobForm.value.StateID == "") {
        errorMsg += "Please Select State. <br/>";
        IsValid = false;
      }
      if (this.JobForm.value.NoOfVacancy == "" || parseInt(this.JobForm.value.NoOfVacancy) < 1) {
        errorMsg += "Please Enter Valid no of vacancy . <br/>";
        IsValid = false;
      }
      if (this.minCtc > this.maxCtc) {
        errorMsg += "Please Enter CTC Details . <br/>";
        IsValid = false;
      }
    }
    if (!IsValid)
      this.toastrService.error(errorMsg, null, { enableHtml: true });
    return IsValid;
  }

  ValidOjt() {
    if (this.JobForm.value.ojtDuration == '') {
      this.jobFromvalid = false;

    } else {
      this.jobFromvalid = true;
    }
  }

  ValidProbation() {
    if (this.JobForm.value.ProbationDuration == '') {
      this.jobFromvalid = false;

    } else {
      this.jobFromvalid = true;
    }
  }

  onClickMe(){
  if(this.minAge<14){
    this.toastrService.error("Please select minimum age 15.");
    this.statusAge = false;
  }else{
    this.statusAge = true;
  }
}

ctcClick(){
  if(this.minCtc<4999){
    this.toastrService.error("Please select minimum ctc 5000.");
    this.status = false;
  }else{
    this.status = true;
  }
}
  _currentValues: any;
  onSliderChange(selectedValues: number[]) {
    this._currentValues = selectedValues;
  }
  GenderInvalid: boolean = false;


  submitJob(el) {

   if(this.JobForm.value.ISprobationtime=='true'){
    if(this.JobForm.value.ProbationDuration<=0){
      this.toastrService.error('Please enter probation duration');
      el.scrollIntoView();
      return false;
    }
  }
 
  if(this.isChecked && this.finalSubmitQuestion.length<1){
    this.isChecked=false;
    this.toastrService.error('please add at least one screening question');
    window.scroll(0,0);   
    return false;
  }
  if(this.JobForm.value.IsOjt=='true'){
    if(this.JobForm.value.ojtDuration<=0){
      this.toastrService.error('Please enter OJT duration');
      el.scrollIntoView();
      return false;
    }
  }

    if (this.newAttribute.length > 0) {
      if (!this.JobForm.value.Male && !this.JobForm.value.Female && !this.JobForm.value.Transgender) {
        el.scrollIntoView();
        this.toastrService.error("Please select Gender");
      }      
      else {
        this.jobFromvalid = true;
        if (this.newAttribute.length > 0) {
          this.postjob();
        } else {
          this.toastrService.error("Please add opening detailss");
        }
      }
    } else {
      this.toastrService.error("Please add opening details");
    }

  }
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
  indexValue:any;
  deleteWalkin(){
    let index=this.indexValue;
    this.newAttributeShow.splice(index,1);
    this.newAttribute.splice(index,1);
    this.modalRef.hide();
  }

  modalRef: BsModalRef;

  PushedTemplate(template: TemplateRef<any>,i) {
    this.indexValue=i;
    this.modalRef = this.modalService.show(template, { class: 'modal-sm' });
  }

  declineBox(): void {
    this.modalRef.hide();
  }
  decimals(e){
    if (e.keyCode === 190 || e.keyCode == 110) {
        return false;
    }
    if (e.keyCode === 189 ) {
        return false;
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
////////////////  sector section //////////
NewSectorShow:any=[];
NewSectorData:any=[];
NewSecterTempData:any=[];
check(){

  let sectorid=this.SectorForm.value.SectorID;
  let tradeid = this.SectorForm.value.TradeID;
  let sectorname = (this.Sector).filter(function (entry) {
    return entry.id == sectorid;
  });
  let tradename = (this.Trade).filter(function (entry) {
    return entry.id == tradeid;
  });
  if(this.NewSectorShow.length){
    for(var sect of this.NewSectorShow){
      if(sect.SectorID==sectorname[0].name && sect.TradeID==tradename[0].name){
        this.toastrService.error('Training sector and trade are already exist');
       // this.SectorForm.value.TradeID=''
        this.SectorForm.controls['TradeID'].setValue("");
        return false;
      }
    }
  }
}

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
          if((sector.SectorID == sectorname[0].name) && (sector.TradeID == tradename[0].name)){
            hasMatch = true;
            break;
          }
        }

        if(!hasMatch)
        {
            this.NewSectorShow.push({
              "SectorID": sectorname!=''?sectorname[0].name:'N/A',
              "TradeID":tradename!=''?tradename[0].name:'N/A',
            });
      }else{

        this.toastrService.error('Training sector and trade are already exist');
        return false;
      }


      this.NewSecterTempData.push({
        "SectorID": this.SectorForm.value.SectorID,
        "TradeID":this.SectorForm.value.TradeID,
      });


      this.NewSectorData.push(
          {
          "sectorId": this.SectorForm.value.SectorID,
          "sectorName":sectorname[0].name,
          "tradeId": this.SectorForm.value.SectorID,
          "tradeName":tradename[0].name,
          "isActive":1,
          }
        );
      this.NewSecterTempData = [];
      this.SectorForm.controls['SectorID'].setValue("");
      this.SectorForm.controls['TradeID'].setValue("");
}

modalRefSector: BsModalRef;
deleteSector(index:number){
  this.NewSectorShow.splice(index,1);
  this.NewSectorData.splice(index,1);
  this.modalRefSector.hide();
}

declineBoxSecor(): void {
  this.modalRefSector.hide();
}
PusTemplateSector(templateSector: TemplateRef<any>) {
  this.modalRefSector = this.modalService.show(templateSector, { class: 'modal-sm' },);
}
////////////////  End Sector Section //////////////


/////////////// create question section /////////

showquestion:boolean=false;
createQuest:boolean=false;
questionList:any=[];
selectedQuestion:any=[];
isChecked:boolean=false;
jobTitleCode:any=[];
showJobDetail:boolean=false;
jobDetails:any;
finalSubmitQuestion:any=[];
jobids:any;
checkedQ:boolean=false;
addedQuestion:any=[];
addedquestStatus:boolean=false;
isViewButtonshow:boolean=false;

createQuestion(templateSector: TemplateRef<any>) {  
  this.isChecked=true;
  if(this.isChecked && !this.isSubmit){        
    this.modalRefSector = this.modalService.show(templateSector, { backdrop: 'static', keyboard: false, class: 'modal-md'});
  } else{
    this.isViewButtonshow=true;
  }
}

// get job title and job code based on user id
getJobTitleList(){
 this.screeningService.getGrouponlyHaveQuestionlist().subscribe(res=>{
   if(res){     
     this.jobTitleCode=res;
   }
 })
}



response:any;
groupId:any
getJobDetails(event:any){  
  let groupId=event.target.value;  
  let groupName = this.jobTitleCode.filter(function (entry) {
    return entry.groupid == groupId;
  });
  this.groupId=groupId;
  if(this.groupId!=null && this.groupId!='')
  {
    this.screeningService.GetActivequestionlist(this.groupId).subscribe(res=>{    
      this.response=res; 
      if(this.response){
        this.showquestion=true;
        this.questionList=res;                
      }    
   })
  }
  else
  {
    this.showquestion=false;
    this.questionList=[];              
  }
  
}

// add own question

addQuestion(){  
  this.finalSubmitQuestion=[];
  if(this.JobForm.value.question){
      this.createQuest=false;
      this.addedquestStatus=true;
      this.checkedQ=true;
      this.showEditForm=false;
      let question = this.JobForm.value.question ;      
              if(this.index!=='' && this.editType=='old' ){
                this.questionList[this.index].questions = question;
              }                   
              this.JobForm.controls['question'].setValue('');
              this.index='';
                       
  }else{
    this.toastrService.error('please add question');
  }
}

// select question form previous posted job 

// selectQuestion(e,item){    
    
//   let question=item.questions;
//   if(e.target.checked){
//      this.selectedQuestion.push({"groupid":item.groupid,"ismandatory":item.mandotary,"groupquestionid":item.groupquestionid,"questionid":0,"Quesons":question,"isActive":item.isactive});
//   }else{
//       let index = this.selectedQuestion.indexOf({"groupid":item.groupid,"ismandatory":item.mandotary,"questionid":0,"groupquestionid":item.groupquestionid,"Quesons":question,"isActive":item.isactive});
//       this.selectedQuestion.splice(index,1);
//       if(this.selectedQuestion.length==0){
//          this.selectedQuestion=[] ;
//      }
//    }
// }

count:number;
quesionListCheck:boolean=false;
SelectquestIndexArr:any=[];
selectQuestion(e,item,i){        
  let question=item.questions;
  if(e.target.checked){      
     if(this.selectedQuestion.length){      
      var newArrObj = this.selectedQuestion.filter(function(obj) {        
        return  obj.groupquestionid == item.groupquestionid;
      }) 
      if(newArrObj.length){        
         if(newArrObj[0].groupquestionid==item.groupquestionid && newArrObj[0].Quesons == item.questions){
           this.toastrService.error('Question is already added');         
           $("#" +"screening"+ i ).prop('checked', false); 
           return false;
         }else{
           this.selectedQuestion.push({"groupid":item.groupid,"ismandatory":item.mandotary,"groupquestionid":item.groupquestionid,"questionid":0,"Quesons":question,"isActive":item.isactive, "Expectanswer": item.expectanswer, "Preference": item.preference});
           this.SelectquestIndexArr.push(item.groupquestionid);
         }
      }else{        
        this.selectedQuestion.push({"groupid":item.groupid,"ismandatory":item.mandotary,"groupquestionid":item.groupquestionid,"questionid":0,"Quesons":question,"isActive":item.isactive, "Expectanswer": item.expectanswer, "Preference": item.preference});
        this.SelectquestIndexArr.push(item.groupquestionid);
      }
    }else{
      
      this.selectedQuestion.push({"groupid":item.groupid,"ismandatory":item.mandotary,"groupquestionid":item.groupquestionid,"questionid":0,"Quesons":question,"isActive":item.isactive, "Expectanswer": item.expectanswer, "Preference": item.preference});
      this.SelectquestIndexArr.push(item.groupquestionid);
    }
  }else{
    let index1 = this.SelectquestIndexArr.indexOf(item.groupquestionid);
    this.selectedQuestion.splice(index1,1);
    this.SelectquestIndexArr.splice(index1,1);
     //let index = this.selectedQuestion.indexOf({"groupid":item.groupid,"ismandatory":item.mandotary,"questionid":0,"groupquestionid":item.groupquestionid,"Quesons":question,"isActive":item.isactive, "Expectanswer": item.expectanswer, "Preference": item.preference});
      // this.selectedQuestion.splice(index,1);
      
      if(this.selectedQuestion.length==0){
         this.selectedQuestion=[] ;
     }
   }
}

index:any='';
editType:any;

// edit question
showEditForm:any;
editQuestion(i,question:any,data:any){
  this.editType=data;  
  this.index=i;  
  this.showEditForm=true
  this.JobForm.controls['question'].setValue(question);
}

//close button function

declinequestion(){
  
  if(this.isSubmit){
    this.isChecked=true;
    this.JobForm.controls['question'].setValue('');
  }else{
    this.JobForm.controls['question'].setValue('');
    this.isChecked=false;
    this.questionList=[];
    this.addedQuestion=[];
    this.finalSubmitQuestion=[];
    this.selectedQuestion=[];
    this.SelectquestIndexArr=[];
  }  
  this.showJobDetail=false;
  this.showquestion=false;
  this.createQuest=false;
  this.addedquestStatus=false;  
  this.modalRefSector.hide();
}

//submit question after select and create question.
isSubmit:boolean=false
submitQuestion(){      
  if(this.selectedQuestion.length>0){
    this.isChecked=true;
    this.isSubmit=true;
    this.isViewButtonshow=true;
    this.finalSubmitQuestion=this.selectedQuestion; 
    this.modalRefSector.hide(); 
    this.toastrService.success('Question added successfully');
  }else{
        this.toastrService.error('please add question');
       }
}

// view added question

viewQuestion(templateSector: TemplateRef<any>,item) {
    if(this.selectQuestion.length>0){
      this.addedQuestion=[];
      this.addedquestStatus=true;
      this.showJobDetail=false;
      this.showquestion=false;
      for(let item of this.selectedQuestion){
        this.checkedQ=true;
        this.addedQuestion.push(item.Quesons);
      }   
    }
    this.modalRefSector = this.modalService.show(templateSector, { class: 'modal-md ' });
}

// save question after job created successfully

 saveQuestion(jobId:any){  
   let postData={
    "jobid":jobId,
    "Quesons": this.finalSubmitQuestion,
   }    
   
   this.jobpostService.saveQuestion(postData).subscribe(res=>{    
    if(res){
      
    }
  })
}

isNotScreeming(){  
  this.isViewButtonshow=false;
  this.isChecked=false
}
//////////////////////////End screening question section///////////////////////


///////////////////////// Add contact Detail for opening section//////////////////


openingModelRef: BsModalRef;

addContactForOpening(template: TemplateRef<any>,item:any) {  
  this.openingModelRef = this.modalService.show(template, { class: 'modal-sm-md',backdrop  : 'static', keyboard  : false });
  if(item=="add"){
    this.JobForm.controls['ContactEmailPublic'].setValue(""); 
    this.close();   
  }
}
geoLocation(template: TemplateRef<any>,item:any) {  
  if(this.GMLtlgStatus==true){
    localStorage.removeItem("lattlngt");
  }
  this.openingModelRef = this.modalService.show(template, { class: 'modal-sm-md' });
}

showAddButton:boolean=true;
showviewButton:boolean=false;
contactEmailValue:any;
contactMobileValue:any;
contactDesignation:any;
contactName:any;
contactLandlineNumber:any;
contactEmailPublic:any
addContactInopening(){  
   
  if(this.JobForm.value.ContactName==''){
    this.toastrService.error("please add contact person name");
    return false
  }else if(this.JobForm.value.ContactDesignation==''){
    this.toastrService.error("please add designation");
    return false
  }else if(this.JobForm.value.ContactMobile==''){
    this.toastrService.error("please add contact number");
    return false
  }else if(this.JobForm.value.ContactEmail==''){
    this.toastrService.error("please add emailID");
    return false
  }
 if(!this.JobForm.value.ContactName && !this.JobForm.value.ContactEmail && !this.JobForm.value.ContactMobile && !this.JobForm.value.ContactLandlineNumber && !this.JobForm.value.ContactDesignation && !this.JobForm.value.ContactEmailPublic){
  this.toastrService.error("please add at least one field");
 }else{
   this.showAddButton=false;
   this.showviewButton=true;
   this.toastrService.success("Contact person added");
   this.openingModelRef.hide();
   this.contactEmailValue=this.JobForm.value.ContactEmail;
   this.contactMobileValue=this.JobForm.value.ContactMobile;
   this.contactDesignation=this.JobForm.value.ContactDesignation;
   this.contactName=this.JobForm.value.ContactName;
   this.contactLandlineNumber=this.JobForm.value.ContactLandlineNumber;
   this.contactEmailPublic=this.JobForm.value.ContactEmailPublic;

  //  this.JobForm.controls['ContactName'].setValue("");
  //  this.JobForm.controls['ContactDesignation'].setValue("");
  //  this.JobForm.controls['ContactMobile'].setValue("");
  //  this.JobForm.controls['ContactLandlineNumber'].setValue(""); 
  //  this.JobForm.controls['ContactEmail'].setValue(""); 
  //  this.JobForm.controls['ContactEmailPublic'].setValue(""); 
 }
}

closeContactModal(){
  this.openingModelRef.hide();
  this.close();
}
close(){
  this.JobForm.controls['ContactName'].setValue("");
  this.JobForm.controls['ContactDesignation'].setValue("");
  this.JobForm.controls['ContactMobile'].setValue("");
  this.JobForm.controls['ContactLandlineNumber'].setValue(""); 
  this.JobForm.controls['ContactEmail'].setValue(""); 
  this.JobForm.controls['ContactEmailPublic'].setValue(""); //by neeraj singh
}
closeViewModal(){
  this.close();
  if(this.JobForm.value.ContactName==''){
    this.JobForm.controls['ContactName'].setValue(this.contactName); 
  } if(this.JobForm.value.ContactEmail==''){
    this.JobForm.controls['ContactEmail'].setValue(this.contactEmailValue); 
  }if(this.JobForm.value.ContactMobile==''){
    this.JobForm.controls['ContactMobile'].setValue(this.contactMobileValue);
  }if(this.JobForm.value.ContactDesignation==''){
    this.JobForm.controls['ContactDesignation'].setValue(this.contactDesignation);
  }if(this.JobForm.value.ContactLandlineNumber==''){//by neeraj singh
    this.JobForm.controls['ContactLandlineNumber'].setValue(this.contactLandlineNumber);
  }if(this.JobForm.value.ContactEmailPublic==''){//by neeraj singh
    this.JobForm.controls['ContactEmailPublic'].setValue(this.contactEmailPublic);
  }
  this.openingModelRef.hide(); 
}


//Google Map Area

latitude:any;
longitude:any;
lat:any;
lng:any;


getLatLang(LtLg){


}

addGeoLocation(){
   var MpAddress=localStorage.getItem("address");
   var LatitLangt=localStorage.getItem("latlnggg");
   var GoogleMapAdd=localStorage.getItem("GoogleMapAdd");

   var SpliteLatLng=LatitLangt.split(',');
   this.MapLatititute=SpliteLatLng[0];
   this.MapLongitute=SpliteLatLng[1];
   this.MapAddress=GoogleMapAdd;
  
   var spliteAdddress=MpAddress.split(',');
   if(spliteAdddress.length >1){
    var trimState=spliteAdddress[1].trim();
     var stateData=trimState.split(' ');
     for(var i=stateData.length;i>=stateData.length;i--){
      if(i==5){
        var stateAdd=stateData[i-5]+' '+stateData[i-4]+' '+stateData[i-3]+' '+stateData[i-2];
      }else if(i==4){
        var stateAdd=stateData[i-4]+' '+stateData[i-3]+' '+stateData[i-2];
      }else if(i==3){
        var stateAdd=stateData[i-3]+' '+stateData[i-2];
      }else if(i==2){
        var stateAdd=stateData[i-2];
      }
      this.GoogleMapState=stateAdd.toUpperCase();
     }
     
    if(this.GoogleMapState && this.GoogleMapState !=''){
      var mapState=this.GoogleMapState;
      var statename = (this.lstState).filter(function (entry){
        return entry.stateName == mapState;
      });
      if(statename && statename !=''){
        this.JobForm.controls['StateID'].setValue(statename[0]['id']);
        this.GetAllDistrict(statename[0]['id']);
        this.GetAllCity(statename[0]['id']);
      }
    }
    
    if(spliteAdddress[0] && spliteAdddress[0] !=''){
      var mapDistUpper=spliteAdddress[0].trim();
      var mapDist=mapDistUpper.toUpperCase();
      var mapDistName = (this.district).filter(function (entry){
        return entry.districtName == mapDist;
      });
      if(mapDistName && mapDistName !=''){
        this.JobForm.controls['DistrictID'].setValue(mapDistName[0]['id']);
      }
    }

   }else if(spliteAdddress.length ==1){
     var trimState=spliteAdddress[0].trim();
     var stateData=trimState.split(' ');
     for(var i=stateData.length;i>=stateData.length;i--){
      if(i==5){
        var stateAdd=stateData[i-5]+' '+stateData[i-4]+' '+stateData[i-3]+' '+stateData[i-2];
      }else if(i==4){
        var stateAdd=stateData[i-4]+' '+stateData[i-3]+' '+stateData[i-2];
      }else if(i==3){
        var stateAdd=stateData[i-3]+' '+stateData[i-2];
      }else if(i==2){
        var stateAdd=stateData[i-2];
      }
      this.GoogleMapState=stateAdd.toUpperCase();
     }

    if(this.GoogleMapState && this.GoogleMapState !=''){
      var mapState=this.GoogleMapState;
      var statename = (this.lstState).filter(function (entry){
        return entry.stateName == mapState;
      });
      if(statename && statename !=''){
        this.JobForm.controls['StateID'].setValue(statename[0]['id']);
      }
    }
   }
   this.openingModelRef.hide(); 
}

 codeAddres(address:any,src:any) {   
  if(address !=''){
    this.GMLtlgStatus=false;
  }else{
    this.GMLtlgStatus=true;
  }
  var mapAddress;
  if(src=='ST'){
    var state=address;
    var statename = (this.lstState).filter(function (entry){
      return entry.id == state;
    });
  }else if(src=='DT'){
    var dist=address;
    var distname = (this.district).filter(function (entry){
      return entry.id == dist;
    });
  }
  if(statename){
  this.StateForMap=statename[0]['stateName'];
  }else if(distname){
    this.DistForMap=distname[0]['districtName'];
  }

  if(this.StateForMap && this.DistForMap){
    var concAddress=this.DistForMap+','+this.StateForMap;
     mapAddress=concAddress;
  }else if(this.StateForMap ){
    this.GMLtlgStatus=false;
    mapAddress=this.StateForMap;
  }
  this.DefMapAddress=mapAddress;
  var geocoder = new google.maps.Geocoder();
  geocoder.geocode({
      'address': mapAddress
  },function(results, status) {
      if (status == google.maps.GeocoderStatus.OK) {
          var latt=results[0].geometry.location.lat();
          var lngt=results[0].geometry.location.lng();
          var latlng=latt+','+lngt;
          localStorage.setItem("lattlngt",latlng);
      }
  });
}

}

interface Marker {
  lat: number;
  lng: number;
  label?: string;
  draggable: boolean;
}
//End Here Google map Area