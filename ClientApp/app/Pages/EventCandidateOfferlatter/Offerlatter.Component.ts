import { Component, OnInit, ViewChild, TemplateRef, AfterViewInit, Input, NgZone, ɵConsole,HostListener } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { MasterService } from '../../Services/master.service';
import { JobpostService } from '../../Services/jobpost.service';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
import { ToastContainerDirective, ToastrService } from 'ngx-toastr';
import { AppConfig } from '../../Globals/app.config';
import { UserInfoService } from '../../Services/userInfo.service.';
import { Location } from '@angular/common';
import { BsModalRef, BsModalService } from 'ngx-bootstrap';
import *as moment from 'moment';
import { CustomValidators } from '../../Validators/custom-validator.directive';
import { EventService } from '../../Services/Event.service';
import {AppConstants} from '../../GlobalError/app-constants'
import { ItemsControl } from 'ngx-carousel/src/ngx-carousel/ngx-carousel.interface';

@Component({
  selector: 'app-OfferlatterComponent',
  templateUrl: './Offerlatter.Component.html',
})
export class OfferlatterComponent implements OnInit {
  @ViewChild(ToastContainerDirective) toastContainer: ToastContainerDirective;
  @ViewChild('JobForms') JobForms: HTMLFormElement;
  

  id: any;
  AdminId: any;
  Show: any = 0;
  ListOfEvent: any = 1;
  Eventform:FormGroup;
  imagename:string='';
  states:any=[];
  district: any;
  pageNumber:number=0;
  ShowRegisterEvent:boolean=false;
  GoEventlist:boolean= false;
  backToEventDetails:boolean= true;
  contactEmailValue:any;
  contactMobileValue:any;
  contactDesignation:any;
  contactName:any;
  contactLandlineNumber:any;
  contactEmailPublic:any
  contactDetail:any={};
  ShowcontactDetail:any=[];
  array:any=[];
  DBResponce: any = [];
  EventList: any = [];
  currentFile:any;
  ValidImageTypes:any=[];
  base64textString:any=[];
  img:any;
  imgGstName:any;
  imgPanName:any;
  PanExtention  : any;
  GstnExtention : any;
  imn1:any;
  imgtype:any;
  getEventList:any=[];
  dbResponse:any=[];
  delay: boolean = false;
  from: any;
  JobDetail:any={};
  ShowPushData:any=[];
  EventPushData:any=[];
  newAttribute: any = [];
  pushjobdetail:any = [];
  jobdetail:any={};
  EventJobDetails:any={};
  EventDetails: any = 0;
  ViewListData:any;
  eventId:any;
  EventEmployerDetails:any={};
  contactPersion:any;
  companyIid:any;
  EventRegistrationDetail:any=[];
  EventRegisterCandidate:any=[];
  CandidateList:boolean=false;
  mineducation:any=[];
  modalRefForJob: BsModalRef;
  Jobid:any;
  ViewJob:any=[];
  EmployerRegistrationBtn:boolean=false;
  ShowuserDetail:boolean=false;
  EventFilter:FormGroup;
  USERDATA: any = [];
  userdata: any = [];
  contactpersonId:any;
  userList:any=[];
  DbResponse:any=[];
  SearchResult:boolean=false;
  showErrorMessage:boolean=false;
  ShowContactDetail:boolean=false;
  errormsg=AppConstants.generalError_NodataFound;
  constructor(
      private EventService: EventService
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

      } catch  { }
  }

  age:any=[];
  ngOnInit() {
    // this.GetEventdContactDetailList();
    var j = 0;
    var h = 16;
    for (h; h <= 50; h++) {
      this.age[j] = h;
      j++;
    }


    $('.page-filters h2 a').click(function () {

      $(this).find('i').toggleClass('fa-chevron-down fa-chevron-right');
      $(this).parent().parent().find('.filter-wrapper').slideToggle();
    });
    $('.filter-toggle').click(function () {
      $('.filter-wrapper').slideToggle();
    });

 this.Eventform  = this.formBuilder.group({
      Name          : ['', [Validators.required, Validators.compose([CustomValidators.removeSpaces])]],
      Aboutcompany  : ['',[Validators.nullValidator]],
      Address       : ['', [Validators.nullValidator]],
      ImgName       : ['', ''],
      JobTitle      : ['', [Validators.nullValidator,Validators.compose([CustomValidators.removeSpaces])]],
      MinEducation  : ['', [Validators.nullValidator]],
      Age           : ['', [Validators.nullValidator]],
      jobDescription: ['', [Validators.nullValidator, Validators.compose([CustomValidators.removeSpaces])]],
      Height        : ['', [Validators.nullValidator,]],
      ContactDetail : ['', [Validators.required,]],
      inch          : ['', [Validators.nullValidator,]],
      MonthCtc      : ['', [Validators.nullValidator,]],
      maxCtcMonth   : ['', [Validators.nullValidator,]],
      weight        : ['', [Validators.nullValidator,]],
      InHandSalary  : ['', [Validators.nullValidator,]],
      minInHandSalary  : ['', [Validators.nullValidator,]],
      NoOfOpening   : ['', [Validators.nullValidator,]],
      State         : ['', [Validators.nullValidator,]],
      District      : ['', [Validators.nullValidator,]],
      ContactName   : ['', [ , Validators.compose([CustomValidators.removeSpaces])]],
      ContactDesignation : ['', [Validators.nullValidator,]],
      ContactMobile : ['', [Validators.compose([CustomValidators.validMobile])]],
      ContactEmail  : ['', [Validators.compose([CustomValidators.vaildEmail])]],
      ContactEmailPublic: ['false', [Validators.nullValidator,]],
      ContactLandlineNumber: ['', [Validators.nullValidator,]]
   });
   this.EventFilter  = this.formBuilder.group({
    EvenType      : ['', [Validators.nullValidator,]],
    State         : ['', [Validators.nullValidator,]],
    District      : ['', [Validators.nullValidator,]],
    Location      : ['', [Validators.nullValidator,]],
    Others        : ['', [Validators.nullValidator,]],
    filterstartDate: ['', [Validators.nullValidator,]],
    filterendDate : ['', [Validators.nullValidator,]],
    Search        : ['', [Validators.nullValidator,]],
 });
    this.GetAllSearchEvent(this.pageNumber, '');
    this.EventsTypeList();
    this.GetAllState();
    this.getEventEmployerDetails();
  }
  toggle: boolean = false;
  texttoggle: any = 'View More...';
  togglediv() {
    this.ShowRegisterEvent = false;
    this.ShowContactDetail = false;
    this.toggle = !this.toggle;
    if (this.texttoggle == 'View More...') {
      this.texttoggle = 'View Less...';
    }
    else {
      this.texttoggle = 'View More...';
      this.ShowRegisterEvent = true;
      this.ShowContactDetail = true;
    }
  }
  viewfalse:any='1';
  @HostListener('window:scroll', ['$event'])
  scrollHandler(event) {
     if ($(window).scrollTop() >= ($(document).height() - $(window).height()) * 0.8) {
      let pos = (document.documentElement.scrollTop || document.body.scrollTop) + document.documentElement.offsetHeight;
      let max = document.documentElement.scrollHeight;
      if (pos >= (0.8 * max)) {
        if (this.delay) {
          return
        }
        this.delay = true;
        if (this.getEventList.length >= 10 && this.viewfalse==1) {
          this.pageNumber = this.pageNumber + 1;
          
          this.GetAllSearchEvent(this.pageNumber, 'scroll');
        }
      }
    }
  }

 GetAllState() {​
  this.masterService.GetAllStates().subscribe(res => {
      this.states = res
      if (this.states != null && this.states.length > 0) {
        this.states = this.states;
      }
    });
  }

  GetAllDistrict(event: any) {
    this.Eventform.controls['District'].setValue('');
    this.id = event.target.value;
    if(this.id!='')
    {
      this.masterService.GetAllDistrict(this.id).subscribe(res => {
        this.district = res
          if (this.district != null && this.district.length > 0) {
           this.district = this.district;
        }
      });
    }
    else
    {
    this.Eventform.controls['District'].setValue('');
    this.district=[];
    }
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
eventtype:any=[];
  EventsTypeList() {
    this.EventService.GetEventTypeList().subscribe(res => {
      this.DBResponce = res
      if(this.DBResponce != null){
        this.eventtype = this.DBResponce.lstGetEventType;
        this.spinnerService.hide();
      }

      })
    };
  

  EventDetail:any=[];
  gGetEventDetail(items:any) {
    
    this.eventId = items.eventId;
    // window.scroll(0,0);
    this.spinnerService.show();
    // this.GetEventdContactDetailList();
    this.EmployerRegistrationBtn = true;
    this.ShowContactDetail = true;
    this.eventId =     items.eventId;
    this.ViewListData = items;
    this.EventDetails = 1;
    this.ListOfEvent = 0;
    this.ShowRegisterEvent = true;
    this.CandidateList = false;
  
   
    this.EventService.GetEventDetailIdWise(this.eventId).subscribe(res => {
      this.dbResponse = res
        if(this.dbResponse != null){
          this.EventDetail = this.dbResponse.adminGetEventDetailIdWise[0];
          this.spinnerService.hide();
        }
    });

   
  }
  BackToEvents() {
    // this.GetEventdContactDetailList();
    this.EventDetails = 0;
    this.ListOfEvent = 1;
    this.ShowRegisterEvent = false
    this.ShowContactDetail = false;
    this.viewfalse = 1;
    this.CandidateList = false;
  }

  eventdata:any=[];
  EmployerRegistration() {
   
    this.Eventform.controls['ImgName'].setValue("");
    this.viewfalse=0;
    // this.CompanyWiseActiveUserList();
    this.ShowContactDetail = false;
    this.ShowRegisterEvent = false;
    this.GoEventlist = true;
    this.eventdata = this.ViewListData;
    this.ListOfEvent = 0;
    this.EventDetails = 0;
    this.Show = 1;
    this.CandidateList = false;
    
    this.Eventform.controls['Name'].setValue(this.EventEmployerDetails.companyName);
    this.Eventform.controls['Aboutcompany'].setValue(this.EventEmployerDetails.aboutCompany);
    this.Eventform.controls['Address'].setValue(this.EventEmployerDetails.companyLocation);
    this.GetMinEducation();
  }

/******************************************************
     *Get Employer Detail By Neeraj Singh (27/05/2019) *
 *****************************************************/


getEventEmployerDetails(){
  this.spinnerService.show();
    this.EventService.GetEventEmployerDetails().subscribe(res => {
    this.dbResponse = res
    if(this.dbResponse != null){
      this.spinnerService.hide();
      this.EventEmployerDetails = this.dbResponse.lstEventEmployerDetails[0]; 
      this.contactPersion = this.dbResponse.lstEventEmployerDetails[0].contactPersion;
      this.companyIid = this.dbResponse.lstEventEmployerDetails[0].companyId;
    }
  });
}

/******************************************************
     *Add multiple job opening Neeraj Singh (27/05/2019) *
 *****************************************************/
  AddMorejob(){

    if(this.Eventform.value.JobTitle == ''){
      this.toastrService.error("Please Add Job Title First");
      return false;
    }
    
if( this.Eventform.value.MonthCtc == 0){
      this.toastrService.error("Please enter Min CTC");
      return false;
    }if( this.Eventform.value.maxCtcMonth == 0){
      this.toastrService.error("Please enter Max CTC");
      return false;
    }
    
    if(parseInt(this.Eventform.value.maxCtcMonth) < parseInt(this.Eventform.value.MonthCtc)){
        this.toastrService.error("Max Ctc is greater than Min Ctc");
        return false;
    }

    if( this.Eventform.value.InHandSalary == 0){
      this.toastrService.error("Please enter Minimum In Hand Salary");
      return false;
    }if( this.Eventform.value.minInHandSalary == 0){
      this.toastrService.error("Please enter Maximum In Hand Salary");
      return false;
    }if(this.Eventform.value.NoOfOpening == 0){
      this.toastrService.error("Please enter In Number of Opening");
      return false;
    }if(parseInt(this.Eventform.value.InHandSalary) > parseInt(this.Eventform.value.maxCtcMonth)){
      this.toastrService.error("In hand Salary Not Be Greater than maximum CTC");
      return false;
    }
    
    if(parseInt(this.Eventform.value.InHandSalary) < parseInt(this.Eventform.value.minInHandSalary)){
      this.toastrService.error("Max inhand salary is greater than Min min in hand salary");
      return false;
  }
    
    if( this.Eventform.value.State == 0){
      this.toastrService.error("Please Select State");
      return false;
    }if( this.Eventform.value.District == 0){
      this.toastrService.error("Please Select District");
      return false;
    }


   
   
    let statedid;
    let districtid;
   
    statedid     = this.Eventform.value.State;
    districtid   = this.Eventform.value.District;
   
    let statename = (this.states).filter(function (entry){
      return entry.id == statedid;
    });
   
    let districtname = (this.district).filter(function (entry) {
      return entry.id == districtid;
    });
    var ShowEventJobDetails = {  // Show opening in registration page
          "stateId":statename[0]['stateName'],
          "districtId":districtname[0]['districtName'],
          "noOfVacancy":this.Eventform.value.NoOfOpening,
          "minCtcMonth":this.Eventform.value.MonthCtc,
          "maxCtcMonth":this.Eventform.value.maxCtcMonth,
          "otherDetail":'',
          "handsonSalary":this.Eventform.value.InHandSalary,
          "maxhandsonSalary":this.Eventform.value.minInHandSalary,
          " eventJobOpngId":0
    }
    
    this.ShowPushData.push(ShowEventJobDetails);

    this.EventJobDetails = { //Send opening data
      "stateId":this.Eventform.value.State,
      "districtId":this.Eventform.value.District,
      "noOfVacancy":this.Eventform.value.NoOfOpening,
      "maxCtcMonth":this.Eventform.value.maxCtcMonth,
      "minCtcMonth":this.Eventform.value.MonthCtc,
      "otherDetail":'',
      "handsonSalary":this.Eventform.value.InHandSalary,
      "maxhandsonSalary":this.Eventform.value.minInHandSalary,
      " eventJobOpngId":0
}
      this.EventPushData.push(this.EventJobDetails);
      this.Eventform.controls['NoOfOpening'].setValue('');
      this.Eventform.controls['InHandSalary'].setValue('');
      this.Eventform.controls['minInHandSalary'].setValue('');
      this.Eventform.controls['maxCtcMonth'].setValue('');
      this.Eventform.controls['MonthCtc'].setValue('');
      this.Eventform.controls['State'].setValue('');
      this.Eventform.controls['District'].setValue('');
  }

  indexValue:any;
  DeleteJobDetail(){
    this.modalRef.hide();
    let index=this.indexValue;
    this.ShowPushData.splice(index,1);
    this.EventPushData.splice(index,1);
   
  }
  DeleteContactDetail(){
    let index=this.indexValue;
    this.ShowcontactDetail.splice(index,1);
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
  openingModelRef: BsModalRef;
  AddContactDetails(template: TemplateRef<any>){
    this.openingModelRef = this.modalService.show(template, { class: 'modal-sm-md',backdrop  : 'static', keyboard  : false });
   
  }
  closeContactModal(){
    this.openingModelRef.hide();
    this.close();
  }
  close(){
    this.Eventform.controls['ContactName'].setValue("");
    this.Eventform.controls['ContactDesignation'].setValue("");
    this.Eventform.controls['ContactMobile'].setValue("");
    this.Eventform.controls['ContactEmail'].setValue(""); 
    this.Eventform.controls['ContactEmailPublic'].setValue(""); //by neeraj singh
  }

  /******************************************************
     *Add Contact Details By Neeraj Singh (27/05/2019) *
 *******************************************************/

  SaveContactDetail(){  
    if(this.Eventform.value.ContactName==''){
      this.toastrService.error("Please add contact person name");
      return false
    }
    // else if(this.Eventform.value.ContactDesignation==''){
    //   this.toastrService.error("Please add designation");
    //   return false
    // }
    else if(this.Eventform.value.ContactMobile==''){
      this.toastrService.error("Please add contact number");
      return false
    }else if(this.Eventform.value.ContactEmail==''){
      this.toastrService.error("Please add emailID");
      return false
    }

   if(!this.Eventform.value.ContactName && !this.Eventform.value.ContactEmail && !this.Eventform.value.ContactMobile && !this.Eventform.value.ContactLandlineNumber &&  !this.Eventform.value.ContactEmailPublic){
    this.toastrService.error("Please add at least one field");
   }else{
     this.toastrService.success("Contact person added");
     this.openingModelRef.hide();
      this.contactDetail={
        "contacPersionName":this.Eventform.value.ContactName,
        "email": this.Eventform.value.ContactEmail,
        "mobile": this.Eventform.value.ContactMobile,
       "designation":this.Eventform.value.ContactDesignation,
      };
      this.ShowcontactDetail.push(this.contactDetail);
   }

   this.Eventform.controls['ContactName'].setValue('');
   this.Eventform.controls['ContactMobile'].setValue('');
   this.Eventform.controls['ContactDesignation'].setValue('');
   this.Eventform.controls['ContactEmail'].setValue('');

}

decimals(e){
  if (e.keyCode === 190 || e.keyCode == 110) {
      return false;
  }
  if (e.keyCode === 189 ) {
      return false;
  }
}

/******************************************************
     *Get Event List By Neeraj Singh (27/05/2019) *
 *****************************************************/
SearchFilter:any={};
ShowFilterData:any=[];
// pagenumber:number = 0;
GetAllSearchEvent(pageNumber, from) {
  
  this.from = "";
  this.SearchResult = true;

  this.ShowFilterData = [];

 this.pageNumber =parseInt(pageNumber);
  this.SearchFilter.eventType     = this.EventFilter.value.EvenType !=undefined && this.EventFilter.value.EvenType !='' && this.EventFilter.value.EvenType !=null ?this.EventFilter.value.EvenType:0;

   this.SearchFilter.stateId      = this.EventFilter.value.State !=undefined && this.EventFilter.value.State !='' && this.EventFilter.value.State !=null ? this.EventFilter.value.State:0;

   this.SearchFilter.districtId   = this.EventFilter.value.District !=undefined && this.EventFilter.value.District !='' && this.EventFilter.value.District !=null ? this.EventFilter.value.District:0;

   this.SearchFilter.searchKey    = this.EventFilter.value.Search !=undefined && this.EventFilter.value.Search !='' && this.EventFilter.value.Search !=null ? this.EventFilter.value.Search:'';

   this.SearchFilter.startDate    = this.EventFilter.value.filterstartDate !=undefined && this.EventFilter.value.filterstartDate !='' && this.EventFilter.value.filterstartDate !=null ?this.EventFilter.value.filterstartDate:null;


   this.SearchFilter.endDate      = this.EventFilter.value.filterendDate !=undefined && this.EventFilter.value.filterendDate !='' && this.EventFilter.value.filterendDate !=null ? this.EventFilter.value.filterendDate:null;

   this.SearchFilter.pagenumber   = this.pageNumber;
   this.SearchFilter.eventFlag    = "CURRENT";
   this.SearchFilter.REGISTRATIONSTATUS    = 0;   
   this.spinnerService.show();
  if (from == 'scroll') {
   
    this.EventService.GetEventType(this.SearchFilter).subscribe(res => {
      this.dbResponse = res;
      if (this.dbResponse != null) {
     
        this.spinnerService.hide();
        this.getEventList = this.getEventList.concat(this.dbResponse.lstRojgaarEventList);
      }
      this.delay = false;
    });
  }
  else {
    // this.spinnerService.show();
    this.EventService.GetEventType(this.SearchFilter).subscribe(res => {
      this.dbResponse = res;
      if (this.dbResponse.lstRojgaarEventList != null  && this.dbResponse.lstRojgaarEventList!= '' && this.dbResponse.lstRojgaarEventList.length) {
        this.spinnerService.hide();
        this.getEventList = this.dbResponse.lstRojgaarEventList;
        this.showErrorMessage = false;
      } else {
        this.getEventList = [];
        this.spinnerService.hide();
        this.showErrorMessage = true;
      }
      this.delay = false;
      this.from = '';
    });
  }
  this.from = '';
}


  






  BackToEventsList(){
 
    this.Show               = 0;
    this.EventDetails       = 1;
    this.ShowContactDetail  = true;
    this.ShowRegisterEvent  = true;
    this.backToEventDetails = true;
    this.GoEventlist        = false;
    
  }
  
  /******************************************************
     *View Candidate List By Neeraj Singh (29/05/2019) *
  *****************************************************/
  ViewcandidateList(items){
    this.ShowContactDetail = false;
    this.CandidateList = true;
    this.EventDetails = 1;
    this.ListOfEvent  = 0;
    this.eventId      = items.eventId;
    this.ViewListData = items;
    this.ShowRegisterEvent = false;
    this.EmployerRegistrationBtn=false;
    this.EventService.GetEventDetailIdWise(this.eventId).subscribe(res => {
      this.dbResponse = res
      this.EventDetails = 1;
      this.ListOfEvent = 0;
     
      // this.CandidateList = false;
        if(this.dbResponse != null){
          this.EventDetail = this.dbResponse.adminGetEventDetailIdWise[0];
         
          this.spinnerService.hide();
        }
    });
    this.GetReleasedOfferletterCandidateList();
}

/*****************************************************
 * Display candidate list By Neeraj Singh 29May2019 * 
 ***************************************************/
// GetEventRegisterCandidate(){
//   
//   this.spinnerService.show();
//   this.EventService.GetEventRegisterCandidate(this.eventId).subscribe(res => {
//     this.dbResponse = res
//     if(this.dbResponse != null){
//       this.EventRegisterCandidate = this.dbResponse.lstGetEventRegistrationCandidate; 
//       this.spinnerService.hide();
//     }
//   });
// }

/*****************************************************
 * Display Event Job Detail By Neeraj Singh 29May2019 * 
 ***************************************************/
ViewJobDetail(template6: TemplateRef<any>,Item){
  
this.Jobid = Item.eventJobId;
this.modalRefForJob = this.modalService.show(template6,
  { backdrop: 'static', keyboard: false, class: 'modal-lg' });
  this.spinnerService.show();
this.EventService.GetEventEmployerJobDtlAndContactDtlList(this.Jobid,this.companyIid,this.eventId).subscribe(res =>{
  this.dbResponse = res
 
    if(this.dbResponse != null){
     this.ViewJob = this.dbResponse.lstGetEventEmployerJobList[0];
     this.spinnerService.hide();
    }
});
}

lstImage:any=[];
/*****************************************************
 * Display candidate list By Pankaj Joshi 24JUNE2019 * 
 ***************************************************/
GetReleasedOfferletterCandidateList(){  
  
  var userId=JSON.parse(localStorage.getItem('UserInfo'));  
  var setSendData = {
    'eventId': this.eventId, 'userId': userId.id,   }
  let setData = JSON.stringify(setSendData);
 let postData= {
               "HSTPLRequest":{
                 "data":setData,
                 "typeFor":"GetEventOfferLetter"
                }
              }
  this.spinnerService.show();
  this.EventService.GetData(postData).subscribe(res => {
    this.dbResponse = res 
    this.spinnerService.hide();
    if(this.dbResponse.hstplResponse.status){
      this.EventRegisterCandidate = JSON.parse(this.dbResponse.hstplResponse.data);
      this.lstImage = JSON.parse(this.dbResponse.hstplResponse.lstImage);
     
    }
  });
}

openOfferLetter(candidateId:any){  
  var imageurl=this.lstImage.find(item=>item.ID===candidateId);
  var offerletterUrl=imageurl.OfferletterImagepath;
  window.open(offerletterUrl,'_blank');
}
}

