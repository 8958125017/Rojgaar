import { Component, OnInit, ViewChild, TemplateRef, VERSION } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
import { ToastContainerDirective, ToastrService } from 'ngx-toastr';
import { AppConfig } from '../../../Globals/app.config';
import { UpdateprofileService } from '../../../Services/updateprofile.service';
import { MasterService } from '../../../Services/master.service';
import { AuthenticationService } from '../../../Services/authenticate.service';
import { CustomValidators } from '../../../Validators/custom-validator.directive';
import { Location } from '@angular/common';
import { Router } from '@angular/router';
import { BsModalService, BsModalRef } from 'ngx-bootstrap';
import { IfObservable } from 'rxjs/observable/IfObservable';


@Component({
  selector: 'app-updateProfileComponent',
  templateUrl: './updateProfile.Component.html',
})
export class updateProfileComponent implements OnInit {
  @ViewChild(ToastContainerDirective) toastContainer: ToastContainerDirective;
  UserInfo: any;
  showForm = 0;
  DbResponse: any = {};
  updateprofile: FormGroup;
  sectorskils: FormGroup;
  updatesectorskils: FormGroup;
  updateprofilefomvalue: any = {};
  sectorskilsformvalue: any = {};
  name: string;
  designation: any;
  currentemployer: any;
  state: any;
  city: any;
  outside: any;
  users: any = {};
  profiledata: any;
  states: any;
  district: any;
  id: any;
  employer: any;
  logintype: any;
  industialrea: any
  functionalarea: any;
  gethiringlevel: any;
  indid: any;
  functid: any;
  hleveid: any;
  skilsshow: any = [];
  skilssubmit: any = [];
  skilsdetails: any;
  sectorprofiledta: any = {};
  Responce: any;
  editid: boolean = false;
  index: number;
  indust: any;
  farea: any;
  empskilssubmit: any = [];
  profile: any = {};
  firstName: any;
  showProfileForm: any = '0';
  showSectorskillForm: any = '0';
  count: any = 1;
  sectorclose: any = 1;
  modalRef: BsModalRef;
  delmodalRef: BsModalRef;
  ShowEdit: boolean = true;
  dropdownSettings: {};
  EnableSkillBtn: boolean = true;



  updateprofileFormdisable: any = true;
  sectorskilsFormdisable: any = true;

  constructor(private appConfig: AppConfig
    , private toastrService: ToastrService
    , private profileservice: UpdateprofileService
    , private masterService: MasterService,
    private _location: Location,
    private authenticationService: AuthenticationService,
    private formBuilder: FormBuilder,
    private spinnerService: Ng4LoadingSpinnerService,
    private modalService: BsModalService,
    private router: Router) {
    if (JSON.parse(localStorage.getItem('UserInfo'))) {
      // 
      this.UserInfo = JSON.parse(localStorage.getItem('UserInfo'));
      this.logintype = this.UserInfo.loginType
    }
  }

  Back() {
    this._location.back();
  }

  ngOnInit() {
    this.dropdownSettings = {
      singleSelection: false,
      idField: 'id',
      textField: 'hiringName',
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      itemsShowLimit: 4,
      allowSearchFilter: true
    };
    this.GetAllState();
    this.GetAllIndustryArea();
    this.GetAllFunctionalArea();
    this.GetUserProfile();
    this.GetHiringLevel();
    this.GetUserSkillDetails();

    this.updateprofile = this.formBuilder.group({
      name: ['', [Validators.required, , Validators.compose([CustomValidators.removeSpaces])]],
      designation: ['', [Validators.required, , Validators.compose([CustomValidators.removeSpaces])]],
      currentemployer: ['', [Validators.required, , Validators.compose([CustomValidators.removeSpaces])]],
      state: ['', [Validators.required]],
      city: ['', [Validators.required]],

    });
    this.sectorskils = this.formBuilder.group({
      industries: ['', [Validators.required]],
      functionalareas: ['', [Validators.required]],
      levelsihirefor: ['', [Validators.required]],
      clientihirefor: ['', [Validators.required, , Validators.compose([CustomValidators.removeSpaces])]],
      skillsroles: ['', [Validators.required, , Validators.compose([CustomValidators.removeSpaces])]],
      ID: ['',],
      STATUS: ['',]

    });
    this.sectorskils.controls['ID'].setValue('0');
    this.sectorskils.controls['STATUS'].setValue('I');


  }

