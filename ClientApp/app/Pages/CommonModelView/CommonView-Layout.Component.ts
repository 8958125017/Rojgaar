import { Component, OnInit, HostListener, TemplateRef, EventEmitter, Output, Input, ElementRef, ViewChild } from '@angular/core';
import { NavigationEnd, Router,ActivatedRoute } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { AppConfig } from '../../Globals/app.config';
import { FormBuilder ,FormGroup, FormControl,Validators} from '@angular/forms';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
import { Options } from 'ng5-slider';
//import { JobpostService } from '../../../Services/jobpost.service';
import { MasterService } from '../../Services/master.service';
import { from } from 'rxjs/observable/from';
//import { RegistrationService } from '../../../Services/registration.service';
//import { CompanyProfileService } from '../../../Services/companyprofile.service';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import * as $ from 'jquery';
import { CandidateService } from '../../Services/candidate.service';
import { UserInfoService } from '../../Services/userInfo.service.';
import { ToastrService } from 'ngx-toastr';
//import { CandidateSearchComponent } from '../Search/CandidateSearch/CandidateSearch.Component';

@Component({
  selector: 'app-CommonView-Layout',
  templateUrl: './CommonView-Layout.Component.html'
})

export class CommonViewLayoutComponent implements OnInit {
  modalRef: BsModalRef;
  modalRefdesc: BsModalRef;
  modaldefualt: BsModalRef;
  modaldpia: BsModalRef;
  @ViewChild('template') template:ElementRef;
  @ViewChild('template2') template2:ElementRef;
  @ViewChild('temppia') temppia:ElementRef;



  @Input() childMessage: string;

