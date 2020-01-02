import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastContainerDirective, ToastrService } from 'ngx-toastr';
import { AppConfig } from '../../../Globals/app.config';
import { CustomValidators } from '../../../Validators/custom-validator.directive';
import { MasterService } from '../../../Services/master.service';
import { Router, ActivatedRoute } from '@angular/router';
import { JobpostService } from '../../../Services/jobpost.service';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
import { BsModalRef, BsModalService } from 'ngx-bootstrap';
import { Options } from 'ng5-slider';
import { Subscription } from 'rxjs';
import { CommonMethodService } from '../../../Services/commonMethod.serive';
import { stringify } from '@angular/compiler/src/util';
import { IfObservable } from 'rxjs/observable/IfObservable';
import { ScreeningQuestionService } from '../../../Services/screeningQuestion.service'
import *as moment from 'moment';
@Component({
  selector: 'app-ViewJobComponent',
  templateUrl: './ViewJob.Component.html',
})
export class ViewJobComponent implements OnInit {
  @ViewChild(ToastContainerDirective) toastContainer: ToastContainerDirective;
  CurrentDate: Date = new Date();
  UserInfo: any;
  openingformValid = true;
  jobFromvalid = true;
  AgeMsg = true;
  ExpMsg = true;
  CtcMsg = true;
  jobopeningdetail: any = [];
  editjobdetailres: any = {};
  editjobopeningres: any = {};
  editjobdetail: any = {};
  editjobopening: any = {};
  DbResponcse: any = {};
  id: any = {};
  response: any = {};
  jobs: any = {};
  jobid: any = {};
  userdetails: any = {};
  checkverifymobile: boolean = false;
  viewid: any = {};
  lstState: any = [];
  lstAllLanguage: any = [];
  joiningprioritys: any = [];
  mineducations: any = [];
  district: any = [];
  city: any = [];
  DBResponce: any = {};
  EditJobForm: FormGroup;
  EditJobOpeningForm: FormGroup;
  EditFormShow: any = false;
  EditOpeningFormShow: any = false;

  count = 1;
  dropdownList = [];
  selectedItems = [];
  dropdownSettings = {};
  PageNumber: number = 0;
  status = true;
  statusAge = true;
  IsAgencyJob: boolean = true;
  Ispush: any;

