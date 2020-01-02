//import { Component, OnInit, ViewChild } from '@angular/core';
import { Component, HostListener, OnInit, TemplateRef, ViewChild, VERSION } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { Location } from '@angular/common'
import { ToastContainerDirective, ToastrService } from 'ngx-toastr';
import { AppConfig } from '../../../Globals/app.config';
import { MasterService } from '../../../Services/master.service';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
import { AgencyjobpostService } from '../../../Services/agencyjobpost.service';
import { CandidateService } from '../../../Services/candidate.service';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { BsModalService } from 'ngx-bootstrap/modal';
import { JobcardComponent } from '../../jobcard/jobcard.component'
import { BoundTextAst } from '@angular/compiler';
import { CommonViewLayoutComponent } from '../../CommonModelView/CommonView-Layout.Component';
//import { CommonViewLayoutComponent } from '../../CommonModelView/CommonView-Layout.Component';
import { Subject } from 'rxjs';
@Component({
  selector: 'app-ApplyJobsComponent',
  templateUrl: './ApplyJobs.Component.html',
})

export class ApplyJobsComponent implements OnInit {
  @ViewChild(CommonViewLayoutComponent) commonView: CommonViewLayoutComponent;
  @ViewChild(ToastContainerDirective) toastContainer: ToastContainerDirective;
  @ViewChild(JobcardComponent) jobcardComponent: JobcardComponent;



  modalRef: BsModalRef;
  modalRefdesc: BsModalRef;
  modaldefualt: BsModalRef;
  screeningRef: BsModalRef;
  dtTrigger = null;// new Subject<any>();
  dtOptions: any = {};
  UserInfo: any;
  jobdetail: any = [];
  static ID: any = '';
  DbResponce: any = {};
  jobDescription: any = '';
  DBResponce: any;
  candidate: any;
  from: any;
  PageNumber: number = 0;
  candidatelistshow: any = '0';
  delay: boolean = false;
  jobId: any;
  chkboxsts: number = 0;
  item: any = '';
  jobOpeningId: any;

  CandidateName: any;
  Email: any;
  mobileNo: any;
  genderType: any;
  stateName: any;
  districtName: any;
  dob: any;
  age: any;
  image: any;
  aboutMe: any;
  religionName: any;
  countryName: any;
  ProfileResponce: any = [];
  candidatedetails: any = [];
  langinfodata: any = [];
  addressinfodatap: any = [];
  familyinfodata: any = [];
  areainfodata: any = [];
  workexpinfodata: any = [];
  empeduinfodata: any = [];
  empcertinfodata: any = [];
  addressinfodata: any = [];
  candid: any;
  PartnerInfo: any = [];
  constructor(private appConfig: AppConfig
    , private toastrService: ToastrService
    , private masterService: MasterService
    , private agencyjobpostService: AgencyjobpostService
    , private CandidateService: CandidateService
    , private router: Router
    , private spinnerService: Ng4LoadingSpinnerService
    , private modalService: BsModalService
    , private route: ActivatedRoute
    , private location: Location
  ) {
    this.UserInfo = appConfig.UserInfo
    this.appConfig.isverified();
  }

  viewProfile: boolean = false;

  ngOnInit() {
    this.jobId = atob(this.route.snapshot.params.jobId);
    this.jobOpeningId = atob(this.route.snapshot.params.jobOpeningId);
    this.PageNumber = 0;
    this.from = ''
    localStorage.setItem('changeUrl', this.jobId);
    this.GetAllJobs();
    this.getCard();
    this.GetAllCandidateDetailsByjobId(this.jobId, this.jobOpeningId, this.PageNumber);
    this.ViewQuestionToHideViewIcon();
  }