  //@Input() result: string = "";
  @Output() clicked = new EventEmitter<string>();
 // @Output() backcliked = new EventEmitter<string>();
 constructor(private appConfig: AppConfig
  , private toastrService: ToastrService
  , private userinfoservice: UserInfoService
  , private formBuilder: FormBuilder
  , private masterService: MasterService
  , private spinnerService: Ng4LoadingSpinnerService
  , private CandidateService: CandidateService
  , private modalService: BsModalService
  , private router: Router
)  {
  }
  PiaContacDetials:any=[]
  GetPiaContactDetails(JobID:any,JobopeningID:any,candiID:any,apitype:any)
  {
    if(apitype=='MRIGS')
    {
      this.CandidateService.GetPiaDetail(JobID,JobopeningID,candiID).subscribe(res => {
        this.ProfileResponce = res
        this.spinnerService.hide();
        if (this.ProfileResponce.lstGetPiaDetai != null) {
          this.PiaContacDetials = this.ProfileResponce.lstGetPiaDetai[0];
          this.modaldpia = this.modalService.show(this.temppia,
            Object.assign({}, { class: 'candidate-view-modal modal-lg' }
           ));
        } else {
          this.PiaContacDetials = [];
        }
      });
    }
  
  }
  callMethod(candiID:any,apitype:any) {
    this.MrigsDataShow=false;
    this.candid='';
    this.candidatedetails=[];
    this.addressinfodatap=[];
    this.addressinfodatac=[];
    this.familyinfodata=[];
    this.langinfodata=[];
    this.areainfodata=[];
    this.workexpinfodata=[];
    this.empcertinfodata=[];
    this.empeduinfodata=[];
    this.PartnerInfo=[];
    this.TrainingPartnerDetails=[];
    if(apitype=='YS')
    {  
    this.candid=candiID;
    this.spinnerService.show();
    this.ViewYSCandidateDetail(candiID);
    this.ViewYSCandidateLanguageDetail(candiID);
    this.ViewYSCandidateAddressDetail(candiID);
    this.ViewYSCandidateFamilyDetail(candiID);
    this.ViewYSCandidateInterestDetail(candiID);
    this.ViewYSCandidateExperienceDetail(candiID);
    this.ViewYSCandidateEducationDetail(candiID);
    this.ViewMrigsCandidateEducationDetail(candiID);
    this.ViewYSCandidateCertificationetail(candiID);
    this.modalRef = this.modalService.show(this.template,
        Object.assign({}, { class: 'candidate-view-modal modal-lg' }
       ));
    }
    if(apitype=='DDUGKY'||apitype=='MRIGS')
    {
      this.candid=candiID;
      this.spinnerService.show();
      this.MrigsDataShow=true;
      this.CandidateService.GetMrigsCandidateDetails(candiID).subscribe(res => {
     this.ProfileResponce = res
     this.spinnerService.hide();
    if (this.ProfileResponce.lstCandidateInfo != null) {
      this.candidatedetails = this.ProfileResponce.lstCandidateInfo[0];
      this.modalRef = this.modalService.show(this.template,
        Object.assign({}, { class: 'candidate-view-modal modal-lg' }
       ));    
    } else {
      this.candidatedetails = [];
    }
  });    
    }
    if(apitype=='MYDB'|| apitype=='ROJGAAR' || apitype=='Rojgaar')
    {
    this.candid=candiID;
    this.GetAllMinEducation();
    this.GetAllRelationdetails();
    this.GetAllReligions_details();
    this.GetEmployeeAddress();
    this.GetFamilyDetails();
    this.GetCandidateLanguage();
    this.GetEmpAreaOfIntrest();
    this.GetEmpWorkExperience();
    this.GetEmpCertification();
    this.GetEmpEdutnQualifictin();   
    this.spinnerService.show();
    this.CandidateService.mydatabaseCandidateDetail(candiID).subscribe(res => {
    this.ProfileResponce = res
    this.spinnerService.hide();
        if (this.ProfileResponce.lstCandeSeMyDatase != null) {
          
          this.candidatedetails = this.ProfileResponce.lstCandeSeMyDatase[0];
        } else {
          this.candidatedetails =[];
        }
       this.modalRef = this.modalService.show(this.template,
        Object.assign({}, { class: 'candidate-view-modal modal-lg' }
        ));
      });
    }
    if(apitype=='REG')
    {
      this.candid='';
      this.addressinfodatap=[];
      this.addressinfodatac=[];
      this.familyinfodata=[];
      this.langinfodata=[];
      this.areainfodata=[];
      this.workexpinfodata=[];
      this.empcertinfodata=[];
      this.empeduinfodata=[];
      this.spinnerService.show();
      this.ViewYSCandidateDetail(candiID);
      this.ViewYSCandidateLanguageDetail(candiID);
      this.ViewYSCandidateAddressDetail(candiID);
      this.ViewYSCandidateFamilyDetail(candiID);
      this.ViewYSCandidateInterestDetail(candiID);
      this.ViewYSCandidateExperienceDetail(candiID);
      this.ViewYSCandidateEducationDetail(candiID);
      this.ViewMrigsCandidateEducationDetail(candiID);
      this.ViewYSCandidateCertificationetail(candiID);
      this.modalRef = this.modalService.show(this.template,
        Object.assign({}, { class: 'candidate-view-modal modal-lg' }
        ));   
    } 
    if(apitype=='' || apitype==null)
    {
      this.candid='';
      this.addressinfodatap=[];
      this.addressinfodatac=[];
      this.familyinfodata=[];
      this.langinfodata=[];
      this.areainfodata=[];
      this.workexpinfodata=[];
      this.empcertinfodata=[];
      this.empeduinfodata=[];
      this.modaldefualt = this.modalService.show(this.template2);   
    }   
  }
  ngOnInit() {
    
  }
  DbResponce: any = [];
  
  openModal(temp: TemplateRef<any>) {
    this.modalRef = this.modalService.show(temp);
  }
  viewdata(companyId: any) {
}
onClicked(CandID:any)
{

}
//////////////////////// Candidate Details /////////////////////////
  candidatedetails:any =[];
  ProfileResponce: any = [];
  postionview:any;
  scrollToX:any;
  scrollToY:any;
  candid:any;
  MrigsDataShow:boolean=false;
 
