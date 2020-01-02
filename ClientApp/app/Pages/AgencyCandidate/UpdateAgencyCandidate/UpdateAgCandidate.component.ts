import { debug } from 'util';
import { Component, ElementRef, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { Http } from '@angular/http';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { ToastrService } from 'ngx-toastr';
import { AppConfig } from '../../../Globals/app.config';
import { AuthenticationService } from '../../../Services/authenticate.service';
import { MasterService } from '../../../Services/master.service';
import { CandidateService } from '../../../Services/candidate.service';
import { MovingDirection } from 'angular-archwizard';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
import { BsModalRef, BsModalService } from 'ngx-bootstrap';
import { DatePipe } from '@angular/common'

// import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-UpdateAgCandidateComponent',
  templateUrl: './UpdateAgCandidate.component.html',
})
export class UpdateAgCandidateComponent implements OnInit {
  @ViewChild('mdResetPasswordOpen') mdResetPasswordOpen: ElementRef

  IsProfileEdit: any = 'Edit';
  name: any = '';
  dob: any = '';
  emailid: any = '';
  mobile: any = '';
  gender: any = '';
  aboutme: any = '';
  religion: any = '';
  birthdistrict: any = '';
  birthstate: any = '';
  country: any = '';
  states: any = [];
  districts: any = [];
  distirctssts: boolean = false;
  language: string = '';
  languageListItem: any = [];
  read: boolean = false;
  write: boolean = false;
  speak: boolean = false;
  languages: any = [];
  today = new Date();
  maxDate = new Date();
  maxDateOfBirth: Date = new Date();
  ImgName: any;
  prevImgName: any;
  ShowPeriodTo: boolean;
  //address details variable starts here;
  addressState: any = '';
  addressDistrict: any = '';
  addressPincode: any = '';
  addressCountry: any = 'India';
  address: any = '';
  addressLamdmark: any = '';
  caddress: any = '';
  addressType: any = "";
  SameAsAbove: boolean = false;
  caddressState: any = '';
  caddressDistrict: any = '';
  caddressPincode: any = '';
  caddressLamdmark: any = '';
  //addressdistirctssts:boolean=false;

  //family details variables starts here
  familyName: any = '';
  familyRelation: any = '';
  familyMobile: any = '';
  familyEmail: any = '';
  familyMyBatch: any = '';
  //area of interest starts here
  interest: any = '';
  batch: any = '';
  hobbiesItem: any = [];
  //workexperience variables starts here
  jobTile: any = '';
  company: any = '';
  jobCountry: any = 'India';
  jobState: any = '';
  jobDistrict: any = '';
  working: any = 'Yes';
  currentctc: any = '';
  periodFrom: any = '';
  periodTo: any = '';
  jobDescription: any = '';
  jobBtach: any = '';
  //education qualification variables starts here
  qualification: any = '';
  board: any = '';
  stream: any = '';
  percenatge: any = '';
  passingYear: any = '';
  myBtach: any = '';
  //certification details variable starts here
  certificateNo: any = '';
  programName: any = '';
  issuedBy: any = '';
  issuedOn: any = '';
  issuedBatch: any = '';
  response: any;
  UserInfo: any;
  logintype: any;
  candid: any;
  year: any = [];
  passingyear = new Date();
  // ShowPeriodTo:boolean=false;

  constructor(
    private http: Http,
    private router: Router,
    private authenticationService: AuthenticationService,
    private toastrService: ToastrService,
    public appConfig: AppConfig,
    private _cookieService: CookieService,
    private config: AppConfig,
    private modalService: BsModalService,
    private masterService: MasterService,
    private candidateService: CandidateService,
    private activatedRoute: ActivatedRoute,
    private spinnerService: Ng4LoadingSpinnerService,
    public datepipe: DatePipe
    // private datePipe: DatePipe
  ) {
    try {
      this.UserInfo = appConfig.UserInfo
      this.logintype = this.UserInfo.loginType
    } catch  { }
    this.appConfig.isverified();

  }
  ngOnInit() {
    this.maxDateOfBirth.setFullYear(new Date().getFullYear() - 15, new Date().getMonth() + 1, 0);
    this.passingyear = new Date();
    var n = this.passingyear.getFullYear();
    for (var i = n - 20; i <= n; i++) {
      this.year.push(i);
    }
    this.maxDate.setFullYear(this.maxDate.getFullYear() - 15);
    this.maxDate.toISOString().slice(0, 15);
    this.activatedRoute.queryParams.subscribe(params => {
      this.candid = params['candid'];
    });
    this.masterService.GetAllStates().subscribe(res => { this.states = res; });
    this.masterService.GetAllLanguage().subscribe(res => {
      this.languages = res;
    });
    this.GetAllMinEducation();
    this.GetAllRelationdetails();
    this.GetAllReligions_details();
    this.GetEmpCandidatePersonalinfo();
    this.GetEmployeeAddress();
    this.GetFamilyDetails();
    this.GetCandidateLanguage();
    this.GetEmpAreaOfIntrest();
    this.GetEmpWorkExperience();
    this.GetEmpCertification();
    this.GetEmpEdutnQualifictin();
  }
  /////////////// code for family deteils /////
  famlyid: any;
  DeleteEmpCandidateFamilyDetails(event: any) {
    this.famlyid = event;
    this.candidateService.DeleteEmpCandidateLang(this.famlyid).subscribe(res => {
      this.famlyid = res
      if (this.famlyid.responseResult) {
        this.toastrService.success(this.famlyid.message);
        this.GetFamilyDetails();
      }
      else {
        this.toastrService.error(this.famlyid.message);
      }
    });
  }
  /////////////// code for delete language /////
  langid: any;
  DeleteEmpCandidateLang(event: any) {
    this.modalRef.hide();
    this.langid = event;
    this.candidateService.DeleteEmpCandidateLang(this.langid).subscribe(res => {
      this.langid = res
      if (this.langid.responseResult) {
        this.toastrService.success(this.langid.message);
        this.GetCandidateLanguage();
      }
      else {
        this.toastrService.error(this.langid.message);
      }
    });
  }

  intrestid: any;
  DeleteEmpCandidateAreaOfInterest(event: any) {
    this.modalRef.hide();
    this.intrestid = event;
    this.candidateService.DeleteEmpCandidateAreaOfInterest(this.intrestid).subscribe(res => {
      this.intrestid = res
      if (this.intrestid.responseResult) {
        this.toastrService.success(this.intrestid.message);
        this.GetEmpAreaOfIntrest();

      }
      else {
        this.toastrService.error(this.intrestid.message);
      }
    });
  }
  ///////////////////////
  certid: any;
  DeleteEmpCertification(event: any) {
    this.certid = event;
    this.modalRef.hide();
    this.candidateService.DeleteEmpCertification(this.certid).subscribe(res => {
      this.certid = res
      if (this.certid.responseResult) {
        this.toastrService.success(this.certid.message);
        this.GetEmpCertification();
      }
      else {
        this.toastrService.error(this.certid.message);
      }
    });
  }
  DeleteEmpFamilyDetail(event: any) {
    this.modalRef.hide();
    this.candidateService.DeleteEmpCandidateFamilyDetails(this.familyid).subscribe(res => {
      this.certid = res
      if (this.certid.responseResult) {
        this.toastrService.success(this.certid.message);
        this.GetFamilyDetails();
      }
      else {
        this.toastrService.error(this.certid.message);
      }
    });

  }
  ////////////////////////////////


  DeleteEducation(template: TemplateRef<any>, id: any) {
    this.educationid = id;
    this.modalRef = this.modalService.show(template, { class: 'modal-sm' });
  }