  ViewDetails(candiID: any) {
    this.commonView.callMethod(candiID, 'MYDB');
  }
  isScreening: any;
  getCard() {
    this.item = localStorage.getItem('item'); // it set in AgencyjobList  
    this.item = JSON.parse(this.item);
    this.isScreening = this.item.isScreening;

    let jobData = {
      'jobDescription': this.item['jobDescription'],
      'mobile': this.item['mobile'],
      'jobcode': this.item['jobcode'],
      'companyName': this.item['companyName'],
      'designation': this.item['designation'],
      'email': this.item['email'],
      'name': this.item['name'],
      'landlineNumber': this.item['landlineNumber'],
      'rolesresPonsiblty': this.item['rolesresPonsiblty'],
      'probationDuration': this.item['probationDuration'],
      'posteDby': this.item['posteDby'],
      'otherDetail': this.item['otherDetail'],
      'maxExp': this.item['maxExp'],
      'minExp': this.item['minExp'],
      'keyword': this.item['keyword'],
      'gender': this.item['gender'],
      'ageMax': this.item['ageMax'],
      'ageMin': this.item['ageMin'],
      'minEducation': this.item['minEducation'],
      'jobId': this.item['jobId'],
      'jobTitle': this.item['jobTitle'],
      'functionalArea': this.item['functionalAreaName'],
      'industryArea': this.item['industryName'],
      'ojtDuration': this.item['ojtDuration'],
      'jobType': this.item['jobType'],
      'male': this.item['male'],
      'female': this.item['female'],
      'transgender': this.item['transgender'],
    }
    this.jobcardComponent.setJobcardValue(jobData);
  }

  public GetAllJobs() {
    this.agencyjobpostService.GetAllJobs(this.PageNumber).subscribe(res => {
      this.DbResponce = res
      if (this.DbResponce != null) {
        this.jobdetail = this.DbResponce;
      }
    });
  }

  SerialNumber: number = 1;
  pagination(paginationNumber: number, pageno: any) {
    this.PageNumber = paginationNumber;
    if (this.PageNumber == 0) {
      this.SerialNumber = 1;
    }
    else {
      this.SerialNumber = ((this.PageNumber) * pageno) + 1;
    }
    this.agencyjobpostService.GetAllCandidateDetailsByJobOpeningId(this.jobId, this.jobOpeningId, this.PageNumber).subscribe(
      res => {
        this.spinnerService.hide();
        this.DBResponce = res;
        this.count = [];
        if (this.DBResponce.lstAgencyCandidateinfo != null) {
          this.candidate = this.DBResponce.lstAgencyCandidateinfo;
          var totalLength = this.candidate[0].totrecd;
          for (var i = 0; i < (Math.ceil(totalLength / 10)); i++) {
            this.count.push(i + 1);
            this.last = i + 1;
          }
          var sts = this.candidate.find(e => e.status === '0');
          if (sts == undefined) {
            this.chkboxsts = 1;
          } else {
            this.chkboxsts = 0;
          }
        }
        else {
          this.candidate = [];
        }
      });
  }


  count: any = [];
  last: any;


  GetAllCandidateDetailsByjobId(jobId, jobopeningId, PageNumber) {

    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 10,
      responsive: true,
      jQueryUI: true,
      destroy: true,
      retrieve: false,
      processing: true,
      deferRender: true,
      stateSave: false,
      dom: '"<"H"lfr>t<"F"ip>',
      autoWidth: true,
      displayStart: 0,
      language: {
        emptyTable: "No data available",
        infoEmpty: "Total Record Found: 0",
        infoFiltered: "(searched in _MAX_ records)",
        loadingRecords: "Loading...",
        processing: "Processing...",
        search: "Search all columns:",
        zeroRecords: "No matching records found"
      },
    };
    this.candidate = [];
    this.dtTrigger = new Subject<any>();