  lstFunctionalArea: any = [];
  lstIndustryArea: any = [];
  respIndustryArea: any = {};
  respFunctionalArea: any = {};
  modalRef: BsModalRef;
  Redirection: any = '0';
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
    floor: 5000,
    ceil: 250000,
    step: 100
  };
  Logintype: any;
  SectorForm: FormGroup;
  public subscription: Subscription;
  constructor(private appConfig: AppConfig
    , private toastrService: ToastrService
    , private masterService: MasterService
    , private formBuilder: FormBuilder
    , private router: Router
    , private spinnerService: Ng4LoadingSpinnerService
    , private jobpostService: JobpostService
    , private modalService: BsModalService
    , private route: ActivatedRoute
    , private commonMethodService: CommonMethodService
    , private screeningService: ScreeningQuestionService
  ) {
    try {
      this.UserInfo = JSON.parse(localStorage.getItem('UserInfo'));
      this.Logintype = this.UserInfo.loginType;

    } catch  { }
    this.appConfig.isverified();
    this.subscription = this.commonMethodService.getMessage().subscribe(message => {
      if (message.status) {
        this.PageNumber = 0;
        this.GetJobDetail(this.viewid);
      }
    });
  }
  OpeningModel(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template, { class: 'modal-sm' });
  }
  declineModel(): void {
    this.modalRef.hide();
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
    this.LangFormArray.splice(item.name, 1)
  }
  onSelectAll(items: any) {
    for (var i = 0; i < items.length; i++) {
      this.LangFormArray.push(items[i].name);
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
      this.EditJobForm.controls['ProbationDuration'].reset();
    }
    this.probationcondition = probcon;
  }
  isvalidDate: boolean = false;
  isViewButtonshow: boolean = false;
  serverDate:any;
  GetEditJob(obj: any) {
    
    this.isViewButtonshow = true;
    this.count = 1;
    this.EditFormShow = true;
    this.NewSectorShow = [];
    this.EditJobForm.controls['JobTitle'].setValue(obj.jobTitle);
    this.EditJobForm.controls['CompanyName'].setValue(obj.companyName);
    this.EditJobForm.controls['Name'].setValue(obj.name);
    this.EditJobForm.controls['Designation'].setValue(obj.designation);
    this.EditJobForm.controls['JobDescription'].setValue(obj.jobDescription);
    this.EditJobForm.controls['Mobile'].setValue(obj.mobile);
    this.EditJobForm.controls['Email'].setValue(obj.email);
    this.EditJobForm.controls['EmailPublic'].setValue(obj.emailPublic);
    this.EditJobForm.controls['RolesresPonsiblty'].setValue(obj.rolesresPonsiblty);
    this.EditJobForm.controls['Keyword'].setValue(obj.keyword);
    this.EditJobForm.controls['LandlineNumber'].setValue(obj.landlineNumber);
    this.EditJobForm.controls['Specialization'].setValue(obj.specialization);
    this.EditJobForm.controls['MinExp'].setValue(obj.minExp);
    this.minExp = obj.minExp;
    this.EditJobForm.controls['MaxExp'].setValue(obj.maxExp); 
    this.maxExp = obj.maxExp;
    if(this.isReCreate){
      if(obj.ageMax==0&&obj.ageMin==0){
        this.minAge=0
        this.maxAge=0
      }else{
        this.EditJobForm.controls['AgeMin'].setValue(obj.ageMin);
        this.minAge = obj.ageMin;
        this.EditJobForm.controls['AgeMax'].setValue(obj.ageMax);
        this.maxAge = obj.ageMax;
      }
    }else{
      this.EditJobForm.controls['AgeMin'].setValue(obj.ageMin);
      this.minAge = obj.ageMin;
      this.EditJobForm.controls['AgeMax'].setValue(obj.ageMax);
      this.maxAge = obj.ageMax;
    }  
    this.EditJobForm.controls['OtherDetail'].setValue(obj.otherDetail);
    this.probation = obj.iSprobationtime ? true : false;
    this.EditJobForm.controls['ISprobationtime'].setValue(obj.iSprobationtime ? 'true' : 'false');
    this.EditJobForm.controls['Male'].setValue(obj.male);
    this.EditJobForm.controls['Female'].setValue(obj.female);   
    
    if(obj.isscreening){
      this.isScreening = obj.isscreening;
      this.EditJobForm.controls['isScreeming'].setValue(obj.isscreening);
    } else{
      this.isScreening = false;
    }  
    
    
    if (this.isScreening ) {
      this.isChecked = true;     
      this.viewQuestion();
    } else {     
      this.isChecked = false;
      this.isViewButtonshow = false;
    }
    this.EditJobForm.controls['Transgender'].setValue(obj.transgender);
    this.EditJobForm.controls['ProbationDuration'].setValue(obj.probationDuration);
    this.EditJobForm.controls['MinEducation'].setValue(obj.minEducation);
    this.EditJobForm.controls['jobId'].setValue(obj.jobId);
    
    var isRecreatedJob=obj.isRecreatedJob;
     

    if (this.isdateDisable) {
      this.isChecked=false;
      this.isvalidDate = false; 
      this.masterService.GetServerDateTime().subscribe(res=>{
        if(res){
            this.serverDate=res;        
            this.mintoDate=moment.utc(this.serverDate).toDate();
            let validToDate= this.mintoDate.setDate(this.mintoDate.getDate() + 1);
            if(this.isReCreate){
              this.EditJobForm.controls['ValidDate'].setValue('');
            }else{
              this.EditJobForm.controls['ValidDate'].setValue(new Date(obj.validDate));
            }
            
            //  this.EditJobForm.controls['ValidDate'].setValue(new Date(validToDate)); // valid date will be day after from current date
        }else{
            this.mintoDate=new Date();           
            let validToDate=this.mintoDate.setDate(this.mintoDate.getDate() + 1);
            // this.EditJobForm.controls['ValidDate'].setValue(new Date(validToDate)); // valid date will be day after from current date
            if(this.isReCreate){
              this.EditJobForm.controls['ValidDate'].setValue('');
            }else{
              this.EditJobForm.controls['ValidDate'].setValue(new Date(obj.validDate));
            }
        }
      })
    } else {
      this.isvalidDate = true;
      this.EditJobForm.controls['ValidDate'].setValue(new Date(obj.validDate));
    }

   


    this.EditJobForm.controls['ojtDuration'].setValue(obj.ojtDuration);
    this.ojt = obj.isOjt ? true : false;
    this.EditJobForm.controls['IsOjt'].setValue(obj.isOjt ? 'true' : 'false');
    this.EditJobForm.controls['Weight'].setValue(obj.weight);
    this.EditJobForm.controls['heightFeet'].setValue(obj.heightFeet);
    this.EditJobForm.controls['heightInch'].setValue(obj.heightInch);
    this.EditJobForm.controls['ShiftTime'].setValue(obj.shiftTime);
    this.EditJobForm.controls['JoiningPriorityId'].setValue(obj.joiningPriorityId);
    this.EditJobForm.controls["IndustryArea"].setValue(obj.industryAreaId);
    this.EditJobForm.controls["FunctionalArea"].setValue(obj.functionalAreaId);
    this.sectortrade = obj.sectorTradeList;
    for (var i = 0; i < this.sectortrade.length; i++) {
      let obj = {
        "id": this.sectortrade[i].id,
        "sectorName": this.sectortrade[i].sectorName,
        "tradeName": this.sectortrade[i].tradeName,
        "sectorId": this.sectortrade[i].sectorId,
        "tradeId": this.sectortrade[i].tradeId,
        "isActive": this.sectortrade[i].isActive
      }
      this.NewSectorShow.push(obj);
    }
  }
  
 
  sectortrade: any = [];
  ojt: boolean = false;

  SetOjt(probcon: any) {
    if (probcon == 1) {
      this.ojt = true;
      this.jobFromvalid = false;
    } else {
      this.ojt = null;
      this.jobFromvalid = true;
      this.EditJobForm.controls['ojtDuration'].setValue("");
    }
  }

  ValidOjt() {
    if (this.EditJobForm.value.ojtDuration == '') {
      this.jobFromvalid = false;
    } else {
      this.jobFromvalid = true;
    }
  }

  ValidProbation() {
    if (this.EditJobForm.value.ProbationDuration == '') {
      this.jobFromvalid = false;
    } else {
      this.jobFromvalid = true;
    }
  }


  getJobOpeningId(data: any) {
    
    this.count = 1;
    this.EditOpeningFormShow = true;
    this.EditJobOpeningForm.controls['jobdetailsid'].setValue(data.jobdetailsid);
    this.EditJobOpeningForm.controls['StateID'].setValue(data.stateID);
    this.GetAllDistrict(data.stateID, "");
    this.EditJobOpeningForm.controls['DistrictID'].setValue(data.districtID);
    this.GetAllCity(data.stateID, "");
    this.EditJobOpeningForm.controls['CityID'].setValue(data.cityId);
    this.EditJobOpeningForm.controls['NoOfVacancy'].setValue(data.noOfVacancy);
    this.LangFormArray = data.languageId;
    this.selectedItems = this.LangFormArray;
    this.EditJobOpeningForm.controls['LanguageId'].setValue(this.LangFormArray);
    this.EditJobOpeningForm.controls['MaxCtc'].setValue(data.maxCtc);
    this.maxCtc = data.maxCtc;
    this.EditJobOpeningForm.controls['MinCtc'].setValue(data.minCtc);
    this.minCtc = data.minCtc;
    this.EditJobOpeningForm.controls['NetSalary'].setValue(data.netSalary);
    this.EditJobOpeningForm.controls['jobId'].setValue(data.jobId);
    
    this.EditJobOpeningForm.controls['ContactName'].setValue(data.contactName);
    this.EditJobOpeningForm.controls['ContactDesignation'].setValue(data.contactDesignation);
    this.EditJobOpeningForm.controls['ContactMobile'].setValue(data.contactMobile);
    this.EditJobOpeningForm.controls['ContactEmail'].setValue(data.contactEmail);
    this.EditJobOpeningForm.controls['ContactLandlineNumber'].setValue(data.contactLandlineNumber);
    this.EditJobOpeningForm.controls['ContactEmailPublic'].setValue(data.isContactSharedPublic);
    this.EditJobOpeningForm.controls['Contactid'].setValue(data.contactid);

  }

  lstGender: any;
  isScrap: any;

  GetGender() {
    this.masterService.GetGender().subscribe(res => {
      this.lstGender = res
    });
  }

  isJobPushed: any;
  isReCreate: any;
  isdateDisable: any;
  isClosed: any;
  isjobowner: any;
  isvalidNot: any;
  mintoDate: any = '';

  ngOnInit() {     

    var data = parseInt(this.route.snapshot.paramMap.get('Redirection'));
    this.viewid = localStorage.getItem('viewid');
    this.isdateDisable = localStorage.getItem('isdateDisable');
    this.isReCreate = localStorage.getItem('isRecreate');
    this.isvalidNot = localStorage.getItem('validNot');
    this.mintoDate = new Date();
    this.mintoDate.setDate(this.mintoDate.getDate() + 1);
    
    if (this.viewid) {
      this.GetJobDetail(this.viewid);
    }
    if (this.isReCreate) {
      this.EditFormShow = true;
      this.isJobPushed = true;
      this.isScrap = true;
      this.isClosed = true;
      this.isjobowner = true;
    }
    if (data) {
      this.IsAgencyJob = false;
      this.getbackData(data);
    }
    window.scroll(0, 0);
    this.dropdownSettings = {
      singleSelection: false,
      idField: 'id',
      textField: 'name',
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      itemsShowLimit: 6,
      allowSearchFilter: true
    };
    this.GetGender();
    this.GetAllStates();
    this.GetAllLanguage();
    this.GetAllJoiningPriority();
    this.GetMinEducation();
    this.GetAllFunctionArea();
    this.GetAllIndustryArea();
    this.editJobFormInit();
    this.editJobOpeningFormInit();
    this.GetAllSector();
    this.getJobTitleList();
    this.SectorForm = this.formBuilder.group({
      SectorID: ['', Validators.nullValidator,],
      TradeID: ['', [Validators.nullValidator,]],
    });
  }

  Sector: any = [];

  GetAllSector() {
    try {
      this.masterService.GetAllMrigsSector().subscribe(res => {
        this.DBResponce = res;
        if (this.DBResponce.lstSector != null) {
          this.Sector = this.DBResponce.lstSector;
        }
        else {
          this.Sector = [];
        }
      });
    } catch  { }
  }

  Trade: any = [];
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

  ValidateExperience(expfrom, expto) {
    let experiencefrom = expfrom;
    let experienceto = expto;
    if (parseInt(experiencefrom) > parseInt(experienceto)) {
      this.jobFromvalid = false;
      this.ExpMsg = false;
    } else {
      this.jobFromvalid = true;
      this.ExpMsg = true;
    }
  }

  ValidateAge(Max, Min) {
    let max = Max;
    let min = Min;
    if (parseInt(max) > parseInt(min)) {
      this.AgeMsg = false;
      this.jobFromvalid = false;
    } else {
      this.jobFromvalid = true;
      this.AgeMsg = true;
    }
  }

  ValidateCtc(minctc, maxctc) {
    let Minctc = minctc;
    let Maxctc = maxctc;
    if (parseInt(Minctc) > parseInt(Maxctc)) {
      this.openingformValid = false;
      this.CtcMsg = false;
    } else {
      this.openingformValid = true;
      this.CtcMsg = true;
    }
  }

  mandatorySign: boolean = true;
  onChangeJobType(jobType: any) {
    if (jobType != "Freelancer") {
      this.mandatorySign = true;
    }
    else {
      this.mandatorySign = false;
    }
  }
  stateRes: any

  private GetAllStates() {
    try {
      this.masterService.GetAllStates().subscribe(res => {
        this.stateRes = res
        this.EditJobOpeningForm.controls.DistrictID.setValue('');
        if (this.stateRes != null && this.stateRes.length > 0) {
          this.lstState = this.stateRes;
        }
      });
    } catch  { }
  }

  private GetAllLanguage() {
    try {

      this.masterService.GetAllLanguage().subscribe(res => {
        var result = res;
        if (result != null) {
          this.lstAllLanguage = result;
        }
      });
    } catch  { }


  }

  private GetAllJoiningPriority() {
    try {
      this.masterService.GetJoiningPrority().subscribe(res => {
        var result = res;
        if (result != null) {
          this.joiningprioritys = result
        }

      });
    } catch  { }
  }

  private GetMinEducation() {
    try {
      this.masterService.GetAllMinEducation().subscribe(res => {
        var result = res;
        if (result != null) {
          this.mineducations = result;
        }
      });
    } catch  { }
  }

  onChangeState(stateId: any) {
    this.EditJobOpeningForm.controls['DistrictID'].setValue('');
    this.GetAllDistrict(stateId, "profile");
    this.GetAllCity(stateId, "profile");
  }
  result: any

  
  private GetAllDistrict(stateId: any, From: string) {
    try {
      if(stateId!=null && stateId!='')
      {
        this.masterService.GetAllDistrict(stateId).subscribe(res => {
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

 
  GetAllCity(stateId:any, From: string){
    try {
      if(stateId!=null && stateId!='')
      {
        this.masterService.GetAllCity(stateId).subscribe(res => {
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

  sectorTrade: any = [];
  sectorstatus: boolean = true;
  jobType:any;
  GetJobDetail(id: any) {    
    
    this.spinnerService.show()    
    this.jobpostService.AgencyGetAllJobs(id, this.PageNumber).subscribe(res => {
      this.spinnerService.hide();      
      this.response = res;
      if (this.response.lstAgencyCandidateinfo[0] != null) {
        this.jobs = this.response.lstAgencyCandidateinfo[0];
        this.jobType=this.jobs.shiftTime;
        console.log(this.jobs.shiftTime)
        var sectorTrade = this.jobs.sectorTradeList;
        if (sectorTrade.length) {
          this.sectorstatus = true;
          this.sectorTrade = this.jobs.sectorTradeList;
        }
        else {
          this.sectorstatus = false;
        }
        if (this.isvalidNot) {
          this.isJobPushed = false
          this.isScrap = false
          this.isClosed = false;
        } else {
          if (this.jobs.isJobPushed == false && this.jobs.isScrap == false && this.jobs.isClosed == false) {
            this.isJobPushed = true
            this.isScrap = true
            this.isClosed = true;
          } else if (this.jobs.isJobPushed == true && this.jobs.isScrap == false && this.jobs.isClosed == false) {
            this.isJobPushed = false
            this.isScrap = true
            this.isClosed = true;
          } else if (this.jobs.isJobPushed == false && this.jobs.isScrap == true && this.jobs.isClosed == false) {
            this.isJobPushed = false
            this.isScrap = true
            this.isClosed = false;
          } else if (this.jobs.isJobPushed == true && this.jobs.isScrap == false && this.jobs.isClosed == true) {
            this.isJobPushed = false
            this.isScrap = true
            this.isClosed = false;
          }
        }
        if (this.isReCreate) {
          
       //   this.isChecked=false;
          this.GetEditJob(this.jobs);
        }
        this.jobpostService.GetJobOpeningDetail(this.viewid).subscribe(res => {
          this.response = res
          this.spinnerService.hide();
          this.response = this.response.lstJobRequest;
          if (this.response != null) {
            this.jobopeningdetail = this.response;
          }
        });
      }
    });
  }

  jobdetail: any = {};
  Updatejob() {


    
    if (this.EditJobForm.value.ISprobationtime == 'true') {
      if (this.EditJobForm.value.ProbationDuration <= 0) {
        this.toastrService.error('Please enter probation duration');
        return false;
      }
    }

    if (this.EditJobForm.value.IsOjt == 'true') {
      if (this.EditJobForm.value.ojtDuration <= 0) {
        this.toastrService.error('Please enter OJT duration');
        return false;
      }
    }

    // if (this.maxAge > 0 || this.minAge >= 15) {
    //   this.statusAge = true;
    // }
    // if (this.statusAge == false || (this.maxAge > 0 && this.minAge == 0)) {
    //   this.toastrService.error("Please select minimum age 15.");
    //   return false;
    // }
    var CurrentDate = new Date();

    if (this.EditJobForm.value.ValidDate <= CurrentDate) {
      this.toastrService.error('Valid to date is must be greater than the current date');

      window.scroll(0, 0);
      return false;
    }

    if(this.minAge > 0 || this.maxAge > 0){
      if(this.minAge < 15){
        this.toastrService.error('Please select minimum age 15.');
        window.scroll(0,0);
        return false;
      } 
}
    
    if (this.isChecked && this.editQuestionList < 1 && this.finalSubmitQuestion.length < 1 && this.isScreening =='') {
      this.isChecked = false;
      this.toastrService.error("please add atleast one screening question.");
      window.scroll(0, 0);
      return false;
    }
    if (this.count == 1) {
      this.jobdetail.JobId = this.viewid;
      this.jobdetail.PostedBy = this.UserInfo.loginType;
      this.jobdetail.JobTitle = this.EditJobForm.value.JobTitle;
      this.jobdetail.CompanyName = this.EditJobForm.value.CompanyName;
      this.jobdetail.Name = this.EditJobForm.value.Name;
      this.jobdetail.Designation = this.EditJobForm.value.Designation;
      this.jobdetail.JobDescription = this.EditJobForm.value.JobDescription;
      this.jobdetail.specialization = this.EditJobForm.value.Specialization;
      this.jobdetail.Mobile = this.EditJobForm.value.Mobile;
      this.jobdetail.Email = this.EditJobForm.value.Email;
      this.jobdetail.EmailPublic = this.EditJobForm.value.EmailPublic;
      this.jobdetail.RolesresPonsiblty = this.EditJobForm.value.RolesresPonsiblty;
      this.jobdetail.Keyword = this.EditJobForm.value.Keyword;
      this.jobdetail.LandlineNumber = this.EditJobForm.value.LandlineNumber;
      this.jobdetail.MinExp = this.minExp;
      this.jobdetail.MaxExp = this.maxExp;
      this.jobdetail.AgeMin = this.minAge;
      this.jobdetail.AgeMax = this.maxAge;
      this.jobdetail.OtherDetail = this.EditJobForm.value.OtherDetail;
      this.jobdetail.Male = this.EditJobForm.value.Male == true ? 1 : this.EditJobForm.value.Male == '1' ? 1 : 0;
      this.jobdetail.Female = this.EditJobForm.value.Female == true ? 2 : this.EditJobForm.value.Female == '2' ? 2 : 0;
      this.jobdetail.Transgender = this.EditJobForm.value.Transgender == true ? 3 : this.EditJobForm.value.Transgender == '3' ? 3 : 0;
      this.jobdetail.ProbationDuration = parseInt(this.EditJobForm.value.ProbationDuration);
      this.jobdetail.MinEducation = this.EditJobForm.value.MinEducation;
      this.jobdetail.ValidDate = this.EditJobForm.value.ValidDate;
      this.jobdetail.ISprobationtime = this.EditJobForm.value.ISprobationtime;
      this.jobdetail.ojtDuration = parseInt(this.EditJobForm.value.ojtDuration);
      this.jobdetail.IsOjt = this.EditJobForm.value.IsOjt;
      this.jobdetail.Weight = this.EditJobForm.value.Weight == '' ? '0' : this.EditJobForm.value.Weight;
      this.jobdetail.heightFeet = this.EditJobForm.value.heightFeet == '' ? '0' : this.EditJobForm.value.heightFeet;
      this.jobdetail.heightInch = this.EditJobForm.value.heightInch == '' ? '0' : this.EditJobForm.value.heightInch;
      this.jobdetail.ShiftTime = this.EditJobForm.value.ShiftTime;
      this.jobdetail.JoiningPriorityId = this.EditJobForm.value.JoiningPriorityId;
      this.jobdetail.FunctionalArea = this.EditJobForm.value.FunctionalArea;
      this.jobdetail.IndustryArea = this.EditJobForm.value.IndustryArea;
      this.jobdetail.sectorTradeList = this.NewSectorShow;
      if (this.isChecked) {
        this.jobdetail.Isscreening = true;
      } else {
        this.jobdetail.Isscreening = false;
      }
      this.NewSectorShow = [];
      this.NewSectorData = [];
      this.isvalidDate = true;
      this.isdateDisable=false;
      localStorage.removeItem('isdateDisable'); 
      this.spinnerService.show(); 
           
      this.jobpostService.UpdateJob(this.jobdetail).subscribe(res => {
      this.DbResponcse = res;
        if (this.DbResponcse.responseResult) {
          this.spinnerService.hide();
          this.EditFormShow = false;
          localStorage.removeItem('isRecreate');
          this.isReCreate = '';
          this.toastrService.success(this.DbResponcse.message);
          this.GetJobDetail(this.DbResponcse.id);
        } else {
          this.toastrService.error(this.DbResponcse.message);
        }
        this.GetJobDetail(this.DbResponcse.id);
      });
    }
    this.count++;
  }


  jopostingdata: any = {};
  UpdateJobOpeningDetails(data: any) {
    if (this.jobType != "Freelancer") {
      if (this.minCtc == 0 && this.maxCtc == 0) {
        this.toastrService.error("Add CTC min and max option");
        return false;
      }
    }

    if(this.EditJobOpeningForm.value.NetSalary>this.maxCtc){
      this.toastrService.error("In hand salary should not be greater than ctc");
      return false;
    }

    if (this.maxCtc > 0 || this.minCtc >= 5000) {
      this.status = true;
    }

    if (this.status == false || (this.maxCtc > 0 && this.minCtc == 0)) {
      this.toastrService.error("Please select minimum CTC 5000.");
      return false;
    }
    if (this.count == 1) {
     
      if (this.ValidatePubilcReg()) {
        this.JobFormDesable = false;
        this.jopostingdata.jobdetailsid = this.EditJobOpeningForm.value.jobdetailsid == null ? 0 : this.EditJobOpeningForm.value.jobdetailsid;
        this.jopostingdata.StateID = this.EditJobOpeningForm.value.StateID;
        this.GetAllDistrict(this.EditJobOpeningForm.value.StateID, "");
        this.jopostingdata.DistrictID = this.EditJobOpeningForm.value.DistrictID ? this.EditJobOpeningForm.value.DistrictID : 0;
        this.GetAllCity(this.EditJobOpeningForm.value.StateID, "");
        this.jopostingdata.CityID = this.EditJobOpeningForm.value.CityID ? this.EditJobOpeningForm.value.CityID : 0;
        this.jopostingdata.NoOfVacancy = this.EditJobOpeningForm.value.NoOfVacancy;
        this.jopostingdata.LanguageId = this.EditJobOpeningForm.value.LanguageId;
        this.jopostingdata.MaxCtc = this.maxCtc;
        this.jopostingdata.MinCtc = this.minCtc;

        this.jopostingdata.Latitude = '';
        this.jopostingdata.Longtitute = '';
        this.jopostingdata.Locationmapaddress = '';

        this.jopostingdata.NetSalary = this.EditJobOpeningForm.value.NetSalary!=null?this.EditJobOpeningForm.value.NetSalary:'';
        this.jopostingdata.ContactName = this.EditJobOpeningForm.value.ContactName!=null?this.EditJobOpeningForm.value.ContactName:'';
        this.jopostingdata.ContactDesignation = this.EditJobOpeningForm.value.ContactDesignation!=null?this.EditJobOpeningForm.value.ContactDesignation:'';
        this.jopostingdata.ContactMobile = this.EditJobOpeningForm.value.ContactMobile!=null?this.EditJobOpeningForm.value.ContactMobile:'';
        this.jopostingdata.ContactLandlineNumber = this.EditJobOpeningForm.value.ContactLandlineNumber!=null?this.EditJobOpeningForm.value.ContactLandlineNumber:'';
        this.jopostingdata.ContactEmail = this.EditJobOpeningForm.value.ContactEmail!=null?this.EditJobOpeningForm.value.ContactEmail:'';
        this.jopostingdata.isContactSharedPublic = this.EditJobOpeningForm.value.ContactEmailPublic ? this.EditJobOpeningForm.value.ContactEmailPublic:false;
        this.jopostingdata.Contactid=this.EditJobOpeningForm.value.Contactid?this.EditJobOpeningForm.value.Contactid:0;
        this.jopostingdata.jobId = this.EditJobOpeningForm.value.jobId == null ? this.viewid : this.EditJobOpeningForm.value.jobId;
        this.spinnerService.show();
        this.jobpostService.SetJobOpening(this.jopostingdata, this.EditJobOpeningForm.value.jobId).subscribe(res => {
          this.spinnerService.hide();
          this.DbResponcse = res;
          this.EditOpeningFormShow = false;          
          if (this.DbResponcse.responseResult) {
            this.toastrService.success(this.DbResponcse.message);
            this.GetJobDetail(this.viewid);
          } else {
            this.toastrService.error(this.DbResponcse.message);
          }
        });
        this.EditJobOpeningForm.reset();
      }
      this.JobFormDesable = true;
    }
    this.count++;
  }

  companyprofile: any = '';
  comapnyimage: any = '';
  companresponsedb: any = [];
  scrapJobs: any
  closeJobs: any;
  DbResponce: any;
  revoke: any;

  RevokeJob(item: any, revo: any) {
    this.spinnerService.show();
    this.jobpostService.RevokeJob(item.jobId).subscribe(res => {
      this.DbResponce = res
      this.spinnerService.hide();
      if (this.DbResponce.responseResult) {
        this.toastrService.success(this.DbResponce.message);
        this.GetJobDetail(item.jobId);
      }
      else {
        this.toastrService.error(this.DbResponce.message);
      }
    });
  }


  // job post ,scrap and close

  performJobAction(job: any, item: any) {

    this.viewid = job.jobId;
    this.spinnerService.show();
    if (item == 'postjob') {
      this.modalRef.hide();
      if (this.jobopeningdetail.length != 0) {
        this.commonMethodService.post(this.viewid, 'job');   // for post job
      } else {
        this.toastrService.error("please atleast one opening");
        this.spinnerService.hide();
      }

    } else if (item == 'scrapjob') {
      this.modalRef.hide();
      this.commonMethodService.scrap(this.viewid, 'job');   // for scrap job
    } else if (item == 'closeJob') {
      this.modalRef.hide();
      this.commonMethodService.close(this.viewid, 'job'); // for close job
    }
  }

  AlertBox(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template, { class: 'modal-sm' });
  }

  jobListRedirection() {
    localStorage.removeItem('validNot');
    this.router.navigate(['/JobList', { Redirection: btoa('1'), Showpushdata: btoa('true') }]);
  }

  ListRedirection() {
    localStorage.removeItem('validNot');
    this.router.navigate(['/AgencyJobList', { Redirection: btoa('1') }]);
  }


  ExitJobDetails() {
    this.NewSectorShow = [];
    this.EditFormShow = false;
    if (!this.isScreening) {
      this.isChecked = false;
    }
    this.isvalidDate = true;
    this.isdateDisable=false;
    localStorage.removeItem('isdateDisable');
  }

  ExitJobOpening() {
    this.EditOpeningFormShow = false;
    this.EditFormShow = false;
  }

  DeletOpeningJob(item) {
    this.maxCtc = 0;
    try {
      this.jobpostService.DeletOpeningJob(item.jobdetailsid).subscribe(res => {
        this.modalRef.hide();
        this.DBResponce = res
        if (this.DBResponce.responseResult) {
          this.toastrService.success(this.DBResponce.message);
          this.GetJobDetail(this.viewid);

        } else {
          this.toastrService.error(this.DBResponce.message);
        }

      });
    } catch  { }
  }

  Showform() {
    this.count = 1;
    this.EditOpeningFormShow = true;
    this.EditJobOpeningForm.controls['jobdetailsid'].setValue(0);
    this.EditJobOpeningForm.controls['jobId'].setValue(this.viewid);
    this.EditJobOpeningForm.controls['StateID'].setValue('');
    this.EditJobOpeningForm.controls['DistrictID'].setValue('');
    this.EditJobOpeningForm.controls['NoOfVacancy'].setValue('');
    this.EditJobOpeningForm.controls['LanguageId'].setValue('');
    this.EditJobOpeningForm.controls['MaxCtc'].setValue('');
    this.EditJobOpeningForm.controls['MinCtc'].setValue('');
    this.maxCtc = 0;
    this.minCtc = 0;

  }

  private ValidatePubilcReg() {
    var IsValid = true;
    var errorMsg = "";
    var regEmail = /^([\w-\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([\w-]+\.)+))([a-zA-Z]{2,4}|[0-9]{1,3})(\]?)$/;
    if (IsValid) {

      if (this.EditJobOpeningForm.value.StateID == "") {
        errorMsg += "Please Select State. <br/>";
        IsValid = false;
        this.count=0;
      }

      if (this.EditJobOpeningForm.value.NoOfVacancy == "" || parseInt(this.EditJobOpeningForm.value.NoOfVacancy) < 1) {
        errorMsg += "Please Enter Valid no of vacancy . <br/>";
        IsValid = false;
        this.count=0;
      }
    }
    if (!IsValid)
      this.toastrService.error(errorMsg, null, { enableHtml: true });
    return IsValid;
  }

  onClickMe() {
    if (this.minAge < 14) {
      this.toastrService.error("Please select minimum age 15.");
      this.statusAge = false;
    } else {
      this.statusAge = true;
    }
  }

  ctcClick() {
    if (this.minCtc < 4999) {
      this.toastrService.error("Please select minimum ctc 5000.");
      this.status = false;
    } else {
      this.status = true;
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

  getbackData(Redirection: any) {
    this.Redirection = '1';
  }

  decimals(e) {
    if (e.keyCode === 190 || e.keyCode == 110) {
      return false;
    }
    if (e.keyCode === 189) {
      return false;
    }

  }

  // job form control

  editJobFormInit() {
    this.EditJobForm = this.formBuilder.group({
      JobTitle: ['', [Validators.required, Validators.compose([CustomValidators.removeSpaces])]],
      CompanyName: ['', [Validators.required, Validators.compose([CustomValidators.removeSpaces])]],
      Specialization: ['', [Validators.nullValidator, Validators.compose([CustomValidators.removeSpaces])]],
      ShiftTime: ['', [Validators.nullValidator,]],
      ojtDuration: ['', [Validators.nullValidator,]],
      IsOjt: ['', [Validators.nullValidator,]],
      Weight: ['', [Validators.nullValidator,]],
      heightFeet: ['', [Validators.nullValidator,]],
      heightInch: ['', [Validators.nullValidator,]],
      JoiningPriorityId: ['', [Validators.required,]],
      Name: ['', [Validators.required, Validators.compose([CustomValidators.removeSpaces])]],
      Designation: ['', [Validators.required, Validators.compose([CustomValidators.removeSpaces])]],
      JobDescription: ['', [Validators.required, ,Validators.compose([CustomValidators.removeSpaces])]],
      Mobile: ['', [Validators.required, Validators.compose([CustomValidators.validMobile])]],
      Email: ['', [Validators.required, Validators.compose([CustomValidators.vaildEmail])]],
      EmailPublic: ['', [Validators.required,]],
      RolesresPonsiblty: ['', [Validators.required, ,Validators.compose([CustomValidators.removeSpaces])]],
      Keyword: ['', [Validators.nullValidator, ,Validators.compose([CustomValidators.removeSpaces])]],
      LandlineNumber: ['', [Validators.nullValidator,]],
      MinExp: ['', [Validators.required,]],
      MaxExp: ['', [Validators.required,]],
      AgeMin: ['', [Validators.nullValidator,]],
      AgeMax: ['', [Validators.nullValidator,]],
      OtherDetail: ['', [Validators.nullValidator, Validators.compose([CustomValidators.removeSpaces])]],
      ISprobationtime: ['', [Validators.nullValidator,]],
      Male: ['', [Validators.nullValidator,]],
      Female: ['', [Validators.nullValidator,]],
      isScreeming: ['', [Validators.nullValidator,]],
      Transgender: ['', [Validators.nullValidator,]],
      ProbationDuration: ['', [Validators.nullValidator,]],
      MinEducation: ['', [Validators.required,]],
      ValidDate: ['', [Validators.required,]],
      jobId: ['', [Validators.required,]],
      IndustryArea: ['', [Validators.required]],
      FunctionalArea: ['', [Validators.required]],
      screening: ['', [Validators.nullValidator,]],
      question: ['', [Validators.compose([CustomValidators.removeSpaces])]],
    });
  }

  //job opening Form control

  editJobOpeningFormInit() {
    this.EditJobOpeningForm = this.formBuilder.group({
      jobdetailsid: ['', [Validators.nullValidator,]],
      jobId: ['', [Validators.nullValidator,]],
      StateID: ['', [Validators.required,]],
      DistrictID: ['', [Validators.nullValidator,]],
      CityID: ['', [Validators.nullValidator,]],
      NoOfVacancy: ['', [Validators.required, Validators.compose([CustomValidators.removeSpaces])]],
      NetSalary: ['', [Validators.nullValidator,]],
      LanguageId: ['', [Validators.nullValidator,]],
      MaxCtc: ['', [Validators.required,]],
      MinCtc: ['', [Validators.required,]],

       // for contact in job opening

       ContactName: ['', [ , Validators.compose([CustomValidators.removeSpaces])]],
       ContactDesignation: ['', [ Validators.compose([CustomValidators.removeSpaces])]],
       ContactMobile: ['', [Validators.compose([CustomValidators.validMobile])]],
       ContactEmail: ['', [Validators.compose([CustomValidators.vaildEmail])]],
       ContactEmailPublic: ['false', [Validators.nullValidator,]],
       ContactLandlineNumber: ['', [Validators.nullValidator,]],
       Contactid:['']
    });
  }

  scrapTemplate(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template, { class: 'modal-sm' });
  }

  closeTemplate(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template, { class: 'modal-sm' });
  }
  declineBox(): void {
    this.modalRef.hide();
  }



  DbResponces: any;

  ////////////////  sector section //////////

  NewSectorShow: any = [];
  NewSectorData: any = [];
  NewSecterTempData: any = [];

  AddSectorValue() {
    if (this.SectorForm.value.SectorID == '') {
      this.toastrService.error('Please Select Training Sector');
      return false;
    }
    if (this.SectorForm.value.TradeID == '') {
      this.toastrService.error('Please Select Training Trade');
      return false;
    }

    let sectorid = this.SectorForm.value.SectorID;
    let tradeid = this.SectorForm.value.TradeID;

    let sectorname = (this.Sector).filter(function (entry) {
      return entry.id == sectorid;
    });

    let tradename = (this.Trade).filter(function (entry) {
      return entry.id == tradeid;
    });

    var hasMatch = false;
    for (var index = 0; index < this.NewSectorShow.length; ++index) {
      var sector = this.NewSectorShow[index];
      if ((sector.sectorId == sectorname[0].id) && (sector.tradeId == tradename[0].id)) {
        hasMatch = true;
        break;
      }
    }

    if (!hasMatch) {
      this.NewSectorShow.push(
        {
          id: 0,
          sectorId: this.SectorForm.value.SectorID,
          sectorName: sectorname[0].name,
          tradeId: this.SectorForm.value.TradeID,
          tradeName: tradename[0].name,
          isActive: 1,
        }
      );

    } else {
      this.toastrService.error('Training sector and trade are already exist');
      return false;
    }
    this.NewSecterTempData.push({
      "SectorID": this.SectorForm.value.SectorID,
      "TradeID": this.SectorForm.value.TradeID,
    });

    this.NewSecterTempData = [];
    this.SectorForm.controls['SectorID'].setValue("");
    this.SectorForm.controls['TradeID'].setValue("");
  }
  modalRefSector: BsModalRef;
  modalRefDelSector: BsModalRef;

  deleteSector(index: number) {
    if (this.NewSectorShow[index].id > 0) {
      this.DeletSector(this.viewid, this.NewSectorShow[index].id, this.NewSectorShow[index].sectorId, this.NewSectorShow[index].tradeId);
    }
    this.NewSectorShow.splice(index, 1);
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

  DeletSector(JobId: any, TblID: any, secID: any, TradID) {
    this.spinnerService.show();
    this.jobpostService.DeleteSectorjobpost(JobId, TblID, secID, TradID).subscribe(res => {
      this.DbResponces = res;
      this.spinnerService.hide();
      if (this.DbResponces != null) {
        this.toastrService.success(this.DbResponces.message);
        this.modalRefDelSector.hide();
        this.GetJobDetail(this.viewid);
      }
      else {
        this.toastrService.error(this.DbResponces.message);
      }
    }
    );
  }
  ////////////////  End Sector Section //////////////

  ////////////////  Edit screening question section /////////////

  showquestion: boolean = false;
  createQuest: boolean = false;
  questionList: any = [];
  selectedQuestion: any = [];
  isChecked: boolean = false;
  jobTitleCode: any = [];
  showJobDetail: boolean = false;
  jobDetails: any;
  finalSubmitQuestion: any = [];
  jobids: any;
  checkedQ: boolean = false;
  addedQuestion: any = [];
  addedquestStatus: boolean = false;
  item: any;
  isScreening: any;


  createQuestion(templateSector: TemplateRef<any>, item: any) {
    
    this.item = item;
    if (this.item == 'view') {
      this.questionList = [];
      this.selectedQuestion = [];
      this.modalRefSector = this.modalService.show(templateSector, { class: 'modal-md ',backdrop: 'static', keyboard: false });
      this.viewQuestion();
    } else {
      this.isChecked = true;
      if (this.isChecked && !this.isViewButtonshow) {
        this.viewQuestion();
        this.modalRefSector = this.modalService.show(templateSector, { class: 'modal-md ',backdrop: 'static', keyboard: false });
      } else {
        this.declinequestion();
      }
    }

  }

  // get job title and job code based on user id
  // getJobTitleList(){
  //  this.jobpostService.getJobTitleList().subscribe(res=>{
  //    if(res){     
  //      this.jobTitleCode=res;
  //    }
  //  })
  // }

  // get job title and job code based on user id
  getJobTitleList() {
    this.screeningService.getGrouponlyHaveQuestionlist().subscribe(res => {
      if (res) {
        this.jobTitleCode = res;
      }
    })
  }


  // get job detail based on job id

  // getJobDetails(jobid:any){    
  //   this.jobids=jobid;
  //   this.jobpostService.getJobDetails(jobid).subscribe(res=>{
  //     if(res[0]!=null){
  //       this.questionList=[];
  //       this.showJobDetail=true;
  //       this.showquestion=false;
  //       this.createQuest=false;     
  //       this.jobDetails=res[0];
  //      }
  //   })
  // }

  results: any;
  groupId: any
  getJobDetails(event: any) {

    let groupId = event.target.value;
    let groupName = this.jobTitleCode.filter(function (entry) {
      return entry.groupid == groupId;
    });
    this.groupId = groupId;
    this.screeningService.GetActivequestionlist(this.groupId).subscribe(res => {
      this.results = res;

      if (this.results) {
        this.showquestion = true;
        this.questionList = res;
      }

    })
  }


  // get previous question list based on job id

  getPreviousQuestion(jobid: any) {
    this.spinnerService.show();
    this.jobpostService.getPreviousQuestionList(jobid).subscribe(res => {
      this.spinnerService.hide();
      if (res) {
        this.showquestion = true;
        this.questionList = res;
      }
    })
  }

  // add own question
  oldQuestion: boolean = false;

  addQuestion(){     
     
    this.finalSubmitQuestion=[];
    if(this.EditJobForm.value.question){
        this.createQuest=false;
        this.addedquestStatus=true;
        this.checkedQ=true;      
        let question = this.EditJobForm.value.question; 
        if(this.questionId){
          var questId= this.questionId
         }     
                if(this.index!=='' && this.editType=='old' ){
                  this.questionList[this.index].questions = question;
                  $("#" +"screening"+ this.index ).prop('checked', false); 
                }else if((this.index!=='' && this.editType=='new' )){
                  this.addedQuestion[this.index] = question;
                }else if((this.index!=='' && this.editType=='editOld' )){
                  this.editQuestionList[this.index] = { id: this.questionId, jobid: this.viewid, companyid: this.companyid, jobtitle: null, posteddate: null,
                    questions: question};
                    this.selectedQuestion.push({"questionid":questId?questId:0,"Quesons":question,"isActive":true}) 
                }
                else{
                  this.addedQuestion.push(question);
              //    console.log("this.addedQuestion = = "+this.addedQuestion);
                }
                this.EditJobForm.controls['question'].setValue('');
                this.index='';              
                
                this.showEditForm = false;

                
                this.questionId=0;
                this.companyid=0            
    }else{
      this.toastrService.error('please add question');
    }
  }
  

  // select question form previous posted job 
  isactive: boolean = true;
  selectQuestion(e, item, type, i) {
    if (e.target.checked) {
        if(this.editQuestionList.length){  
          this.questionId = '';
          if (type == 'edit' || type == 'old') {
             var question = item.questions;       
             this.companyid = item.companyid
           } else if (type == "new") {
              var question = item;
         }
         this.isactive = true;    
          var newArrObj = this.editQuestionList.filter(function(obj) {        
            return  obj.groupquestionid == item.groupquestionid;
          })    

          if(newArrObj.length){        
            if(newArrObj[0].groupquestionid==item.groupquestionid && newArrObj[0].questions == item.questions){
              this.toastrService.error('Question is already added');         
              $("#" +"screening"+ i ).prop('checked', false); 
              return false;
            }else{
              this.selectedQuestion.push({ "groupid": item.groupid, "ismandatory": item.mandotary, "questionid": item.questionid, "groupquestionid": item.groupquestionid,"Expectanswer": item.expectanswer, "Quesons": question,"Preference": item.preference, "isActive": item.isactive });
            }
         }else{        
          this.selectedQuestion.push({ "groupid": item.groupid, "ismandatory": item.mandotary, "questionid": item.questionid, "groupquestionid": item.groupquestionid,"Expectanswer": item.expectanswer, "Quesons": question,"Preference": item.preference, "isActive": item.isactive });
         }
        }else{
          this.questionId = '';
          if (type == 'edit' || type == 'old') {
             var question = item.questions;       
             this.companyid = item.companyid
           } else if (type == "new") {
              var question = item;
         }
         this.isactive = true;
         this.selectedQuestion.push({ "groupid": item.groupid, "ismandatory": item.mandotary, "questionid": item.questionid, "groupquestionid": item.groupquestionid,"Expectanswer": item.expectanswer, "Quesons": question,"Preference": item.preference, "isActive": item.isactive });
      }
     } else {
      if (type == 'edit') {
        var question = item.questions;
        this.questionId = item.id;
        this.companyid = item.companyid;
        this.isactive = false;
        var index = this.editQuestionList.findIndex(function (o, index) {
          return index === i;
        })
        if (index !== -1) {
          this.selectedQuestion.push({ "groupid": item.groupid, "ismandatory": item.mandotary, "groupquestionid": item.groupquestionid, "questionid": item.questionid,"Expectanswer": item.expectanswer, "Quesons": question,"Preference": item.preference, "isActive": this.isactive });
        }
      } else {
        var index = this.selectedQuestion.findIndex(function (o, index) {
          return index === i;
        })
        if (index !== -1) {
          this.selectedQuestion.splice(index, 1);
        }
      }
    }
  }

  index: any = '';
  editType: any;
  questionId: any;
  companyid: any;
  // edit questionsaveQuestion
  showEditForm: any;
  editItem: any;
  editQuestion(i, item: any, data: any) {

    if (data == 'new') {
      var question = item;
    } else {
      this.editItem = item;
      this.showEditForm = true;
      if (item.questions) {
        var question = item.questions;
      } else {
        var question = item;
      }

      this.questionId = item.questionid;
      this.companyid = item.companyid
    }
    this.editType = data;
    this.index = i;
    this.EditJobForm.controls['question'].setValue(question);
  }

  //close button function

  declinequestion() {
    this.EditJobForm.controls['screening'].setValue('');
    this.showJobDetail = false;
    this.showquestion = false;
    this.createQuest = false;
    this.addedquestStatus = false;
    this.addedQuestion = [];
    this.questionList = [];
    this.selectedQuestion = [];
    this.finalSubmitQuestion = [];
    this.modalRefSector.hide();
    if (this.item != 'view') {
      if (!this.isclosestatus) {
        this.isChecked = false;
      }

    } else {
      // this.isChecked=false;
    }
  }

  //submit question after select and create question.
  isSubmit: boolean = false;
  submitQuestion() {
    this.finalSubmitQuestion = [];
    this.isSubmit = true;
    if (this.selectedQuestion.length > 0) {
      this.EditJobForm.controls['question'].setValue('');
      this.finalSubmitQuestion = this.selectedQuestion;
      this.selectedQuestion = [];
      this.addedQuestion = [];
      this.modalRefSector.hide();
      this.saveQuestion(this.viewid);
    } else if (this.editQuestionList.length > 0) {
      this.modalRefSector.hide();
      this.saveQuestion(this.viewid);
    } else {
      this.toastrService.error('please add question');
    }
  }

  // save question after job created successfully

  saveQuestion(jobId: any) {
    let postData = {
      "jobid": jobId,
      "Quesons": this.finalSubmitQuestion,
    }
    this.jobpostService.saveQuestion(postData).subscribe(res => {
      if (res) {
        this.editQuestionList = [];
        this.isChecked = true;
        this.toastrService.success('question saved successfully');
        this.viewQuestion();
      }
    })
  }

  editQuestionList: any = [];
  isclosestatus: boolean = false;
  showEditQuestion: boolean = false;
  viewQuestion() {

    var jobId = this.viewid;
    this.spinnerService.show();
    this.jobpostService.getPreviousQuestionList(jobId).subscribe(res => {
      this.spinnerService.hide();
      if (res) {
        let response = res;
        this.showEditQuestion = true;
        this.checkedQ = true;
        this.editQuestionList = response;

        this.finalSubmitQuestion = this.editQuestionList;
        if (this.editQuestionList.length > 0 && this.isSubmit) {
          this.isViewButtonshow = true;
        } else {
          this.isChecked = true;
          if (this.isChecked && this.editQuestionList.length) {
            this.isclosestatus = true;
            this.isViewButtonshow = true;
          }else if(this.isScreening){
            this.isViewButtonshow = true;
          }else {
            this.isViewButtonshow = false;
           
          }
        }
        //this.selectedQuestion=res;     
      } else {
      }
    })
  }



  //////////////////////////End screening question section///////////////////////
  screenList: any = [];
  modalRefScrenning: BsModalRef;
  displayQuestionList(templateScrenning: TemplateRef<any>) {  
    var jobId = this.viewid;
    this.spinnerService.show();
    this.jobpostService.getPreviousQuestionList(jobId).subscribe(res => {   
      this.spinnerService.hide();    
      if (res) {
        this.modalRefScrenning = this.modalService.show(templateScrenning, { class: 'modal-md ' });
        this.screenList = res;
      }else{
        this.toastrService.error('server error');
      }
    });
  }
  closeQuestionList() {
    this.screenList = [];
    this.modalRefScrenning.hide();
  }

  isNotScreeming() {
    this.isChecked = false;
    this.isViewButtonshow=false;
  }
}