  educationid: any;
  DeleteEmpEducationQualification() {
    this.modalRef.hide();
    this.candidateService.DeleteEmpEducationQualification(this.educationid).subscribe(res => {
      this.educationid = res
      if (this.educationid.responseResult) {
        this.toastrService.success(this.educationid.message);
        this.GetEmpEdutnQualifictin();
      }
      else {
        this.toastrService.error(this.educationid.message);
      }
    });
  }

  ///////////////////////////////////
  DeleteEmpWorkExp(template: TemplateRef<any>, id: any) {

    this.familyid = id;
    this.modalRef = this.modalService.show(template, { class: 'modal-sm' });
  }
  DeleteEmpFamily(template: TemplateRef<any>, id: any) {
    this.workexpid = id;
    this.modalRef = this.modalService.show(template, { class: 'modal-sm' });
  }
  workexpid: any;
  DeleteEmpCandidateWorkExp(event: any) {
    this.workexpid = event;
    this.modalRef.hide();
    this.spinnerService.show();
    this.candidateService.DeleteEmpCandidateWorkExp(this.workexpid).subscribe(res => {
      this.spinnerService.hide();
      this.workexpid = res
      if (this.workexpid.responseResult) {
        this.toastrService.success(this.workexpid.message);
        this.GetEmpWorkExperience();
      }
      else {
        this.toastrService.error(this.workexpid.message);
      }
    });
  }
  ///////////////   min education details ///////////////
  mineducation: any = [];
  GetAllMinEducation() {
    this.masterService.GetAllMinEducation().subscribe(res => {
      this.mineducation = res;
      if (this.mineducation) {
        this.mineducation = this.mineducation;
      }
      else {
        this.mineducation = this.mineducation;
      }
    });
  }
  ///////////////   candiate details ///////////////
  jstoday
  personaldata: any = [];
  GetEmpCandidatePersonalinfo() {
    this.candidateService.GetEmpCandidatePersonalinfo(this.candid).subscribe(res => {
      this.personaldata = res;
      if (this.personaldata) {
        if (this.personaldata.lstCandidateInfo != null) {
          //console.log(this.personaldata);
          this.personaldata = this.personaldata.lstCandidateInfo[0];
          this.GetAllDistrict(this.personaldata.stateId);
          this.name = this.personaldata.candName != '' ? this.personaldata.candName : "";
          this.dob = new Date(this.personaldata.dob);
          this.emailid = this.personaldata.email != '' ? this.personaldata.email : "";
          this.mobile = this.personaldata.mobile != '' ? this.personaldata.mobile : "";
          this.gender = this.personaldata.gender != '' ? this.personaldata.gender : "";
          this.aboutme = this.personaldata.aboutMe != '' ? this.personaldata.aboutMe : "";
          this.religion = this.personaldata.religion != '' ? this.personaldata.religion : "";
          this.birthdistrict = this.personaldata.districtId != '' ? this.personaldata.districtId : "";
          this.birthstate = this.personaldata.stateId != '' ? this.personaldata.stateId : "";
          this.imagename = this.personaldata.image != '' ? this.personaldata.image : "";
          // this.ImgName=this.personaldata.imagename!=''?this.personaldata.imagename:"";
          this.prevImgName = this.personaldata.imagename != '' ? this.personaldata.imagename : "";
        }
      }
      else {
        this.personaldata = this.personaldata.lstCandidateInfo[0];
      }
    });
  }
  ////////
  addressinfodata: any;
  addressinfodatap: any;
  addressinfodatac: any;
  addressid: any;
  GetEmployeeAddress() {
    this.candidateService.GetEmployeeAddress(this.candid).subscribe(res => {
      this.addressinfodata = res;
      if (this.addressinfodata.lstEmployeeAddress != null && this.addressinfodata.lstEmployeeAddress.length != 0
      ) {
        if (this.addressinfodata.lstEmployeeAddress[0]) {
          this.addressinfodatap = this.addressinfodata.lstEmployeeAddress[0];
        }
        if (this.addressinfodata.lstEmployeeAddress[1]) {
          this.addressinfodatac = this.addressinfodata.lstEmployeeAddress[1];
        }
        if (this.addressinfodatap.id) {
          this.addressid = this.addressinfodatap.id;
        }
        this.GetAllDistrictaddress(this.addressinfodata.stateId != '' ? this.addressinfodatap.stateId : "");
        this.addressState = this.addressinfodatap.stateId != '' ? this.addressinfodatap.stateId : "";
        this.addressDistrict = this.addressinfodatap.addressDistrict != '' ? this.addressinfodatap.districtId : "";
        this.addressPincode = this.addressinfodatap.addressPincode != '' ? this.addressinfodatap.pinCode : "";
        this.addressCountry = 'India';
        this.address = this.addressinfodatap.address != '' ? this.addressinfodatap.address : "";
        this.addressLamdmark = this.addressinfodatap.landmark != '' ? this.addressinfodatap.landmark : "";
        //this.addressType=this.addressinfodata!=''?this.addressinfodata.addressType:"";
        this.SameAsAbove = this.addressinfodatap.SameAsAbove ? this.addressinfodatap.SameAsAbove : false;
        this.caddress = this.addressinfodatac.address ? this.addressinfodatac.address : '';
        this.caddressState = this.addressinfodatac.stateId ? this.addressinfodatac.stateId : '';
        this.GetAllcDistrictaddress(this.addressinfodatac.stateId);
        this.caddressDistrict = this.addressinfodatac.districtId ? this.addressinfodatac.districtId : '';;
        this.caddressPincode = this.addressinfodatac.pinCode ? this.addressinfodatac.pinCode : '';;
        this.caddressLamdmark = this.addressinfodatac.landmark ? this.addressinfodatac.landmark : '';
      }
      else {
        this.addressinfodata = this.addressinfodata.lstEmployeeAddress[0];
      }
    });
  }
  ////////////
  familyinfodata: any;
  GetFamilyDetails() {
    this.candidateService.GetFamilyDetails(this.candid).subscribe(res => {
      this.familyinfodata = res;
      if (this.familyinfodata) {
        this.familyinfodata = this.familyinfodata.lstGetFamilyDtl;
      }
      else {
      }
    });
  }
  ////////////
  langinfodata: any;
  GetCandidateLanguage() {
    this.candidateService.GetCandidateLanguage(this.candid).subscribe(res => {
      this.langinfodata = res;
      if (this.langinfodata) {
        this.langinfodata = this.langinfodata.lstCandidateLang;
      }
      else {
        this.langinfodata = res;
      }
    });

  }
  //////////
  areainfodata: any;
  GetEmpAreaOfIntrest() {
    this.candidateService.GetEmpAreaOfIntrest(this.candid).subscribe(res => {
      this.areainfodata = res;
      if (this.areainfodata) {
        this.areainfodata = this.areainfodata.lstAreaOfIntrest;
      }
      else {
        this.areainfodata = res;
      }
    });
  }
  //////////
  workexpinfodata: any = {};
  GetEmpWorkExperience() {
    this.count = 1;
    this.spinnerService.show();
    this.candidateService.GetEmpWorkExperience(this.candid).subscribe(res => {
      this.spinnerService.hide();
      this.workexpinfodata = res;
      if (this.workexpinfodata) {
        this.workexpinfodata = this.workexpinfodata.lstEmpWorkExperience;
      }
      else {
        this.workexpinfodata = this.workexpinfodata.lstEmpWorkExperience[0];
      }
    });

  }
  ////////////
  empcertinfodata: any;
  GetEmpCertification() {
    this.spinnerService.show();
    this.candidateService.GetEmpCertification(this.candid).subscribe(res => {
      this.spinnerService.hide();
      this.empcertinfodata = res;
      if (this.empcertinfodata) {
        this.empcertinfodata = this.empcertinfodata.lstEmpCertification;
      }
      else {
        this.empcertinfodata = this.empcertinfodata.lstEmpCertification[0];
      }
    });

  }
  //////////
  empeduinfodata: any;
  GetEmpEdutnQualifictin() {
    this.spinnerService.show();
    this.candidateService.GetEmpEdutnQualifictin(this.candid).subscribe(res => {
      this.spinnerService.hide();
      this.empeduinfodata = res;
      if (this.empeduinfodata) {
        this.empeduinfodata = this.empeduinfodata.lstEmpEdutnQualifictin;
      }
      else {
        this.empeduinfodata = this.empeduinfodata.lstEmpEdutnQualifictin[0];
      }
    });
  }
  /////////////////// End candiate details //////////
  addressdistirct: any;
  workexpdistics: any;
  GetAllDistrict(stateid: any) {
    if (stateid) {
      this.masterService.GetAllDistrict(stateid).subscribe(res => {
        this.districts = res;
        this.distirctssts = true;
      });
    }else{
      this.districts=[];
    }
  }
  GetAllDistrictaddress(stateid: any) {
    if (stateid) {
      this.masterService.GetAllDistrict(stateid).subscribe(res => {
        this.addressdistirct = res;
        this.addressdistirct = this.addressdistirct;
      });
    } else {
      this.addressdistirct = [];
    }
  }
  GetAllDistrictwork(stateid: any) {
    if (stateid) {
      this.masterService.GetAllDistrict(stateid).subscribe(res => {
        this.workexpdistics = res;
        this.workexpdistics = this.workexpdistics;
      });
    } else {
      this.workexpdistics = [];
    }
  }
  cdistricaddress: any;
  GetAllcDistrictaddress(stateid: any) {
    if (stateid) {
      this.masterService.GetAllDistrict(stateid).subscribe(res => {
        this.cdistricaddress = res;
        this.cdistricaddress = this.cdistricaddress;
      });
    }
  }
  rel: any = [];
  GetAllRelationdetails() {
    this.candidateService.GetAllRelation().subscribe(res => {
      this.rel = res;
    });
  }

