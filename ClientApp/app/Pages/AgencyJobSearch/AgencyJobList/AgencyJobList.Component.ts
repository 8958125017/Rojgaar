// import { Component, OnInit, ViewChild, HostListener} from '@angular/core';
import { Component, HostListener, OnInit, TemplateRef, ViewChild, VERSION } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { RouterModule } from '@angular/router';
import { ToastContainerDirective, ToastrService } from 'ngx-toastr';
import { AppConfig } from '../../../Globals/app.config';
import { UserInfoService } from '../../../Services/userInfo.service.';
import { CustomValidators } from '../../../Validators/custom-validator.directive';
import { MasterService } from '../../../Services/master.service';
import { identifierModuleUrl } from '@angular/compiler';
import { debug } from 'util';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
import { AgencyjobpostService } from '../../../Services/agencyjobpost.service';
import * as $ from 'jquery';
import { FormGroup , FormBuilder, Validators } from '@angular/forms';
import { Options } from 'ng5-slider';


@Component({
  selector: 'app-AgencyJobListComponent',
  templateUrl: './AgencyJobList.Component.html',
})

export class AgencyJobListComponent implements OnInit {
  @ViewChild(ToastContainerDirective) toastContainer: ToastContainerDirective;
      UserInfo: any;
      jobdetail: any = [];
      static ID:any='';
      DbResponce :any= {};
      PageNumber: number = 0;
      from:any;
      candidatelistshow:any='0';
      delay: boolean = false;
      Responce: any = {};
      FilterForm  : FormGroup;
      minCtc: number = 0;
      maxCtc: number = 0;
      minExp: number = 0;
      maxExp: number = 0;
      Redirection:any='';
      localdata:any={};
      // searchsts:number=0;
      searchsts:boolean=false;
      redirection:any;
      loginType:any;

      CtcOptions: Options = {
        floor: 0,
        ceil: 250000,
        step: 100
      };

      ExpOptions: Options = {
        floor: 0,
        ceil: 20,
        step: 1
      };

      table_data:any={};
      fromApplyJob:Boolean=false;
      backJobSearch:Boolean=false;
      jobStatus:boolean=false;
      local_jsondata:any={};
      pageno:any='';
      from1:any='';
      postdata:any={};
      filterResult:number=1;
      industryname:any='';
      functionalareaname;
      searchdata:any={};
      localpostdata:any={};
      jobsearchStatus:boolean=false;
      ViewJob : boolean
      ViewState : boolean=false;
      jobroll   : boolean=false;
      previous : boolean=false;
      dbRes      : any = {};
      id        : any;
      jobId                  : any;
      paginationjobid        : number;
      stateJobscrol:boolean=false;
      getstateJobDetails    : any = [];
      resultstatus:boolean=false
      showErrorMessage:boolean=false;
      constructor(private appConfig: AppConfig
             ,private toastrService: ToastrService
             ,private masterService: MasterService
             ,private agencyjobpostService:AgencyjobpostService
             ,private router: Router
             ,private spinnerService:Ng4LoadingSpinnerService
             ,private formBuilder: FormBuilder
             ,private route: ActivatedRoute
            )
      {
        this.UserInfo = appConfig.UserInfo;
        this.appConfig.isverified();
      }

      @HostListener('window:scroll', ['$event'])
      scrollHandler(event) {

        if(this.redirection==null)
        {
          let pos = (document.documentElement.scrollTop || document.body.scrollTop) + document.documentElement.offsetHeight;
          let max = document.documentElement.scrollHeight;
          if (pos >=(0.8 * max)) {
            if (this.delay) {
              return
            }
            this.delay = true;
            if(this.stateJobscrol){
              if(this.getstateJobDetails.length >= 10){
                this.PageNumber = this.PageNumber + 1;
                this.getJobByOpenings(this.jobId,this.PageNumber,'scroll');
              }
             }
             else if(this.jobroll) {
              if(this.jobdetail.length >=10){
                this.PageNumber = this.PageNumber + 1;
                
                this.GetFilterJobs(this.PageNumber,'scroll');
              }
            }
          }
        }

      }



getValues:any
redirect:any;
reloadJob:boolean=true;

