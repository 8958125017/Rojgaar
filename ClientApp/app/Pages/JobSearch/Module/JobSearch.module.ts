import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { CommonModule } from "@angular/common";
import { ErrorsModule } from "../../../errors.component";
import { RouterModule } from "@angular/router";
import { JobSearchComponent } from "../JobSearch.component"; 
import { AppConfig } from "../../../Globals/app.config"; 
import {  AuthenticationService } from '../../../Services/authenticate.service';
import { Browser } from 'selenium-webdriver';
import { BrowserModule } from '@angular/platform-browser';
import { AccordionModule, TypeaheadModule } from 'ngx-bootstrap';
import { HttpClientModule } from '@angular/common/http';
import { RegistrationService } from '../../../Services/registration.service';
import { MasterService } from '../../../Services/master.service';
import { JobSearchRoutes } from './JobSearch.routes';
import { Ng5SliderModule } from 'ng5-slider';
import { NgMarqueeModule } from 'ng-marquee';


@NgModule({
  imports: [
    FormsModule,
    CommonModule,
    AccordionModule,
    HttpClientModule,
  //  BrowserModule,
    NgMarqueeModule,
    TypeaheadModule,
    ReactiveFormsModule,
    ErrorsModule,
    Ng5SliderModule,
    RouterModule.forChild(JobSearchRoutes )  
  ],
  declarations: [
    JobSearchComponent,//, ErrorsComponent  
  ],
  providers: [
    RegistrationService,
  AppConfig,
    AuthenticationService,  
  //  MasterService,
    
  ],
 // bootstrap: [AppComponent]
})
export class JobSearchModule { }

