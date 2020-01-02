
import { MasterService } from './../../../Services/master.service';
import { Component, OnInit, ViewChild, HostListener,AfterContentInit, TemplateRef } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
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
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker/bs-datepicker.config';
import { BsDatepickerViewMode } from 'ngx-bootstrap/datepicker/models';
import { TypeaheadMatch } from 'ngx-bootstrap';
import {debounceTime, distinctUntilChanged, map} from 'rxjs/operators';
import * as moment from 'moment';


@Component({
  selector: 'app-UploadDocumentComponent',
  templateUrl: './UploadDocument.Component.html',

})

export class UploadDocumentComponent implements OnInit {
  modalRef: BsModalRef;
  //public bsConfig: Partial<BsDatepickerConfig> = new BsDatepickerConfig();
  minMode: BsDatepickerViewMode = 'month';
 // bsValue: Date = new Date(2017, 7);
 

  bsConfig: Partial<BsDatepickerConfig>;

  @ViewChild(ToastContainerDirective) toastContainer: ToastContainerDirective;

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
  maxDate:Date=new Date();
  candidate_document: FormGroup;
  
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
  year:any=[]
  passingyear = new Date();
  month:any=[];
  
  States: any = [];
  StatesSelected: string;
  Responce:any=[];
  Searchjobs:any;
  stateId:any;
  allpias:any=[];
  PiaSelecteds: any = null;
  PiaSelectedsID: any = 0;
  GetPiaData:any=[];
  pia:any='';

  GetAllPia() {

    this.masterService.GetAllPia().subscribe(res => {
      this.Responce = res;
      this.GetPiaData = this.Responce.lstPIA;
      // for (var i = 0; i < this.GetPiaData.length; i++) {
      //   if (this.States[i].id == this.pia.id) {
      //     this.PiaSelecteds = this.GetPiaData [i].pia_Name;
      //     //this.StatesSelecteds = this.States[i].stateName;
      //   }
      // }
    });
  }

  StatesOnSelect(event: TypeaheadMatch): void {
    this.PiaSelecteds = event.item.pia_Name;
    this.PiaSelectedsID = event.item.id;
    this.candidate_form.controls['training_partner'].setValue(this.PiaSelecteds);
  }

  StatesSelectedclears() {
    this.candidate_form.controls['training_partner'].setValue('');
    this.PiaSelecteds =null ;
    this.PiaSelectedsID =0;
  }