    this.agencyjobpostService.GetAllCandidateDetailsByJobOpeningId(jobId, jobopeningId, PageNumber).subscribe(
      res => {
        this.DBResponce = res;
        this.dtTrigger.next();
        this.count = [];
        if (this.DBResponce.lstAgencyCandidateinfo != null) {

          this.candidate = this.DBResponce.lstAgencyCandidateinfo;
          var totalLength = this.candidate[0].totrecd;
          for (var i = 0; i < (Math.ceil(totalLength / 10)); i++) {
            this.count.push(i + 1);
            this.last = i + 1;
          }
          var sts = this.candidate.find(e => e.status === '0');
          if (sts == undefined) {
            this.chkboxsts = 1;
          } else {
            this.chkboxsts = 0;
          }
          this.spinnerService.hide();
          this.from = '';
        }
        else {
          this.candidate = [];
          this.from = '';
        }
      });
  }



  selectedAll: any;;
  candId_array: any = [];

  selectAll(e) {
    if (e.target.checked) {
      // if(this.setForCandidate.length>0){
      //     this.setForCandidate=[] ; 
      // }
      for (var i = 0; i < this.candidate.length; i++) {
        this.candidate[i].selected = this.selectedAll;
        let index = this.setForCandidate.indexOf(this.candidate[i]);
        if (index < 0) {
          if (this.candidate[i].status == 0) {
            //  this.candId_array.push({'CandId':this.candidate[i].candId});
            this.setForCandidate.push({
              candidateId: this.candidate[i].candId,
              // 'jobOpeningId':this.jobOpeningId,
              // 'JobId':this.item['jobId'],
              'screeningAnswer': ''
            })
            //     alert("this.setForCandidate "+JSON.stringify(this.setForCandidate));
          }
        }
      }
    } else {
      for (var i = 0; i < this.candidate.length; i++) {
        this.candidate[i].selected = false;
        $("#" + "isAnswer" + i).html("View");


      }
      this.setForCandidate = [];
      //  alert("this.setForCandidate "+JSON.stringify(this.setForCandidate));
    }
  }

  // setId1(e,candId){
  //     if(e.target.checked){       
  //        this.candId_array.push({'CandId':candId});      
  //     }else{
  //         this.selectedAll=false;
  //         let index = this.candId_array.indexOf(candId);  
  //         this.candId_array.splice(index,1); 
  //          if(this.candId_array.length==0){
  //              this.candId_array=[] ;  
  //          }
  //     }

  // }



  // Screening Question section 


  lstGetYuvaSamparkQuestion: any = [];
  lstGetYuvaSamparkQuestionDis: any = [];
  options: any = [];


  //   open pop up for  get Screening Question list after click in check box

  candId: any;
  setId(e, tempdelsector: TemplateRef<any>, candId: any, i) {
    this.counts = 0;
    this.candId = candId;
    this.indexValue = i
    if (e.target.checked) {
      if (this.isScreening) {
        this.spinnerService.show();
        this.agencyjobpostService.getScreeningQuestionList(this.jobId).subscribe(res => {
          this.spinnerService.hide()
          this.DBResponce = res;
          if (this.DBResponce != null) {
            if (this.DBResponce.yuvaJobSearch[0].lstGroup != '') {
              this.screeningRef = this.modalService.show(tempdelsector, { backdrop: 'static', keyboard: false, class: 'modal-md' });
              this.lstGetYuvaSamparkQuestion = this.DBResponce.yuvaJobSearch[0].lstGroup;
            }
          } else {
            this.lstGetYuvaSamparkQuestion = [];
            //  console.log(this.DBResponce)
          }
        })
      } else {
        this.setForCandidate.push({
          candidateId: this.candId,
          'screeningAnswer': this.options
        })
        // alert("this.options  = = ="+JSON.stringify(this.setForCandidate));
      }
    } else {

      $("#" + "isAnswer" + this.indexValue).html("View").css(
        {
          'color': 'blue',
          'cursor': 'pointer',
          'pointer-events': 'auto'
        }
      );
      this.selectedAll = false;

      let index = this.setForCandidate.findIndex(item => item.candidateId == candId);
      //let index = this.setForCandidate.indexOf(candId);  
      this.setForCandidate.splice(index, 1);
      if (this.setForCandidate.length == 0) {
        this.setForCandidate = [];
      }
      //  alert("this.options  = = ="+JSON.stringify(this.setForCandidate));
    }
  }

  // open pop up for  get screening Question after click in view buton
  indexValue: any;
  ViewQuestion(tempdelsector: TemplateRef<any>, candId: any, i) {
    this.counts = 0;
    this.candId = candId;
    this.indexValue = i;
    this.spinnerService.show();
    this.agencyjobpostService.getScreeningQuestionList(this.jobId).subscribe(res => {
      this.spinnerService.hide()
      this.DBResponce = res;
      if (this.DBResponce != null) {
        this.screeningRef = this.modalService.show(tempdelsector, { backdrop: 'static', keyboard: false, class: 'modal-md' });
        this.lstGetYuvaSamparkQuestion = this.DBResponce.yuvaJobSearch[0].lstGroup;
      } else {
        this.lstGetYuvaSamparkQuestion = [];
      }
    })
  }
  hideViewScreening: boolean = true;
  ViewQuestionToHideViewIcon() {
    this.agencyjobpostService.getScreeningQuestionList(this.jobId).subscribe(res => {
      this.DBResponce = res;
      if (this.DBResponce != null) {
        if (this.DBResponce.yuvaJobSearch[0].lstGroup == '') {
          this.hideViewScreening = false;
        }
      } else {
        this.lstGetYuvaSamparkQuestionDis = [];
      }
    })
  }

  // confifirm submit question or not

  confirmModalRef: BsModalRef;
  confirmSubmit(template: TemplateRef<any>) {
    this.confirmModalRef = this.modalService.show(template, { class: 'modal-sm' });
  }

  declineConfirm() {
    this.confirmModalRef.hide();
  }

  // submit Screening Question Scetion
  counts: any = 0;
  setForCandidate: any = [];
  submitQuestion() {
    //alert(this.indexValue) 
    this.options = [];

    for (var i = 0; i < this.lstGetYuvaSamparkQuestion.length; i++) {
      for (var j = 0; j < this.lstGetYuvaSamparkQuestion[i].questions.length; j++) {
        if (this.lstGetYuvaSamparkQuestion[i].questions[j].isAnswer == null) {
          this.toastrService.error("All questions are mandatory");
          return false;
        }
        else {
          this.options.push({ groupid: this.lstGetYuvaSamparkQuestion[i].groupid, isAnswer: this.lstGetYuvaSamparkQuestion[i].questions[j].isAnswer, questionid: this.lstGetYuvaSamparkQuestion[i].questions[j].questionid });
          // $("#" +"isAnswer"+ this.indexValue ).attr('disabled','true');
          //$("#" +"isAnswer"+ this.indexValue).removeAttr("href");           
          $("#" + "isChecked" + this.indexValue).prop('checked', true);
          $("#" + "isAnswer" + this.indexValue).html("Answered").css(
            {
              'color': 'red',
              'pointer-events': 'none'
            }
          );

        }
      }
      this.setForCandidate.push({
        candidateId: this.candId,
        'screeningAnswer': this.options
      })
      this.confirmModalRef.hide();
      this.screeningRef.hide();
      if (this.counts == 0) {
        this.toastrService.success("Answers has been submitted successfully");
        this.counts++
      }

      // alert("this.options  = = ="+JSON.stringify(this.setForCandidate));
    }

  }


  // Apply candidate by agency

  item_info: any = {};
  postdata: any = {};
  response: any = {};
  submitsts: boolean = true;
  countSub: number = 0;
  submit() {

    if (this.setForCandidate.length == 0) {
      this.toastrService.error('Please select at least one candidate');
      return false;
    } else {
      
        this.submitsts = false;
        this.item_info = localStorage.getItem('item');
        if (this.isScreening) {
          for (var i = 0; i < this.setForCandidate.length; i++) {
            if (this.setForCandidate[i].screeningAnswer.length == 0) {
              this.toastrService.error('please submit screening question answer for all candidates');
              this.setForCandidate = [];
              this.submitsts = true;
              return false
            }
          }
        }
        this.postdata = {
          'jobOpeningId': this.jobOpeningId,
          'JobId': this.item['jobId'],
          'data': this.setForCandidate
        }
        this.spinnerService.show();
        this.submitsts = true;

        if (this.countSub == 0) {
        this.agencyjobpostService.ApplyJob(this.postdata).subscribe(
          data => {
            this.spinnerService.hide();
            this.submitsts = true;
            let response = data;

            if (response['responseResult']) {
              this.toastrService.success(response['message']);
              this.PageNumber = 0
              this.from = '';
             
              this.router.navigate(['/AgencyJobList', { "Redirection": btoa('1') }]);
              this.GetAllCandidateDetailsByjobId(this.jobId, this.jobOpeningId, this.PageNumber);
              this.spinnerService.hide();
            } else {
              this.toastrService.error(response['message']);
              this.spinnerService.hide();
            }
          },
          err => {
            console.log('404 error');
            this.spinnerService.hide();
          },
        );
      }
      this.countSub++;
    }
  }

  BackToAgencyJob() {
    this.router.navigate(['/AgencyJobList', { "Redirection": btoa('1') }]);
  }



  backbutton() {
    this.router.navigate(['/AgencyJobList', { Redirect: btoa('1') }]);
  }

  closeSceeningModal() {
    $("#" + "isChecked" + this.indexValue).prop('checked', false);
    this.screeningRef.hide();
  }

}

