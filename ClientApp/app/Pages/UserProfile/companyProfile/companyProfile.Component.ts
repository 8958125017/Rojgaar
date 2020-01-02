import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
import { ToastContainerDirective, ToastrService } from 'ngx-toastr';
import { AppConfig } from '../../../Globals/app.config';
import { MasterService } from '../../../Services/master.service';
import { AuthenticationService } from '../../../Services/authenticate.service';
import { CompanyProfileService } from '../../../Services/companyprofile.service';
import { Location, NgIf} from '@angular/common';
import { CustomValidators } from '../../../Validators/custom-validator.directive';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { Alert } from 'selenium-webdriver';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
@Component({
  selector: 'app-companyProfileComponent',
  templateUrl: './companyProfile.Component.html',
})
export class companyProfileComponent implements OnInit {
  @ViewChild(ToastContainerDirective) toastContainer: ToastContainerDirective;
  modalRef: BsModalRef;
  UserInfo: any;
  showForm = 0;
  DbResponse: any = {};
  CompanyProfile: any ={};
  states:any=[];
  companytype:any=[];
  district: any;
  id: any;
  logintype: any;
  industialrea: any=[];
  companyprofile: any = [];
  profilesubmit:any=[];
  sectorprofiledta: any = {};
  Responce: any;
  editid: boolean = false;
  index: number;
  indust: any;
  showProfileForm: any = '0';
  showSectorskillForm: any = '0';
  CompanyProfileForm: FormGroup;
  sectorskils: FormGroup;
  district1:any=[];
  Cdata:any= [];
  profileshow:any='0';
  profilehide:any='1';
  showlist:any=0;
  GetCompanyData:any=[];
  profileshow1:any=1;
  formshow1:any=0;
  companyprofilelength:any='';
  editclick:any=1;
  public WorkLocation =[];
  WorkLocationshow:any=[];
  public GetCompanyProfileData:any={};
  displaytextBox:any = 0;
  SaveLocation: any = [];
  public companyid:number;
  public sid:any;
  ShowCompanyData:any={};
  companyinfo:any='0';
  res:any={};
  hidecompanyprofile:any='1';
  hidecompanyprofile2:any='1';
  companyId:any;
  workLocationId:any;
  hideupdate:any;
  back:any='0';
  profileshow2:any='0';
  CompanyProfileShow:any='1';
  otherText:any='1';
  Exitprofile:any='1';
  companyName: any;
  companyshortname: any;
  count:any=1;
  description:any;
  imagename:string='';
  checkverifymobile:boolean;
  Gstn:any=[];
  companyTypeO:any;

  gstImage:any;
  showMagGst:boolean=false;
  panImage1:any;
  showMagPan:boolean=false;
  panImage:any;
  gstinvalid:boolean=false;
  gstdbinvalid:boolean=true;
  gstlength:boolean=false;
  gstpanmsg:string='';
  gstdbval:string='';
  pandbval:String='';

  constructor(private appConfig: AppConfig
    , private toastrService: ToastrService
    , private companyProfileService:CompanyProfileService
    , private masterService: MasterService
    , private _location: Location
    , private authenticationService: AuthenticationService
    , private formBuilder: FormBuilder
    , private spinnerService: Ng4LoadingSpinnerService
    ,  public router: Router
    , private _cookieService: CookieService,
     private modalService: BsModalService

    ) {
    try {
      this.UserInfo = appConfig.UserInfo
      this.logintype = this.UserInfo.loginType
    } catch  { }

  }

