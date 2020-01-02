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
import { JobListComponent } from '../JobList.Component';
import { JobListRoutes } from './JobList.routes';
import { JobpostService } from '../../../../Services/jobpost.service';
import { TypeaheadModule } from 'ngx-bootstrap';
import { Ng5SliderModule } from 'ng5-slider';
import { BsDatepickerModule, DatepickerModule } from 'ngx-bootstrap';
import { CompanyProfileService } from '../../../../Services/companyprofile.service';
import { CommonMethodService } from '../../../../Services/commonMethod.serive'
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ErrorsModule,
    InfiniteScrollModule,
    ReactiveFormsModule,
    TypeaheadModule,
    Ng5SliderModule,
    SharedBootstrapModule,
    RouterModule.forChild(JobListRoutes),
    BsDatepickerModule.forRoot()
  ],
  declarations: [
    JobListComponent,
    
  ],
  providers: [
    UserInfoService,
 //   MasterService,
    AppConfig,
    AuthGuard,
    JobpostService,
    AuthenticationService,
    CompanyProfileService,
    CommonMethodService,  
    // ,ProfileSidebar,
   // LeftSidebar,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
})
export class JobListModule { }

