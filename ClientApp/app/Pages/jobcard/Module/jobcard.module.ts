import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { CommonModule } from "@angular/common";
import { ErrorsModule } from "../../../errors.component";
import { RouterModule } from "@angular/router";
//import { JobcardComponent,JobcardforApplicationReceived } from "../jobcard.component"; 
import { AppConfig } from "../../../Globals/app.config"; 
import { AuthenticationService } from '../../../Services/authenticate.service';
import { AccordionModule, TypeaheadModule } from 'ngx-bootstrap';
import { HttpClientModule } from '@angular/common/http';
import { RegistrationService } from '../../../Services/registration.service';
import { jobcardRoutes } from './jobcard.routes';
import { Ng5SliderModule } from 'ng5-slider';
import { TCSearchService } from '../../../Services/tcsearch.service';
@NgModule({
  imports: [
    FormsModule,
    CommonModule,
    AccordionModule,
    HttpClientModule,
    TypeaheadModule,
    ReactiveFormsModule,
    ErrorsModule,
    Ng5SliderModule,
    RouterModule.forChild(jobcardRoutes )  
  ],
  declarations: [
    // JobcardComponent,
    // JobcardforApplicationReceived
    //, ErrorsComponent  
  ],
  providers: [
     RegistrationService,
      AppConfig,
     TCSearchService,
     AuthenticationService,      
  ],

})
export class SharedModule { }

