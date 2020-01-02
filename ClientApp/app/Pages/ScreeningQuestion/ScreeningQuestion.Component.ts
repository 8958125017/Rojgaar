import {  Component,  OnInit,  TemplateRef } from '@angular/core';
import { Router} from '@angular/router';
import { ToastrService} from 'ngx-toastr';
import { CustomValidators } from '../../Validators/custom-validator.directive';
import { Ng4LoadingSpinnerService} from 'ng4-loading-spinner';
import { FormBuilder, FormGroup,Validators } from '@angular/forms';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { ScreeningQuestionService } from '../../Services/screeningQuestion.service';

@Component({
  selector    : 'app-screeningquestion',
  templateUrl : './ScreeningQuestion.Component.html',
})

export class  ScreeningQuestionComponent implements  OnInit {
  createGroupForm:FormGroup;
  questionForm: FormGroup; 
  groupList:any;
  groupListResponse:any;
  groupId:any
  groupName:any
  isActive:boolean=false;
  isMandatory:boolean=false;
  questionId:any;
  mode:any;
  questionGroupList:any=[];
  questionList:any=[];
  showCreateQuestion :boolean=false;
  response:any;
  showQuestionTable:boolean=false;
  modalRef: BsModalRef;
  EnablesGroupmodalRef: BsModalRef;
  ScreenDataRespose:any=[];


  constructor(  private screeningService:  ScreeningQuestionService           
            , private spinnerService: Ng4LoadingSpinnerService
            , private fb : FormBuilder
            , private toastrService: ToastrService
            , private modalService: BsModalService){
          
            }