  religions: any = [];
  GetAllReligions_details() {
    this.candidateService.GetAllReligions().subscribe(res => {
      this.religions = res;
    });
  }
  validateDOB: any;
  submitPersonalInfo() {
    var image;
    var personalinfo = {};
    if (this.ImgName != '' && this.ImgName != null) {
      image = '';
    }
    else {
      image = this.prevImgName;
    }
    this.validateDOB = this.datepipe.transform(this.dob, "yyyy-MM-dd");

    personalinfo = JSON.stringify({
      'CandName': this.name.trim(),
      'DOB': this.dob,
      'Email': this.emailid.trim(),
      'Mobile': this.mobile,
      'Gender': this.gender,
      'Religion': this.religion,
      'CountryId': "1",
      'StateId': this.birthstate,
      'DistrictId': this.birthdistrict,
      'AboutMe': this.aboutme.trim(),
      // 'UserId':"0",
      'CandidateId': this.candid,
      'Imagename': image,
      'Image': this.base64textString[0]
    });
    // console.log(personalinfo);
    this.spinnerService.show();
    this.candidateService.CandidatePersonalinfo(personalinfo).subscribe(res => {
      this.spinnerService.hide();
      this.response = res;
      if (this.response.responseResult) {
        this.toastrService.success(this.response.message);
        //this.candid=this.response.id
        personalinfo = {};

      } else {
        this.toastrService.error(this.response.message);

        personalinfo = {};
      }
    })

  }

  //add languag into list
  languageListItemshow: any = [];
  addLanguageList() {
    if (this.read == true || this.write == true || this.speak == true) {
      if (this.language.length > 0 && this.LangErr) {
        var readvalue: any;
        var writevalue: any;
        var speakvalue: any;
        var name = this.languages.find(x => x.id == this.language).name;
        readvalue = this.read ? 'true' : 'false';
        writevalue = this.write ? 'true' : 'false';
        speakvalue = this.speak ? 'true' : 'false';
        let item = { 'CandId': this.candid, 'LanguageId': this.language, 'IsRead': readvalue, 'IsWrite': writevalue, 'IsSpeak': speakvalue, 'EmpLanguageId': 0 };
        this.languageListItem.push(item);
        this.submitLanguageInfo();
      }
      else {
        if (this.LangErr) {
          this.toastrService.error('Please select language');
        }
        else {
          this.toastrService.error('Language already exist kindly change it');
        }

      }
    } else {
      this.toastrService.error('Please select atleast one language checkbox');
    }

  }
  submitLanguageInfo() {
    if (this.languageListItem.length > 0) {
      this.candidateService.CandidateLanguageinfo(this.languageListItem).subscribe(res => {
        this.response = res;
        if (this.response.responseResult) {
          this.toastrService.success(this.response.message);
          this.languageListItem = [];
          this.GetCandidateLanguage();
          this.language = "";
          this.read = false;
          this.write = false;
          this.speak = false;
        } else {
          this.toastrService.error(this.response.message);
          this.languageListItem = [];
        }
      })
    }
  }
  LangErr: boolean = true;
  GetAllLangg(langId: any) {
    let langinfoid = (this.langinfodata).filter(function (entry) {
      return entry.languageId == langId;
    });

    if (langinfoid != '' && langinfoid) {
      this.LangErr = false;
      this.toastrService.error('Language already exists');
    }
    else {
      this.LangErr = true;
    }
  }
  checksameabovevalue: boolean = false;
  sameasabovechnage(event: any) {
    if (event == 1) {
      this.caddress = this.address;
      this.caddressState = this.addressState;
      this.GetAllcDistrictaddress(this.addressState)
      this.caddressDistrict = this.addressDistrict;
      this.caddressPincode = this.addressPincode;
      this.caddressLamdmark = this.addressLamdmark;
      this.checksameabovevalue = true;
    }
    else {
      this.caddress = '';
      this.caddressState = '';
      this.caddressDistrict = '';
      this.caddressPincode = '';
      this.caddressLamdmark = '';
      this.checksameabovevalue = false;
    }
  }
  submitAddressInfo() {

    var addressinfo = [];
    var addresstypep = {};
    var addresstypec = {};
    if (this.addressState > 0 || this.addressDistrict > 0 || this.addressPincode > 0 || this.address.trim() != "" || this.addressLamdmark.trim() != "") {
      addresstypep = {
        "Id": this.addressid != '' ? this.addressid : 0,
        "candidateid": this.candid,
        "StateId": this.addressState != '' ? this.addressState : 0,
        "DistrictId": this.addressDistrict != '' ? this.addressDistrict : 0,
        "PinCode": this.addressPincode,
        "CountryId": "91",
        "SameAsAbove": this.SameAsAbove,
        "Address": this.address.trim(),
        "landmark": this.addressLamdmark.trim(),
        "AddressType": "P"
      };
      addresstypec = {
        "Id": this.addressid != '' ? this.addressid : 0,
        "candidateid": this.candid,
        "StateId": this.caddressState != '' ? this.caddressState : 0,
        "DistrictId": this.caddressDistrict != '' ? this.caddressDistrict : 0,
        "PinCode": this.caddressPincode,
        "CountryId": "91",
        "SameAsAbove": this.SameAsAbove,
        "Address": this.caddress.trim(),
        "landmark": this.caddressLamdmark.trim(),
        "AddressType": "C"
      }
      addressinfo.push(addresstypep);
      addressinfo.push(addresstypec);
      this.candidateService.AddressInfo(addressinfo).subscribe(res => {
        this.response = res;
        if (this.response.responseResult) {
          this.toastrService.success(this.response.message);
          addressinfo = [];
          addresstypep = {};
          addresstypec = {};
        } else {
          this.toastrService.error(this.response.message);
          addressinfo = [];
          addresstypep = {};
          addresstypec = {};
        }
      })
    }

  }
  familyinfo: any = [];
  familyadd() {
    var IsValidfamily = true;
    var errorMsgfamily = "";
    var IndNum = /^[0]?[6789]\d{9}$/;
    var regexEmail = /\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*/;
    var regexIndNum = /^\(?([0-9]{1})\)?[-. ]?([0-9]{5})[-. ]?([0-9]{4})$/;
    var regemail = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    
    if (IsValidfamily) {
      if (this.familyName.trim().length == 0) {
        errorMsgfamily += "Enter name. <br/>";
        IsValidfamily = false;
      }
      if (this.familyRelation.length == 0) {
        errorMsgfamily += "Please select relation. <br/>";
        IsValidfamily = false;
      }
      // if(this.familyName.trim().length>0 && this.familyRelation.length==0)
      // {
      //   errorMsgfamily += "Please select relation. <br/>";
      //   IsValidfamily = false;
      // }
      // if(this.familyRelation.length >0 && this.familyName.trim().length==0){
      //   errorMsgfamily += "Enter name. <br/>";
      //   IsValidfamily = false;
      //   //return false;
      // }
      if (this.familyEmail.trim().length > 0 && !regemail.test(this.familyEmail)) {
        errorMsgfamily += "Entered email not valid. <br/>";
        IsValidfamily = false;
      }
     
      if (this.familyMobile.length < 10) {
        errorMsgfamily += "Enter valid mobile no. <br/>";
        IsValidfamily = false;
      }
      if (this.familyMobile.length == 10 && !IndNum.test(this.familyMobile)) {
        errorMsgfamily += "Entered mobile no. not valid. <br/>";
        IsValidfamily = false;
      }
    }
    if (!IsValidfamily) {
      this.toastrService.error(errorMsgfamily, null, { enableHtml: true });
      return IsValidfamily;
    }
    else {

      // let familyinfoid = (this.familyinfodata).filter(function (entry) {
      //   return entry.id == famlyid;
      // });
      this.familyinfo = JSON.stringify({
        "Id": 0,
        "Candid": this.candid,
        "RelationId": this.familyRelation,
        "Name": this.familyName.trim(),
        "Mobile": this.familyMobile,
        "Email": this.familyEmail.trim()
      });
      this.submitFamilyInfo();
      return true;
    }
  }
  ////////////////////////////////////////
  familyaddbuttonshow: any = '1';
  familyupdatebuttonshow: any = '0';
  familyid
  familyedit(editid: any) {
    this.familyaddbuttonshow = '0';
    this.familyupdatebuttonshow = '1';
    this.familyid = editid;
    if (this.familyid != '' && this.familyid != 'null' && this.familyid != 'undefined') {
      let famlyid = this.familyid;
      let familyinfoid = (this.familyinfodata).filter(function (entry) {
        return entry.id == famlyid;
      });
      this.familyName = familyinfoid[0].name != '' ? familyinfoid[0].name : "";
      this.familyRelation = familyinfoid[0].relationId != '' ? familyinfoid[0].relationId : "";
      this.familyMobile = familyinfoid[0].mobile != '' ? familyinfoid[0].mobile : "";
      this.familyEmail = familyinfoid[0].email != '' ? familyinfoid[0].email : "";
    }
  }

