import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { CommonModule } from "@angular/common";
import { ErrorsModule } from "../../../errors.component";
import { RouterModule } from "@angular/router";
import { PredictiveSearchComponent } from "../PredictiveSearch.component"; 
import { AppConfig } from "../../../Globals/app.config"; 
import {  AuthenticationService } from '../../../Services/authenticate.service';
import { Browser } from 'selenium-webdriver';
import { BrowserModule } from '@angular/platform-browser';
import { AccordionModule, TypeaheadModule } from 'ngx-bootstrap';
import { HttpClientModule } from '@angular/common/http';
import { MasterService } from '../../../Services/master.service';
import { PredictiveSearchRoutes } from './PredictiveSearch.routes';
import { Ng5SliderModule } from 'ng5-slider';
import { PredictiveSearchService } from '../../../Services/PredictiveSearch.services';
import { CandidateService } from '../../../Services/candidate.service';
//import {SharedModule} from '../../../shared.module'
import {CommonViewLayoutModule} from '../../CommonModelView/Module/CommonViewLayout.module'

@NgModule({
  imports: [
    FormsModule,
    CommonModule,
    AccordionModule,
    HttpClientModule,
    TypeaheadModule,
    ReactiveFormsModule,
    ErrorsModule,
   // SharedModule,
    Ng5SliderModule,
    CommonViewLayoutModule,
    RouterModule.forChild(PredictiveSearchRoutes )  
  ],
  declarations: [
    PredictiveSearchComponent,//, ErrorsComponent  
  ],
  providers: [
     AppConfig,
     AuthenticationService,  
     PredictiveSearchService,
     CandidateService
  //  MasterService,
    
  ],
 // bootstrap: [AppComponent]
})
export class PredictiveSearchModule { }

