import { Component, OnInit, ViewChild, ElementRef, HostListener,TemplateRef } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { RouterModule } from '@angular/router';
import { FormBuilder, Validators, FormGroup, FormControl } from '@angular/forms';
import { AuthenticationService } from '../../../Services/authenticate.service';
import { CookieService } from 'ngx-cookie-service';
import { AppConfig } from '../../../Globals/app.config';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
import { ToastrService, ToastContainerDirective } from 'ngx-toastr';
import { Http } from '@angular/http';
import { CustomValidators } from '../../../Validators/custom-validator.directive';
import { strictEqual } from 'assert';
import { stringify } from 'querystring';
import { OutputType } from '@angular/core/src/view';
import { CandidateService } from '../../../Services/candidate.service';
import { MasterService } from '../../../Services/master.service';
import * as $ from 'jquery';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { CommonViewLayoutComponent } from '../../CommonModelView/CommonView-Layout.Component';
@Component({
  selector: 'app-agCandidateComponent',
  templateUrl: './agCandidate.component.html',
})
export class agCandidateComponent implements OnInit {
  modalRef: BsModalRef;
  modalRefdesc: BsModalRef;
  modaldefualt: BsModalRef;
  uploadForm:FormGroup;
  @ViewChild('mdResetPasswordOpen') mdResetPasswordOpen: ElementRef
  @ViewChild(CommonViewLayoutComponent) private mymodel: CommonViewLayoutComponent;
  DBResponce:any;
  Responce: any = {};
  UserInfo:any;
  logintype:any;
  loading = false;
  candidate:any;
  candidatelistshow:any='0';
  PageNumber: number = 0;
  from:any;
  items: any[];
  states:any=[];
  languages:any=[];
  candid:any;
  delmodalRef: BsModalRef;
  constructor(
    private http: Http,
    private router: Router,
    private spinnerService: Ng4LoadingSpinnerService,
    private cookieService: CookieService,
    private authenticationService: AuthenticationService,
    private candidateService: CandidateService,
    private toastrService:ToastrService,
    private forgotPasswordBuilder: FormBuilder,
    private activatedRoute: ActivatedRoute,
    private updatePasswordBuilder: FormBuilder,
    private formBuilder: FormBuilder,
    public appConfig: AppConfig,
    private _cookieService: CookieService,
    private config: AppConfig,
    private modalService: BsModalService,
    private masterService : MasterService,
  
  ) 
  {
   
   this.UserInfo = appConfig.UserInfo;
   this.logintype = this.UserInfo.loginType
   this.appConfig.isverified();

  }

   ///////////////////  scrollhandler ////////////////////  
   viewProfile: boolean = false;
   @HostListener('window:scroll', ['$event'])
  scrollHandler(event) {
   let pos = (document.documentElement.scrollTop || document.body.scrollTop) + document.documentElement.offsetHeight;
   let max = document.documentElement.scrollHeight;
   if (pos == max) {
     if (this.candidate.length > 0 && this.viewProfile ==false) {
      this.PageNumber = this.PageNumber + 1;
       this.GetAllCandidateDetails(this.PageNumber,'scroll');
     }
   }
 }
 
  ngOnInit() {
    this.GetAllCandidateDetails(this.PageNumber,this.from);
    this.items = Array(15).fill(0);   

    this.uploadForm=this.formBuilder.group({
      uploadfile: ['', [Validators.required]],     
    })
  }
  States: any = [];
  StatesSelected: string;
  stateRes:any;
  GetAllStates() {
    this.masterService.GetAllStates().subscribe(res => {
      this.stateRes = res;     
      if(this.stateRes!=null && this.stateRes.length>0){
        this.States = this.stateRes;
      }
     
    });
  }
  openModal(candid:any) {
    this.mymodel.callMethod(candid,'MYDB');
  }
  

/////////////////// End candiate details //////////
addressdistirct:any;
workexpdistics:any;
districts:any=[];
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
  this.candidateService.GetAllRelation().subscribe(res=>{this.rel=res;
  });
}