  ////////////////////
  familyeditsave() {
    var IsValidfamily = true;
    var errorMsgfamily = "";
    var regexEmail = /\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*/;
    var regexIndNum = /^\(?([0-9]{1})\)?[-. ]?([0-9]{5})[-. ]?([0-9]{4})$/;

    if (IsValidfamily) {
      // if(this.familyName.length==0){
      //     errorMsgfamily += "Enter name . <br/>";
      //     IsValidfamily = false;
      //     //return false;
      //   }
      if (this.familyName.trim().length > 0 && this.familyRelation.length == 0) {
        errorMsgfamily += "Please select relation. <br/>";
        IsValidfamily = false;
      }
      if (this.familyRelation.length > 0 && this.familyName.trim().length == 0) {
        errorMsgfamily += "Enter name. <br/>";
        IsValidfamily = false;
        //return false;
      }
      if (this.familyEmail.trim().length > 0 && !regexEmail.test(this.familyEmail)) {
        errorMsgfamily += "Entered email not valid. <br/>";
        IsValidfamily = false;
      }
      if (!regexIndNum.test(this.familyMobile) && this.familyMobile.length != 0) {
        errorMsgfamily += " Entered moble no. not valid. <br/>";
        IsValidfamily = false;
      }
    }
    if (!IsValidfamily) {
      this.toastrService.error(errorMsgfamily, null, { enableHtml: true });
      return IsValidfamily;
    }
    else {
      this.familyinfo = JSON.stringify({
        "Id": this.familyid,
        "Candid": this.candid,
        "RelationId": this.familyRelation,
        "Name": this.familyName.trim(),
        "Mobile": this.familyMobile,
        "Email": this.familyEmail.trim()
      });

      this.submitFamilyInfo();
      return true;
    }
  }
  //////////////////////////////////////////////
  submitFamilyInfo() {
    if (this.familyName.trim().length > 0 || this.familyRelation > 0 || this.familyEmail.trim().length > 0 || this.familyMobile > 0) {

      this.candidateService.FamilyInfo(this.familyinfo).subscribe(res => {
        this.response = res;
        if (this.response.responseResult) {
          this.toastrService.success(this.response.message);
          this.familyinfo = [];
          this.familyinfodata = [];
          this.familyName = '';
          this.familyRelation = '';
          this.familyMobile = '';
          this.familyEmail = '';
          this.familyaddbuttonshow = '1';
          this.familyupdatebuttonshow = '0';
          this.GetFamilyDetails();
        } else {
          this.toastrService.error(this.response.message);
          this.familyinfo = [];
        }
      })
    }
  }
  //add hobbehy into list
  hobbiesItemshow: any = [];
  addHobbiesList() {
    this.interest = this.interest.trim();
    var interestForValid=this.interest;
    let interestData = (this.areainfodata).filter(function (entry) {
      return entry.interest == interestForValid;
    });
    if(interestData !='' && interestData){
      this.toastrService.error('Area of interest / hobbies already exists');
      return false;
    }
    if (this.interest.length > 0) {
      let item = { "CandId": this.candid, "Interest": this.interest, "Intrestid": 0 };
      this.hobbiesItem.push(item);
      this.interest = '';
      this.submitHobbiesInfo();
    }
    else {
      this.toastrService.error('Please Enter Area of interest / hobbies');
    }

  }

