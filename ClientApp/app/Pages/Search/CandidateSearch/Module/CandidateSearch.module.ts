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
import { CandidateSearchComponent } from '../CandidateSearch.Component';
import { CandidateSearchRoutes } from './CandidateSearch.routes';
import { CandidateService } from '../../../../Services/candidate.service';
//import {SharedModule} from '../../../../shared.module'
import {CommonViewLayoutModule} from '../../../CommonModelView/Module/CommonViewLayout.module'


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ErrorsModule,
    InfiniteScrollModule,
    ReactiveFormsModule,
    SharedBootstrapModule,
   // SharedModule,
    CommonViewLayoutModule,
    RouterModule.forChild(CandidateSearchRoutes)
  ],
  declarations: [
    CandidateSearchComponent
  ],
  providers: [
    UserInfoService,
    MasterService,
    AppConfig,
    AuthGuard,
    AuthenticationService,
    CandidateService
    // ,ProfileSidebar,
   // LeftSidebar,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
})
export class CandidateSearchModule { }

