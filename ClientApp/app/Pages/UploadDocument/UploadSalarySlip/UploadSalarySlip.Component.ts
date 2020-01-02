import { MasterService } from './../../../Services/master.service';
import { Component, OnInit, ViewChild, HostListener, AfterContentInit, OnDestroy, TemplateRef } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
import { ToastContainerDirective, ToastrService } from 'ngx-toastr';
import { AppConfig } from '../../../Globals/app.config';
import { UserInfoService } from '../../../Services/userInfo.service.';
import { UploadSalarySlipService } from '../../../Services/uploadSalarySlip.service ';
import * as $ from 'jquery';
import { from } from 'rxjs/observable/from';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker/bs-datepicker.config';
import { BsDatepickerViewMode } from 'ngx-bootstrap/datepicker/models';
import { TypeaheadMatch } from 'ngx-bootstrap';
import { debounceTime, distinctUntilChanged, map } from 'rxjs/operators';
import * as moment from 'moment';
import { DatePipe } from '@angular/common'

import { Subject } from 'rxjs/Subject';
@Component({
  selector: 'app-UploadSalarySlipComponent',
  templateUrl: './UploadSalarySlip.Component.html',

})

export class UploadSalarySlipComponent implements OnInit, OnDestroy {
  modalRef: BsModalRef;
  minMode: BsDatepickerViewMode = 'month';
  bsConfig: Partial<BsDatepickerConfig>;
  candidatedata: any = {};
  viewProfile: boolean = false;
  candidatelist: any = [];
  showsearchresult: any = [];
  UserInfo: any;
  candidate_form: FormGroup;
  candidate_document: FormGroup;
  loginType: any;
  CandidateDbresponse: any = [];
  year: any = []
  month: any = [];
  PageNumber: number = 0;
  delay: boolean = false;
  showTable: boolean = false;
  dtOptions: DataTables.Settings = {};
  dtTrigger = null
  modalDocument: BsModalRef;
  candidateID: any;
  candidatedetails: any = [];
  ProfileResponce: any = [];
  maxDate: Date = new Date();
  @ViewChild(ToastContainerDirective) toastContainer: ToastContainerDirective;
  constructor(private appConfig: AppConfig
    , private toastrService: ToastrService
    , private userinfoservice: UserInfoService
    , private formBuilder: FormBuilder
    , private masterService: MasterService
    , private spinnerService: Ng4LoadingSpinnerService
    , private uploadSalarySlipService: UploadSalarySlipService
    , private modalService: BsModalService
    , private router: Router
    , public datepipe: DatePipe
  ) {
    this.UserInfo = appConfig.UserInfo
    this.loginType = this.UserInfo.loginType;
    this.appConfig.isverified();
  }

  ngOnInit() {

    this.bsConfig = Object.assign({},
      {
        minMode: 'month',
        datepickerMode: 'month',
        containerClass: 'theme-dark-blue',
        showWeekNumbers: false,
        dateInputFormat: 'DD/MM/YYYY'
      }
    );

    $(document).ready(function () {
      $('.page-filters h2 a').click(function () {
        $(this).find('i').toggleClass('fa-chevron-down fa-chevron-right');
        $(this).parent().siblings('.filter-wrapper').slideToggle();
      });
    });
    this.getData();
    this.candidate_formInit();
    this.candidate_documentInit();
  }

  // Submit data for get candidate list for upload salary slip

  submit() {
    this.viewProfile = false;
    this.candidatedata.candidateName = this.candidate_form.value.candidateName != '' ? this.candidate_form.value.candidateName : '';
    this.candidatedata.dateOfJoining = this.candidate_form.value.dateOfJoining != '' ? this.candidate_form.value.dateOfJoining : '';
    this.candidatedata.designation = this.candidate_form.value.designation != '' ? this.candidate_form.value.designation : '';
    this.candidatedata.searchKeyword = this.candidate_form.value.searchKeyword != '' ? this.candidate_form.value.searchKeyword : '';
    this.showsearchresult = [];

    this.showsearchresult = ({
      "candidateName": this.candidate_form.value.candidateName != '' ? this.candidate_form.value.candidateName :
        'N/A',
      "dateOfJoining": this.candidate_form.value.dateOfJoining != '' ? this.candidate_form.value.dateOfJoining :
        'N/A',
      "designation": this.candidate_form.value.designation != '' ? this.candidate_form.value.designation : 'NA',
      "searchKeyword": this.candidate_form.value.searchKeyword != '' ? this.candidate_form.value.searchKeyword : 'NA',
    });

    this.getData();

    /////////////////////  End method for My Database source ///////////////////
  }