  submitHobbiesInfo() {
    if (this.hobbiesItem.length > 0) {
      this.candidateService.HobbiesInfo(this.hobbiesItem).subscribe(res => {
        this.response = res;
        if (this.response.responseResult) {
          this.toastrService.success(this.response.message);
          this.hobbiesItem = [];
          this.hobbiesItemshow = [];
          this.GetEmpAreaOfIntrest();
        } else {
          this.toastrService.error(this.response.message);
          //this.spinnerService.hide();
          this.hobbiesItem = [];
          this.hobbiesItemshow = [];
        }
      })
    }
  }
  hobiesUpdateBtn: boolean = false;
  hobiesAddBtn: boolean = true;
  hobId: any;
  EditHobbies:any;
  hobbiesedit(hobiesid: any) {
    this.hobId = hobiesid;
    this.hobiesUpdateBtn = true;
    this.hobiesAddBtn = false;
    this.hobbiesItem = [];
    let hobid = (this.areainfodata).filter(function (entry) {
      return entry.id == hobiesid;
    });
    this.interest = hobid[0].interest;
    this.EditHobbies=this.interest;
  }
  updateHobbiesList() {
    this.hobiesUpdateBtn = false;
    this.hobiesAddBtn = true;
    this.interest = this.interest.trim();

    var interestForValid=this.interest;
    let interestData = (this.areainfodata).filter(function (entry) {
      return entry.interest == interestForValid;
    });
    if(this.EditHobbies != interestForValid){
      if(interestData !='' && interestData){
        this.toastrService.error('Area of interest / hobbies already exists');
        return false;
      }
    }

    
    if (this.interest.length > 0) {
      let item = { "CandId": this.candid, "Interest": this.interest, "Intrestid": this.hobId };
      this.hobbiesItem.push(item);
      this.interest = '';
      this.submitHobbiesInfo();
    }
    else {
      this.toastrService.error('Please Enter Area of interest / hobbies');
    }
  }
  workexpsave: any = [];
  workid: any;
  periodFromVld: any;
  workexpadd() {
    var IsValidwork = true;
    var errorMsgwork = "";
    this.periodFromVld = this.datepipe.transform(this.periodFrom, "yyyy-MM-dd");

    if (this.periodFromVld < this.validateDOB) {
      errorMsgwork += "Please enter period[from] date after candidate's date of Birth";
      IsValidwork = false;
    } else {
      IsValidwork = true;
    }


    var regexEmail = /\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*/;
    var regexIndNum = /^\(?([0-9]{1})\)?[-. ]?([0-9]{5})[-. ]?([0-9]{4})$/;
    var d1 = new Date(this.periodFrom);
    var d2 = new Date(this.periodTo);

    if (IsValidwork) {
      if (this.jobTile.trim().length == 0) {
        errorMsgwork += "Enter job titile. <br/>";
        IsValidwork = false;
      }
      if (this.company.trim().length == 0) {
        errorMsgwork += "Enter company. <br/>";
        IsValidwork = false;
      }
      if (this.jobState.length == 0) {
        errorMsgwork += "Please select state. <br/>";
        IsValidwork = false;
      }
      if (this.jobDistrict.length == 0) {
        errorMsgwork += "Please select District. <br/>";
        IsValidwork = false;
      }

      if (this.currentctc.length == 0) {
        errorMsgwork += "Enter current ctc. <br/>";
        IsValidwork = false;
      }
      if (this.radiovalue == "Yes") {
        this.periodTo = new Date();
      }
      if (this.working == "") {
        errorMsgwork += "Select currently working. <br/>";
        IsValidwork = false;
      }
      // if(this.periodTo.length==0)
      // {
      // errorMsgwork += "Enter period to. <br/>";
      // IsValidwork = false;
      // }

      if (this.radiovalue == "No") {
        if (this.periodTo.length == 0) {
          //If candidate is not currently working by Neeraj Singh

          errorMsgwork += "Enter periodto. <br/>";
          IsValidwork = false;
        }

      }

      if (this.periodFrom.length == 0) {
        errorMsgwork += "Enter period from. <br/>";
        IsValidwork = false;
      }
      if (d1 > d2 && this.periodFrom != '' && this.periodTo != '') {
        errorMsgwork += "Entered period to must be greater than period from. <br/>";
        IsValidwork = false;
      }
      if (this.jobDescription.trim().length == 0) {
        errorMsgwork += "Enter job description. <br/>";
        IsValidwork = false;
      }


    }
    if (!IsValidwork) {
      this.toastrService.error(errorMsgwork, null, { enableHtml: true });
      return IsValidwork;
    }
    else {
      if (this.working == "Yes") {
        this.working = true;
      } else if (this.working == "No") {
        this.working = false;
      }
      this.workexpsave.push({
        "Id": 0,
        "CandId": this.candid,
        "JobTitle": this.jobTile.trim(),
        "CompanyName": this.company.trim(),
        // "CountryId":this.jobCountry,
        "CountryId": "91",
        "StateId": this.jobState ? this.jobState : "",
        "DistrictId": this.jobDistrict ? this.jobDistrict : "",
        "CurrentlyWorking": this.working,
        "CurrentCtc": this.currentctc ? this.currentctc : "0.00",
        "JobPeriodTo": this.periodTo ? this.periodTo : this.maxDate,//When candidate is currently working by Neeraj Singh
        "JobPeriodFrom": this.periodFrom ? this.periodFrom : "",
        "JobDesc": this.jobDescription.trim()

      });
      this.submitWorkExperience();
    }
  }
  workaddbuttonshow: any = '1';
  workaupdatebuttonshow: any = '0';
  workexpedit(editid: any) {

    this.workaddbuttonshow = '0';
    this.workaupdatebuttonshow = '1';
    this.workid = editid;
    if (this.workid != '' && this.workid != 'null' && this.workid != 'undefined') {
      let workid = this.workid;
      let workinfoid = (this.workexpinfodata).filter(function (entry) {
        return entry.id == workid;
      });
      this.GetAllDistrictwork(workinfoid[0].stateId != "" ? workinfoid[0].stateId : "0");
      if (workinfoid[0].currentlyWorking) {
        var workingValue = "Yes";
      } else {
        workingValue = "No";
      }
      this.jobTile = workinfoid[0].jobTitle != '' ? workinfoid[0].jobTitle : "";
      this.company = workinfoid[0].companyName != '' ? workinfoid[0].companyName : "";
      this.jobCountry = 'India';
      this.jobState = workinfoid[0].stateId != '' ? workinfoid[0].stateId : "0";
      this.jobDistrict = workinfoid[0].districtId != '' ? workinfoid[0].districtId : "0";
      // this.working = workinfoid[0].currentlyWorking != '' ? workinfoid[0].currentlyWorking:"";
      this.working = workingValue;
      this.currentctc = workinfoid[0].currentCtc != '' ? workinfoid[0].currentCtc : "";
      this.periodFrom = new Date(workinfoid[0].jobPeriodFrom);
      this.periodTo = new Date(workinfoid[0].jobPeriodTo);
      this.jobDescription = workinfoid[0].jobDesc != '' ? workinfoid[0].jobDesc : "";
      this.jobBtach = "";
      // if(workinfoid[0].currentlyWorking){
      //   this.working=workinfoid[0].currentlyWorking;
      //   console.log(this.working);
      // }

    }
  }