   ///////////////   min education details ///////////////
   mineducation:any=[];
   GetAllMinEducation()
   {
     this.masterService.GetAllMinEducation().subscribe(res=>{this.mineducation=res;
       if (this.mineducation) {
      this.mineducation=this.mineducation;  
     }
     else
     {
     this.mineducation=this.mineducation;
     }
     }); 
   }
   ///////////////   candiate details ///////////////
   jstoday
   personaldata:any=[];
   ////////
   addressinfodata:any=[];
   addressinfodatap:any=[];
   addressinfodatac:any=[];
   addressid:any;
   GetEmployeeAddress()
   {
   this.CandidateService.GetEmployeeAddress(this.candid).subscribe(res=>{this.addressinfodata=res;  
       if (this.addressinfodata.lstEmployeeAddress!= null && this.addressinfodata.lstEmployeeAddress.length!= 0
       ) {
         this.addressinfodata=this.addressinfodata.lstEmployeeAddress;
   
     //   if(this.addressinfodata.lstEmployeeAddress[0])
     //   {
     //   this.addressinfodatap=this.addressinfodata.lstEmployeeAddress[0];
     //   }
     //   if(this.addressinfodata.lstEmployeeAddress[1])
     //   {
     //  this.addressinfodatac=this.addressinfodata.lstEmployeeAddress[1];
     //   }
       this.GetAllDistrictaddress(this.addressinfodata.stateId!=''?   this.addressinfodatap.stateId:"");
       this.GetAllcDistrictaddress(this.addressinfodatac.stateId);
       }
       else
       {
       this.addressinfodata=[];
      }
     });
   }
   ////////////
   familyinfodata:any=[];
   GetFamilyDetails()
   {  
     this.CandidateService.GetFamilyDetails(this.candid).subscribe(res=>{this.familyinfodata=res;
     if(this.familyinfodata) { 
     this.familyinfodata=this.familyinfodata.lstGetFamilyDtl;
      }
      else
      {
      }
     });
   }
   ////////////
   langinfodata:any=[];
   GetCandidateLanguage()
   { 
     this.CandidateService.GetCandidateLanguage(this.candid).subscribe(res=>{this.langinfodata=res;
       if(this.langinfodata) { 
       this.langinfodata=this.langinfodata.lstCandidateLang; 
       }
       else
       {
         this.langinfodata=res;
       } 
     });
    
   }
   //////////
   areainfodata:any=[];
   GetEmpAreaOfIntrest()
   {
     this.CandidateService.GetEmpAreaOfIntrest(this.candid).subscribe(res=>{this.areainfodata=res;
       if(this.areainfodata) { 
     this.areainfodata=this.areainfodata.lstAreaOfIntrest; 
       }
       else
       {
         this.areainfodata=res;
       } 
     });
   }
   //////////
   workexpinfodata:any=[];
   GetEmpWorkExperience()
   {
     this.spinnerService.show();
     this.CandidateService.GetEmpWorkExperience(this.candid).subscribe(res=>{this.workexpinfodata=res;
       if (this.workexpinfodata) { 
       this.workexpinfodata=this.workexpinfodata.lstEmpWorkExperience;
       }
       else
       {
         this.workexpinfodata=this.workexpinfodata.lstEmpWorkExperience[0];
       }
     });
     
   }
   ////////////
   empcertinfodata:any=[];
   GetEmpCertification()
   {
     this.spinnerService.show();
     this.CandidateService.GetEmpCertification(this.candid).subscribe(res=>{
       this.empcertinfodata=res;
       if(this.empcertinfodata) { 
       this.empcertinfodata=this.empcertinfodata.lstEmpCertification; 
       }
       else
       {
         this.empcertinfodata=this.empcertinfodata.lstEmpCertification[0];
       }
     });
     
   }
   //////////
   empeduinfodata:any=[];
   GetEmpEdutnQualifictin()
   {
    this.spinnerService.show();
     this.CandidateService.GetEmpEdutnQualifictin(this.candid).subscribe(res=>{this.empeduinfodata=res;
       if(this.empeduinfodata) { 
       this.empeduinfodata=this.empeduinfodata.lstEmpEdutnQualifictin;
       }
       else
       {
         this.empeduinfodata=this.empeduinfodata.lstEmpEdutnQualifictin[0];
       }
     });
   }
   /////////////////// End candiate details //////////
   addressdistirct:any;
   workexpdistics:any;
   districts:any;
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
   // ViewGETMrigsCandidateDetails(candiID:any)
   // {
   //   this.CandidateService.GetMrigsCandidateDetails(candiID).subscribe(res => {
   //     this.ProfileResponce = res
   //     this.spinnerService.hide();
   //     if (this.ProfileResponce.lstCandidateInfo != null) {
   //       this.candidatedetails = this.ProfileResponce.lstCandidateInfo[0];
   //     } else {
   //       this.candidatedetails = [];
   //     }
   //   });
   // }
   ViewMrigsCandidateDetail(candiID:any)
   {
     this.CandidateService.ViewMrigsCandidateDetail(candiID).subscribe(res => {
       this.ProfileResponce = res
       this.spinnerService.hide();
       if (this.ProfileResponce.lstCandidateInfo != null) {
         this.candidatedetails = this.ProfileResponce.lstCandidateInfo[0];
       } else {
         this.candidatedetails = [];
       }
     });
   }
   PartnerInfo:any=[];
   ViewMrigsCandidatePartnerInfoDetail(candiID:any)
   {
     this.CandidateService.PartnerInfo(candiID).subscribe(res => {
       this.ProfileResponce = res
       this.spinnerService.hide();
       if (this.ProfileResponce.lstPartnerInfo != null) {
         this.PartnerInfo = this.ProfileResponce.lstPartnerInfo[0];
       } else {
         this.PartnerInfo = [];
       }
     });
   }
   TrainingPartnerDetails:any=[];
   ViewMrigsCandidateTrainingPartnerDetail(candiID:any)
   {
     this.CandidateService.trainingPartner(candiID).subscribe(res => {
       this.ProfileResponce = res
       this.spinnerService.hide();
       if (this.ProfileResponce.lstTrainingInformation != null) {
         this.TrainingPartnerDetails = this.ProfileResponce.lstTrainingInformation[0];
   
       } else {
         this.TrainingPartnerDetails = [];
       }
     });
   }
   ViewMrigsCandidateLanguageDetail(candiID:any)
   {
     this.CandidateService.ViewMrigsCandidateLanguageDetail(candiID).subscribe(res => {
       this.ProfileResponce = res
       this.spinnerService.hide();
       if (this.ProfileResponce.lstCandidateLang != null) {
         this.langinfodata = this.ProfileResponce.lstCandidateLang;
       } else {
         this.langinfodata = [];
       }
     });
   }
   
