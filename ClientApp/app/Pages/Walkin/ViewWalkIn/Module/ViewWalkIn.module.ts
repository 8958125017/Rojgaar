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
import { ViewWalkInComponent } from '../ViewWalkIn.Component';
import { ViewWalkInRoutes } from './ViewWalkIn.routes';
import { DatepickerModule, BsDatepickerModule } from 'ngx-bootstrap';
import { JobpostService } from '../../../../Services/jobpost.service';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { WalkinPostService } from '../../../../Services/walkinpost.service';
import { Ng5SliderModule } from 'ng5-slider';
import { TimepickerModule } from 'ngx-bootstrap/timepicker';
import { AmazingTimePickerService, AmazingTimePickerModule } from 'amazing-time-picker';
import { CompanyProfileService } from '../../../../Services/companyprofile.service';
import { CommonMethodService } from '../../../../Services/commonMethod.serive'
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ErrorsModule,
    InfiniteScrollModule,
    ReactiveFormsModule,
    SharedBootstrapModule,
    BsDatepickerModule,
    DatepickerModule,
    Ng5SliderModule,
    NgMultiSelectDropDownModule,
    RouterModule.forChild(ViewWalkInRoutes),
    TimepickerModule.forRoot(),
    AmazingTimePickerModule
  ],
  declarations: [
    ViewWalkInComponent
  ],
  providers: [
    UserInfoService,
    MasterService,
    AppConfig,
    AuthGuard,
    JobpostService,
    AuthenticationService,
    CompanyProfileService,
    CommonMethodService,
    WalkinPostService

  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
})
export class ViewWalkInModule { }