  workexpeditsave() {
    // var ddMMyyyy = this.datepipe.transform(new Date(),"dd-MM-yyyy");
    var IsValidwork = true;
    var errorMsgwork = "";

    var periodFrom = this.datepipe.transform(this.periodFrom, "yyyy-MM-dd");
    if (periodFrom < this.validateDOB) {
      errorMsgwork += "Please enter period[from] date after candidate's date of Birth";
      IsValidwork = false;
    } else {
      IsValidwork = true;
    }
    var regexEmail = /\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*/;
    var regexIndNum = /^\(?([0-9]{1})\)?[-. ]?([0-9]{5})[-. ]?([0-9]{4})$/;
    var d1 = new Date(this.periodFrom);
    var d2 = new Date(this.periodTo);

    if (IsValidwork) {
      if (this.jobTile.trim().length == 0) {
        errorMsgwork += "Enter job titile. <br/>";
        IsValidwork = false;
      }
      if (this.company.trim().length == 0) {
        errorMsgwork += "Enter company. <br/>";
        IsValidwork = false;
      }

      if (this.jobState.length == 0) {
        errorMsgwork += "Please select state. <br/>";
        IsValidwork = false;
      }
      if (this.jobDistrict.length == 0) {
        errorMsgwork += "Please select District. <br/>";
        IsValidwork = false;
      }

      if (this.currentctc.length == 0) {
        errorMsgwork += "Enter current ctc. <br/>";
        IsValidwork = false;
      }
      if (this.working == "") {
        errorMsgwork += "Select currently working. <br/>";
        IsValidwork = false;
      }
      if (this.radiovalue == "Yes") {
        // this.periodTo=ddMMyyyy;
        this.periodTo = new Date();

      }
      // if(this.periodTo.length==0)
      // {
      // errorMsgwork += "Enter period to. <br/>";
      // IsValidwork = false;
      // }
      if (this.radiovalue == "No") {
        if (this.periodTo.length == 0) {
          //If candidate is not currently working by Neeraj Singh

          errorMsgwork += "Enter periodto. <br/>";
          IsValidwork = false;
        }

      }

      if (this.periodFrom.length == 0) {
        errorMsgwork += "Enter period from. <br/>";
        IsValidwork = false;
      }
      if (this.radiovalue == false) {
        if (d1 > d2 && this.periodFrom != '' && this.periodTo != '') {
          errorMsgwork += "Entered period to must be greater than period from. <br/>";
          IsValidwork = false;
        }
      }

      if (this.jobDescription.trim().length == 0) {
        errorMsgwork += "Enter job description. <br/>";
        IsValidwork = false;
      }
    }
    if (!IsValidwork) {
      this.toastrService.error(errorMsgwork, null, { enableHtml: true });
      return IsValidwork;
    }
    else {
      this.count = 1;
      if (this.working == "Yes") {
        this.working = true;
      } else if (this.working == "No") {
        this.working = false;
      }

      this.workexpsave.push({
        "Id": this.workid,
        "CandId": this.candid,
        "JobTitle": this.jobTile.trim(),
        "CompanyName": this.company.trim(),
        // "CountryId":this.jobCountry,
        "CountryId": "91",
        "StateId": this.jobState ? this.jobState : "",
        "DistrictId": this.jobDistrict ? this.jobDistrict : "",
        "CurrentlyWorking": this.working,
        "CurrentCtc": this.currentctc ? this.currentctc : "0.00",
        "JobPeriodTo": this.periodTo ? this.periodTo : "",
        "JobPeriodFrom": this.periodFrom ? this.periodFrom : "",
        "JobDesc": this.jobDescription.trim()
      });
      this.submitWorkExperience();
      this.workaddbuttonshow = '1';
      this.workaupdatebuttonshow = '0';
    }
  }
  count: any = 1;

  submitWorkExperience() {
    if (this.count == 1) {

      if (this.workexpsave.length > 0) {
        this.candidateService.WorkExperience(this.workexpsave).subscribe(res => {
          this.response = res;
          if (this.response.responseResult) {
            this.toastrService.success(this.response.message);
            this.workexpsave = [];
            this.GetEmpWorkExperience();
            this.jobTile = "";
            this.company = "";
            this.jobCountry = 'India';
            this.jobState = "";
            this.jobDistrict = "";
            this.working = "Yes";
            this.currentctc = "";
            this.periodFrom = "";
            this.periodTo = "";
            this.jobDescription = "";
            this.jobBtach = "";

          } else {
            this.toastrService.error(this.response.message);
            this.workexpsave = [];
          }
        })
      }

    }
    this.count++;

  }

  educationsave: any = [];
  eduid: any;
  eduaddbuttonshow: any = '1';
  eduupdatebuttonshow: any = '0';
 