   ViewMrigsCandidateAddressDetail(candiID:any)
   {
     this.CandidateService.ViewMrigsCandidateAddressDetail(candiID).subscribe(res => {
       this.ProfileResponce = res
       this.spinnerService.hide();
       if (this.ProfileResponce.lstEmployeeAddress != null) {
         this.addressinfodata = this.ProfileResponce.lstEmployeeAddress;
       } else {
         this.addressinfodata =[];
       }
     });
   }
   
   ViewMrigsCandidateFamilyDetail(candiID:any)
   {
     this.CandidateService.ViewMrigsCandidateFamilyDetail(candiID).subscribe(res => {
       this.ProfileResponce = res
       this.spinnerService.hide();
       if (this.ProfileResponce.lstGetFamilyDtl != null) {
         this.familyinfodata = this.ProfileResponce.lstGetFamilyDtl;
       } else {
         this.familyinfodata =[];
       }
     });
   }
   
   ViewMrigsCandidateInterestDetail(candiID:any)
   {
     this.CandidateService.ViewMrigsCandidateInterestDetail(candiID).subscribe(res => {
       this.ProfileResponce = res
       this.spinnerService.hide();
       if (this.ProfileResponce.lstAreaOfIntrest != null) {
         this.areainfodata = this.ProfileResponce.lstAreaOfIntrest;
       } else {
         this.areainfodata = [];
       }
     });
   }
   
   ViewMrigsCandidateExperienceDetail(candiID:any)
   {
     this.CandidateService.ViewMrigsCandidateExperienceDetail(candiID).subscribe(res => {
       this.ProfileResponce = res
       this.spinnerService.hide();
       if (this.ProfileResponce.lstEmpWorkExperience != null) {
         this.workexpinfodata = this.ProfileResponce.lstEmpWorkExperience;
       } else {
         this.workexpinfodata =[];
       }
     });
   }
   
   ViewMrigsCandidateEducationDetail(candiID:any)
   {
     this.CandidateService.ViewMrigsCandidateEducationDetail(candiID).subscribe(res => {
       this.ProfileResponce = res
       this.spinnerService.hide();
       if (this.ProfileResponce.lstEmpWorkExperience != null) {
         this.empeduinfodata = this.ProfileResponce.lstEmpWorkExperience;
       } else {
         this.empeduinfodata = [];
       }
     });
   }
   
   ViewMrigsCandidateCertificateDetail(candiID:any)
   {
     this.CandidateService.ViewMrigsCandidateCertificateDetail(candiID).subscribe(res => {
       this.ProfileResponce = res
       this.spinnerService.hide();
       if (this.ProfileResponce.lstEmpWorkExperience != null) {
         this.empcertinfodata = this.ProfileResponce.lstEmpWorkExperience;
       } else {
         this.empcertinfodata = [];
       }
     });
   }
   