  ngOnInit() {
    this.GetAllState();
    this.GetAllIndustryArea();
    const token = sessionStorage.getItem('usertoken');
    if(token){
      this.GetCompanydata();
    }
    else{
      localStorage.clear();
      sessionStorage.clear();
      this._cookieService.deleteAll('UserInfo');
      this._cookieService.deleteAll();
      sessionStorage.removeItem('usertoken');
      localStorage.removeItem('UserInfo');
      this.router.navigate(['index']);
    }

    this.GetCompanyType();
    this.CompanyProfileForm = this.formBuilder.group({
      CompanyName: ['', [Validators.required, , Validators.compose([CustomValidators.removeSpaces])]],
      ImgName: ['', ''],
      // TagLine: ['', [Validators.required, , Validators.compose([CustomValidators.removeSpaces])]],
      TagLine: ['', [Validators.nullValidator, , Validators.compose([CustomValidators.removeSpaces])]],
      // gstn:['', [Validators.required, Validators.compose([CustomValidators.validgdteenformate])]],
      // gstn:['', [Validators.nullValidator]],
      gstn: ['', [Validators.nullValidator, , Validators.compose([CustomValidators.validgdteenformate]), Validators.compose([CustomValidators.removeSpaces])]],
      PAN: ['', [Validators.required, Validators.compose([CustomValidators.validpanformate])]],
     // Description: ['', [Validators.required, , Validators.compose([CustomValidators.removeSpaces])]],
     Description: ['0', [Validators.nullValidator]],
      IndustryType: ['0', [Validators.required]],
      DistrictID: ['', [Validators.required]],
      email: ['', [Validators.required,Validators.compose([CustomValidators.removeSpaces,CustomValidators.vaildEmail])]],
      mobile: ['', [Validators.required, Validators.compose([CustomValidators.validMobile])]],
      LandlineNumber: ['', [Validators.nullValidator]],
      website: ['', [Validators.nullValidator]],
      aboutCompany: ['', [Validators.nullValidator]],
      StateiD: ['', [Validators.required]],
      OfficeAddress: ['', [Validators.required, , Validators.compose([CustomValidators.removeSpaces])]],
      companyshortname: ['', [Validators.required, , Validators.compose([CustomValidators.removeSpaces])]],
      ImgNames: ['', [Validators.nullValidator]],
      gstImg: ['', [Validators.nullValidator]],
      panImg: ['', [Validators.nullValidator]],
      GstinImgName:['', ''],
      PanImgName:['', ''],
    });
    this.sectorskils = this.formBuilder.group({
      Stateid: ['', [Validators.required]],
      Districtid: ['', [Validators.required]],
      Caddress: ['', [Validators.required, , Validators.compose([CustomValidators.removeSpaces])]],
      CtypeName: ['', [Validators.required]],
      CompanyTypeOther: ['', [, , Validators.compose([CustomValidators.removeSpaces])]],
    });
    this.hidecompanyprofile='1';
}

get f() { return this.CompanyProfileForm.controls; }

  //  get All States

  GetAllState() {​
    this.hidecompanyprofile='1';
    this.masterService.GetAllStates().subscribe(res => {
      this.states = res
      if (this.states != null && this.states.length > 0) {
        this.states = this.states;

      }
    });

  }

//   decimals(e){
//     if (e.keyCode === 190 ) {
//         return false;
//     }
//     if (e.keyCode === 189 ) {
//         return false;
//     }
// }
cmpType:any;
  GetCompanyType() {
    this.spinnerService.show();
    this.companyProfileService.GetCompanyTypeData().subscribe(res => {
      this.cmpType=res;
      if (this.cmpType != null) {
        this.companytype = this.cmpType;
      }
      setTimeout(()=>this.spinnerService.hide(),500)
    });
  }
  // code for get District

  GetAllDistrict(event: any) {
    this.CompanyProfileForm.controls['DistrictID'].setValue('');
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
    this.CompanyProfileForm.controls['DistrictID'].setValue('');
    this.district=[];
    }

  }

  GetDistrict(event: any) {
    this.sectorskils.controls['Districtid'].setValue('');
    this.id = event.target.value;
    if(this.id)
    {
      this.masterService.GetAllDistrict(this.id).subscribe(res => {
        this.district1 = res
        if (this.district1 != null && this.district1.length > 0) {
          this.district1 = this.district1;
        }
      });
    }
    else
    {
    this.sectorskils.controls['Districtid'].setValue('');
    this.district1=[];
    }

  }
  GetNewDistrict(stateid:any) {
    this.id = stateid;
    if(this.id)
    {
      this.masterService.GetAllDistrict(this.id).subscribe(res => {
        this.district1 = res
        if (this.district1 != null && this.district1.length > 0) {
          this.district1 = this.district1;
        }
      });
    }
    else
    {
      this.sectorskils.controls['Districtid'].setValue('');
      this.district1=[];
    }

  }
  panGetImage:any;
  gstGetImage:any;
  gstGetImg:boolean=false;
  panGetImg:boolean=false;
  isowner:boolean=false;
  GetCompanydata(){
    this.companyProfileService.GetCompanyData().subscribe(res => {
    this.DbResponse = res;
    this.GetCompanyProfileData = this.DbResponse.lstCompanyProfile;
    // localStorage.setItem('yuvaSandesh',JSON.stringify(this.GetCompanyProfileData[0].image));
    this.gstdbval=this.GetCompanyProfileData[0].gstn;
    this.pandbval=this.GetCompanyProfileData[0].pan;
    if(this.GetCompanyProfileData[0].isowner){
       this.isowner=true;
    }  else{
      this.isowner=false;
    }
    this.CompanyProfileForm.controls['CompanyName'].setValue(this.UserInfo.companyName ? this.UserInfo.companyName : 'NA');
    this.companyprofilelength=this.GetCompanyProfileData.length;
      var length = this.companyprofilelength;
    if(this.GetCompanyProfileData.length>0){
      this.companyid=this.GetCompanyProfileData[0].companyId;
      this.getallprofilecompany(this.companyid);
      if (this.GetCompanyProfileData[0].panImgName) {
        this.panGetImage = this.GetCompanyProfileData[0].panImage;
        this.panGetImg = true;
        this.showMagPan = false;
      }
      if (this.GetCompanyProfileData[0].gstinImgName) {
        this.gstGetImage = this.GetCompanyProfileData[0].gstinImage;
        this.gstGetImg = true;
        this.showMagGst = false;
      }
    }else{
      this.companyid=0;
    }
    this.companyinfo='0';
    if (length===1) {
      this.profileshow1='1';
      this.CompanyProfileShow='1';
      this.hidecompanyprofile='1'
     }
     if (length===0) {
      this.Exitprofile='0';
      this.profileshow1='0';
      this.CompanyProfileShow='0';
      this.hidecompanyprofile='0'
     }
   });

}
countDelete:number=0
// Delete For Company Work Location
isDelete:boolean=true;
countStatus:boolean=false;;
deletecompanydetail(){
  // if(this.countStatus){
  //     this.countDelete=0;
  // }
  this.countDelete++
  this.companyid = this.DeleteComId;
  this.isDelete=true;
  this.spinnerService.show();
  if(this.countDelete == 1){
    //this.countStatus=false;
    this.companyProfileService.DeleteCompanyProfile(this.companyid).subscribe(res =>{
      this.spinnerService.hide();
      this.Responce = res
      this.modalRef.hide();
      //this.countStatus=true;
      this.countDelete=0;
      this.isDelete=false;
      if(this.Responce){
        this.GetCompanydata();
        this.toastrService.success("Company work location delete successfully.");
      }
    });
  }

}


