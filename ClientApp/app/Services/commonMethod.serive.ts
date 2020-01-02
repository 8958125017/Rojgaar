import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Subject } from 'rxjs/Subject';
import { ToastrService } from 'ngx-toastr';
import { JobpostService } from './jobpost.service';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
import { BsModalRef } from 'ngx-bootstrap';
@Injectable()

export class CommonMethodService {
    modalRef            : BsModalRef;
    postJob             : any
    id                  : any;    
    DbResponce          : any = {};
    openingResponse     : any;
    constructor(               
                  private toastrService: ToastrService           
                , private jobpostService:JobpostService
                , private spinnerService:Ng4LoadingSpinnerService     
               ){  }

        private subject = new Subject<any>(); 

        // post job/walkin

        post(id:any,item:any){  
            this.id=id  
            this.spinnerService.show();
            this.jobpostService.PublishJob(this.id).subscribe(res => {
            this.DbResponce = res;
            this.spinnerService.hide();
            if(this.DbResponce.responseResult)     {  
                    if(item=='job'){
                        this.toastrService.success(this.DbResponce.message);
                    }else{
                        this.toastrService.success('Walkin Posted Successfully'); 
                    }    
                    this.postToYs(this.id);
                    this.subject.next({ status: 'true' });  
            }else{
                    this.toastrService.success(this.DbResponce.message);
            }     
            })    
        }

        // scrap job/walkin

        scrap(id:any,item:any){              
            this.id=id  
            this.spinnerService.show();         
            this.jobpostService.scrapJob(this.id).subscribe(res => {
            this.DbResponce = res;      
            this.spinnerService.hide();  
            if (this.DbResponce.responseResult) {         
                    this.postToYs(this.id);
                    if(item=='job'){
                        this.toastrService.success("Job scraped successfully");
                    }else{
                        this.toastrService.success('Walkin scraped successfully'); 
                    }                     
                    this.subject.next({ status: 'true' });            
                } else {
                this.toastrService.error(this.DbResponce.message);
                }
            });
        }
        
        // close job/walkin
        
        close(id:any,item:any) {            
            this.id=id  
            this.spinnerService.show();
            
            this.jobpostService.CloseJob(this.id).subscribe(res => {
                
            this.DbResponce = res 
            this.spinnerService.hide();
            if (this.DbResponce.responseResult) {
                
            this.postToYs(this.id);
                if(item=='job'){
                    this.toastrService.success("Job closed successfully");
                }else{
                    this.toastrService.success('Walkin closed successfully'); 
                }             
                this.subject.next({ status: 'true' }); 
            } else {
            this.toastrService.error(this.DbResponce.message);
            }
            });
        }

        postToYs(jobId:any){   
            this.jobpostService.postToYs(jobId).subscribe(res=>{
              
                this.openingResponse=res;
            })            
        }
       
        getMessage(): Observable<any> {
            return this.subject.asObservable();
        }
}
