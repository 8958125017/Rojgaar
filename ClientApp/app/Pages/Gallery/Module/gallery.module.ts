import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { CommonModule } from "@angular/common";
import { ErrorsModule } from "../../../errors.component";
import { RouterModule } from "@angular/router";
import { GalleryRoutes } from "./gallery.routes";
//import { EventComponent } from "../Event.component"; 
import { AppConfig } from "../../../Globals/app.config"; 
import { AuthenticationService } from '../../../Services/authenticate.service';
import { Browser } from 'selenium-webdriver';
import { BrowserModule } from '@angular/platform-browser';
import { AccordionModule, TypeaheadModule, CarouselModule, ModalModule } from 'ngx-bootstrap';
import { HttpClientModule } from '@angular/common/http';
import { RegistrationService } from '../../../Services/registration.service';
import { MasterService } from '../../../Services/master.service';
import { NgxSelectModule } from 'ngx-select-ex';
import { AppComponent } from '../../../app.component';
import { HttpModule } from '@angular/http';
import { RecaptchaModule ,RECAPTCHA_SETTINGS } from 'ng-recaptcha';
import { RecaptchaFormsModule } from 'ng-recaptcha/forms'
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { SharedModule } from '../../../shared.module';

import { NgMarqueeModule } from 'ng-marquee';
import { EventService } from '../../../Services/Event.service';
import { GalleryComponent } from '../gallery.component';
import { NgxGalleryModule } from 'ngx-gallery';
import 'hammerjs';


@NgModule({
  imports: [
    FormsModule,
    CommonModule,
    AccordionModule,
    HttpClientModule,
    HttpModule,
  //  BrowserModule,
    NgMarqueeModule,
    ReactiveFormsModule,
    NgMultiSelectDropDownModule,
    ErrorsModule,
    NgxSelectModule,
    TypeaheadModule,
    SharedModule,
    RecaptchaModule.forRoot(),
    RecaptchaFormsModule,
    RouterModule.forChild(GalleryRoutes),
    CarouselModule.forRoot(),
    ModalModule.forRoot(),
    NgxGalleryModule
  ],
  declarations: [
    GalleryComponent
  ],
  providers: [
    RegistrationService,
    AppConfig,
    EventService,
    AuthenticationService,
    {
      provide: RECAPTCHA_SETTINGS,
       useValue: { 
         siteKey: '6LdAm04UAAAAABRwz2yNS5P2yLKpxxL47nDqN_sT',
                   } 
      },
   // MasterService,
    
  ],
 // bootstrap: [AppComponent]
})
export class GalleryModule { }