  GetAllState() {

    this.masterService.GetAllStates().subscribe(res => {
      this.states = res
      if (this.states != null && this.states.length > 0) {
        this.states = this.states;
      }
    });
  }

  GetAllDistrict(event: any) {
    this.updateprofile.controls['city'].setValue('');

    this.id = event.target.value;
    if (this.id != '') {
      this.masterService.GetAllDistrict(this.id).subscribe(res => {
        this.district = res
        if (this.district != null && this.district.length > 0) {
          this.district = this.district;
        }
      });
    } else {
      this.updateprofile.controls['city'].setValue('');
      this.district = [];
    }

  }

  GetAllDistrictslected(event: any) {
    this.id = event;
    this.masterService.GetAllDistrict(this.id).subscribe(res => {
      this.district = res
      if (this.district != null && this.district.length > 0) {
        this.district = this.district;
      }
    });
  }
  GetAllIndustryArea() {
    this.masterService.GetAllIndustryArea().subscribe(res => {
      this.industialrea = res
      if (this.industialrea != null && this.industialrea.length > 0) {
        this.industialrea = this.industialrea;
      }
    });
  }
  GetAllFunctionalArea() {
    this.masterService.GetAllFunctionArea().subscribe(res => {
      this.functionalarea = res
      if (this.functionalarea != null && this.functionalarea.length > 0) {
        this.functionalarea = this.functionalarea;
      }
    });
  }
  GetHiringLevel() {
    this.gethiringlevel = [];
    this.masterService.GetHiringLevel().subscribe(res => {

      this.gethiringlevel = res
      if (this.gethiringlevel != null && this.gethiringlevel.length > 0) {
        this.gethiringlevel = this.gethiringlevel;
      }
    });
  }

  HireArray: any = [];
  onItemSelect(item: any) {
    this.HireArray.push(item.hiringName);
  }

  onItemDeSelect(item: any) {

    this.HireArray.splice(item.hiringName, 1);

  }

  onSelectAll(items: any) {
    this.HireArray = [];
    for (var i = 0; i < items.length; i++) {
      this.HireArray.push(items[i].hiringName);
    }
  }

  GetUserSkillDetails() {
    this.spinnerService.show();
    this.masterService.GetUserSkillDetails().subscribe(res => {
      this.DbResponse = res
      if (this.DbResponse) {
        setTimeout(() => this.spinnerService.hide(), 500)
        this.skilsdetails = this.DbResponse.lstSkillDetails;
        if (this.skilsdetails.length == 0) {
          this.EnableSkillBtn = false;
        } else if (this.skilsdetails.length > 1) {
          this.EnableSkillBtn = true;
        }
        // console.log(this.skilsdetails[0].levelsihirefor)
      }
    });
  }
  userStatus: boolean = false;
  GetUserProfile() {
    this.spinnerService.show();
    this.profileservice.GetUserProfile().subscribe(res => {
      this.DbResponse = res
      if (this.DbResponse != null) {
        setTimeout(() => this.spinnerService.hide(), 500)
        this.profile = this.DbResponse.responseResult[0];
        this.GetAllDistrictslected(this.profile.stateid);
        if (this.profile.isActive == false) {
          this.userStatus = false;
        }
        this.updateprofile.controls['name'].setValue(this.profile.firstName);
        this.updateprofile.controls['designation'].setValue(this.profile.designation);
        this.updateprofile.controls['currentemployer'].setValue(this.profile.companyName);
        if (this.profile.stateid != '') {
          this.updateprofile.controls['state'].setValue(this.profile.stateid);
        } else {
          this.updateprofile.controls['state'].setValue('');
        }

        this.updateprofile.controls['city'].setValue(this.profile.districtid);
      }

    });
  }