religions:any=[];
GetAllReligions_details()
{
  this.candidateService.GetAllReligions().subscribe(res=>{this.religions=res;
  });
}
  


  GetAllCandidateDetails(PageNumber,from)
  {
        if (from == 'scroll') {    
                  this.spinnerService.show();
                  this.candidateService.GetAllCandidateDetails(PageNumber).subscribe(res=>{ this.DBResponce=res;
                  if(this.DBResponce.lstGetAllCandidateDetails!=null)  
                  {
                  this.candidate =this.candidate.concat(this.DBResponce.lstGetAllCandidateDetails);
                  this.spinnerService.hide();
                  this.from='scroll';
                  }
                  else
                  {
                    this.candidate=[];
                    this.from='';
                  }       
                  });
        }
            else
             {
                this.candidateService.GetAllCandidateDetails(PageNumber).subscribe(res=>{
                this.DBResponce=res;
                if(this.DBResponce.lstGetAllCandidateDetails!=null)  
                {
                this.candidate =this.DBResponce.lstGetAllCandidateDetails;
                this.spinnerService.hide();
                this.from='';
                }
                else
                {
                  this.candidate=[];
                  this.from='';
                }
                });         
        }
  }

  delcandid:any;
  DeleteEmpCandidate() {
    this.delcandid = this.DelCandID;
    this.candidateService.DeleteEmpCandidate(this.delcandid).subscribe(res => {
      this.delcandid = res
      if (this.delcandid.responseResult) {
        this.delcandid = this.delcandid;
        this.delmodalRef.hide();
        this.toastrService.success(this.delcandid.message);
        this.GetAllCandidateDetails(this.PageNumber,this.from);
      }
      else { 
        this.toastrService.error(this.delcandid.message);
        this.GetAllCandidateDetails(this.PageNumber,this.from);
      }
    });
  }
  /////////////// 
  DelCandID:any;
  confirmBox(confirm: TemplateRef<any>,DelCandID:any) {
    this.DelCandID=DelCandID;
    this.delmodalRef = this.modalService.show(confirm, { class: 'modal-sm' });
  }

  declineBox(): void {
    this.DelCandID='';
    this.delmodalRef.hide();
  }

  // candidate bulk upload section 

  excelmodalRef: BsModalRef;
  fileName:any;

// open modal for upload excel file
  openDialogforexcel(confirm: TemplateRef<any>){
    this.excelmodalRef = this.modalService.show(confirm, { backdrop: 'static', keyboard: false, class: 'modal-sm'});
  }

  excelFile:any;
  currentFile:any;
  ValidImageTypes:any=[];
  base64textString:any=[];
  img:any;
  imgGstName:any;
  imgPanName:any;
  PanExtention  : any;
  GstnExtention : any;
  imn1:any
  ValidImageExt:any;

// onupload function start
doctExtension:any;
  onUploadChange(evt: any) {      
    this.base64textString=[];
    var file: File = evt.target.files[0];
    this.currentFile = file;
    var imn = file.name;
    var imn1 = imn.split('.');
    this.doctExtension = imn1[1]; 

    var imagetype = this.currentFile.type.split('/');
    this.ValidImageTypes = ["application/vnd.oasis.opendocument.spreadsheet"];
    this.ValidImageExt = ["vnd.openxmlformats-officedocument.spreadsheetml.sheet","vnd.oasis.opendocument.spreadsheet"];
    if ($.inArray(imagetype[1],this.ValidImageExt)<0) {
     this.toastrService.error("Only formats are allowed : xlsx, xls, csv & ods");
     this.uploadForm.controls['uploadfile'].setValue('');
     return false;
   }    
     var mimetypereader = new FileReader();     
     mimetypereader.onloadend = this.CheckMimeType.bind(this);
     const Eblob = file.slice(0, 4);
     var data = mimetypereader.readAsArrayBuffer(Eblob);

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
        this.toastrService.error("Only formats are allowed : xlsx, xls, csv & ods");
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
        case '504B34':
          return 'application/vnd.oasis.opendocument.spreadsheet'             
      }
    }


    selectedFile:any;
    handleReaderLoaded(e){      
      this.selectedFile='data:image/png;base64,' + btoa(e.target.result);
    }


 // final submit button function
  submitUpload(){
    if(this.selectedFile){

  //    this.toastrService.error('API Is not available please wait!');
      let postData={
         "FileExt":this.doctExtension,
         "Imagenames":'',
         "Imagepath":this.selectedFile
      }
       this.excelmodalRef.hide();   
       this.spinnerService.show();
       this.candidateService.uploadEXCELFile(postData).subscribe(res=>{
       this.spinnerService.hide();
        if(res){
           this.toastrService.success('Document saved successfully');
        }else{
          this.toastrService.success('Api Error');
        }  
      })     
    }else{
      this.toastrService.error('please select document first');
    }  
  }

  close(){
    this.excelmodalRef.hide();
  }

}