// Save Company Profile data
   error1:boolean=false

  updatecompanyProfile(){
    // this.f.TagLine.value.trim()==''

    if(this.f.companyshortname.value.trim()=='')
    {
      this.toastrService.error("Please enter company short name.")
      return false;
    }
     if(this.f.OfficeAddress.value.trim()==''){
      this.toastrService.error("Please enter office address.")
      return false;
     }
     var regExp4 = /^(http:\/\/www\.|https:\/\/www\.|http:\/\/|https:\/\/|www\.)[a-z0-9]+([\-\.]{1}[a-z0-9]+)*\.[a-z]{2,5}(:[0-9]{1,5})?(\/.*)?$/; 

    var companyName   = this.CompanyProfileForm.value.CompanyName;
    var ImgNames      = this.CompanyProfileForm.value.ImgNames;
    var TagLine       = this.CompanyProfileForm.value.TagLine;
    var gst           = this.CompanyProfileForm.value.gstn;
    if(gst){
      var gstn          =  gst.toUpperCase();
    }   
    var pannumber     = this.CompanyProfileForm.value.PAN;
    if(pannumber){
      var PAN           =  pannumber.toUpperCase();
    }  
    var IndustryType  =this.CompanyProfileForm.value.IndustryType;
    var Description   =this.CompanyProfileForm.value.Description;
    var StateiD       =this.CompanyProfileForm.value.StateiD;
    var DistrictID    =this.CompanyProfileForm.value.DistrictID;
    var OfficeAddress =this.CompanyProfileForm.value.OfficeAddress;
    var email         =this.CompanyProfileForm.value.email;
    var mobile        =this.CompanyProfileForm.value.mobile;
    var LandlineNumber=this.CompanyProfileForm.value.LandlineNumber;
    var website       =this.CompanyProfileForm.value.website;
    var aboutCompany  =this.CompanyProfileForm.value.aboutCompany;
    var OfficeAddress =this.CompanyProfileForm.value.OfficeAddress;
    var ImagePath     = this.imagename;
    var companyid     = this.companyid;
    var companyshortname= this.CompanyProfileForm.value.companyshortname;
    var GstinImage    = this.gstImage;
    var PanImage      = this.panImage1;
    var PanImgName    = this.CompanyProfileForm.value.PanImgName;
    var GstinImgName  = this.CompanyProfileForm.value.GstinImgName;
    var GstinDocName  = "GSTN";
    var PanDocName    = "PAN";
    var GstnExtention = this.GstnExtention;
    var PanExtention  = this.PanExtention;

if(website){
  if(!website.match(regExp4)){ 
    this.toastrService.error('Please enter WebSite address valid formate');
    return false;
  }
}

if(gstn){//Check for gstin if gstin is not null by Neeraj Singh
  if(gstn.length){
    var gst_partial = gstn.substr(2,10);
    if(gst_partial!=PAN){
      this.toastrService.error('PAN must be a  part of GSTIN');
      this.gstinvalid=false
      return false;
  }else{
      this.gstinvalid=true;
  }
}else{
  this.gstinvalid=true;
}
}else{
  this.gstinvalid=true;
}


     if(this.count==1){
                    var senddata = {
                    'CompanyName': companyName,
                    'ImgName': ImgNames,
                    'TagLine': TagLine,
                    'Email':email,
                    'gstn': gstn,
                    'PAN': PAN,
                    'IndustryType': IndustryType,
                    'OfficeAddress': OfficeAddress,
                    'Description': Description,
                    'StateiD': StateiD,
                    'DistrictID': DistrictID,
                    'Image': ImagePath,
                    'companyid': companyid,
                    'companyshortname': companyshortname,
                    'GstinImage': GstinImage,
                    'PanImage' : PanImage,
                    'PanImgName':PanImgName,
                    'GstinImgName':GstinImgName,
                    'GstinDocName': GstinDocName,
                    'PanDocName' : PanDocName,
                    'GstnExtention':GstnExtention,
                    'PanExtention':PanExtention,
                    'Mobile' : mobile,
                    'landLineNo' : LandlineNumber,
                    'Website':website,
                    'AboutCompany':aboutCompany
                  };


    if(this.gstinvalid==true){
          this.spinnerService.show();
          this.masterService.saveUserLogs('CompanyProfile/CompanyProfileUpdate','Update company profile');
          this.companyProfileService.SaveCompanyProfile(senddata).subscribe(res => {
            this.spinnerService.hide();
            this.addworkStatus=true;
          this.Responce = res;
          if(this.Responce!=null){
            this.CompanyProfileForm.reset();
            this.closeStatus=false;
            this.addworkStatus=true;
            this.profileshow1='1';
            this.CompanyProfileShow='1';
            this.hidecompanyprofile='1';
            this.GetCompanydata();
            this.getUserInfo();
            this.toastrService.success(this.Responce.message);
          }
      });
}

}else{
  this.addworkStatus=true;
}
if(this.gstinvalid==true&&this.gstdbinvalid){
this.count++;
}
}