  updateprofiledata(template: TemplateRef<any>) {

debugger
    if (this.updateprofile.controls.designation.value.trim() == '') {
      this.toastrService.error("Please enter correct data.")
      return false;
    }
    if (this.profile.isActive == true) {
      this.updateprofileFormdisable = false;
      if (this.updateprofile.valid) {
        this.spinnerService.show();
        this.profileservice.UpdateUserProfile(this.updateprofile.value).subscribe(res => {
          this.Responce = res;
          this.spinnerService.hide();
          this.updateprofileFormdisable = true;
          this.showProfileForm = '0';
          if (this.Responce.responseResult) {
            if (!this.Responce.isvalue) {
              this.modalRef = this.modalService.show(template, { class: 'modal-sm' });
            }
            this.toastrService.success(this.Responce.message);
            this.getUserInfo();
            this.GetUserProfile();
            this.Removeaddbuttondata();
          } else {
            this.toastrService.error(this.Responce.message);
          }
        });
      }
      else {
        this.toastrService.error(this.Responce.message);
      }
    }else{
      this.toastrService.error("You are inactive");
      return false;
    }
  }
  updateuserInfo: any
  updateResult: any;

  getUserInfo() {
    this.masterService.getuserInfoAfterUpdate().subscribe(res => {
      this.updateResult = res;
      if (this.updateResult)
        this.updateuserInfo = this.updateResult.lstUserDetails[0];
      localStorage.setItem('UserInfo', JSON.stringify(this.updateuserInfo));
      var ret = localStorage.getItem('UserInfo');
    });
  }
  hireData: any = [];
  testData: any = [];
  arrayData: any = '';
  agency_save() {
debugger

    if (this.sectorskils.controls.skillsroles.value.trim() == '' || this.sectorskils.controls.clientihirefor.value.trim() == '') {
      this.toastrService.error("Please enter correct data.")
      return false;
    }


    let indid;
    let functid;
    let hireid;
    let hirefor;
    let skillsroles;
    indid = this.sectorskils.value.industries;
    functid = this.sectorskils.value.functionalareas;
    hireid = this.sectorskils.value.levelsihirefor;

    var array;
    for (var j = 0; j < hireid.length; j++) {
      this.hireData = hireid[j]['id'];
      array = {
        'levelsihireforid': this.hireData
      }
      this.testData.push(array);
    }

    hirefor = this.sectorskils.value.clientihirefor;
    skillsroles = this.sectorskils.value.skillsroles;

    // for(var i=0;i<hireid.length;i++){
    this.skilssubmit.push({
      "clientihirefor": hirefor,
      "functionalareas": functid,
      "industries": indid,
      "levelsihirefor": this.testData,
      "skillsroles": skillsroles,
      "USERHIRINGID": 0,
      "ID": 0

    });
    this.testData = [];
    this.hireData = [];
    // }
    // this.skilssubmit.push(this.sectorskils.value);

    let resultindid = (this.industialrea).filter(function (entry) {
      return entry.id === indid;
    });
    let resultfuncid = (this.functionalarea).filter(function (entry) {
      return entry.id === parseInt(functid);
    });
    let resulthireid = (this.gethiringlevel).filter(function (entry) {
      return entry.id == hireid;
    });

    for (var k = 0; k < this.HireArray.length; k++) {
      this.arrayData += this.HireArray[k] + '/';

    }
   

    // for(var i=0;i<this.HireArray.length;i++){
    this.skilsshow.push({
      "industries": resultindid[0]['industryName'],
      "functionalareas": resultfuncid[0]['functionalAreaName'],
      "clientihirefor": hirefor,
      "levelsihirefor": this.arrayData,
      "skillsroles": skillsroles
    });
    // }
    this.HireArray = [];
    this.arrayData = '';

    this.sectorskils.value.reset;
    this.reset_sector_form();

    this.sectorclose = '1';
  }