  ngOnInit(){    
    this.questionGroupList=[]; 
    this.getGroupList();
      this.createGroupForm=this.fb.group({
        groupName:['', [Validators.required, , Validators.compose([CustomValidators.removeSpaces])]],       
      })
      this.questionForm = this.fb.group({
        question: ['', [Validators.required, , Validators.compose([CustomValidators.removeSpaces])]],
        isMandatory: ['', [Validators.nullValidator,]],   
        answer: ['', [Validators.required,]], 
        preference:['null',[Validators.required]],
        isActive:[],  
    });     



    
}


////////////////// get Group List ///////////////////

getGroupList(){
this.spinnerService.show();
 this.screeningService.getGroupList().subscribe(res=>{
  this.spinnerService.hide();  
  if(res){
    this.groupListResponse=res
    if(this.groupListResponse.length){    
       this.groupList=res;
     }
   }
 })
}

/////////////////// get question list based on group id gelect from group list /////////////////

getQuestionListByGroup(event:any){
  let groupId=event.target.value;   
  if(groupId){
    let groupName = this.groupList.filter(function (entry) {
      return entry.groupid == groupId;
    }); 
    this.groupId=groupId;
    this.groupName=groupName[0]['groupname'];     
    this.getscreeningQuestion()
  } 
}

/////////////////// get question list based on group id and display in data table /////////////////

getscreeningQuestion(){ 
   this.questionGroupList=[];
    this.spinnerService.show();
   this.screeningService.getscreeningQuestion(this.groupId).subscribe(res=>{
      this.spinnerService.hide();
     this.ScreenDataRespose=res; 
     this.questionGroupList=[];
     if(this.ScreenDataRespose!=null){
       this.showQuestionTable=true;              
       this.questionGroupList=this.ScreenDataRespose;      
     }
  }) 

}



// open Question create modal click in add button

openQuestionCreateMOdal(template: TemplateRef<any>,mode) {
  this.isActive=false;
  this.isMandatory=false;
  this.mode=mode
  this.showPrefrence=false;
  this.questionForm.reset();
  this.questionForm.controls['answer'].setValue('');
  this.questionForm.controls['preference'].setValue('');
  this.modalRef = this.modalService.show(template, { class: 'modal-md' });
}

// submit Question after create and update

isEnable:boolean=true;;
submitCreateUpdateQuestion(){  
    
  if(!this.questionForm.value.question){
    this.toastrService.error('please add question');
    return false
  }  
  // if(this.showPrefrence) {
    if(!this.questionForm.value.answer){
       this.toastrService.error('please add answer');
       return false
    // }
} 
  
 


  if(this.showPrefrence){
    if(!this.questionForm.value.preference){
      this.toastrService.error('please select preference');
      return false
    }else{
      var setpeferenceSelect= parseInt(this.questionForm.value.preference)
    }   
  }
  if(this.mode=='Add'){
    this.questionId=0;    
  }else{
    this.isEnable=this.questionForm.value.isActive ;
  }
  this.questionList=[];
  this.questionList.push({
                          "questionlist":this.questionForm.value.question,
                          "isActive":this.isEnable,
                          "Mandatory":this.questionForm.value.isMandatory ? this.questionForm.value.isMandatory:false,
                          "answer":this.questionForm.value.answer,
                          "preference":setpeferenceSelect?setpeferenceSelect:0,
                          "groupquestionid":this.questionId ? this.questionId:0
                        });
 this.questionForm.reset();
  let postData={
    "Groupname" : this.groupName,
    "Groupid": this.groupId,
    "questionlist":this.questionList  }    
   this.modalRef.hide(); 
   this.spinnerService.show();   
   this.screeningService.setScreeningQuestion(postData).subscribe(res=>{
   this.spinnerService.hide();
   this.result=res;
   if(this.mode=='Add'){
    this.toastrService.success('New Question added successfully');
  }else{
    this.toastrService.success('Question updated successfully');
  }   
   if(this.result.responseResult){
    this.getscreeningQuestion();
   }
  
  })
}


// open modal for edit question 
 capitalize(s)
{
    return s[0].toUpperCase() + s.slice(1);
}

// open edit question pop up

editQuestion(template: TemplateRef<any>,item:any,mode,EnablesInCreatedGroup: TemplateRef<any>) {     
  if(item.isactive)
  {
  this.modalRef = this.modalService.show(template, { class: 'modal-md' });  
  }
  else
  {
  this.EnablesGroupmodalRef = this.modalService.show(EnablesInCreatedGroup, { class: 'modal-md' });  
  }
  this.groupId=item.groupid; 
  this.questionId=item.groupquestionid;;  
  this.mode=mode;
  //this.capitalize(this.mode);
  this.questionForm.controls['question'].setValue(item.questions);
  this.questionForm.controls['answer'].setValue(item.answer);
  this.questionForm.controls['isActive'].setValue(item.isactive);
  this.questionForm.controls['isMandatory'].setValue(item.mandotary);
  if(item.mandotary){
    this.isMandatory=true
    this.showPrefrence=true;
    this.questionForm.controls['preference'].setValue(item.preference);
  }else{
    this.isMandatory=false
    this.showPrefrence=false;
    this.questionForm.controls['preference'].setValue('');
  }  
}

// enable disable question
 
activeDeactivQuestion(item:any,value){
  let postData={
   "Groupid": item.groupid,
   "groupquestionid":item.groupquestionid,
   "IsActive": value
  }   
  this.screeningService.activeDeactiveQuestion(postData).subscribe(res=>{     
    if(res){
      if(value){
        this.toastrService.success('Question is Enable successfully');
      }else{
        this.toastrService.success('Question is Disable successfully');
      }
      this.getscreeningQuestion();
    }
  })
}

// close Question create modal
 
close(){
  this.modalRef.hide();
}
closeenables()
{
this.EnablesGroupmodalRef.hide(); 
}

// open create Question Section

openCreateQuestionSection(groupId:any){
  this.showPrefrence=false;
  this.showQuestionTable=false;
  this.showCreateQuestion=true;
  this.questionGroupList=[];
  this.questionList=[];
  this.createGroupForm.controls['groupName'].setValue("");
}

// open form for create group

groupInputShow:boolean=false;
openGroupform(){
  this.groupInputShow=true; 
  this.ShownewGroupList=false;
  this.createGroupForm.reset();
}


// submit new group

groupResponse:any;
submitNewGroup(){
  if(!this.createGroupForm.value.groupName){
    this.toastrService.error('please enter group name');
    return false
  }
  let postData={
    "Groupname" : this.createGroupForm.value.groupName,
  }
  this.spinnerService.show();
  this.screeningService.saveGroup(postData).subscribe(res=>{
    this.spinnerService.hide();
    this.groupResponse=res;
     if(this.groupResponse.responseResult){
      this.toastrService.success('Group added successfully');
      this.groupInputShow=false;
      this.getGroupList();
     }
  })
}

// cancle create group form

canclecreateGroupForm(){
  this.groupInputShow=false;
  this.createGroupForm.reset();
}

// show group List

ShownewGroupList:boolean=false;
showGroupList(){
  this.ShownewGroupList=true
  this.groupInputShow=false;
  this.showPrefrence=false;
  this.questionForm.reset();
  this.questionList=[];
  this.showQuestionAddForm=false;   
}

// open screening question form

showQuestionAddForm:boolean=false;
showQuestionForm(event:any){      
this.questionList=[];
this.questionForm.controls['answer'].setValue('');
this.questionForm.controls['preference'].setValue('');
 let groupId=event.target.value; 
 let groupName = this.groupList.filter(function (entry) {
   return entry.groupid == groupId;
 });
   this.groupId=groupId;   
    this.groupName=groupName[0]['groupname'];    
    this.showQuestionAddForm=true;  
 }