updateuserInfo:any
updateResult:any;

getUserInfo(){
  this.masterService.getuserInfoAfterUpdate().subscribe(res=>{
    this.updateResult=res;
    if(this.updateResult)
    this.updateuserInfo=this.updateResult.lstUserDetails[0];
    localStorage.setItem('UserInfo', JSON.stringify(this.updateuserInfo));
    var ret=localStorage.getItem('UserInfo');

  });
}

// edit Company Profile
addworkStatus:boolean=true;
getdbgst:any='';

  EditCompanyProfile() {
  this.closeStatus=true;
  this.addworkStatus=false;
  this.count=1;
  this.editid = true;
  this.showMagGst=false;
  this.showMagPan=false;
  this.CompanyProfileForm.controls['CompanyName'].setValue(this.GetCompanyProfileData[0].companyName ? this.GetCompanyProfileData[0].companyName : 'NA');
  this.getdbgst=this.GetCompanyProfileData[0].gstn;
  this.CompanyProfileForm.controls['gstn'].setValue(this.GetCompanyProfileData[0].gstn);
  this.CompanyProfileForm.controls['Description'].setValue(this.GetCompanyProfileData[0].description);
  this.CompanyProfileForm.controls['StateiD'].setValue(this.GetCompanyProfileData[0].stateiD ? this.GetCompanyProfileData[0].stateiD : '');
  this.CompanyProfileForm.controls['DistrictID'].setValue(this.GetCompanyProfileData[0].districtID ? this.GetCompanyProfileData[0].districtID : '');
  this.imagename = this.GetCompanyProfileData[0].image;
  if(this.GetCompanyProfileData[0].panImage){
    this.panImage1=   this.GetCompanyProfileData[0].panImage;
    this.showMagPan=true;
  }

  if(this.GetCompanyProfileData[0].gstinImage){
    this.gstGetImage=this.GetCompanyProfileData[0].gstinImage;
    this.gstGetImg=true;
    this.showMagGst=false;
  }
  if(this.GetCompanyProfileData[0].panImage){
    this.panGetImage=this.GetCompanyProfileData[0].panImage;
    this.panGetImg=true;
    this.showMagPan=false;
  }
  this.CompanyProfileForm.controls['PAN'].setValue(this.GetCompanyProfileData[0].pan);
  this.CompanyProfileForm.controls['email'].setValue(this.GetCompanyProfileData[0].companyEmail);
  this.CompanyProfileForm.controls['IndustryType'].setValue(this.GetCompanyProfileData[0].industryID ? this.GetCompanyProfileData[0].industryID :'');
  this.CompanyProfileForm.controls['TagLine'].setValue(this.GetCompanyProfileData[0].tagLine);
  this.CompanyProfileForm.controls['OfficeAddress'].setValue(this.GetCompanyProfileData[0].officeAddress);
  this.CompanyProfileForm.controls['companyshortname'].setValue(this.GetCompanyProfileData[0].companyShortName);
  this.CompanyProfileForm.controls['ImgNames'].setValue(this.GetCompanyProfileData[0].imgName);
  this.CompanyProfileForm.controls['PanImgName'].setValue(this.GetCompanyProfileData[0].PanImgName);
  this.CompanyProfileForm.controls['GstinImgName'].setValue(this.GetCompanyProfileData[0].GstinImgName);
  this.CompanyProfileForm.controls['mobile'].setValue(this.GetCompanyProfileData[0].mobile);
  this.CompanyProfileForm.controls['LandlineNumber'].setValue(this.GetCompanyProfileData[0].landLineNo);
  this.CompanyProfileForm.controls['website'].setValue(this.GetCompanyProfileData[0].website);
  this.CompanyProfileForm.controls['aboutCompany'].setValue(this.GetCompanyProfileData[0].aboutCompany);
  this.companyProfileService.GetCompanyTypeData().subscribe(res => {
    this.companytype = res
  });

  this.masterService.GetAllDistrict(this.GetCompanyProfileData[0].stateiD).subscribe(res => {
     this.district = res
    if (this.district != null && this.district.length > 0 && this.district != "") {
        this.district  = this.district;
    }
  });
   this.profileshow1       = '0';
   this.CompanyProfileShow = '0';
   this.hidecompanyprofile = '0';
}


