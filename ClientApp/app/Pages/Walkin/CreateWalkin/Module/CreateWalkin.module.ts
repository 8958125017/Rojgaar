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
import { CreateWalkinRoutes } from './CreateWalkin.routes';
import { CreateWalkinComponent } from '../CreateWalkin.Component';
import { WalkinPostService } from '../../../../Services/walkinpost.service';
import { BsDatepickerModule, DatepickerModule } from 'ngx-bootstrap';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { Ng5SliderModule } from 'ng5-slider';
import { TimepickerModule } from 'ngx-bootstrap/timepicker';
import { AmazingTimePickerService, AmazingTimePickerModule } from 'amazing-time-picker';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ErrorsModule,
    InfiniteScrollModule,
    NgMultiSelectDropDownModule,
    ReactiveFormsModule,
    SharedBootstrapModule,
    BsDatepickerModule,
    Ng5SliderModule,
    DatepickerModule,
    RouterModule.forChild(CreateWalkinRoutes),
    TimepickerModule.forRoot(),
    AmazingTimePickerModule
  ],
  declarations: [
    CreateWalkinComponent
  ],
  providers: [
    UserInfoService,
    MasterService,
    AppConfig,
    AuthGuard,
    WalkinPostService,
    AuthenticationService,
    // ,ProfileSidebar,
   // LeftSidebar,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
})
export class CreateWalkinsModule { }