   ////////////////////  ys detials  //////////
   ViewYSCandidateDetail(candiID:any)
   {
     this.CandidateService.ViewYSCandidateDetail(candiID).subscribe(res => {
       this.ProfileResponce = res
       this.spinnerService.hide();
       if (this.ProfileResponce.lstCandidateDetails!='undefined' && this.ProfileResponce.lstCandidateDetails != null) {
         this.candidatedetails = this.ProfileResponce.lstCandidateDetails[0];
       } else {
         this.candidatedetails = [];
       }
     });
   }
   ViewYSCandidateLanguageDetail(candiID:any)
   {
     this.CandidateService.ViewYSCandidateLanguageDetail(candiID).subscribe(res => {
       this.ProfileResponce = res
       this.spinnerService.hide();
       if (this.ProfileResponce.lstCandidateLang != null) {
         this.langinfodata = this.ProfileResponce.lstCandidateLang;
       } else {
         this.langinfodata = [];
       }
     });
   }
   
   ViewYSCandidateAddressDetail(candiID:any)
   {
     this.CandidateService.ViewYSCandidateAddressDetail(candiID).subscribe(res => {
       this.ProfileResponce = res
       this.spinnerService.hide();
       if (this.ProfileResponce.lstEmployeeAddress != null) {
         this.addressinfodata = this.ProfileResponce.lstEmployeeAddress;
       } else {
         this.addressinfodata = [];
       }
     });
   }
   
   ViewYSCandidateFamilyDetail(candiID:any)
   {
     this.CandidateService.ViewYSCandidateFamilyDetail(candiID).subscribe(res => {
       this.ProfileResponce = res
       this.spinnerService.hide();
       if (this.ProfileResponce.lstGetFamilyDtl != null) {
         this.familyinfodata = this.ProfileResponce.lstGetFamilyDtl;
       } else {
         this.familyinfodata = [];
       }
     });
   }
   
   ViewYSCandidateInterestDetail(candiID:any)
   {
     this.CandidateService.ViewYSCandidateInterestDetail(candiID).subscribe(res => {
       this.ProfileResponce = res
       this.spinnerService.hide();
       if (this.ProfileResponce.lstAreaOfIntrest != null) {
         this.areainfodata = this.ProfileResponce.lstAreaOfIntrest;
       } else {
         this.areainfodata = [];
       }
     });
   }
   
   ViewYSCandidateExperienceDetail(candiID:any)
   {
     this.CandidateService.ViewYSCandidateExperienceDetail(candiID).subscribe(res => {
       this.ProfileResponce = res
       this.spinnerService.hide();
       if (this.ProfileResponce.lstEmpWorkExperience != null) {
         this.workexpinfodata = this.ProfileResponce.lstEmpWorkExperience;
       } else {
         this.workexpinfodata = [];
       }
     });
   }
   
   ViewYSCandidateEducationDetail(candiID:any)
   {
     this.CandidateService.ViewYSCandidateEducationDetail(candiID).subscribe(res => {
       this.ProfileResponce = res
       this.spinnerService.hide();
       if (this.ProfileResponce.lstEmpEdutnQualifictin != null) {
         this.empeduinfodata = this.ProfileResponce.lstEmpEdutnQualifictin;
       } else {
         this.empeduinfodata = [];
       }
     });
   }
   
   ViewYSCandidateCertificationetail(candiID:any)
   {
     this.CandidateService.ViewYSCandidateCertificationetail(candiID).subscribe(res => {
       this.ProfileResponce = res
       this.spinnerService.hide();
       if (this.ProfileResponce.lstEmpCertification != null) {
         this.empcertinfodata = this.ProfileResponce.lstEmpCertification;
       } else {
         this.empcertinfodata = [];
       }
     });
   }
   CandiadateDescr:any;
   viewcandidateDescription(candidDesc:any,template3: TemplateRef<any>)
   {
     this.CandiadateDescr=candidDesc;
     this.modalRefdesc = this.modalService.show(template3,
       Object.assign({}, { class: 'candidate-view-modal modal-sm' }
      ));
   }
   descshort(desc:any)
   {
    return desc.substr(0, 10);
   }




//////////////////////// End Candidate Details ////////////////////

}