// Add Multiple Data For Company Work Location

  CompanyWorkLocation(){
     if (this.sectorskils.controls.Caddress.value.length>1000){
       this.toastrService.error("Address length should not be greater than 500 characters.");
       return false
     }
    if(this.sectorskils.controls.Caddress.value.trim()=='')
    {
      this.toastrService.error("Please Enter the Address.")
      return false;
    }
    if(this.companyTypeO=="5")
      {
      if(this.sectorskils.controls['CompanyTypeOther'].value=='' || this.sectorskils.controls.CompanyTypeOther.value.trim()==''){
        this.toastrService.error("Please enter the other value.");
        return false;
      }
    }

  let statedid;
  let districtid;
  let typeid;

  statedid     = this.sectorskils.value.Stateid;
  districtid   = this.sectorskils.value.Districtid;
  typeid       = this.sectorskils.value.CtypeName;

  let statename = (this.states).filter(function (entry){
    return entry.id == statedid;
  });

  let districtname = (this.district1).filter(function (entry) {
    return entry.id == districtid;
  });
  let typename = (this.companytype).filter(function (entry){
    return entry.id == typeid;
  });

var pushdata={
   "Address":this.sectorskils.controls.Caddress.value,
   "CompanyType":this.sectorskils.controls.CtypeName.value,
   "StateId":this.sectorskils.controls.Stateid.value,
   "DistrictId":this.sectorskils.controls.Districtid.value,
   "CompanyTypeOther":this.sectorskils.controls.CompanyTypeOther.value,
   "companyId":this.companyid
};


this.WorkLocation.push(pushdata);

this.WorkLocationshow.push({
  "Caddress":this.sectorskils.controls.Caddress.value,
  "CtypeName":typename[0]['companyType'],
  "Stateid":statename[0]['stateName'],
  "Districtid":districtname[0]['districtName']
});
this.showlist='1';
this.displaytextBox = 0;
this.sectorskils.reset();
this.sectorskils.controls['Stateid'].setValue('');
this.sectorskils.controls['Districtid'].setValue('');
this.sectorskils.controls['CtypeName'].setValue('');
this.sectorskils.controls['CompanyTypeOther'].setValue('');
this.sectorskils.controls['Caddress'].setValue('');

}


onItemDeleted(itemNo:number){
  this.modalRef.hide();
  var index = this.WorkLocationshow.findIndex(function(o,index){
  return index === itemNo;
})
if (index !== -1) {
  this.WorkLocationshow.splice(index, 1);
  this.WorkLocation.splice(index, 1);
}
if(this.WorkLocationshow.length===0){
  this.showlist=0;
  this.WorkLocationshow=[];
  this.WorkLocation=[];
    }
}




// code for get distics

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

  Showsectorbutton: any = '0';
  Addsectorbutton() {
    this.count='1';
    this.Showsectorbutton = '1'
    this.editid = false;
    this.showSectorskillForm = '1';
    this.hidecompanyprofile = '0';
    this.isowner = false;
    this.sectorskils.reset();
    this.sectorskils.controls['Stateid'].setValue("");
    this.sectorskils.controls['Districtid'].setValue("");
    this.sectorskils.controls['CtypeName'].setValue("");
    this.sectorskils.controls['CompanyTypeOther'].setValue("");
  }

  exitHireForm() {
    this.addworkStatus=true;
    this.isowner = true;
    this.isowner=true;
    this.closeStatus=false;
    this.showSectorskillForm = '0';
    this.hidecompanyprofile='1';
    this.WorkLocation=[];
    this.WorkLocationshow=[];
    this.showlist=0;
  }