  ngOnInit(){  
    this.bsConfig = Object.assign({},
      {
        minMode: 'month',
        datepickerMode: 'month',
        containerClass: 'theme-dark-blue',
        showWeekNumbers: false,
        dateInputFormat: 'DD/MM/YYYY'
       // maxDate: new Date(),
      }
    );
    this.GetAllPia();
    this.GetCandidateDocumentType();
    this.passingyear = new Date();
    var n = this.passingyear.getFullYear();
    for (var i = n - 20; i <= n; i++) {
      this.year.push(i);
    }
    for (var j = 1; j <= 12; j++) {
      this.month.push(j);
    }
    $(document).ready(function () {
      $('.page-filters h2 a').click(function () {
        $(this).find('i').toggleClass('fa-chevron-down fa-chevron-right');
        $(this).parent().siblings('.filter-wrapper').slideToggle();
      });
    });
    this.candidate_form = this.formBuilder.group(
      {
        training_partner: ['', ''],
        Tcname:['', ''],
        domicile_state: ['', ''],
        domicile_district: ['', ''],
        sector: ['', ''],
        trade: ['', ''],
        candage: ['', ''],
        Gender: ['', ''],
      })
      this.candidate_document=this.formBuilder.group(
        {
          doctype: ['', Validators.required],
          TypeOther:['',Validators.nullValidator],
          docdateyear: ['', Validators.required], 
          uploaddocument: ['', Validators.required], 
        })
        this.GetAllStates();
        this.GetAllSectors();
  }
  private GetAllStates() {
    try {
      this.masterService.GetAllStates().subscribe(res => {
        this.dbresponse = res
        if(this.dbresponse!=null)
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
  GetAllDistrict(stateid:any){
    
    if(stateid!=null&&stateid!='')
    {
      this.masterService.GetAllDistrict(stateid).subscribe(res=>{this.districts=res;
      });
    }
    else
    {
      this.districts=[];
    }
   
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
  Documenttype:any=[]
  GetCandidateDocumentType()
  {
    this.CandidateService.GetCandidateDocumentType().subscribe(res => {
      this.DbResponce = res
      if (this.DbResponce != null) {
        this.Documenttype = this.DbResponce;

      } else {
        this.Documenttype = [];
      }
    });
  }
  getallducmentdata:any=[];
  GetCandidateDocument()
  {
    this.CandidateService.GetCandidateDocument(this.candidateID).subscribe(res => {
      this.DbResponce = res
      if (this.DbResponce.lstCandidateInfo!= null) {
        this.getallducmentdata = this.DbResponce.lstCandidateInfo;
      } else {
        this.getallducmentdata = [];
      }
    });
  }
   
candidateuploaddata:any=[];
docdate:any;
isValid:boolean=true;
count:number =1;
UploadDocumentYear:any;
  uploaddocument()
  {
    this.UploadDocumentYear = this.candidate_document.value.docdateyear;
    this.UploadDocumentYear = new Date(this.UploadDocumentYear);
    this.UploadDocumentYear = moment(this.UploadDocumentYear).format('YYYY/MM/DD');
    this.mindate            = moment(this.mindate).format('YYYY/MM/DD');

    
    if (this.UploadDocumentYear < this.mindate) {
      this.toastrService.error('Please Select Valid Date');
      return false;
    }
    this.spinnerService.show();
    if(this.count == 1)
    {
     if(this.Otype=="5")
      {
      if(this.candidate_document.controls['TypeOther'].value=='' || this.candidate_document.controls['TypeOther'].value==null){
        this.toastrService.error("Please enter the other value.");
        return false;
      }
    }
   if(this.candidate_document.valid)
      {
        //this.candidate_form.reset;
        this.candidateuploaddata=[];
        let doctype=this.candidate_document.value.doctype;
        if(doctype=='1' || doctype=='2')
        {
          var date = new Date(this.candidate_document.value.docdateyear), y = date.getFullYear(), m = date.getMonth();
          var firstDay = new Date(y, m, 1);
          this.docdate=firstDay;
        }
        else
        {
          
          this.docdate=this.candidate_document.value.docdateyear;
        }
       this.candidateuploaddata= {
          "CandidateId":this.candidateID!=''?this.candidateID:0,
          "DocId":this.candidate_document.value.doctype!=''?this.candidate_document.value.doctype:0,
          "Imagename":" ",
          "Imagepath":this.base64textString[0],
          "DocumentName":this.candidate_document.controls['TypeOther'].value ? this.candidate_document.controls['TypeOther'].value:'',
          "BegnningOfDate":this.docdate!=''?this.docdate:'0000-00-00',
          "ActualDate":this.docdate!=''?this.docdate:'0000-00-00',
          }
       
         this.masterService.saveUserLogs('Candidate/GetCandidateSearchOpenDatabase/','Candidate Documents');
          this.CandidateService.SaveCandidateDocument(this.candidateuploaddata).subscribe(res => {
            this.DbResponce = res
            if (this.DbResponce.responseResult!= null) {
              this.GetCandidateDocument();
              this.GetCandidateDocumentType();
              this.toastrService.success(this.DbResponce.message);
            } else {
              this.toastrService.error(this.DbResponce.message);
            } 
            this.spinnerService.hide();
            this.count=1;

            this.reset_form();
          });
      }
      else
      {
        this.toastrService.error('All Fields are required');
      }
    }
    this.displaytextBox = false;
    // this.CandidateDbresponse.candidate_document['doctype'].setValue('');
    this.candidate_document.controls['TypeOther'].setValue('');

    this.count++;

  }
  reset_form()
  {
    this.ImgName='';
    this.imagename='';
    this.candidate_document.controls['doctype'].setValue('');
    this.candidate_document.controls['docdateyear'].setValue('');
    this.candidate_document.controls['uploaddocument'].setValue('');
    this.candidate_document.reset({  });
  }
  ///////////////////  image upload ////////////
  base64textString: any = [];
  imagename: string = '';
  ImgName:any;

  currentFile: any
  ValidImageTypes: any;


  // onUploadChange1(evt: any) {
  //   this.base64textString = [];
  //   const file = evt.target.files;
  //   var imn = file[0].name;
  //   var imn1 = imn.split('.');
  //   if (imn1[1] == 'jpeg' || imn1[1] == 'png' || imn1[1] == 'jpg' ||  imn1[1] == 'pdf') {
  //     for (var i = 0; i < file.length; i++) {
  //       var size = file[i].size;
  //       var si = Math.round(size / 1024);
  //       if (si >= 2097152) {
  //         this.toastrService.error(file[i].name + " <br/> File Size must be less then 2 mb", null, { enableHtml: true })
  //         return false;
  //       }
  //       const reader = new FileReader();

  //       reader.onload = this.handleReaderLoaded.bind(this);
  //       reader.readAsBinaryString(file[i]);
  //     }
  //   }
  //   else {
  //     this.toastrService.error("Only PNG, JPG, JPEG and PDF file format are allowed.", null, { enableHtml: true });
  //     this.ImgName='';
  //     this.candidate_document.controls['uploaddocument'].setValue('');
  //   }
  // }

  onUploadChange(evt: any) {

    this.base64textString = [];
    var file: File = evt.target.files[0];
    var imn = file.name;
    var imn1 = imn.split('.');
    //this.doctExtension = imn1[1];
    this.currentFile = file;
    var imagetype = this.currentFile.type.split('/');
    let ValidImageExt = ["jpeg", "png", "jpg", "pdf"];
    if ($.inArray(imagetype[1], ValidImageExt) < 0) {
      this.toastrService.error("Only formats are allowed : jpg, jpeg, png & pdf");
      this.candidate_document.controls['uploaddocument'].setValue('');
      return false;
    }
    this.ValidImageTypes = ["image/jpeg", "image/png", "image/jpg", "application/pdf"];
    var mimetypereader = new FileReader();
    mimetypereader.onloadend = this.CheckMimeType.bind(this);
    const Eblob = file.slice(0, 4);
    var data = mimetypereader.readAsArrayBuffer(Eblob);

  }

  handleReaderLoaded(e) {
    this.base64textString.push('data:image/png;base64,' + btoa(e.target.result));
    for (var i = 0; i < this.base64textString.length; i++) {
      this.imagename = '';
      this.imagename = this.base64textString[i]
    }
    // this.ImgName='';
  }

// check mime type

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
    this.toastrService.error("Only formats are allowed : png, jpeg, jpg & pdf");
    $("#fileProfile").val('');
    return false
  } else {
    var reader = new FileReader();
    var size = Math.round(this.currentFile.size / 1024);
    if (size > 2000) {
      this.toastrService.error("File Size must be less then 2 MB", null, { enableHtml: true });
      return false;
    }
    reader.onloadend = this.handleReaderLoaded.bind(this);
    var data = reader.readAsBinaryString(this.currentFile);
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
  candidatedata: any ={};
  showsearchresult:any=[];
  scheamfilter:any=[];
  worklocation:any;
  DbResponce:any=[];
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
  Tcid: any;
  candage: any;
  MinCandAge: any;
  MaxCandAge: any;
  statename:any=[];
  districtname:any=[];
  sectorname:any=[];
  tradename:any=[];
  scheamname:any=[];
  CandidateDbresponse:any=[];
  submit(PageNumbers:number, from) {
   this.viewProfile=false;
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
  this.PiaSelectedsID
  // this.candidatedata.Training_Partner = this.candidate_form.value.training_partner!=''?this.candidate_form.value.training_partner: 0;
  this.candidatedata.Training_Partner = this.PiaSelectedsID!=''?this.PiaSelectedsID: 0;
  this.candidatedata.Tcname = this.candidate_form.value.Tcname!=''?this.candidate_form.value.Tcname:'NA';
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
   let statedid;
   let districtid;
   let sectorid;
   let tradtid;
statedid     = this.candidate_form.value.domicile_state;
districtid   = this.candidate_form.value.domicile_district;
sectorid   = this.candidate_form.value.sector;
tradtid   = this.candidate_form.value.trade;

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
"Training_Partner":this.candidate_form.value.training_partner!=''?this.candidate_form.value.training_partner:
  'N/A',
"Tcname":this.candidate_form.value.Tcname!=''?this.candidate_form.value.Tcname:
'N/A',
"State": this.statename!=''?this.statename:'NA',
"District":this.districtname!=''?this.districtname:'NA',
"Sector": this.sectorname!=''? this.sectorname:'NA',
"Trade": this.tradename!=''?this.tradename:'NA',
"Age":this.candidate_form.value.candage!=''?this.candidate_form.value.candage:'NA',
"Gender":this.candidate_form.value.Gender!=''?this.candidate_form.value.Gender:'NA',

});

      ////////////////////  method of  Registered Pool   source  //////////////////
        if (from == 'scroll') {
          this.spinnerService.show();
          this.CandidateService.GetCandidateSearchOpenDatabase(this.candidatedata).subscribe(res => {
            this.CandidateDbresponse = res
            this.spinnerService.hide();
            if (this.CandidateDbresponse.lstSearchFriend != null) {
              this.candidatelist = this.candidatelist.concat(this.CandidateDbresponse.lstSearchFriend);

            }
            else {
              this.candidatelist = [];
            }
            this.delay = false;
            //$('.filter-wrapper').slideToggle();
          });
        } else {
        this.candidatelist = [];
        this.spinnerService.show();
        this.masterService.saveUserLogs('Candidate/GetCandidateSearchOpenDatabase/','Candidate Documents');
        this.CandidateService.GetCandidateSearchOpenDatabase(this.candidatedata).subscribe(res => {
          this.CandidateDbresponse = res
          this.spinnerService.hide();
          if (this.CandidateDbresponse.lstSearchFriend != null) {
            this.candidatelist = this.CandidateDbresponse.lstSearchFriend;
          }
          else {
            this.candidatelist = [];
          }
          this.delay = false;
          $('.filter-wrapper').slideToggle();
        });
         
        }
    /////////////////////  End method for My Database source ///////////////////
  }
  candidatedetails:any =[];
  ProfileResponce: any = [];
  postionview:any;
  scrollToX:any;
  scrollToY:any;
  candidateID:any;
  viewcandidateProfile(candiID:any,apitype:any,template: TemplateRef<any>,template2: TemplateRef<any>) {
   this.candidateID=candiID;
   this.reset_form();
   this.GetCandidateDocument();
   this.GetCandidateDocumentType();
   this.ViewMrigsCandidateDetail(candiID);

    this.modalRef = this.modalService.show(template,
      Object.assign({}, { class: 'candidate-view-modal modal-lg' }
     ))
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
  mindate:any;

ViewMrigsCandidateDetail(candiID:any)
{
  this.CandidateService.ViewMrigsCandidateDetail(candiID).subscribe(res => {
    this.ProfileResponce = res
    this.spinnerService.hide();
    if (this.ProfileResponce.lstCandidateInfo != null) {
      this.candidatedetails = this.ProfileResponce.lstCandidateInfo[0];
  
      this.mindate = this.candidatedetails.dob;
    } else {
      this.candidatedetails = [];
    }
  });
}
ResetFilterResult() {
 
  this.candidate_form.controls['training_partner'].setValue('');
  this.candidate_form.controls['Tcname'].setValue('');
  this.candidate_form.controls['domicile_state'].setValue('');
  this.candidate_form.controls['domicile_district'].setValue('');
  this.candidate_form.controls['sector'].setValue('');
  this.candidate_form.controls['trade'].setValue('');
  this.candidate_form.controls['candage'].setValue('');
  this.candidate_form.controls['Gender'].setValue('');
  this.districts = [];
  this.trade = [];
  this.showsearchresult=[];
  
}
/////////////////// End candiate details //////////


// Upload other document By Neeraj Singh
OtherType:any;
Otype:any;
displaytextBox:boolean;
ShowTextBox(event:any){

this.Otype=event.target.value;
this.OtherType=this.Otype;
if(this.Otype == 5)
{
  
  this.displaytextBox = true;   
}
else
{
  this.displaytextBox = false;   
  
  // this.candidate_document.controls['TypeOther '].setValue('');
  this.candidate_document.controls['TypeOther'].setValue('');

}
}
}

