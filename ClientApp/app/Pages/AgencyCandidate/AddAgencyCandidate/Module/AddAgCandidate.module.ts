import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { ArchwizardModule } from 'angular-archwizard';
import { CommonModule } from "@angular/common";
import { RouterModule } from "@angular/router";
import { Browser } from 'selenium-webdriver';
import { BrowserModule } from '@angular/platform-browser';
//import { agCandidateRoutes } from './agCandidate.routes';
//import { agCandidateComponent } from '../agCandidate.component';
import { ErrorsModule } from '../../../../errors.component';
import { AppConfig } from '../../../../Globals/app.config';
import { AuthenticationService } from '../../../../Services/authenticate.service';
import { RegistrationService } from '../../../../Services/registration.service';
import { AddAgCandidateRoutes } from './AddAgCandidate.routes';
import { AddAgCandidateComponent } from '../AddAgCandidate.component';
import { CandidateService } from '../../../../Services/candidate.service';
import { AuthGuard } from '../../../../Guards/auth.guard';
import { BsDatepickerModule, DatepickerModule } from 'ngx-bootstrap';


@NgModule({
  imports: [
    FormsModule,
    CommonModule,
    BsDatepickerModule,
    DatepickerModule,
  //  BrowserModule,
    ArchwizardModule,
    ReactiveFormsModule,
    ErrorsModule,
    RouterModule.forChild(AddAgCandidateRoutes)
  ],
  declarations: [
    AddAgCandidateComponent,//, ErrorsComponent
  ],
  providers: [
    AppConfig,
    AuthenticationService,
    AuthGuard,
    RegistrationService,
    CandidateService,
    AuthenticationService,
  ],
 // bootstrap: [AppComponent]
})
export class AddAgCandidateModule { }