// Final save Data For Company Work Location

  SaveCompanyProfileData() {
    this.isowner = true;
    if(this.count==1)
    {
    this.spinnerService.show();

    this.companyProfileService.SaveMultidata(this.WorkLocation).subscribe(res => {
    this.Responce= res;
    this.spinnerService.hide();
    if(this.Responce.responseResult){
      if(this.Responce.responseResult!=null){
        this.showlist=0;
        this.WorkLocationshow=[];
        this.WorkLocation=[];
        this.sectorskils.reset();
        this.getallprofilecompany(this.companyid)
        this.toastrService.success("Company work location saved successfully.");
        this.hidecompanyprofile = '1';
      }else{
        this.showlist=0;
        this.WorkLocationshow=[];
        this.WorkLocation=[];
        this.sectorskils.reset();
        this.getallprofilecompany(this.companyid)
        this.toastrService.error(this.Responce.message);
        this.hidecompanyprofile = '1';
      }
     }else{
          this.toastrService.error(this.Responce.message);
     }

    });
  }
    this.count++;

}

// Edit Company Work Location details

editcompanydetails(id:any,address:any,stateId:any,districtId:any,companyTypeOther:any,companyId:any,workLocationId:any,other:any) {
  this.addworkStatus=false;
  this.isowner=false;
  this.editid = true;
  this.showSectorskillForm='1';
  this.hidecompanyprofile='0';
  this.sectorskils.controls['Stateid'].setValue(stateId);
  this.GetNewDistrict(stateId);
  this.sectorskils.controls['Districtid'].setValue(districtId);
  this.sectorskils.controls['Caddress'].setValue(address);
  this.GetCompanyType();
  this.sectorskils.controls['CtypeName'].setValue(companyTypeOther);
  this.companyid=companyId;
  this.workLocationId=workLocationId;
  this.sid=id;
  if(companyTypeOther=="5")
  {
  this.displaytextBox="1";
  this.sectorskils.controls['CompanyTypeOther'].setValue(other);

  }
  else
  {
    this.displaytextBox="0";
  }
}

updatecompanyprofile(id:any){
  if(this.sectorskils.controls.Caddress.value.trim()=='')
  {
    this.toastrService.error("Please Enter the Address.")
    return false;
  }

  if(this.ctype=="5")
  {
    if(this.sectorskils.controls['CompanyTypeOther'].value=='' || this.sectorskils.controls['CtypeName'].value=='')
        {
        if(this.sectorskils.controls['CompanyTypeOther'].value==''){
          this.toastrService.error("Please enter the other value.");
          return false;
        }
    }
}

    var pushdata={
      "Address":this.sectorskils.controls.Caddress.value,
      "CompanyType":this.sectorskils.controls.CtypeName.value,
      "StateId":this.sectorskils.controls.Stateid.value,
      "DistrictId":this.sectorskils.controls.Districtid.value,
      "CompanyTypeOther":this.sectorskils.controls.CompanyTypeOther.value,
      "companyId":this.companyid,
      "workLocationId":this.workLocationId,
      "Cwlid":this.sid
    };
    this.profilesubmit.push(pushdata);
    this.companyProfileService.SaveMultidata(this.profilesubmit).subscribe(res =>{
      this.Responce =res
      this.addworkStatus=true;
      this.ShowCompanyData=[];
      this.profilesubmit=[];
      this.toastrService.success("Company work location updated successfully.");
      if(this.Responce!=null){
        this.getallprofilecompany(this.companyid);
      }
    });
    this.hideupdate='1';
    this.hidecompanyprofile='1';
    this.showSectorskillForm='0';
    this.isowner=true;

}

