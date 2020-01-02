  import { Component, OnInit} from '@angular/core';
  import { Router} from '@angular/router';
  import { FormBuilder, Validators, FormGroup} from '@angular/forms';
  import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
  import { ToastrService,  } from 'ngx-toastr';
  import { CompanyProfileService } from '../../Services/companyprofile.service'; 
  import { MasterService } from '../../Services/master.service';

  @Component({
  selector: 'YuvaSendeshComponent',
  templateUrl: './YuvaSendesh.component.html',
  })

  export class YuvaSendeshComponent implements OnInit {
    UserInfo       : any;
    logintype      : any;
    YuvaSandesh    : FormGroup;
    invoiceForm    : FormGroup;
    CompanyName    : any;
    PushSandesh    : any = {}; 
    result         : any;
    imagename      : string = '';
    imagename1     : any = [];
    Response       : any = {};
    ShowForm       : boolean;
    ShowsandeshList: boolean = true;
    clickbtn       : boolean = true;
    count          : any = 1;
    ImageUpload    : boolean = true;
    Extention      : any;
    Filetype       : any = [];
    Image          : any  = [];
    DbResponce     : any;
    lstimagesNames = [];
    ExtentionList  = [];
    GetId          = [];
    isValid        : boolean=false;
    Isdisabled     : boolean=false;

    
  constructor(
        private toastrService: ToastrService 
      , private formBuilder: FormBuilder
      , private spinnerService: Ng4LoadingSpinnerService
      , public router: Router     
      , private masterService: MasterService   
      , private companyProfileService : CompanyProfileService
    )
    {
      try {
        this.UserInfo = JSON.parse(localStorage.getItem('UserInfo'));;
        this.logintype = this.UserInfo.loginType;
        
    } catch  { }

    }
    CompanyImage:any;
  
  ngOnInit() {    
    this.YuvaSandesh = this.formBuilder.group({
      CompanyName: ['', [Validators.required]],
      ImgName: ['', ''],
      subject: ['', [Validators.required]],
      content: ['', [Validators.required]],
      SandeshPicture: ['', [Validators.nullValidator]]
    });
    this.GetCompanyData();
 }


  /**************************************
   **** For Multiple Image Upload save***
  **************************************/ 
  MultiImage:any={};
  Imageid:any=[];
  GetImgId:any=[];
  UploadImage(){     
      this.MultiImage.Imageid         = '0';
      this.MultiImage.CompanyName     = '';
      this.MultiImage.Subject         = '';
      this.MultiImage.content         = '';
      this.MultiImage.ExtentionDetail = this.ExtentionList;
      this.MultiImage.ImagenDetail    = this.lstimagesNames;

      this.spinnerService.show();
      this.masterService.SetUploadImage(this.MultiImage).subscribe(res => {
        this.GetImgId = res
        if(this.GetImgId!=null){
          this.spinnerService.hide();
          for(var i=0; i<this.GetImgId.objYuva.length; i++){
            this.GetId.push(this.GetImgId.objYuva[i].imageid)
          }
          this.YuvaSandesh.controls[('SandeshPicture')].reset();
          this.Base64textString=[];
        }
      });
    this.isValid = false;
    this.Isdisabled = false;
  }
  /*End Of Multiple Image Upload Save***/ 

  /**************************************
   *Save All Data Multiple Image Upload**
  **************************************/ 
  senddata:any=[];
  SaveSandesh(){
    this.PushSandesh.Id             = this.GetId;
    this.PushSandesh.CompanyName    = this.YuvaSandesh.value.CompanyName;
    this.PushSandesh.subject        = this.YuvaSandesh.value.subject;
    this.PushSandesh.content        = this.YuvaSandesh.value.content;
    if(this.GetId.length>0){
      for(var i=0;i<this.GetId.length;i++){

        let obj = {"ImageId":this.GetId[i],"CompanyName":this.YuvaSandesh.value.CompanyName,"subject":this.YuvaSandesh.value.subject,"content":this.YuvaSandesh.value.content};
        this.senddata.push(obj);
}

this.masterService.UpdateYuvaSandesh(this.senddata).subscribe(res => {
  this.Response = res
  if(this.Response!=null){
    this.YuvaSandesh.reset();
    this.toastrService.success(this.Response.message);
    this.YuvaSandesh.controls['CompanyName'].setValue(this.UserInfo.companyName);
  }
});
}
else{
  this.toastrService.error("Record Not Found");
}

    this.ShowForm = false;
    this.ShowsandeshList = true;
    this.clickbtn = true;
    this.GetYuvaSandesh();
  }
  /**End Of Save All Data Multiple Image***/   

  /**************************************
  ** Function For Multiple Image Upload *
  **************************************/  
  MultiImg:any
  PushMultiImg:any=[];
  Base64textString:any=[];
  target:any;
  
onUploadChange1(evtt: any) {
  this.Base64textString = [];
  this.ExtentionList    = [];
  this.lstimagesNames = [];
  var ImageExt = ['jpg', 'jpeg', 'png'];
  this.target = evtt.target || evtt.srcElement;
  var validImageExt: Array<string> = ['jpg', 'jpeg', 'png'];
  //var validViedoExt: Array<string> = ['mp4', '3gp', 'wmv'];
  const file = evtt.target.files;
  if (file.length > 20) {
    //evt.target.files = [];
    this.toastrService.error("You can upload maximum 20 files at a time.");
  }
  else {
    var totalSize = 0;
    for (var i = 0; i < file.length; i++) {
      let ext = file[i].type.split('/')[1];
      totalSize = totalSize + file[i].length;
      if (!ext || (ext && validImageExt.indexOf(ext.toLowerCase()) == -1)) {
        this.toastrService.error(file[i].name + " <br/> Invalid Selected file.", null, { enableHtml: true })
        return false;
      }
      else if (totalSize > 102400000) {
        this.toastrService.error("The Total file size must not exceed 100Mb.", null, { enableHtml: true })
        return false;
      }
      else {
        for(var i=0; i <=file.length-1; i++)
        {
          const reader = new FileReader();
          reader.onload = this.handleReaderLoaded1.bind(this);
          reader.readAsBinaryString(file[i]); 
          this.ExtentionList.push({ "Filetype": file[i].type});
        }
      }
    }
  }
  this.isValid = true;
  this.Isdisabled = true;
}

handleReaderLoaded1(evtt:any) {

  this.Base64textString.push('data:image/png;base64,' + btoa(evtt.target.result));
  for (var i = 0; i < this.Base64textString.length; i++) {
    this.imagename1 = '';
    this.imagename1=  this.Base64textString[i]
  }
  this.lstimagesNames.push({"FileName": this.imagename1,"ImgName":''});
}

/* End Of Multiple Image Upload **/ 

/**************************************
 This Function Is USed For BackButton
**************************************/ 
  SendSandesh(){
    this.ShowForm=true;
    this.ShowsandeshList = false;
    this.clickbtn = false; 
  }
  /* End Of BackButton **/ 

  /***************************************************
  This Function Is USed For List Of All Yuva Sandesh 
  *************************************************/ 
  showList:any;
  GetYuvaSandesh(){
    this.masterService.GetYuvaSandeshList().subscribe(res => {
      this.Response = res
      if(this.Response.lstYuvaSandesh!= null){
        this.showList = this.Response.lstYuvaSandesh;
      }
    });
  }

/*  End Of All Yuva Sandesh List Function */


 /**********************************************
   **** For Display Company Image or Name save***
  ***********************************************/ 
  GetCompanyData(){

    this.companyProfileService.GetCompanyData().subscribe(res =>{
      this.DbResponce = res
      if(this.DbResponce.lstCompanyProfile!=null){
        this.DbResponce = this.DbResponce.lstCompanyProfile;
        this.YuvaSandesh.controls['CompanyName'].setValue(this.DbResponce[0].companyName);
      }


    });
  }

  }