  educationadd() {
    this.count = 1;
    if(this.count == 1){
      var errorMsgedu = "";
      if (this.qualifErro == false) {
        errorMsgedu += "qualification already exists kindly change it. <br/>";
        this.IsValidedu = false;
      } else {
        this.IsValidedu = true;
      }
      if (this.IsValidedu) {
        if (this.qualification.length == 0) {
          errorMsgedu += "Select qualification. <br/>";
          this.IsValidedu = false;
        }
        if (this.board.trim().length == 0) {
          errorMsgedu += "Enter board. <br/>";
          this.IsValidedu = false;
        }
        if (this.stream.trim().length == 0) {
          errorMsgedu += "Enter stream. <br/>";
          this.IsValidedu = false;
        }
        if (this.percenatge.trim().length == 0) {
          errorMsgedu += "Enter percenatge. <br/>";
          this.IsValidedu = false;
        }
        if (this.percenatge.trim() > 100) {
          errorMsgedu += "Entered percenatge must be less than or equals to 100. <br/>";
          this.IsValidedu = false;
        }
        if (this.passingYear.length == 0) {
          errorMsgedu += "Select passing year. <br/>";
          this.IsValidedu = false;
        }
      }
      if (!this.IsValidedu) {
        this.toastrService.error(errorMsgedu, null, { enableHtml: true });
        return this.IsValidedu;
      }
      else {
        this.educationsave.push({
          "Id": 0,
          "CandId": this.candid,
          "Education": this.qualification ? this.qualification : "",
          "Board": this.board.trim() ? this.board.trim() : "",
          "Stream": this.stream.trim() ? this.stream.trim() : "",
          "Percentage": this.percenatge ? this.percenatge : "0.00",
          "YearOfPassing": this.passingYear ? this.passingYear : ""
        });
        this.submitEducationalQualification();
      }
    }
    this.count++;
  
  }
  educationedit(educaid: any) {
    this.IsValidedu = true;
    this.eduaddbuttonshow = '0';
    this.eduupdatebuttonshow = '1';
    this.eduid = educaid;
    if (this.eduid != '' && this.eduid != 'null' && this.eduid != 'undefined') {
      let empeduid = this.eduid;
      let empeduinfoid = (this.empeduinfodata).filter(function (entry) {
        return entry.id == empeduid;
      });
      this.qualification = empeduinfoid[0].education != '' ? empeduinfoid[0].education : "";
      this.board = empeduinfoid[0].board != '' ? empeduinfoid[0].board : "";
      this.stream = empeduinfoid[0].stream != '' ? empeduinfoid[0].stream : "";
      this.percenatge = empeduinfoid[0].percentage != '' ? empeduinfoid[0].percentage : "";
      this.passingYear = empeduinfoid[0].yearOfPassing != '' ? empeduinfoid[0].yearOfPassing : "0";
      this.myBtach = "";
    }
  }
  IsValidedu = true;
  educationeditsave() {

    var errorMsgedu = "";
    if (this.editQualifErro == false) {
      errorMsgedu += "qualification already exists kindly change it. <br/>";
      this.IsValidedu = false;
    } else {
      this.IsValidedu = true;
    }
    if (this.IsValidedu) {
      if (this.qualification.length == 0) {
        errorMsgedu += "Select qualification. <br/>";
        this.IsValidedu = false;
      }

      if (this.board.trim().length == 0) {
        errorMsgedu += "Enter board. <br/>";
        this.IsValidedu = false;
      }

      if (this.stream.length == 0) {
        errorMsgedu += "Enter stream. <br/>";
        this.IsValidedu = false;
      }
      if (this.percenatge.length == 0) {
        errorMsgedu += "Enter percenatge. <br/>";
        this.IsValidedu = false;
      }
      if (this.percenatge.length > 0 && this.percenatge.length > 100) {
        errorMsgedu += "Entered percenatge must be less than or equals to 100. <br/>";
        this.IsValidedu = false;
      }
      if (this.passingYear.length == 0) {
        errorMsgedu += "Select passing year. <br/>";
        this.IsValidedu = false;
      }
    }
    if (!this.IsValidedu) {
      this.toastrService.error(errorMsgedu, null, { enableHtml: true });
      return this.IsValidedu;
    }
    else {
      this.educationsave.push({
        "Id": this.eduid,
        "CandId": this.candid,
        "Education": this.qualification ? this.qualification : "",
        "Board": this.board.trim() ? this.board.trim() : "",
        "Stream": this.stream.trim() ? this.stream.trim() : "",
        "Percentage": this.percenatge ? this.percenatge : "0.00",
        "YearOfPassing": this.passingYear ? this.passingYear : ""
      });
      this.submitEducationalQualification();
      this.eduaddbuttonshow = '1';
      this.eduupdatebuttonshow = '0';
    }
  }
  submitEducationalQualification() {
    if (this.educationsave.length > 0) {
      this.spinnerService.show();
      this.candidateService.EducationalQualification(this.educationsave).subscribe(res => {
        this.spinnerService.hide();
        this.response = res;
        if (this.response.responseResult) {
          this.toastrService.success(this.response.message);
          this.educationsave = [];
          this.GetEmpEdutnQualifictin();
          this.qualification = "";
          this.board = "";
          this.stream = "";
          this.percenatge = "";
          this.passingYear = "";
        } else {
          this.toastrService.error(this.response.message);
          this.educationsave = [];
        }
      })

    }
  }
  qualifErro: boolean = true;
  editQualifErro: boolean = true;
  GetAllEducatiom(CandId: any) {
    let EducationDetail = (this.empeduinfodata).filter(function (entry) {
      return entry.education == CandId;
    });

    if (EducationDetail != '' && EducationDetail) {
      // this.qualification = "";
      this.qualifErro = false;
      this.toastrService.error('This qualification already exists');
      this.IsValidedu = false;
      this.editQualifErro = false;
    } else {
      this.qualifErro = true;
      this.editQualifErro = true;
    }
  }
  certsave: any = [];
  certficationid: any;
  certaddbuttonshow: any = '1';
  certupdatebuttonshow: any = '0';
  certadd() {
    var errorMsgecert = "";
    var IsValidcert = true;

    var IssueOnVld = this.datepipe.transform(this.issuedOn, "yyyy-MM-dd");

    if (IssueOnVld < this.validateDOB) {
      errorMsgecert += "Please enter issue on date after candidate's date of Birth";
      IsValidcert = false;
    } else {
      IsValidcert = true;
    }

    var certNo = this.certificateNo;
    let certficateid = (this.empcertinfodata).filter(function (entry) {
      return entry.certificationNo == certNo;
    });
    if (certficateid != '' && certficateid) {
      errorMsgecert += "Certification no. already exists <br/>";
      IsValidcert = false;
    }

    if (IsValidcert) {
      if (this.certificateNo.trim().length == 0) {
        errorMsgecert += "Enter certificate no. <br/>";
        IsValidcert = false;
      }
      if (this.programName.trim().length == 0) {
        errorMsgecert += "Enter program name. <br/>";
        IsValidcert = false;
      }

      if (this.issuedBy.trim().length == 0) {
        errorMsgecert += "Enter issued by. <br/>";
        IsValidcert = false;
      }
      if (this.issuedOn.length == 0) {
        errorMsgecert += "Select issued on. <br/>";
        IsValidcert = false;
      }

    }
    if (!IsValidcert) {
      this.toastrService.error(errorMsgecert, null, { enableHtml: true });
      return IsValidcert;
    }
    else {
      this.certsave.push({
        "Id": 0,
        "CandId": this.candid,
        "CertificationNo": this.certificateNo.trim() ? this.certificateNo.trim() : "",
        "ProgramName": this.programName.trim() ? this.programName.trim() : "NULL",
        "IssuedBy": this.issuedBy.trim() ? this.issuedBy.trim() : "",
        "IssuedOn": this.issuedOn ? this.issuedOn : ""
      });
      this.submitCertification();
    }
  }
  certDuplicate: any;
  certedit(certid: any) {
    this.certaddbuttonshow = '0';
    this.certupdatebuttonshow = '1';
    this.certficationid = certid;
    if (this.certficationid != '' && this.certficationid != 'null' && this.certficationid != 'undefined') {
      let empcertid = this.certficationid;
      let empcertinfoid = (this.empcertinfodata).filter(function (entry) {
        return entry.id == empcertid;
      });

      this.certificateNo = empcertinfoid[0].certificationNo != '' ? empcertinfoid[0].certificationNo : "";
      this.certDuplicate = this.certificateNo;
      this.programName = empcertinfoid[0].programName != '' ? empcertinfoid[0].programName : "";
      this.issuedBy = empcertinfoid[0].issuedBy != '' ? empcertinfoid[0].issuedBy : "";
      //  this.issuedOn=empcertinfoid[0].issuedOn!=''?empcertinfoid[0].issuedOn:"";
      this.issuedOn = new Date(empcertinfoid[0].issuedOn);
      this.issuedBatch = "";
    }
  }
  certeditsave() {
    var IsValidcert = true;
    var errorMsgecert = "";

    var IssueOnVld = this.datepipe.transform(this.issuedOn, "yyyy-MM-dd");

    if (IssueOnVld < this.validateDOB) {
      errorMsgecert += "Please enter issue on date after candidate's date of Birth";
      IsValidcert = false;
    } else {
      IsValidcert = true;
    }
    
    var certNo = this.certificateNo;
    if (this.certDuplicate == this.certificateNo) {
      IsValidcert = true;
    } else {
      let certficateid = (this.empcertinfodata).filter(function (entry) {
        return entry.certificationNo == certNo;
      });
      if (certficateid != '' && certficateid) {
        errorMsgecert += "Certification no. already exists <br/>";
        IsValidcert = false;
      }
    }


    if (IsValidcert) {
      if (this.certificateNo.trim().length == 0) {
        errorMsgecert += "Enter certificate no. <br/>";
        IsValidcert = false;
      }
      if (this.programName.trim().length == 0) {
        errorMsgecert += "Enter program name. <br/>";
        IsValidcert = false;
      }
      if (this.issuedBy.trim().length == 0) {
        errorMsgecert += "Enter issued by. <br/>";
        IsValidcert = false;
      }
      if (this.issuedOn.length == 0) {
        errorMsgecert += "Select issued on. <br/>";
        IsValidcert = false;
      }
    }
    if (!IsValidcert) {
      this.toastrService.error(errorMsgecert, null, { enableHtml: true });
      return IsValidcert;
    }
    else {
      this.issuedOn = this.issuedOn;
      this.certsave.push({
        "Id": this.certficationid,
        "CandId": this.candid,
        "CertificationNo": this.certificateNo.trim() ? this.certificateNo.trim() : "",
        "ProgramName": this.programName.trim() ? this.programName.trim() : "NULL",
        "IssuedBy": this.issuedBy.trim() ? this.issuedBy.trim() : "",
        "IssuedOn": this.issuedOn ? this.issuedOn : ""
      });
      this.submitCertification();
      this.certaddbuttonshow = '1';
      this.certupdatebuttonshow = '0';
    }
  }
  /////////////////////  edit sexction //////////////////////////
  submitCertification() {
    var certificatiopn = {};
    if (this.certsave.length > 0) {
      this.candidateService.Certification(this.certsave).subscribe(res => {
        this.response = res;
        if (this.response.responseResult) {
          this.toastrService.success(this.response.message);
          this.certsave = [];
          this.GetEmpCertification();
          this.certificateNo = "";
          this.programName = "";
          this.issuedBy = "";
          this.issuedOn = "";
        } else {
          this.toastrService.error(this.response.message);
          this.certsave = [];
        }
      })
    }
  }
  ///////////////// validation personal info //////
  canExitStep1: (MovingDirection) => boolean = (direction) => {
    switch (direction) {
      case MovingDirection.Forwards:
        return this.checkStep1();
      case MovingDirection.Backwards:
        return true;
    }
  }
  checkStep1(): boolean {
    var IsValid = true;
    var errorMsg = "";
    var regexEmail = /\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*/;
    var regemail = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    var IndNum = /^[0]?[6789]\d{9}$/;
    var regdate = /^\d{4}\-(0?[1-9]|1[012])\-(0?[1-9]|[12][0-9]|3[01])$/;
    if (IsValid) {
      if (this.name.trim().length == 0) {
        errorMsg += "Enter name. <br/>";
        IsValid = false;
      }
      if (this.dob.length == 0) {
        errorMsg += "Select date of birth. <br/>";
        IsValid = false;
      }
      if (this.emailid.trim().length == 0) {
        errorMsg += "Enter email. <br/>";
        IsValid = false;
      }
      if (this.emailid.trim().length > 0 && !regemail.test(this.emailid)) {
        errorMsg += "Entered email pattern not valid. <br/>";
        IsValid = false;
      }

      if (this.mobile.length < 10) {
        errorMsg += "Enter valid mobile no. <br/>";
        IsValid = false;
      }
      if (this.mobile.length == 10 && !IndNum.test(this.mobile)) {
        errorMsg += "Entered mobile no. not valid. <br/>";
        IsValid = false;
      }
      if (this.gender.length == 0) {
        errorMsg += "Select gender. <br/>";
        IsValid = false;
      }
      if (this.religion.length == 0) {
        errorMsg += "Select religion. <br/>";
        IsValid = false;
      }
      if (this.birthstate.length == 0) {
        errorMsg += " Select birth state. <br/>";
        IsValid = false;
      }
      if (this.birthdistrict.length == 0) {
        errorMsg += "Select birth district. <br/>";
        IsValid = false;
      }
      if (this.aboutme.trim().length == 0) {
        errorMsg += "Enter about me. <br/>";
        IsValid = false;
      }
    }
    if (!IsValid) {
      this.toastrService.error(errorMsg, null, { enableHtml: true });
      return IsValid;
    }
    else {
      this.submitPersonalInfo();
      return true;
    }
  }
  ///////////////// validation address info //////
  canExitStep2: (MovingDirection) => boolean = (direction) => {
    switch (direction) {
      case MovingDirection.Forwards:
        return this.checkStep2();
      case MovingDirection.Backwards:
        return true;
    }
  }
  checkStep2(): boolean {
    var IsValilang = true;
    var errorMsglang = "";
    var regpin = /^\(?([1-9]{1})\)?([0-9]{5})$/;
    if (IsValilang) {

    }
    if (!IsValilang) {
      this.toastrService.error(errorMsglang, null, { enableHtml: true });
      return IsValilang;
    }
    else {
      this.addLanguageList;
      return true;
    }
  }
  ///////////////// validation address info //////

