import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { CommonModule } from "@angular/common";
import { ErrorsModule } from "../../../errors.component";
import { RouterModule } from "@angular/router";
import { CommonViewLayoutComponent } from "../CommonView-Layout.Component"; 
import { AppConfig } from "../../../Globals/app.config"; 
import {  AuthenticationService } from '../../../Services/authenticate.service';
import { Browser } from 'selenium-webdriver';
import { BrowserModule } from '@angular/platform-browser';
import { AccordionModule, TypeaheadModule } from 'ngx-bootstrap';
import { HttpClientModule } from '@angular/common/http';
import { RegistrationService } from '../../../Services/registration.service';
import { MasterService } from '../../../Services/master.service';
//import { CommonViewLayout } from './CommonViewLayout.routes';
import { Ng5SliderModule } from 'ng5-slider';
//import {CandidateSearchModule} from '../../../Pages/Search/CandidateSearch/Module/CandidateSearch.module'
import {SharedModule} from '../../../shared.module'


@NgModule({
  imports: [
    FormsModule,
    CommonModule,
    AccordionModule,
    HttpClientModule,
  //  BrowserModule, 
    TypeaheadModule,
    ReactiveFormsModule,
    ErrorsModule,
    Ng5SliderModule,
    //RouterModule.forChild(CommonViewLayout ),
    SharedModule,
    //CandidateSearchModule,
 
  ],
  declarations: [
    CommonViewLayoutComponent,//, ErrorsComponent  
  ],
  exports: [
    CommonViewLayoutComponent
  ],

  providers: [
    RegistrationService,
  AppConfig,
    AuthenticationService,  
  //  MasterService,
    
  ],
 // bootstrap: [AppComponent]
})
export class CommonViewLayoutModule { }

