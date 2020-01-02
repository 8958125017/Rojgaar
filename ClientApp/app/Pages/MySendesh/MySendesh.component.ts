  import { Component, TemplateRef,OnInit} from '@angular/core';
  import { Router} from '@angular/router';
  import { FormBuilder, Validators, FormGroup} from '@angular/forms';
  import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
  import { ToastrService,  } from 'ngx-toastr';
  import { CompanyProfileService } from '../../Services/companyprofile.service'; 
  import { MasterService } from '../../Services/master.service';
  import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
  import { BsModalService } from 'ngx-bootstrap/modal';


  @Component({
  selector: 'MySendeshComponent',
  templateUrl: './MySendesh.component.html',
  })

  export class MySendeshComponent implements OnInit {
    UserInfo       : any;
    logintype      : any;
     dbResponse    : any; 
     modalRef: BsModalRef;
    
  constructor(
        private toastrService: ToastrService 
      , private formBuilder: FormBuilder
      , private spinnerService: Ng4LoadingSpinnerService
      , public router: Router     
      , private masterService: MasterService   
      , private modalService: BsModalService
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
    this.GetNdscMessageByComapnyId();
 }

/*****************************************************
 * Get Ndsc Message by Neeraj Singh Date 20-May-2018 *
 ******************************************************/
 Messagelist:any=[];
 GetNdscMessageByComapnyId(){
   this.spinnerService.show();
   this.masterService.GetNdscMessageByComapnyId().subscribe(res => {
     this.dbResponse = res
     this.spinnerService.hide();
     if(this.dbResponse.lstMessageByComapnyId!=null){
      this.Messagelist = this.dbResponse.lstMessageByComapnyId;
     }
   })
 }

 /*************************************************************
    *   View Ndsc Message by Neeraj Singh Date 21-May-2018 *
 *************************************************************/
 message:any;
 
 messagemodal: BsModalRef;
 ViewMessage(template:TemplateRef<any>,message){
   this.messagemodal=message;
  
   this.modalRef =this.modalService.show(template,
    { backdrop: 'static', keyboard: false });
 }

  /*************************************************************
     * Delete Ndsc Message by Neeraj Singh Date 222-May-2018 *
 *************************************************************/
 sandeshId:any;
 DeleteNdscMessage(sandeshId){
   this.modalRef.hide();
  this.sandeshId = sandeshId;
  this.spinnerService.show()
  this.masterService.DeleteNdscMessage(this.sandeshId).subscribe(res => {
  this.dbResponse = res
  if(this.dbResponse){
    this.toastrService.success(this.dbResponse.message);
    this.GetNdscMessageByComapnyId()
    this.spinnerService.hide();
  }
})
 }

 PushedTemplate(template1: TemplateRef<any>,i) {
  
  this.modalRef = this.modalService.show(template1, { class: 'modal-sm' });
}

}
