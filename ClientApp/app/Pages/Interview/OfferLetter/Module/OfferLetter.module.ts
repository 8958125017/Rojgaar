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
import { OfferLetterRoutes } from './OfferLetter.routes';
import { JobpostService } from '../../../../Services/jobpost.service';
import { OfferLetterComponent } from '../OfferLetter.Component';
import { BsDatepickerModule, DatepickerModule } from 'ngx-bootstrap';
import { TimepickerModule } from 'ngx-bootstrap/timepicker'; 
import { AmazingTimePickerService, AmazingTimePickerModule } from 'amazing-time-picker';
import { InterviewService } from '../../../../Services/interview.service';
import { RegistrationService } from '../../../../Services/registration.service';
import {NgxPaginationModule} from 'ngx-pagination';
import { CandidateService } from '../../../../Services/candidate.service';
import {SharedModule} from '../../../../shared.module'
import { DataTablesModule } from 'angular-datatables';
import {CommonViewLayoutModule} from '../../../CommonModelView/Module/CommonViewLayout.module';
import {DataTableModule} from 'primeng/datatable';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    AmazingTimePickerModule,
    ErrorsModule,
    InfiniteScrollModule,
    ReactiveFormsModule,
    SharedBootstrapModule,
    BsDatepickerModule,
    DatepickerModule,
    TimepickerModule.forRoot(),
    NgxPaginationModule,
    DataTablesModule,
    SharedModule,
    CommonViewLayoutModule,
    DataTableModule,
    RouterModule.forChild(OfferLetterRoutes)
  ],
  declarations: [
    OfferLetterComponent
  ],
  providers: [
    UserInfoService,
    MasterService,
    RegistrationService,
    InterviewService,
    AppConfig,
    AuthGuard,
    JobpostService,
    AuthenticationService,
    AmazingTimePickerService,
    CandidateService
    // ,ProfileSidebar,
   // LeftSidebar,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
})
export class OfferLetterModule { }

