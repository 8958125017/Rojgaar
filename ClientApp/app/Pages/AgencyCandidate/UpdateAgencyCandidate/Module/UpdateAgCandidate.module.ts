import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { ArchwizardModule } from 'angular-archwizard';
import { CommonModule, DatePipe } from "@angular/common";
import { RouterModule } from "@angular/router";
import { Browser } from 'selenium-webdriver';
import { BrowserModule } from '@angular/platform-browser';
//import { agCandidateRoutes } from './agCandidate.routes';
//import { agCandidateComponent } from '../agCandidate.component';
import { AppConfig } from '../../../../Globals/app.config';
import { AuthenticationService } from '../../../../Services/authenticate.service';
import { RegistrationService } from '../../../../Services/registration.service';
import { UpdateAgCandidateComponent } from '../UpdateAgCandidate.component';
import { CandidateService } from '../../../../Services/candidate.service';
import { AuthGuard } from '../../../../Guards/auth.guard';
import { BsDatepickerModule, DatepickerModule } from 'ngx-bootstrap';
import { ErrorsModule } from '../../../../errors.component';
import { UpdateAgCandidateRoutes } from './UpdateAgCandidate.routes';

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
    RouterModule.forChild(UpdateAgCandidateRoutes)
  ],
  declarations: [
    UpdateAgCandidateComponent,//, ErrorsComponent
  ],
  providers: [
    AppConfig,
    AuthenticationService,
    AuthGuard,
    RegistrationService,
    CandidateService,
    AuthenticationService,
    DatePipe,
  ],
 // bootstrap: [AppComponent]
})
export class UpdateAgCandidateModule { 

  
}

