import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { CommonModule } from "@angular/common";
import { RouterModule } from "@angular/router";
import { Browser } from 'selenium-webdriver';
import { BrowserModule } from '@angular/platform-browser';
import { agCandidateRoutes } from './agCandidate.routes';
import { agCandidateComponent } from '../agCandidate.component';
import { ErrorsModule } from '../../../../errors.component';
import { AppConfig } from '../../../../Globals/app.config';
import { AuthenticationService } from '../../../../Services/authenticate.service';
import { RegistrationService } from '../../../../Services/registration.service';
import { ArchwizardModule } from 'angular-archwizard';
import { AuthGuard } from '../../../../Guards/auth.guard';
import { BsDatepickerModule, DatepickerModule } from 'ngx-bootstrap';
import { CandidateService } from '../../../../Services/candidate.service';
import {CommonViewLayoutModule} from '../../../CommonModelView/Module/CommonViewLayout.module'

@NgModule({
  imports: [
    FormsModule,
    CommonModule,
    ArchwizardModule,
  //  BrowserModule,
    ReactiveFormsModule,
    ErrorsModule,
    BsDatepickerModule,
    DatepickerModule,
    CommonViewLayoutModule,
    RouterModule.forChild(agCandidateRoutes)
  ],
  declarations: [
    agCandidateComponent,//, ErrorsComponent

  ],
  providers: [    
    AppConfig,
    AuthGuard,
    AuthenticationService,
    RegistrationService,
    CandidateService,
  ],
 // bootstrap: [AppComponent]
})
export class agCandidateModule { }

