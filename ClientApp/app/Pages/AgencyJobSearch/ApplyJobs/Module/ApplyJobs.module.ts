import { NgModule, NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ErrorsModule } from '../../../../errors.component';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { SharedBootstrapModule } from '../../../../shared-bootstrap.module';
import { DefaultImage } from '../../../../Directives/error.image.directive';
import { ReadMoreDirective } from '../../../../Directives/read-more.directive';
import { ThumbnailDirective } from '../../../../Directives/thumbnail.directive';
import { UserInfoService } from '../../../../Services/userInfo.service.';
import { MasterService } from '../../../../Services/master.service';
import { AppConfig } from '../../../../Globals/app.config';
import { AuthenticationService } from '../../../../Services/authenticate.service';
import { AuthGuard } from '../../../../Guards/auth.guard';
import { ApplyJobsComponent } from '../ApplyJobs.Component'
import { ApplyJobsRoutes } from './ApplyJobs.routes';
import { JobpostService } from '../../../../Services/jobpost.service';
import { AgencyjobpostService } from '../../../../Services/agencyjobpost.service';
import { CandidateService } from '../../../../Services/candidate.service';
import { JobcardComponent } from "../../../jobcard/jobcard.component"; 
import { CommonViewLayoutModule } from '../../../CommonModelView/Module/CommonViewLayout.module';
//import { SharedModule } from '../../../jobcard/Module/jobcard.module'
import { DataTablesModule } from 'angular-datatables';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ErrorsModule,
    InfiniteScrollModule,
    ReactiveFormsModule,
    SharedBootstrapModule,
    RouterModule.forChild(ApplyJobsRoutes),
    CommonViewLayoutModule,
    DataTablesModule
    //SharedModule
  ],
  declarations: [
    ApplyJobsComponent,
    JobcardComponent
  ],
  providers: [
    UserInfoService,
    MasterService,
    AppConfig,
    AuthGuard,
    JobpostService,
    AuthenticationService,
    CandidateService,
    AgencyjobpostService
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
})
export class ApplyJobsModule { }

