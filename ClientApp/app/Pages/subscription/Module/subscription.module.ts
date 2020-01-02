import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { CommonModule } from "@angular/common";
import { ErrorsModule } from "../../../errors.component";
import { RouterModule } from "@angular/router";
import { SubscriptionRoutes } from "./subscription.routes";
import { SubscriptionComponent } from "../subscription.component"; 
import { AppConfig } from "../../../Globals/app.config"; 
import { AuthenticationService } from '../../../Services/authenticate.service';
import { AccordionModule, TypeaheadModule } from 'ngx-bootstrap';
import { HttpClientModule } from '@angular/common/http';
import { RegistrationService } from '../../../Services/registration.service';
import { NgxSelectModule } from 'ngx-select-ex';
import { HttpModule } from '@angular/http';
import { RecaptchaModule ,RECAPTCHA_SETTINGS } from 'ng-recaptcha';
import { RecaptchaFormsModule } from 'ng-recaptcha/forms'
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { SharedModule } from '../../../shared.module';

import { NgMarqueeModule } from 'ng-marquee';


@NgModule({
  imports: [
    FormsModule,
    CommonModule,
    AccordionModule,
    HttpClientModule,
    HttpModule,
    NgMarqueeModule,
    ReactiveFormsModule,
    NgMultiSelectDropDownModule,
    ErrorsModule,
    NgxSelectModule,
    SharedModule,
    TypeaheadModule,
    RecaptchaModule.forRoot(),
    RecaptchaFormsModule,
    RouterModule.forChild(SubscriptionRoutes )
  ],
  declarations: [
    SubscriptionComponent,

  ],
  providers: [
    RegistrationService,
    AppConfig,
    AuthenticationService,
    {
      provide: RECAPTCHA_SETTINGS,
       useValue: { 
         siteKey: '6LdAm04UAAAAABRwz2yNS5P2yLKpxxL47nDqN_sT',
                   } 
      },
  
  ],
 // bootstrap: [AppComponent]
})
export class SubscriptionModule { }

