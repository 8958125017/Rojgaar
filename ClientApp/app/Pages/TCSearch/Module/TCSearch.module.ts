import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { CommonModule } from "@angular/common";
import { ErrorsModule } from "../../../errors.component";
import { RouterModule } from "@angular/router";
import { TCSearchComponent } from "../TCSearch.component"; 
import { AppConfig } from "../../../Globals/app.config"; 
import {  AuthenticationService } from '../../../Services/authenticate.service';
import { Browser } from 'selenium-webdriver';
import { BrowserModule } from '@angular/platform-browser';
import { AccordionModule, TypeaheadModule } from 'ngx-bootstrap';
import { HttpClientModule } from '@angular/common/http';
import { RegistrationService } from '../../../Services/registration.service';
import { MasterService } from '../../../Services/master.service';
import { TCSearchRoutes } from './TCSearch.routes';
import { Ng5SliderModule } from 'ng5-slider';
import { TCSearchService } from '../../../Services/tcsearch.service';
import { CandidateService } from '../../../Services/candidate.service';
//import { KeepHtml } from '../../../Pipes/keepHtml.Pipes';
import {SharedModule} from '../../../shared.module'
// import {AppModule} from '../../../app.module'
import {CommonViewLayoutModule} from '../../CommonModelView/Module/CommonViewLayout.module'
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
    //AppModule,
    SharedModule,
   CommonViewLayoutModule,
    RouterModule.forChild(TCSearchRoutes )  
  ],
  declarations: [
    TCSearchComponent,//, ErrorsComponent
    //KeepHtml
  ],
  providers: [
    RegistrationService,
     AppConfig,
     TCSearchService,
    AuthenticationService, 
    CandidateService 
  //  MasterService,
    
  ],
 // bootstrap: [AppComponent]
})
export class TCSearchModule { }