  finaldata() {
    this.ShowEdit = true;
    if (this.count == 1) {
      this.profileservice.SaveMultipleSkill(this.skilssubmit).subscribe(res => {
        this.Responce = res;
        if (this.Responce.responseResult) {
          this.toastrService.success(this.Responce.message);
          this.skilssubmit = [];
          this.skilsshow = [];
          this.HireArray = [];
          this.sectorskils.value.reset;
          this.reset_sector_form();
          this.editid = false;
          this.Removeaddbuttondata();
          this.GetUserSkillDetails();
        } else {
          this.toastrService.error(this.Responce.message);
        }
      });
    }

    else {

    }

    this.count++;
  }
  empLevelData: any = {};
  empHireData: any = [];
  empHirePushData: any = [];
  employer_save() {

    if (this.sectorskils.controls.skillsroles.value.trim() == '' || this.sectorskils.controls.clientihirefor.value.trim() == '') {

      this.toastrService.error("Please enter correct data.")
      return false;
    }

    var leveldata = this.sectorskils.value.levelsihirefor;

    var arraypush;
    for (var j = 0; j < leveldata.length; j++) {
      this.empHireData = leveldata[j]['id'];
      arraypush = {
        'levelsihireforid': this.empHireData
      }
      this.empHirePushData.push(arraypush);
    }

    this.empLevelData.ID = 0;
    this.empLevelData.STATUS = "";
    this.empLevelData.clientihirefor = this.sectorskils.value.clientihirefor;
    this.empLevelData.functionalareas = this.sectorskils.value.functionalareas;
    this.empLevelData.industries = this.sectorskils.value.industries;
    this.empLevelData.levelsihirefor = this.empHirePushData;
    this.empLevelData.skillsroles = this.sectorskils.value.skillsroles;

    if (this.count == 1) {
      if (this.sectorskils.valid) {
        this.empskilssubmit.push(this.empLevelData);

        this.spinnerService.show();
        this.profileservice.SaveMultipleSkill(this.empskilssubmit).subscribe(res => {
          this.spinnerService.hide();
          this.Responce = res;
          if (this.Responce.responseResult) {
            this.toastrService.success(this.Responce.message);
            this.skilsshow = [];
            this.HireArray = [];
            this.empHireData = [];
            this.empHirePushData = [];
            this.empskilssubmit = [];
            this.sectorskils.value.reset;
            this.editid = false;
            this.EnableSkillBtn = true;
            this.reset_sector_form();
            this.GetUserSkillDetails();
            this.Removeaddbuttondata();
          } else {
            this.toastrService.error(this.Responce.message);

          }
        });
      }
      else {
        this.toastrService.error(this.Responce.message);
      }
    }
    else {

    }
    this.ShowEdit = true;
    this.count++;
  }

  reset_sector_form() {
    // this.HireArray=[];
    this.count = '1';
    this.sectorskils.reset();
    this.sectorskils.controls['ID'].setValue('0');
    this.sectorskils.controls['STATUS'].setValue('');
    this.sectorskils.controls['industries'].setValue('');
    this.sectorskils.controls['functionalareas'].setValue('');
    this.sectorskils.controls['levelsihirefor'].setValue('');
  }

  updateprofile_reset() {
    this.count = '1';
    this.updateprofile.reset();
    this.sectorskils.controls['ID'].setValue('0');
    this.sectorskils.controls['STATUS'].setValue('I');
  } r


  onItemDeleted(index: number) {
    this.modalRef.hide();
    this.skilsshow.splice(index, 1);
    this.skilssubmit.splice(index, 1);
  }
  levelhireid: any = [];
  levelhirename: any = [];
  editsectordetails(index: any, indust: any, farea: any, levelid: any, clienthire: any, skillrole: any) {
    this.editid = true;
    this.levelhirename = [];
    var array;
    for (var j = 0; j < levelid.length; j++) {
      this.levelhireid = levelid[j]['levelsihireforid'];
      var hirename = levelid[j]['hiringName']
      array = {
        'id': this.levelhireid,
        'hiringName': hirename
      }
      this.levelhirename.push(array);
    }

    this.sectorskils.controls['ID'].setValue(index);
    this.sectorskils.controls['STATUS'].setValue('U');
    this.sectorskils.controls['industries'].setValue(indust);
    this.sectorskils.controls['functionalareas'].setValue(farea);
    this.sectorskils.controls['levelsihirefor'].setValue(this.levelhirename);
    this.sectorskils.controls['clientihirefor'].setValue(clienthire);
    this.sectorskils.controls['skillsroles'].setValue(skillrole);
    this.count = '1';

  }

  updatehireData: any = [];
  updatePushData: any = [];
  hireLevelData: any = {};

