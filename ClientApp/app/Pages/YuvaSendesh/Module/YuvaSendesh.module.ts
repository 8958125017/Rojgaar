import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { CommonModule } from "@angular/common";
import { ErrorsModule } from "../../../errors.component";
import { Routes,RouterModule } from "@angular/router";
import { AppConfig } from "../../../Globals/app.config"; 
import {  AuthenticationService } from '../../../Services/authenticate.service';
import { Browser } from 'selenium-webdriver';
import { BrowserModule } from '@angular/platform-browser';
//import { YuvaSendeshRoutes } from '../Module/YuvaSendesh.routes';
import { AccordionModule } from 'ngx-bootstrap';
import { YuvaSendeshComponent } from '../YuvaSendesh.component'
import { from } from 'rxjs/observable/from';
import { YuvaSendeshRoutes } from './YuvaSendesh.routes';
import { CompanyProfileService } from '../../../Services/companyprofile.service';
// import { FileUploader } from 'ng2-file-upload';


@NgModule({
  imports: [
    FormsModule,
    CommonModule,
    AccordionModule,
    ReactiveFormsModule,
    ErrorsModule,
    RouterModule.forChild(YuvaSendeshRoutes)
  ],
  declarations: [
    YuvaSendeshComponent,
    // FileUploader
  
  ],
  providers: [ 
    AppConfig,
    AuthenticationService,
    CompanyProfileService,
  ],
 // bootstrap: [AppComponent]
})
export class YuvaSendeshModule { }

