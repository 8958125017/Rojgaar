import { Component, ViewChild, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { AppConfig } from '../../../../Globals/app.config';
import { Http, Headers, RequestOptions, Request, Response, RequestMethod } from '@angular/http';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ImageCropperComponent, CropperSettings } from 'ng2-img-cropper';
import { UserInfoService } from '../../../../Services/userInfo.service.';
import { ToastContainerDirective, ToastrService } from 'ngx-toastr';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';

@Component({
  selector: 'app-Profile-Sidebar',
  templateUrl: './Profile-Sidebar.Component.html'
})
export class ProfileSidebar {

  UserInfo: any;
  ProfileData: any;
  cropperSettings: CropperSettings;

  @ViewChild('form') form;
  @ViewChild('cropper', undefined) cropper: ImageCropperComponent;
  @ViewChild('mdProfileImageClose') mdProfileImageClose: ElementRef
  @ViewChild('mdProfileImageOpen') mdProfileImageOpen: ElementRef;
  @ViewChild(ToastContainerDirective) toastContainer: ToastContainerDirective;

  constructor(private http: HttpClient
    , public router: Router
    , private config: AppConfig
    , private _cookieService: CookieService
    , private appConfig: AppConfig
    , private userinfoservice: UserInfoService
    , private spinnerService: Ng4LoadingSpinnerService
    , private toastrService: ToastrService
  ) {

    this.UserInfo = appConfig.UserInfo
    this.toastrService.overlayContainer = this.toastContainer

    this.cropperSettings = new CropperSettings();
    this.cropperSettings.width = 150;
    this.cropperSettings.height = 150;
    this.cropperSettings.croppedWidth = 150;
    this.cropperSettings.croppedHeight = 150;
    this.cropperSettings.canvasWidth = 400;
    this.cropperSettings.canvasHeight = 300;
    this.ProfileData = {};;
  }

  // ProfileChangeListener($event) {
  //   var image: any = new Image();
  //   var reader = new FileReader();
  //   var file: File = $event.target.files[0];
  //   var fileType = file["type"];
  //   var ValidImageTypes = ["image/gif", "image/jpeg", "image/png"];
  //   if ($.inArray(fileType, ValidImageTypes) < 0) {
  //     // invalid file type code goes here.
  //     this.toastrService.error("Only formats are allowed : gif, jpeg & png");
  //     $("#fileProfile").val('');
  //   } else {
  //     var myReader: FileReader = new FileReader();
  //     var that = this;
  //     myReader.onloadend = function (loadEvent: any) {
  //       image.src = loadEvent.target.result;
  //       that.cropper.setImage(image);
  //     };
  //     myReader.readAsDataURL(file);
  //     this.mdProfileImageOpen.nativeElement.click();

  //   }

  // }

  Profile() {
    this.router.navigate(['/yuva/profile']);

  }
  UpdateProfileImage() {

    if (this.ProfileData.image != null && this.ProfileData.image != "") {
      this.spinnerService.show();
      this.userinfoservice.UpdateProfileImage(this.ProfileData.image).subscribe(res => {
        this.ProfileData = res;

        if (this.ProfileData != null && this.ProfileData.responseResult) {
          this.toastrService.success(this.ProfileData.message);
          this.mdProfileImageClose.nativeElement.click();
          this.UserInfo = this.appConfig.UserInfo
          //setTimeout(() => , 1000);
          this.UserInfo.imagePath = this.ProfileData.imagePath
          this.appConfig.SetUserInfoDetails(this.UserInfo);

        }
        else if (this.ProfileData != null) {
          this.toastrService.error(this.ProfileData.message);
        }

        this.spinnerService.hide();
      });
    }
  }

}
