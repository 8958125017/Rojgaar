import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { CommonModule } from "@angular/common";
import { ErrorsModule } from "../../../errors.component";
import { RouterModule } from "@angular/router";
import { AppConfig } from "../../../Globals/app.config"; 
import {  AuthenticationService } from '../../../Services/authenticate.service';
import { Browser } from 'selenium-webdriver';
import { BrowserModule } from '@angular/platform-browser';
import { AccordionModule } from 'ngx-bootstrap';
import { regisrationRoutes } from './regisration.routes';
import { regisrationComponent } from '../regisration.component';
import { RegistrationService } from '../../../Services/registration.service';
import { MasterService } from '../../../Services/master.service';
import { RecaptchaModule ,RECAPTCHA_SETTINGS } from 'ng-recaptcha';
import { RecaptchaFormsModule } from 'ng-recaptcha/forms'
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { SharedModule } from '../../../shared.module';
// import {GeolocationComponent } from '../../GeoLocation/Geolocation.Component';

@NgModule({
  imports: [
    FormsModule,
    CommonModule,
    AccordionModule,
    SharedModule,
  //  BrowserModule,
    ReactiveFormsModule,
    NgMultiSelectDropDownModule,
    ErrorsModule,
    RecaptchaModule.forRoot(),
    RecaptchaFormsModule,
    RouterModule.forChild(regisrationRoutes)
  ],
  declarations: [
    regisrationComponent,//, ErrorsComponent
    // GeolocationComponent,
  
  ],
  providers: [ 
    AppConfig,
    AuthenticationService,
    RegistrationService,
    MasterService,
    {
      provide: RECAPTCHA_SETTINGS,
       useValue: { 
         siteKey: '6LdAm04UAAAAABRwz2yNS5P2yLKpxxL47nDqN_sT',
                   } 
      },
    
  ],
 // bootstrap: [AppComponent]
})
export class RegisrationModule { }