  getData() {
    this.candidatelist = [];
    this.CandidateDbresponse = [];
    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 10,
      paging: true,
      searching: true,
      destroy: false,
      retrieve: true,
    };
    this.dtTrigger = new Subject<any>();
    this.spinnerService.show();
    this.uploadSalarySlipService.GetCandidateSearchOpenDatabase(this.candidatedata).subscribe(res => {


      this.CandidateDbresponse = res
      this.spinnerService.hide();
      if (this.CandidateDbresponse.objPlacedresponse != null) {
        this.candidatelist = this.CandidateDbresponse.objPlacedresponse;
        this.dtTrigger.next();
      }
      else {
        this.candidatelist = [];
      }
      this.delay = false;
      $('.filter-wrapper').slideToggle();
    });

  }

  ngOnDestroy(): void {
    // Do not forget to unsubscribe the event
    this.dtTrigger.unsubscribe();
  }
  // open modal with candidate information and open upload salary slip form
  candidateResult: any
  dateOfBirth:any;
  dateOfJoin:any;
  viewcandidateProfile(candidate: any, templateSector: TemplateRef<any>) {
    
    $(window).on('popstate',(event)=>
    this.CloseModal());
    
    this.maxDate.setFullYear(new Date().getFullYear(), new Date().getMonth(), 0);
    this.candidateID = candidate.candid;
   
    var CandiateDetailForValidate = (this.candidatelist).filter(function (entry){
      return entry.candid == candidate.candid;
    });
    this.dateOfJoin=CandiateDetailForValidate[0].joiningdate;   
    this.candidate_document.controls.uploaddocument.setValue('');
    this.candidate_document.controls.docdateyear.setValue('');
    this.imagename='';
    this.candidate_document.reset();
    this.spinnerService.show();
    this.uploadSalarySlipService.GetCandidatePersonalinfo(this.candidateID).subscribe(res => {
      this.spinnerService.hide();
      this.candidateResult = res;

      this.modalDocument = this.modalService.show(templateSector, { class: 'modal-lg' });
      
      if (this.candidateResult.lstCandidateInfo[0]) {
        this.candidatedetails = this.candidateResult.lstCandidateInfo[0];
        this.dateOfBirth=this.candidatedetails.dob;
        this.GetCandidateDocument();
      } else {
        this.toastrService.error("server error");
      }
    })
  }
  CloseModal(){
    this.modalDocument.hide();
  }

  // Get Candidate information
  getallducmentdata: any = [];
  DbResponce: any
  CandModifyData: any = [];
  CandModifyShowData: any = [];
  candidateMonthValide: any = [];

  GetCandidateDocument() {
    var data = [];
    this.uploadSalarySlipService.GetCandidateDocument(this.candidateID).subscribe(res => {
      this.DbResponce = res
      if (this.DbResponce.lstCandidateInfo != null) {
        this.getallducmentdata = this.DbResponce.lstCandidateInfo;
        this.CandModifyData = this.DbResponce.lstCandidateInfo
        this.CandModifyData.forEach(function (item) {
          var fileName, fileExtension;
          fileName = item.imagepath;
          fileExtension = fileName.substr((fileName.lastIndexOf('.') + 1));
          var obj = {
            "candidateId": item.candidateId,
            "docId": item.docId,
            "imagepath": item.imagepath,
            "imagenames": item.imagenames,
            "image": item.image,
            "begnningOfDate": item.begnningOfDate,
            "actualDate": item.actualDate,
            "userId": item.userId,
            "documentName": item.documentName,
            "fileExt": item.fileExt,
            "fileExtension": fileExtension,
            "id":item.id
          }
          data.push(obj);
        });
        this.CandModifyShowData = data;
      } else {
        this.getallducmentdata = [];
      }
    });
  }


  // Reset candidate search filter 

  ResetFilterResult() {
    this.candidate_form.controls['candidateName'].setValue('');
    this.candidate_form.controls['dateOfJoining'].setValue('');
    this.candidate_form.controls['designation'].setValue('');
    this.candidate_form.controls['searchKeyword'].setValue('');
    this.candidate_form.reset({});
  }


  // openModal(templateSector: TemplateRef<any>) {
  //   this.modalDocument = this.modalService.show(templateSector, { class: 'modal-lg' });
  // }


  ///////////////////  image upload ////////////
  base64textString: any = [];
  imagename: string = '';
  ImgName: any;
  doctExtension: any;




  // upload documents

  UploadDocumentYear: any;
  mindate: any;
  count: number = 0;
  candidateuploaddata: {};

  onOpenCalendar(container) {
    container.monthSelectHandler = (event: any): void => {
      container._store.dispatch(container._actions.select(event.date));
    };
    container.setViewMode('month');
  }
  forErrorMessage: boolean = false;
  updateCalcs(event) {
    var jointDay =this.datepipe.transform(this.dateOfJoin, 'MM-yyyy');
    var birthstDay =this.datepipe.transform(this.dateOfBirth, 'MM-yyyy');
    var inputComp=this.datepipe.transform(event, 'MM-yyyy');
    var toDayDate= new Date();
    var todateDateFormate=this.datepipe.transform(toDayDate, 'MM-yyyy');
    
    if(inputComp > todateDateFormate){
      this.candidate_document.controls['docdateyear'].setValue('');
      this.toastrService.error("Please select valid date");
    }
    if(inputComp < birthstDay){
      this.candidate_document.controls['docdateyear'].setValue('');
      this.toastrService.error("Salary slip month should not be before date of birth");
    }
    if(inputComp < jointDay){
      this.candidate_document.controls['docdateyear'].setValue('');
      this.toastrService.error("Salary slip month should not be before date of joining");
    }

    var j = 0;
    var inputFormateDate = this.datepipe.transform(event, 'MM-yyyy');
    for (var i = 0; i < this.CandModifyShowData.length; i++) {
      var DataBasedate = this.CandModifyShowData[i].begnningOfDate;
      var date = new Date(DataBasedate), y = date.getFullYear(), m = date.getMonth();
      var formateDate = this.datepipe.transform(date, 'MM-yyyy');
      
      if (formateDate === inputFormateDate) {
        j++;
        this.candidate_document.controls['docdateyear'].setValue('');
        if (j == 1) {
          this.toastrService.error("Please select another month and year");
        }
      }

    }
  }


  uploaddocument() {
debugger
    // this.UploadDocumentYear = this.candidate_document.value.docdateyear;
    this.UploadDocumentYear = new Date(this.UploadDocumentYear);
    this.UploadDocumentYear = moment(this.UploadDocumentYear).format('YYYY/MM/DD');
    this.mindate = moment(this.mindate).format('YYYY-MM-DD');
    var date = new Date(this.candidate_document.value.docdateyear), y = date.getFullYear(), m = date.getMonth();
    var firstDay = new Date(y, m);
    this.UploadDocumentYear = moment(firstDay).format('YYYY-MM-DD');
    // if (this.UploadDocumentYear < this.mindate) {
    //   this.toastrService.error('Please Select Valid Date');
    //   return false;
    // }
    this.count++
    if (this.count == 1) {
      this.candidate_document.value.doctype = "salaryslip"
      this.candidateuploaddata = {
        "CandidateId": this.candidateID != '' ? this.candidateID : 0,
        "DocId": 2,
        "Imagenames": '',
        "Image": '',
        "Imagepath": this.base64textString[0],
        "FileExt": this.doctExtension,
        "BegnningOfDate": this.UploadDocumentYear,
        "DocumentName": "Salary Slip",
      }
      this.spinnerService.show();
      this.uploadSalarySlipService.uploadSalarySlip(this.candidateuploaddata).subscribe(res => {
        this.spinnerService.hide();
        this.result = res;
        this.count=0;
        if (this.result.responseResult) {
          this.candidate_document.controls['docdateyear'].setValue('');
          this.candidate_document.controls['uploaddocument'].setValue('');
          this.imagename = '';
          this.candidate_document.reset({});
          this.toastrService.success(this.result.message);
          this.GetCandidateDocument();
        }
      })
    }
  }
  result: any;


  // Candiate form Init
  candidate_formInit() {
    this.candidate_form = this.formBuilder.group(
      {
        candidateName: ['', ''],
        dateOfJoining: ['', ''],
        designation: ['', ''],
        searchKeyword: ['', '']
      })
  }
  // candidate_documentInit
  candidate_documentInit() {
    this.candidate_document = this.formBuilder.group(
      {
        //doctype: ['', Validators.required],
        //TypeOther:['',Validators.nullValidator],
        docdateyear: ['', Validators.required],
        uploaddocument: ['', Validators.required],
      })
  }

  closeModal() {
    this.modalDocument.hide()
  }

  currentFile: any
  ValidImageTypes: any;
  onUploadChange(evt: any) {

    this.base64textString = [];
    var file: File = evt.target.files[0];
    var imn = file.name;
    var imn1 = imn.split('.');
    this.doctExtension = imn1[1];
    this.currentFile = file;
    var imagetype = this.currentFile.type.split('/');
    let ValidImageExt = ["jpeg", "png", "jpg", "pdf"];
    if ($.inArray(imagetype[1], ValidImageExt) < 0) {
      this.toastrService.error("Only formats are allowed : jpg, jpeg, png & pdf");
      $("#fileProfile").val('');
      this.candidate_document.controls['uploaddocument'].setValue('');
      return false;
    }
    this.ValidImageTypes = ["image/jpeg", "image/png", "image/jpg", "application/pdf"];
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
      // this.candidate_form.controls.uploaddocument.patchValue('');
      this.toastrService.error("Only formats are allowed : jpg, jpeg, png & pdf");
      this.candidate_document.controls['uploaddocument'].setValue('');
      this.imagename = '';    
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

  handleReaderLoaded(e) {
    this.base64textString.push('data:image/png;base64,' + btoa(e.target.result));
    for (var i = 0; i < this.base64textString.length; i++) {
      this.imagename = '';
      this.imagename = this.base64textString[i]
    }
  }
  Getextention(docimage: any) {
    fileName = '';
    var fileName, fileExtension;
    fileName = docimage;
    fileExtension = fileName.substr((fileName.lastIndexOf('.') + 1));
    return fileExtension;
  }

  modalRefDeleteSalarySlip: BsModalRef;
  PushedTemplate(template: TemplateRef<any>) {
    this.modalRefDeleteSalarySlip = this.modalService.show(template, { class: 'modal-sm' });
  }
  
  declineBox(): void {
    this.modalRefDeleteSalarySlip.hide();
  }
  DBResponce:any
  deleteSalarySlip(item) {    
    var getsenddata = { 'Id': item.id}
    let getserializeddata = JSON.stringify(getsenddata);
    let postData={      
                "HSTPLRequest": {
                      "clientKey": "ROJGAAR_ANDROID",
                      "typeFor": "DeleteSalarySlip",
                      "data": getserializeddata
                 }
              }
    this.spinnerService.show();    
    this.uploadSalarySlipService.DeletSalarySlip(postData).subscribe(res => {
     this.spinnerService.hide();     
           this.DBResponce = res
          if (this.DBResponce.hstplResponse.status) {
            this.toastrService.success("Salary slip deleted successfully");          
            this.modalRefDeleteSalarySlip.hide();
            this.GetCandidateDocument();
          } else {
            this.toastrService.error(this.DBResponce.message);
          }  
        });
}


}

