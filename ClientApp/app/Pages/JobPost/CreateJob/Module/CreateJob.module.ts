import { NgModule, NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ErrorsModule } from '../../../../errors.component';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { SharedBootstrapModule } from '../../../../shared-bootstrap.module';
import { UserInfoService } from '../../../../Services/userInfo.service.';
import { MasterService } from '../../../../Services/master.service';
import { AppConfig } from '../../../../Globals/app.config';
import { AuthenticationService } from '../../../../Services/authenticate.service';
import { AuthGuard } from '../../../../Guards/auth.guard';
import { CreateJobRoutes } from './CreateJob.routes';
import { CreateJobComponent } from '../CreateJob.Component';
import { JobpostService } from '../../../../Services/jobpost.service';
import { BsDatepickerModule, DatepickerModule } from 'ngx-bootstrap';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { Ng5SliderModule } from 'ng5-slider';
import { ScreeningQuestionService} from '../../../../Services/screeningQuestion.service'
import {GeolocationComponent } from '../../../GeoLocation/Geolocation.Component'
// import { GeolocationRoutes } from "../../../GeoLocation/Module/Geolocation.routes";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ErrorsModule,
    InfiniteScrollModule,
    ReactiveFormsModule,
    SharedBootstrapModule,
    NgMultiSelectDropDownModule,
    Ng5SliderModule,
    BsDatepickerModule,//bsdatepicker
    DatepickerModule, //bssdatepicker
    RouterModule.forChild(CreateJobRoutes),
    // RouterModule.forChild(GeolocationRoutes )
  ],
  declarations: [
    CreateJobComponent,
     GeolocationComponent
  ],
  providers: [
    UserInfoService,
    MasterService,
    AppConfig,
    AuthGuard,
    JobpostService,
    ScreeningQuestionService,
    AuthenticationService,
    // ,ProfileSidebar,
    // LeftSidebar,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
})
export class CreateJobsModule { }

