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
import { UploadSalarySlipComponent } from '../UploadSalarySlip.Component';
import { UploadSalarySlipRoutes } from './UploadSalarySlip.routes';
import { UploadSalarySlipService } from '../../../../Services/uploadSalarySlip.service ';
import { BsDatepickerModule, DatepickerModule, } from 'ngx-bootstrap';
import { AccordionModule, TypeaheadModule } from 'ngx-bootstrap';
import { UploadDocumentRoutes } from '../../UploadDocument/Module/UploadDocument.routes';
import { DataTablesModule } from 'angular-datatables';
import { DatePipe } from '@angular/common'

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    BsDatepickerModule,
    DatepickerModule,
    ErrorsModule,
    InfiniteScrollModule,
    ReactiveFormsModule,
    SharedBootstrapModule,
    AccordionModule,
    TypeaheadModule,
    DataTablesModule,
    RouterModule.forChild(UploadSalarySlipRoutes)
  ],
  declarations: [
    UploadSalarySlipComponent
  ],
  providers: [
    UserInfoService,
    MasterService,
    AppConfig,
    AuthGuard,
    AuthenticationService,
    UploadSalarySlipService,
    DatePipe    
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
})
export class UploadSalarySlipModule { }