  canExitStep3: (MovingDirection) => boolean = (direction) => {
    switch (direction) {
      case MovingDirection.Forwards:
        return this.checkStep3();
      case MovingDirection.Backwards:
        return true;
    }
  }
  checkStep3(): boolean {
    var IsValidadd = true;
    var errorMsgadd = "";
    var regpin = /^\(?([1-9]{1})\)?([0-9]{5})$/;
    if (IsValidadd) {
      // if(this.addressState.length==0){
      //   errorMsgadd += "Please select state . <br/>";
      //   IsValidadd = false;

      // }
      if (this.addressState.length > 0 && this.addressDistrict.length == 0) {
        errorMsgadd += "Please select district of permanent. <br/>";
        IsValidadd = false;
      }
      if (!regpin.test(this.addressPincode) && this.addressPincode.length > 0) {
        errorMsgadd += "Entered correct pincode  of permanent. <br/>";
        IsValidadd = false;
      }
      if (this.caddressState.length > 0 && this.caddressDistrict.length == 0) {
        errorMsgadd += "Please select district of correspondence. <br/>";
        IsValidadd = false;
      }
      if (!regpin.test(this.caddressPincode) && this.caddressPincode.length > 0) {
        errorMsgadd += "Entered correct pincode of correspondence. <br/>";
        IsValidadd = false;
      }
      // if(this.address.length==0)
      // {
      //   errorMsgadd += "Enter address . <br/>";
      //   IsValidadd = false;
      // }

      // if(this.addressLamdmark.length==0)
      // {
      //   errorMsgadd += "Enter landmark . <br/>";
      //   IsValidadd = false;
      // }
    }
    if (!IsValidadd) {
      this.toastrService.error(errorMsgadd, null, { enableHtml: true });
      return IsValidadd;
    }
    else {
      // if(this.addressState.length>0 ||this.addressPincode.length>0 || this.address.length> 0  || this.addressLamdmark.length >0)
      // {
      this.submitAddressInfo();
      // }
      return true;
    }
  }
  ///////////// key event validation //////

  onlyNumber(evt) {
    evt = (evt) ? evt : window.event;
    var charCode = (evt.which) ? evt.which : evt.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;
  }
  onlyNumberForPercentage(evt) {
    evt = (evt) ? evt : window.event;
    var charCode = (evt.which) ? evt.which : evt.keyCode;
    if (charCode > 31 && (charCode < 46 || charCode > 57)) {
      return false;
    }
    return true;
  }
  ///////////////////  image upload ////////////
  base64textString: any = [];
  imagename: string = '';
  onUploadChange(evt: any) {
    //var imgn = this.CompanyProfileForm.controls['ImgName'].get(ImgName);    //getValue(ImgName);
    this.base64textString = [];
    const file = evt.target.files;
    var imn = file[0].name;
    var imn1 = imn.split('.');
    if (imn1[1] == 'jpeg' || imn1[1] == 'png' || imn1[1] == 'jpg') {
      for (var i = 0; i < file.length; i++) {
        var size = file[i].size;
        var si = Math.round(size / 1024);
        if (si >= 2000) {
          this.toastrService.error(file[i].name + " <br/> File Size must be less then 20 KB", null, { enableHtml: true })
          return false;
        }
        const reader = new FileReader();

        reader.onload = this.handleReaderLoaded.bind(this);
        reader.readAsBinaryString(file[i]);
      }
    }
    else {
      this.toastrService.error("Invalid format", null, { enableHtml: true });
      this.ImgName = '';
      //this.ImgName='';
    }
  }

  handleReaderLoaded(e) {
    this.base64textString.push('data:image/png;base64,' + btoa(e.target.result));
    for (var i = 0; i < this.base64textString.length; i++) {
      this.imagename = '';
      this.imagename = this.base64textString[i]
    }
    // this.ImgName='';
  }
  //////////////////////////// final submit data //////////
  finalsubmit() {
    this.toastrService.success("Candidate registration update successfully.");
    this.router.navigate(['/Candidate']);
  }

  /*This Function use for get value of radio button
   from Work Experience form Created by Neeraj Singh*/
  radiovalue: any;
  CurrentlyWorking(event: any) {

    this.radiovalue = event;
    if (this.radiovalue == "Yes") {
      this.ShowPeriodTo = false;
      this.periodTo = ''
    } else {
      this.ShowPeriodTo = true;
    }
  }

  /*Function is used for open the confirmation
    popup message before deletion of hobbies by
    Neeraj Singh*/
  modalRef: BsModalRef;
  PushedTemplate(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template, { class: 'modal-sm' });
  }

  declineBox(): void {
    this.modalRef.hide();
  }


}