  ngOnInit() {
    
    this.redirect = atob(this.route.snapshot.paramMap.get('Redirect'));
    this.redirection = atob(this.route.snapshot.paramMap.get('Redirection'));
    this.loginType=sessionStorage.getItem('loginType');
    if(this.redirect=='1'){
      
      this.redirection=null
      this.jobId=localStorage.getItem('changeUrl');
      if(this.jobId){
        this.ViewState=true;
        this.jobsearchStatus=false;
        this.jobStatus=false;
        this.filterResult=0
        this.searchsts=false;
        
        // $('.filter-wrapper').slideToggle().hide();
        this.localdata = JSON.parse(localStorage.getItem('filter_job_data'));
        this.table_data = JSON.parse(localStorage.getItem('search_job_data'));
        this.industryname=this.table_data.industryid;
        this.functionalareaname=this.table_data.functionalareaid;
        this.minexp=this.table_data.MinExp;
        this.minexp=this.table_data.MinExp;
        this.maxexp=this.table_data.MaxExp;
        this.minctc=this.table_data.Minctc;
        this.maxctc=this.table_data.Maxctc;
        this.walkinfromdate=this.table_data.Walkinfromdate;
        this.walkintodate=this.table_data.Walkintodate;
        this.PageNumber=0;
        var jobId=this.jobId;
        this.from=''        
        this.getJobByOpenings(jobId,this.PageNumber,this.from)
        this.fromApplyJob=true;
        localStorage.removeItem('changeUrl');
     }
    }

    if(this.loginType=='Agency')
    {

      $('.page-filters h2 a').click(function () {
        $(this).find('i').toggleClass('fa-chevron-down fa-chevron-right');
        $(this).parent().parent().find('.filter-wrapper').slideToggle();
      });
         $('.filter-toggle').click(function () {
          $('.filter-wrapper').slideToggle();

      });

      this.FilterForm = this.formBuilder.group({
           industry : ['', Validators.nullValidator],
           functionalarea : ['', Validators.nullValidator],
           MinCtc : ['',Validators.nullValidator],
           MaxCtc : ['',Validators.nullValidator],
           MinExp : ['',Validators.nullValidator],
           MaxExp : ['',Validators.nullValidator],
           JobKeyword: ['', Validators.nullValidator],
           employer  :  ['', Validators.nullValidator],
           walkInFromDate : ['',Validators.nullValidator],
           walkInToDate : ['',Validators.nullValidator]
      })


      this.GetAllIndustryArea();
      this.GetAllFunctionArea();


    if(this.redirection=='1'){
          this.redirect='' ;     
          this.localdata = JSON.parse(localStorage.getItem('filter_job_data'));
          this.table_data = JSON.parse(localStorage.getItem('search_job_data'));
          this.industryname=this.table_data.industryid;
          this.functionalareaname=this.table_data.functionalareaid;
          this.minexp=this.table_data.MinExp;
          this.minexp=this.table_data.MinExp;
          this.maxexp=this.table_data.MaxExp;
          this.minctc=this.table_data.Minctc;
          this.maxctc=this.table_data.Maxctc;
          this.searchKeyWord=this.table_data.searchKeyWord;
          this.walkinfromdate=this.table_data.Walkinfromdate;
          this.walkintodate=this.table_data.Walkintodate;
          this.redirection =null;
          this.backbutton();
    }
       if(localStorage.getItem('filterid')!=null){         
           this.GetFilterJobs(0,'');
       }
  }
  else{
    this.router.navigate(['/']);
  }
  
  if(this.reloadJob){
    this.showSearchResult=true;
    this.GetFilterJobs(0,'');
  }  
  this.getEmployerList();
}


// get employer list code by Pankaj Joshi
employerList:any=[];
getEmployerList(){
  var pageNumber=0;  
   this.agencyjobpostService.getEmployerList(pageNumber).subscribe(res=>{     
     if(res){
       this.employerList=res;
     }
   });
}

showSearchResult:boolean=false;
IndustryArea: any = [];
IndustryAreaSelecteds: any = null;
IndustryAreaSelected: string;
FunctionArea : any =[];
industry:number=0;
functionalarea:number=0;
minctc:number=0;
maxctc:number=0;
walkinfromdate:any='';
walkintodate:any='';
minexp:number=0;
maxexp:number=0;

GetAllIndustryArea() {
  this.masterService.GetAllIndustryArea().subscribe(res => {
    this.Responce = res;
    this.IndustryArea = this.Responce;

  });
}



GetAllFunctionArea() {
  this.masterService.GetAllFunctionArea().subscribe(res => {
    this.Responce = res;
    this.FunctionArea = this.Responce;

  });
}





public GetAllJobs(PageNumber:any,from:any){
          this.spinnerService.show();
          if (from == 'scroll') {
              this.agencyjobpostService.GetAllJobs(PageNumber).subscribe(res => {
              this.DbResponce = res
                  if (this.DbResponce!= null) {
                    this.jobdetail = this.jobdetail.concat(this.DbResponce);
                    this.spinnerService.hide();
                    this.from='scroll';
                  }else{
                    this.jobdetail = [];
                    this.from='';
                  }
                  this.delay = false;
          });
        }else{

            this.agencyjobpostService.GetAllJobs(PageNumber).subscribe(res=>{
            this.DbResponce=res;
            if(this.DbResponce!=null)
            {
              this.jobdetail =this.DbResponce;
              this.spinnerService.hide();
              this.from='';
            }
            else
            {
              this.jobdetail=[];
              this.from='';
            }

          });
        }
}



ListRedirection(jobid:any){
  localStorage.setItem('viewid', jobid);
  this.router.navigate(['/ViewJob', {Redirection:'1'}]);
}



