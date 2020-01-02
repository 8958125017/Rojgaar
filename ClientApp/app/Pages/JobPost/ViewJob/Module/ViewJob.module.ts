import { NgModule, NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ErrorsModule } from '../../../../errors.component';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { SharedBootstrapModule } from '../../../../shared-bootstrap.module';
import { UserInfoService } from '../../../../Services/userInfo.service.';
import { MasterService } from '../../../../Services/master.service';
import { AppConfig } from '../../../../Globals/app.config';
import { AuthenticationService } from '../../../../Services/authenticate.service';
import { AuthGuard } from '../../../../Guards/auth.guard';
import { ViewJobComponent } from '../ViewJob.Component';
import { ViewJobRoutes } from './ViewJob.routes';
import { DatepickerModule, BsDatepickerModule } from 'ngx-bootstrap';
import { JobpostService } from '../../../../Services/jobpost.service';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { Ng5SliderModule } from 'ng5-slider';
import { CompanyProfileService} from '../../../../Services/companyprofile.service';
import { CommonMethodService } from '../../../../Services/commonMethod.serive';
import { SharedModule} from '../../../../shared.module';
import { ScreeningQuestionService} from '../../../../Services/screeningQuestion.service';
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ErrorsModule,
    InfiniteScrollModule,
    ReactiveFormsModule,
    SharedBootstrapModule,
    BsDatepickerModule,
    Ng5SliderModule,
    DatepickerModule,
    NgMultiSelectDropDownModule,
    SharedModule,
    RouterModule.forChild(ViewJobRoutes)
  ],
  declarations: [
    ViewJobComponent,
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
    ScreeningQuestionService
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
})
export class ViewJobModule { }

