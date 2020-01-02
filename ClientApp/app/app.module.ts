import { CommonModule, DatePipe } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule } from '@angular/router';
import { ImageCropperModule } from 'ng2-img-cropper';
import { Ng4LoadingSpinnerModule } from 'ng4-loading-spinner';
import { TypeaheadModule, BsDatepickerModule, DatepickerModule, ModalModule } from 'ngx-bootstrap';
import { CookieService } from 'ngx-cookie-service';
import { NgProgressModule } from 'ngx-progressbar';
import { ToastrModule } from 'ngx-toastr';
import { AppComponent } from './app.component';
import { DefaultImage } from './Directives/error.image.directive';
import { ReadMoreDirective } from './Directives/read-more.directive';
import { ThumbnailDirective } from './Directives/thumbnail.directive';
import { ErrorsModule, ErrorsComponent } from './errors.component';
import { AppConfig } from './Globals/app.config';
import { AuthGuard } from './Guards/auth.guard';
// import { PublicFooterComponent } from './Pages/Layouts/Public/Footer/Public-Footer.Component';
// import { PublicHeaderComponent } from './Pages/Layouts/Public/Herder/Public-Header.Component';
import { PublicLayoutComponent } from './Pages/Layouts/Public/Public-Layout.Component';
import { SecureFooterComponent } from './Pages/Layouts/Secure/Footer/Secure-Footer.Component';
import { SecureHeaderComponent } from './Pages/Layouts/Secure/Herder/Secure-Header.Component';
import { SecureLayoutComponent } from './Pages/Layouts/Secure/Secure-Layout.Component';
import { LeftSidebar } from './Pages/Layouts/Secure/Sidebar/Left-Sidebar.Component';
import { ProfileSidebar } from './Pages/Layouts/Secure/Sidebar/Profile-SideBar.Component';
import { DateFormatPipe } from './Pipes/custom.Pipes';
import { AppRoutingModule } from './Routes/app.routing';
import { AuthenticationService } from './Services/authenticate.service';
import { RegistrationService } from './Services/registration.service';
import { UserInfoService } from './Services/userInfo.service.';
import { SharedBootstrapModule } from './shared-bootstrap.module';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { NgxContentLoadingModule } from 'ngx-content-loading';
import { MasterService } from './Services/master.service';
import { InterviewService } from './Services/interview.service';
import { DashBoardComponent } from './Pages/DashBoard/DashBoard.Component';
import { regisrationComponent } from './Pages/Regisration/regisration.component';
import { TimepickerModule } from 'ngx-bootstrap/timepicker';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { LoaderComponent } from './loader/loader.component';
import { AgencyjobpostService } from './Services/agencyjobpost.service'
import { WalkinPostService } from './Services/walkinpost.service';
//import { TestComponent } from './Pages/test/test.component';
import { AmazingTimePickerModule, AmazingTimePickerService } from 'amazing-time-picker';
import { NgxSelectModule, INgxSelectOptions } from 'ngx-select-ex';
import { IndexComponent } from './Pages/Index/index.component';
import { JobSearchComponent } from './Pages/JobSearch/JobSearch.component';
import { Ng5SliderModule } from 'ng5-slider';
import { EncrDecrService} from './Services/EncrDecrService';
//import {entryComponents} from './Services/EncrDecrService';
import { RecaptchaModule ,RECAPTCHA_SETTINGS } from 'ng-recaptcha';
import { RecaptchaFormsModule } from 'ng-recaptcha/forms'
import { DataTablesModule } from 'angular-datatables';
import { ExcelService } from './Services/excel.service';
// import { HttpErrorInterceptor } from './Globals/http-error.interceptor';
import {DataTableModule} from 'primeng/datatable';
import {RadioButtonModule} from 'primeng/radiobutton';
import { ScrollToModule} from 'ng2-scroll-to';
@NgModule({
  imports: [
    CommonModule,
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    TypeaheadModule.forRoot(),
    HttpModule,
    ModalModule.forRoot(),
    HttpClientModule,
    NgMultiSelectDropDownModule.forRoot(),
    FormsModule,
    RouterModule,
    RadioButtonModule,
//    NgMultiSelectDropDownModule.forRoot(),
    ToastrModule.forRoot(),
    BrowserAnimationsModule, // required animations module
    Ng4LoadingSpinnerModule.forRoot(),
    ToastrModule.forRoot(),
    ImageCropperModule,
    InfiniteScrollModule,     // can remove
    NgxContentLoadingModule, //can Remove
    SharedBootstrapModule,
    BsDatepickerModule.forRoot(),
    DatepickerModule.forRoot(),
    TimepickerModule.forRoot(),
    NgProgressModule,
    ErrorsModule,
    NgxSelectModule,
    AmazingTimePickerModule,
    BsDatepickerModule.forRoot(),
    DatepickerModule.forRoot(),
    Ng5SliderModule,
    DataTablesModule,
    RecaptchaModule.forRoot(),
    RecaptchaFormsModule,
    DataTableModule,
    ScrollToModule
  ], 
  declarations: [
    // PublicFooterComponent,
    DashBoardComponent,
    AppComponent,
    PublicLayoutComponent,
    // PublicHeaderComponent,
    SecureLayoutComponent,
    SecureHeaderComponent,
    SecureFooterComponent,
    ProfileSidebar,
    LeftSidebar,
    ReadMoreDirective,
    //IndexComponent,
    //JobSearchComponent,
    DefaultImage,
    LoaderComponent,
    ThumbnailDirective,
    DateFormatPipe,

  ],
  providers: [
    AppConfig,
    DatePipe,
    DateFormatPipe,
    InterviewService,
    AuthenticationService,
    UserInfoService,
    CookieService,
    AmazingTimePickerService,
    AuthGuard,
    MasterService,
    ExcelService,
     EncrDecrService,
     {
      provide: RECAPTCHA_SETTINGS,
       useValue: {
         siteKey: '6Lf8A2cUAAAAAGgMF0eRboCS0VrzTzjNw86jimjP',
                   }
      },
      // {
      //   provide: HTTP_INTERCEPTORS,
      //   useClass: HttpErrorInterceptor,
      //   multi: true
      // }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
