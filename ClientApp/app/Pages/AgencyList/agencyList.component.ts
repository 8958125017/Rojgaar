import { Component,HostListener, OnInit, ViewChild} from '@angular/core';
import { ToastContainerDirective, ToastrService } from 'ngx-toastr';
import { AppConfig } from '../../Globals/app.config'; 
import { AgencyListService } from '../../Services/agencylist.service';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
import { Router, ActivatedRoute, Params } from '@angular/router';
@Component({
  selector: 'app-agencyListComponent',
  templateUrl: './agencyList.component.html',
})
export class AgencyListComponent implements OnInit {  
   @ViewChild(ToastContainerDirective) toastContainer: ToastContainerDirective;  
  UserInfo: any;
  pageNumber: number = 0;
  DbResponce :any= {};
  agencyDetail :any= [];
  agencyResfinal: any = [];
  from:any;
  delay:boolean=false;
  logintype:any;
  constructor(
             private appConfig: AppConfig
            ,private agencyListService : AgencyListService
            ,private spinnerService: Ng4LoadingSpinnerService
            ,private router: Router
    )
 {
  try {
    this.UserInfo = this.appConfig.UserInfo;
  } catch  { }
  this.appConfig.isverified();
 }


  @HostListener('window:scroll', ['$event'])
  scrollHandler(event) {
    let pos = (document.documentElement.scrollTop || document.body.scrollTop) + document.documentElement.offsetHeight;
    let max = document.documentElement.scrollHeight; 
    
    if (pos >=(0.8 * max)) {
      if (this.delay) {
        return
      }
      this.delay = true;
      if (this.agencyDetail.length >=10 ) {
        this.pageNumber= this.pageNumber + 1;
        this.GetAllAgency(this.pageNumber,'scroll')
      }
    }
  }

  ngOnInit() { 
    this.logintype= sessionStorage.getItem('loginType');
    if(this.logintype=='Agency')   
    {
      this.router.navigate(['/']);
    }
    else
    { 
      this.GetAllAgency(this.pageNumber,this.from); 
    }
  //  this.GetAllAgency(this.pageNumber,this.from); 
    
  }

  GetAllAgency(PageNumber,from){      
     if(from=='scroll')
       {
        this.spinnerService.show();
        this.agencyListService.GetAllAgency(PageNumber).subscribe(res => {
          this.spinnerService.hide();
          this.DbResponce = res;  
          this.agencyResfinal = this.DbResponce.lstAgencyCandidateinfo;
          if (this.agencyResfinal != null) {
            this.agencyDetail = this.agencyDetail.concat(this.agencyResfinal);          } 
          this.delay=false;
        });
       }
       else
       {
        this.spinnerService.show();
        this.agencyListService.GetAllAgency(PageNumber).subscribe(res => {
          this.spinnerService.hide();
          this.DbResponce = res;        
          this.agencyResfinal = this.DbResponce.lstAgencyCandidateinfo;
          if (this.agencyResfinal != null) {
            this.agencyDetail = this.agencyResfinal;
          }
          this.delay=false;
        });
       }   
     }
}