getallprofilecompany(id)
{
    this.companyProfileService.GetCompanyLocationdata(id).subscribe(res => {
    this.ShowCompanyData = res;
    if(this.ShowCompanyData.lstCompanyWorkLocation!=null){
      this.ShowCompanyData=this.ShowCompanyData.lstCompanyWorkLocation
      this.showSectorskillForm='0';
    }

  });
}
closeStatus:boolean=false;
backprofile(){
  this.closeStatus=false;
  this.isowner=true;
  this.addworkStatus=true;
  this.profileshow1='1';
  this.CompanyProfileShow='1';
  this.hidecompanyprofile='1';
}

  ctype:any;
  ShowTextBox(event:any){
  this.ctype=event.target.value;
  this.companyTypeO=this.ctype;
  if(this.ctype == 5)
  {
    this.displaytextBox = 1;
  }
  else
  {
    this.displaytextBox = 0;
    this.sectorskils.controls['CompanyTypeOther'].setValue('');

  }
  }

    ExitCompanyProfileform() {
      this.closeStatus=false;
      this.addworkStatus=true;
      this.profileshow1='1';
      this.CompanyProfileShow='1';
      this.hidecompanyprofile='1';
    }

     // upload company logo, gst and pan upload
     currentFile:any;
     ValidImageTypes:any=[];
     base64textString:any=[];
     img:any;
     imgGstName:any;
     imgPanName:any;
     PanExtention  : any;
     GstnExtention : any;
     imn1:any

     onUploadChange(evt: any,selectFile:any) {
     this.img = selectFile;
     this.base64textString=[];
     var file: File = evt.target.files[0];
     this.currentFile = file;
     var imagetype = this.currentFile.type.split('/');
     let ValidImageExt = ["jpeg", "png", "jpg","pdf"];
     if ($.inArray(imagetype[1],ValidImageExt)<0) {
      this.toastrService.error("Only formats are allowed : jpg, jpeg, png & pdf");
      this.CompanyProfileForm.controls['ImgName'].setValue('');
      return false;
    }
      if(this.img=='gstImg'){
        this.ValidImageTypes = ["image/jpeg", "image/png", "image/jpg","application/pdf"];
      }else if(this.img=='panImg'){
        this.ValidImageTypes = ["image/jpeg", "image/png", "image/jpg","application/pdf"];
      }else{
        this.ValidImageTypes = ["image/jpeg", "image/png", "image/jpg"];
      }
      var mimetypereader = new FileReader();
      mimetypereader.onloadend = this.CheckMimeType.bind(this);
      const Eblob = file.slice(0, 4);
      var data = mimetypereader.readAsArrayBuffer(Eblob);

     }

     // check image format

     CheckMimeType(e) {
      var res = e.target.result;
      let bytes = [];
      const uint = new Uint8Array(res);
      uint.forEach((byte) => {
        bytes.push(byte.toString(16));
      })
      const hex = bytes.join('').toUpperCase();
      var fileType = this.getMimetype(hex);
      if ($.inArray(fileType, this.ValidImageTypes) < 0) {
        this.toastrService.error("Only formats are allowed : jpg, jpeg & png");
        $("#fileProfile").val('');
        if(this.img=='gstImg'){
          this.CompanyProfileForm.controls.gstImg.setValue('');
        }else if(this.img=='panImg'){
          this.CompanyProfileForm.controls.panImg.setValue('');
        }else{
          this.CompanyProfileForm.controls.ImgName.setValue('');
         }
        return false
      } else {
         var reader = new FileReader();
          var size = Math.round(this.currentFile.size / 1024);
          if (size > 2000) {
            this.toastrService.error("File Size must be less then 2 MB", null, { enableHtml: true });
            if(this.img=='gstImg'){
              this.CompanyProfileForm.controls.gstImg.setValue('');
            }else if(this.img=='panImg'){
              this.CompanyProfileForm.controls.panImg.setValue('');
            }else{
              this.CompanyProfileForm.controls.ImgName.setValue('');
             }
            return false;
        }
        reader.onloadend = this.handleReaderLoaded.bind(this);
        var data = reader.readAsBinaryString(this.currentFile);
      }
    }

    handleReaderLoaded(e) {
      var imn= this.currentFile.name ;
      if(this.img=='gstImg'){
        var imn2= imn.split('.');
        this.imgGstName=imn;
        this.GstnExtention=imn2[1] ;
        this.gstImage='data:image/png;base64,' + btoa(e.target.result);
        this.showMagGst=true;
        this.gstGetImg=false;
        this.CompanyProfileForm.controls['GstinImgName'].setValue("");
     }else if(this.img=='panImg'){
        var imn3= imn.split('.');
        this.imgPanName=imn;
        this.PanExtention= imn3[1] ;
        this.panImage1='data:image/png;base64,' + btoa(e.target.result);
        this.showMagPan=true;
        this.panGetImg=false;
        this.CompanyProfileForm.controls['PanImgName'].setValue("");
     }else{
       this.base64textString.push('data:image/png;base64,' + btoa(e.target.result));
       for (var i = 0; i < this.base64textString.length; i++) {
         this.imagename = '';
         this.imagename=  this.base64textString[i]
       }
       this.CompanyProfileForm.controls['ImgNames'].setValue("");
     }
 }

     getMimetype(signature) {
      switch (signature) {
        case '89504E47':
          return 'image/png'
        case '47494638':
          return 'image/gif'
        case '25504446':
          return 'application/pdf'
        case 'FFD8FFDB':
        case 'FFD8FFE0':
          return 'image/jpeg'
        case '504B0304':
          return 'application/zip'
        default:
          return 'Unknown filetype'
      }
    }
// end of upload company logo, gst and pan upload

