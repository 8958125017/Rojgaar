import { NgModule, NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ErrorsModule } from '../../../errors.component';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { SharedBootstrapModule } from '../../../shared-bootstrap.module';
import { DefaultImage } from '../../../Directives/error.image.directive';
import { ReadMoreDirective } from '../../../Directives/read-more.directive';
import { ThumbnailDirective } from '../../../Directives/thumbnail.directive';
import { UserInfoService } from '../../../Services/userInfo.service.';
import { MasterService } from '../../../Services/master.service';
import { AppConfig } from '../../../Globals/app.config';
import { AuthenticationService } from '../../../Services/authenticate.service';
import { AuthGuard } from '../../../Guards/auth.guard';
import { JobApplicantReceivedComponent } from '../JobApplicantReceived.Component';
import { JobApplicantReceivedRoutes } from './JobApplicantReceived.routes';
import { JobApplicantReceivedService } from '../../../Services/JobApplicantReceived.service';
import { Ng5SliderModule } from 'ng5-slider';
// import {NgxPaginationModule} from 'ngx-pagination';
// import {JobcardforApplicationReceived } from "../../../Pages/jobcard/jobcard.component"; 
import { CandidateService } from '../../../Services/candidate.service';
import {SharedModule} from '../../../shared.module'
import { DataTablesModule } from 'angular-datatables';
import {CommonViewLayoutModule} from '../../CommonModelView/Module/CommonViewLayout.module';
import { JobpostService } from '../../../Services/jobpost.service';
import {DataTableModule} from 'primeng/datatable';
import {DropdownModule} from 'primeng/dropdown';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ErrorsModule,
    InfiniteScrollModule,
    ReactiveFormsModule,
    SharedBootstrapModule,
    SharedModule,
    RouterModule.forChild(JobApplicantReceivedRoutes),
    Ng5SliderModule,
    DataTablesModule,
    CommonViewLayoutModule,
    DataTableModule,
    DropdownModule
    //  NgxPaginationModule,
    
  ],
  declarations: [
    JobApplicantReceivedComponent,
    // JobcardforApplicationReceived
  ],
  providers: [
    UserInfoService,
    MasterService,
    AppConfig,
    AuthGuard,
    AuthenticationService,
    JobApplicantReceivedService,
    CandidateService,
    JobpostService
    
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
})

  export class JobApplicantReceivedModule { }