  updatesectorskilsdata() {
    this.ShowEdit = true;
    if (this.count == 1) {

      if (this.sectorskils.controls.skillsroles.value.trim() == '' || this.sectorskils.controls.clientihirefor.value.trim() == '') {

        this.toastrService.error("Please enter correct data.")
        return false;
      }
      this.sectorskilsFormdisable = false;
      if (this.sectorskils.valid) {
        var leveldata = this.sectorskils.value.levelsihirefor;

        var arraypush;
        for (var j = 0; j < leveldata.length; j++) {
          this.updatehireData = leveldata[j]['id'];
          arraypush = {
            'levelsihireforid': this.updatehireData
          }
          this.updatePushData.push(arraypush);
        }

        this.hireLevelData.ID = this.sectorskils.value.ID;
        this.hireLevelData.STATUS = this.sectorskils.value.STATUS;
        this.hireLevelData.clientihirefor = this.sectorskils.value.clientihirefor;
        this.hireLevelData.functionalareas = this.sectorskils.value.functionalareas;
        this.hireLevelData.industries = this.sectorskils.value.industries;
        this.hireLevelData.levelsihirefor = this.updatePushData;
        this.hireLevelData.skillsroles = this.sectorskils.value.skillsroles;

        this.skilssubmit.push(this.hireLevelData);
        this.HireArray = [];
        this.profileservice.SaveMultipleSkill(this.skilssubmit).subscribe(res => {
          this.Responce = res;
          this.sectorskilsFormdisable = true;
          if (this.Responce.responseResult) {
            this.toastrService.success(this.Responce.message);
            this.sectorskils.value.reset;
            this.reset_sector_form();
            this.Removeaddbuttondata();
            this.skilssubmit = [];
            this.updatePushData = [];
            this.editid = false;
            this.GetUserSkillDetails();
            this.showSectorskillForm = '0';
          } else {
            this.toastrService.error(this.Responce.message);
          }
        });
      }
      else {
        this.toastrService.error(this.Responce.message);
      }

    }
    else {

    }
    this.count++;
  }

  EditProfile() {
    this.GetUserProfile();
    this.showProfileForm = '1';
    this.showSectorskillForm = '0';
    this.Showsectorbutton = '1';
    this.updateprofile.controls['state'].setValue('');
    this.updateprofile.controls['city'].setValue('');

  }
  Editsectorskill() {
    this.showSectorskillForm = '1';
    this.showProfileForm = '0';
    this.Showsectorbutton = '1'

  }
  Showsectorbutton: any = '0';
  Addsectorbutton() {
    this.reset_sector_form();
    this.Showsectorbutton = '1'
    this.ShowEdit = false;
    this.editid = false;
    this.showSectorskillForm = '1';
  }

  Removeaddbuttondata() {
    this.Showsectorbutton = '0'
    this.editid = true;
    this.showSectorskillForm = '0';

  }
  secortorid: any;
  deleteCount: any = 0
  deletesectordetails() {
    this.deleteCount++
    this.delmodalRef.hide();
    this.spinnerService.show();
    this.secortorid = this.DelSecorrID;
    if (this.deleteCount == 1) {
      this.profileservice.DeleteUserSkill(this.secortorid).subscribe(res => {
        this.Responce = res;

        this.spinnerService.hide();
        if (this.Responce.responseResult) {
          this.deleteCount = 0;
          this.toastrService.success(this.Responce.message);
          this.editid = false;
          this.GetUserSkillDetails();
          this.showSectorskillForm = '0';
        } else {
          this.deleteCount = 0;
          this.toastrService.error(this.Responce.message);
        }
      });
    }
  }
  exitHireForm() {
    this.ShowEdit = true;
    this.showSectorskillForm = '0';
    this.sectorclose = '0';
    this.skilsshow = [];
    this.skilssubmit = [];

  }
  ExitProfileform() {
    this.showProfileForm = '0';
    this.sectorclose = '0';
    this.GetUserProfile();
  }
  GoToCompanyProfile() {
    this.modalRef.hide();
    this.router.navigate(['/companyprofile']);
  }
  DelSecorrID: any;
  confirmBox(confirm: TemplateRef<any>, DelSectorID: any) {
    this.DelSecorrID = DelSectorID;
    this.delmodalRef = this.modalService.show(confirm, { class: 'modal-sm' });
  }

  declineBox(): void {
    this.DelSecorrID = '';

    this.delmodalRef.hide();
  }

  PushedTemplate(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template, { class: 'modal-sm' });
  }

  declineBox1(): void {

    this.modalRef.hide();
  }
}