// old code for upload company logo, gst and pan upload

  //   onUploadChange1(evt: any,a:any) {
  //     this.img = a;
  //     this.base64textString=[];
  //     const file = evt.target.files;
  //     var imn= file[0].name ;
  //     this.imn1= imn.split('.');
  //     var validImageExt: Array<string> = ['jpg', 'jpeg', 'png'];
  //     if(this.img=='gstImg'){
  //       var imn2= imn.split('.');
  //       this.imgGstName=imn;
  //       this.GstnExtention=imn2[1] ;
  //       this.selectImage(file);

  //     }else if(this.img=='panImg'){
  //       var imn3= imn.split('.');
  //       this.imgPanName=imn;
  //       this.PanExtention= imn3[1] ;
  //       this.selectImage(file);

  //     }else if(this.img=='logo'){
  //       if(this.imn1[1]=='jpeg' || this.imn1[1]=='png' || this.imn1[1]=='jpg')
  //       {
  //       for (var i = 0; i < file.length; i++) {
  //         var size = file[i].size;
  //         var si = Math.round(size / 1024);
  //         var ext = file[i].type.split('/')[1];
  //         if (!ext || (ext && validImageExt.indexOf(ext.toLowerCase()) > -1)) {
  //           if (validImageExt.indexOf(ext) == -1) {
  //             this.toastrService.error(file[i].name + " <br/> Invalid Selected file.", null, { enableHtml: true })
  //             return false;
  //           }
  //         }
  //         if (si >= 2000) {
  //           this.toastrService.error("File Size must be less then 2 MB", null, { enableHtml: true })
  //           this.CompanyProfileForm.controls.ImgName.reset();
  //           return false;
  //         }else if(ext=='pdf'){
  //             this.toastrService.error(file[i].name + " <br/> Invalid Selected file.", null, { enableHtml: true })
  //             return false;
  //         }
  //         const reader = new FileReader();
  //         reader.onload = this.handleReaderLoaded.bind(this);
  //         reader.readAsBinaryString(file[i]);
  //       }
  //     }
  //     else
  //     {
  //       this.toastrService.error("Invalid format", null, { enableHtml: true });
  //       this.CompanyProfileForm.controls['ImgName'].setValue("");
  //     }
  //     }


  // }

  // selectImage(file:any){
  //   if(this.imn1[1]=='jpeg' || this.imn1[1]=='png' || this.imn1[1]=='jpg' ||this.imn1[1]=='pdf')
  //   {
  //   for (var i = 0; i < file.length; i++) {
  //     var size = file[i].size;
  //     var si = Math.round(size / 1024);
  //     if (si >2000) {

  //       this.toastrService.error("File Size must be less then 2 MB", null, { enableHtml: true })
  //       if(this.img=='gstImg'){
  //         this.CompanyProfileForm.controls.gstImg.reset();
  //       }else if(this.img=='panImg'){
  //         this.CompanyProfileForm.controls.panImg.reset();
  //       }
  //       return false;
  //     }
  //     const reader = new FileReader();
  //     reader.onload = this.handleReaderLoaded.bind(this);
  //     reader.readAsBinaryString(file[i]);
  //   }
  // }
  // else
  // {
  //   this.toastrService.error("Invalid format", null, { enableHtml: true });
  //   this.CompanyProfileForm.controls['ImgName'].setValue("");
  // }
  // }




  //   GstValue(GstValue) {
  //     let result = GstValue.substr(2);
  //     let Pan = result.substring(0, result.length - 3);
  //   }

  //   CheckGstin(event:any) {
  //     this.Gstn =   event.target.value;
  //     if(this.Gstn.lenght>0){
  //       this.companyProfileService.CheckGstn(this.Gstn).subscribe(res => {
  //         this.Responce = res;
  //           if (this.Responce.responseResult!=null) {
  //             this.gstinvalid=true;
  //           }
  //           else {
  //             this.toastrService.error(this.Responce.message);
  //             this.gstinvalid=false;

  //           }
  //       });
  //     }
  //    }

  ///////////// Landline Specail Char //////////////
Validationforlandline(event:any) {
  var phoneno=event;

  var myregex =  /^\(?([0-9]{1})\)?[-. ]?([1-9]{1})[-. ]?([0-9]{4})[-. ]?([0-9]{4,6})$/;
if(this.CompanyProfileForm.controls.LandlineNumber.value!=''){
  if (!myregex.test(phoneno) || phoneno=="0") {
    //event.preventDefault();
    this.toastrService.error(" Entered landline number is not valid");
    this.CompanyProfileForm.controls.LandlineNumber.setValue('');
    return false;
}
}

}
////////////////////// End Landline Char ////////////////
DeleteComId:any;
confirmBox(confirm: TemplateRef<any>,delcomID:any) {
  this.DeleteComId=delcomID;
  this.modalRef = this.modalService.show(confirm, { class: 'modal-sm' });
}
PushedTemplate(template: TemplateRef<any>) {
  this.modalRef = this.modalService.show(template, { class: 'modal-sm' });
}

declineBox(): void {
  this.modalRef.hide();
  this.DeleteComId='';

}

onlyNumber(evt) {
  evt = (evt) ? evt : window.event;
  var charCode = (evt.which) ? evt.which : evt.keyCode;
  if (charCode > 31 && (charCode < 48 || charCode > 57)) {
    return false;
  }
  return true;
}

decimals(e){
  if (e.keyCode === 190 || e.keyCode == 110) {
      return false;
  }
  if (e.keyCode === 189 ) {
      return false;
  }
}


  }





