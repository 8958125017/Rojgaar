import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { CommonModule } from "@angular/common";
import { ErrorsModule } from "../../../errors.component";
import { Routes,RouterModule } from "@angular/router";
import { AppConfig } from "../../../Globals/app.config";
import {  AuthenticationService } from '../../../Services/authenticate.service';
import { Browser } from 'selenium-webdriver';
import { BrowserModule } from '@angular/platform-browser';
import { AccordionModule } from 'ngx-bootstrap';
import { PlacedCandidateComponent } from '../PlacedCandidate.component'
import { from } from 'rxjs/observable/from';
import { PlacedCandidateRoutes } from './PlacedCandidate.routes';
import { CandidateService } from '../../../Services/candidate.service';
import { DataTablesModule } from 'angular-datatables';
import { SharedModule } from '../../../shared.module';
import {CommonViewLayoutModule} from '../../CommonModelView/Module/CommonViewLayout.module'
import { JobpostService } from '../../../Services/jobpost.service';
import {DataTableModule} from 'primeng/datatable';

@NgModule({
  imports: [
    FormsModule,
    CommonModule,
    AccordionModule,
    ReactiveFormsModule,
    ErrorsModule,
    DataTablesModule,
    SharedModule,
    CommonViewLayoutModule,
    RouterModule.forChild(PlacedCandidateRoutes),
    DataTableModule
  ],
  declarations: [
    PlacedCandidateComponent,


  ],
  providers: [
    AppConfig,
    AuthenticationService,
    CandidateService,
    JobpostService
  ],
 // bootstrap: [AppComponent]
})
export class PlacedCandidateModule { }