  setItem(item:any){
    localStorage.setItem('item',JSON.stringify(item));
    this.router.navigate(['/ApplyJob', {Redirection:'1'}]);
}

industry_filter:any='';
functionalareaid_filter:any='';
minexp_filter:any='';
maxexp_filter:any='';
minctc_filter:any='';
maxctc_filter:any='';
walkintodate_filter:any='';
walkinfromdate_filter:any='';
searchKeyWord:any='';
employer:any='';
GetFilterJobsSearch(){
  
  localStorage.removeItem('filter_job_data');
  this.industry_filter= 0;
  this.functionalareaid_filter=0;
  this.minexp_filter=0;
  this.maxexp_filter=0;
  this.minctc_filter=0;
  this.maxctc_filter=0;
  this.walkintodate_filter='';
  this.walkinfromdate_filter='';
  this.searchsts=true;
  this.employer='';
  this.searchKeyWord='';
  this.showSearchResult=true;
  this.GetFilterJobs(0,'');  
}
empName:any
selectchange(event){
  //  this.employer=event.target.value;
  //  alert(" this.employer 1= = "+ this.employer)
   this.empName = event.target.options[event.target.selectedIndex].text; 
 //  alert(" this.employer 2= = "+ this.employer)
}
public GetFilterJobs(pageno1,from){
  this.pageno = pageno1;
  if(this.pageno=='0'){
    this.PageNumber=0;
  }
  this.from1  = from;
  // this.searchsts=false;
  
  if(localStorage.getItem('filter_job_data')!=null){
  let filter_job_data = JSON.parse(localStorage.getItem('filter_job_data'));
      this.industry_filter= filter_job_data.industryid;
      this.functionalareaid_filter=filter_job_data.functionalareaid;
      this.minexp_filter=filter_job_data.MinExp;
      this.maxexp_filter=filter_job_data.MaxExp;
      this.minctc_filter=filter_job_data.Minctc;
      this.maxctc_filter=filter_job_data.Maxctc;
      this.employer=filter_job_data.employer;
      this.searchKeyWord=filter_job_data.searchKeyWord;
      this.walkintodate_filter=filter_job_data.Walkintodate;
      this.walkinfromdate_filter=filter_job_data.Walkinfromdate;
  }

   if(this.FilterForm.value.industry!=''){

      this.industry=this.FilterForm.value.industry;
      this.industryname=this.IndustryArea.find(o => o.id === this.industry);
      this.industryname = this.industryname.industryName;

   }else if(this.industry_filter!=''){
    this.industry=this.industry_filter;

   }else{
    this.industry=0;
    this.industryname='';
   }

   if(this.FilterForm.value.functionalarea!=''){

    this.functionalarea=this.FilterForm.value.functionalarea;
    this.functionalareaname=this.FunctionArea.find(o=>o.id===this.functionalarea)
    this.functionalareaname=this.functionalareaname.functionalAreaName;
  }else if(this.functionalareaid_filter!=''){
    this.functionalarea=this.functionalareaid_filter;

  }else{
   this.functionalarea=0;
   this.functionalareaname='';
  }


  if(this.minCtc>0){

    this.minctc=this.minCtc
  }else if(this.minctc_filter!=''){
    this.minctc=this.minctc_filter;

  }else{
   this.minctc=0;
  }

  if(this.maxCtc>0){

    this.maxctc=this.maxCtc;
  }else if(this.maxctc_filter!=''){
    this.maxctc=this.maxctc_filter;

  }else{
   this.maxctc=0;
  // this.newMethod();
  }

  if(this.minExp>0){

    this.minexp=this.minExp;
  }else if(this.minexp_filter!=''){
    this.minexp=this.minexp_filter;

  }else{
   this.minexp=0;
  }

  if(this.maxExp){

    this.maxexp=this.maxExp;
  }else if(this.maxexp_filter!=''){
    this.maxexp=this.maxexp_filter;

  }else{
   this.maxexp=0;
  }

  if(this.FilterForm.value.walkInFromDate!=''){

    this.walkinfromdate=this.FilterForm.value.walkInFromDate;
    this.walkinfromdate = new Date(this.walkinfromdate);
  }else if(this.walkinfromdate_filter!=''){
    this.walkinfromdate=this.walkinfromdate_filter;

  }else{
   this.walkinfromdate='';
  }

  if(this.FilterForm.value.walkInToDate!=''){

    this.walkintodate=this.FilterForm.value.walkInToDate;
  }else if(this.walkintodate_filter!=''){
    this.walkinfromdate=this.walkintodate_filter;

  }else{
   this.walkintodate='';
  }

  if(this.walkinfromdate!=''&& this.walkintodate!=''){

        if(this.walkinfromdate>this.walkintodate){

            this.toastrService.error('Please Select Valid Date');
            this.searchsts=false;
            $('.filter-wrapper').slideToggle();
            return false;
        }
        this.redirection=='';
  }

    if(this.FilterForm.value.JobKeyword){
        this.searchKeyWord=this.FilterForm.value.JobKeyword
    }
    if(this.FilterForm.value.employer){
        this.employer=this.empName
    }

     this.searchdata= {
                   'industryid':this.industryname,
                   'functionalareaid':this.functionalareaname,
                   'MinExp':this.minexp,'MaxExp':this.maxexp,
                   'Minctc':this.minctc,
                   'Maxctc':this.maxctc,
                   'Walkinfromdate':this.walkinfromdate,
                   'Walkintodate':this.walkintodate,
                   'Pagenumber':this.pageno,
                   'searchKeyWord':this.searchKeyWord,
                   'employer':this.employer
                  };
     this.localpostdata={
                  'industryid':this.industry,
                  'functionalareaid':this.functionalarea,
                  'MinExp':this.minexp,
                  'MaxExp':this.maxexp,
                  'Minctc':this.minctc,
                  'Maxctc':this.maxctc,
                  'Walkinfromdate':this.walkinfromdate,
                  'Walkintodate':this.walkintodate,
                  'Pagenumber':0,
                  'searchKeyWord':this.searchKeyWord,
                  'employer':this.employer
                };
      localStorage.setItem('filter_job_data',JSON.stringify(this.localpostdata));
      localStorage.setItem('search_job_data',JSON.stringify(this.searchdata));

      this.postdata={
          'industryid':this.industry,
          'functionalareaid':this.functionalarea,
          'MinExp':this.minexp,
          'MaxExp':this.maxexp,
          'Minctc':this.minctc,
          'Maxctc':this.maxctc,
          'JobKeyword':this.searchKeyWord,
          'employer':this.employer,
          'Walkinfromdate':this.walkinfromdate,
          'Walkintodate':this.walkintodate,
          'Pagenumber':this.pageno
        };
      this.spinnerService.show();

          if (this.from1 == 'scroll') {
            
              this.agencyjobpostService.GetAllJobs(this.postdata).subscribe(res => {
              this.DbResponce = res
                  if (this.DbResponce!= null) {
                    this.jobsearchStatus=true;
                    this.jobdetail = this.jobdetail.concat(this.DbResponce);
                    this.jobroll=true;
                    this.stateJobscrol=false;
                    this.ViewState=false;
                    this.filterResult=1;
                    this.spinnerService.hide();
                     if(localStorage.getItem('filterid')!=null){
                       localStorage.removeItem('filterid');
                     }
                    //this.from1='scroll';
                  }else{
                    this.jobdetail = [];
                    this.filterResult=0;
                   // this.from1='';

                  }
                  //this.resultstatus=true;
                  this.delay = false;

          });
        }else{
          
          this.masterService.saveUserLogs('Agency/GetEmployerJobList/','job search');
          
            this.agencyjobpostService.GetAllJobs(this.postdata).subscribe(res=>{
            this.DbResponce=res;
            
            this.redirection=null
            if(this.DbResponce!=null)
            {
              if(this.DbResponce.length){
                this.showErrorMessage=false;
                this.jobdetail =this.DbResponce;
                this.jobroll=true
                this.stateJobscrol=false;               
                this.jobsearchStatus=true;
                this.ViewState=false;
                this.filterResult=1;                
                this.spinnerService.hide();  
                 if(localStorage.getItem('filterid')!=null){
                   localStorage.removeItem('filterid');
                 }
                this.from1='';
              }else{
                this.showErrorMessage=true;
              }
       
            }
            else
            {

              this.jobdetail=[];
              this.filterResult=0;
              this.from1='';
            }
           // this.resultstatus=false;

           this.delay = false;
          });
        }
}


openingWise(item:any){
  this.PageNumber=0;
  this.searchsts=false;
  localStorage.setItem('item',JSON.stringify(item)); // set jobdetail openingwise and get it from apply job to display in job card
  this.getJobByOpenings(item.jobId,0,'');
}

getJobByOpenings(jobid,pageNumber,from:any){

  this.ViewJob       = false;
  this.ViewState     = true;
  this.jobroll       =  false;
  this.backJobSearch=true;
  this.jobsearchStatus=false;
  this.fromApplyJob=true;
  this.filterResult=0;
  this.jobId=jobid
  if (from == 'scroll') {
    this.spinnerService.show();
   this.agencyjobpostService.getJobByOpening(this.jobId,pageNumber).subscribe(res=>{
       this.spinnerService.hide();
       this.dbRes = res;

       if(this.dbRes.lstJobwiseOpeningList != null){
         this.jobId=this.dbRes.lstJobwiseOpeningList[0].jobId;
         var stateJobResult  = this.dbRes.lstJobwiseOpeningList[0].jobOpeningList;
         if (stateJobResult!= null) {
           this.getstateJobDetails  = this.getstateJobDetails.concat(stateJobResult);
           this.from='scroll';
         }else{
         
           this.getstateJobDetails = [];
           this.from='';
         }
         this.delay = false;
       }else{
         this.jobId=this.jobId;
       }
       this.delay = false;

   })
  }else{
    
    this.spinnerService.show();
    
    if(this.redirect=='1'){
      this.reloadJob=false;
    }
    $('.filter-wrapper').slideToggle().hide();
    this.getstateJobDetails = [];
   this.agencyjobpostService.getJobByOpening(jobid,pageNumber).subscribe(res=>{
    this.spinnerService.hide();
   
    this.dbRes = res
    
    this.jobId=this.dbRes.lstJobwiseOpeningList[0].jobId;
      var stateJobResult    = this.dbRes.lstJobwiseOpeningList[0].jobOpeningList;
      this.id=this.paginationjobid;
      //alert("sdfsd"+stateJobResult.length)
      if(stateJobResult != null){
        if(stateJobResult.length){
          this.stateJobscrol=false;
          this.showErrorMessage=false
          this.getstateJobDetails = stateJobResult;
        }else{
          this.showErrorMessage=true
        }       
      }else{     
          this.getstateJobDetails = [];
       }
       this.delay = false;
   })
  }
}

getCandidateListingByOpening(jobDetail){
  this.backJobSearch=false;
  this.router.navigate(['/ApplyJob', { Redirection:btoa('1'),jobId : btoa(jobDetail.jobId),jobOpeningId:btoa(jobDetail.jobOpeningID)}]);
}

backbutton(){
  this.fromApplyJob=false;
  this.jobStatus=false;
  this.ViewState=false;
  this.showErrorMessage=false;
  if(this.showSearchResult){
    this.searchsts=true;
  }else{
    this.searchsts=true;
  }
 
  this.filterResult=1;
  this.stateJobscrol=false;  
  this.getJobSearch();
  this.table_data = JSON.parse(localStorage.getItem('search_job_data'));
}



getJobSearch(){
  // $('.filter-wrapper').slideToggle();
  this.postdata = JSON.parse(localStorage.getItem('filter_job_data'));
  this.spinnerService.show();
  this.agencyjobpostService.GetAllJobs(this.postdata).subscribe(res=>{
    this.spinnerService.hide();
    this.DbResponce=res;
    this.showErrorMessage=false;
    if(this.DbResponce!=null)
    {
      
      this.jobdetail =this.DbResponce;
      if(this.jobdetail.length == 10 && this.postdata.industryid =='0' && this.postdata.functionalareaid == '0'&& this.postdata.Minctc == '0' && this.postdata.Maxctc=='0' && this.postdata.MinExp=='0' && this.postdata.MaxExp=='0'){
        this.jobroll=true
      } else if( (this.jobdetail.length == 10) && (this.postdata.industryid !='0' || this.postdata.functionalareaid != '0' || this.postdata.Minctc != '0' && this.postdata.Maxctc !='0' && this.postdata.MinExp !='0' && this.postdata.MaxExp !='0')){
        this.jobroll=true;
      } else if(this.jobdetail.length < 10){
        this.jobroll=false;
      }else if(this.jobdetail.length==0){
         this.showErrorMessage=true;
      }

      this.jobsearchStatus=true;
      this.filterResult=1;
      this.spinnerService.hide();
       if(localStorage.getItem('filterid')!=null){
         localStorage.removeItem('filterid');
      }

      this.from1='';
    }
    else
    {
      this.jobdetail=[];
      this.filterResult=0;
      this.from1='';
    }
    this.delay = false;

  });
}
ResetFilterResult() {
    
  this.minCtc = 0;
  this.maxCtc = 0;
  this.minExp = 0;
  this.maxExp = 0;

  this.FilterForm.controls['industry'].setValue('');
  this.FilterForm.controls['functionalarea'].setValue('');
  this.FilterForm.controls['MinCtc'].setValue(this.minCtc);
  this.FilterForm.controls['MaxCtc'].setValue(this.maxCtc);
  this.FilterForm.controls['MinExp'].setValue(this.minExp);
  this.FilterForm.controls['MaxExp'].setValue(this.maxExp);
  this.FilterForm.controls['JobKeyword'].setValue('');
  this.FilterForm.controls['employer'].setValue('');
  this.filterResult = 0;
  this.searchsts = false;
  this.jobdetail = [];
  this.jobsearchStatus = false;
 // this.FilterForm.controls['JobKeyword'].setValue('');
  ///this.GetFilterJobsList(this.PageNumber, '');
  this.GetFilterJobs(this.PageNumber, '');

}


}