 // check if non negotiable
 showPrefrence:boolean=false;
 peferenceSelect:any;
 
 isNonNegotiable(e){  
  if(e.target.checked){
    this.peference=''
    this.showPrefrence=true;
  }else{
    this.peferenceSelect=''
    this.questionForm.controls['preference'].setValue('');
    this.showPrefrence=false;
  }
 }

 peference:any;
 setPreference(event){
   this.peference = event.target.value; 
}

 // add question in question list

 addNewQuestion(){  
   
  if(!this.groupName){
    this.toastrService.error('please add group name');
    return false
  }else if(!this.questionForm.value.question){
    this.toastrService.error('please add question');
    return false
  }  
  //  if(this.showPrefrence) {
          if(!this.questionForm.value.answer){
             this.toastrService.error('please add answer');
             return false
          }
    //  }


  if(this.showPrefrence){    
    if(!this.questionForm.value.preference){
      this.toastrService.error('please select preference');
      return false
    }else{
      var setpeferenceSelect= parseInt(this.questionForm.value.preference)
    }   
  }
  this.questionList.push({
                          "questionlist":this.questionForm.value.question,
                          "isActive":true,
                          "Mandatory":this.questionForm.value.isMandatory ? this.questionForm.value.isMandatory:false,
                          "answer":this.questionForm.value.answer ? this.questionForm.value.answer:'',
                          "preference":setpeferenceSelect?setpeferenceSelect:0,
                          "groupquestionid":0
                        });                       
                 
                         $("#preference").prop('checked', false); 
                         this.showPrefrence=false;
                       
 this.questionForm.reset();
 this.questionForm.controls['answer'].setValue('');
 this.questionForm.controls['preference'].setValue('');
}

// open confirm dialog for delete question

delete(template: TemplateRef<any>) {
  this.modalRef = this.modalService.show(template, { class: 'modal-sm' });
}

// close delete confirm dialog

declineBoxSecor(){
  this.modalRef.hide();
 }


// delete question from list

deleteQuestion(index:number){
  this.modalRef.hide();
  this.questionList.splice(index,1)
}

// submit new question in a group

result:any
submitGroupQuestion(){
 if(!this.questionList.length){
  this.toastrService.error('plaease add at least one question');
  return false
 }
  let postData={
    "Groupname" : this.groupName,
    "Groupid": this.groupId,
    "questionlist":this.questionList   
  } 
  this.questionList=[];
    this.spinnerService.show();   
     
    this.screeningService.setScreeningQuestion(postData).subscribe(res=>{
    this.spinnerService.hide();
    this.result=res
    if(this.result.responseResult){
      this.createGroupForm.controls['groupName'].setValue("");
        this.toastrService.success(this.result.message);
        this.showCreateQuestion=false;    
        this.ShownewGroupList=false;   
        this.showQuestionAddForm=false;
    }
  })
}

// back to datatable section

Back(){
  this.groupInputShow=false;
  this.showCreateQuestion=false;    
  this.ShownewGroupList=false;   
  this.showQuestionAddForm=false;
}




}

