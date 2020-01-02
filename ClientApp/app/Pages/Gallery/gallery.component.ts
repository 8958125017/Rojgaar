import { Component, OnInit, ViewChild, ElementRef, TemplateRef, HostListener  } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup,  Validators } from '@angular/forms';
import { RegistrationService } from '../../Services/registration.service';
import { AuthenticationService } from '../../Services/authenticate.service';
import { CookieService } from 'ngx-cookie-service';
import { AppConfig } from '../../Globals/app.config';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
import { ToastrService,  } from 'ngx-toastr';
import { CustomValidators } from '../../Validators/custom-validator.directive';
import { MasterService } from '../../Services/master.service';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { BsModalService } from 'ngx-bootstrap/modal';
import { EventService } from '../../Services/Event.service';
import { CarouselConfig } from 'ngx-bootstrap/carousel';
import { NgxGalleryOptions, NgxGalleryImage, NgxGalleryAnimation } from 'ngx-gallery';


@Component({
  selector: 'app-galleryComponent',
  templateUrl: './gallery.component.html',
  providers: [
    { provide: CarouselConfig, useValue: { interval: 1500, noPause: true, showIndicators: true,activeSlideIndex:0,
      itemsPerSlide: 3,
      singleSlideOffset: false,
      noWrap: false} }
  ]
})

export class GalleryComponent implements OnInit {
  galleryOptions: NgxGalleryOptions[];
  galleryImages: NgxGalleryImage[];
  modalRef: BsModalRef;
  myInterval = 3000;
  //itemsPerSlide = 5;
  //singleSlideOffset = true;
  
  ImageData:any;
  Responce: any = {};
  constructor(    
    private router: Router,
    private spinnerService: Ng4LoadingSpinnerService,  
    private registService: RegistrationService,
    private masterService: MasterService,
    private toastrService: ToastrService,   
    private formBuilder: FormBuilder,
    public appConfig: AppConfig,
    private modalService: BsModalService,
    private EventService:EventService
  ) {
  
   
  }
  openModal(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template);
  }

  resolved(captchaResponse: string) {

  }
  GetGalleyImages()
  {
    var galldata={"Adminid":0,"eventId":0,"Page":0}
    this.EventService.GetEventGalleryImage(galldata).subscribe(res => {
     
      this.Dbresponse = res
      if(this.Dbresponse!=null)
      {
       this.PosterEvent = this.Dbresponse.lstRojgaarEventList;
       this.ImageData = this.PosterEvent;
       this.galleryImages = this.ImageData.map(item => ({ small: item.imagePath, medium: item.imagePath, big: item.imagePath,description: item.eventDescription }));

      }
    
    });
  }

  scroll(el) {
    el.scrollIntoView();
  }

  ngOnInit() {
    this.galleryOptions = [
      {
        width: '100%',
        height: '600px',
        thumbnailsColumns: 12,
        thumbnailsRows:1,
        imageAutoPlay: true,
        imageAutoPlayInterval: 3000,
        imageAutoPlayPauseOnHover: true,
        fullWidth:true,
        imageSize:'contain',
        //thumbnailSize:'contain',
        previewDescription:true,
        thumbnailsPercent: 20,
        thumbnailsMargin: 10,
        imageAnimation: NgxGalleryAnimation.Zoom,
        imageInfinityMove: true, 
        //previewZoom: true,
        //previewDownload: true,
        layout: 'thumbnails- top',
        previewKeyboardNavigation: true,
        previewInfinityMove: true,
        previewAutoPlay: true,
        previewAnimation: true,
        previewCloseOnEsc: true,
        //thumbnailsRemainingCount: true,
      },
      // max-width 800
      {
        breakpoint: 800,
        width: '100%',
        //height: '500px',
        imagePercent: 80,
        thumbnailsPercent: 20,
        thumbnailsMargin: 20,
        thumbnailMargin: 20,
        imageSize:'contain',

      },
      // max-width 767
      {
        breakpoint: 767,
        preview: true,
        height: "160px",
        thumbnails: false,
      },
      // max-width 400
      {
        breakpoint: 400,
        preview: true,
        height: "130px",
        thumbnails: false,
      },
      // max-width 350
      {
        breakpoint: 350,
        preview: true,
        height: "120px",
        thumbnails: false,
      },
      // max-width 320
      {
        breakpoint: 320,
        preview: true,
        height: "110px",
        thumbnails: false,
        imageAutoPlay: false,
      },
    ];
    this.GetGalleyImages();
    /////////////////////////
    /////////////////////
    $(".mobile-tgl-menu").click(function () {
      //$('.header .main_menu_bg #bs-example-navbar-collapse-1 ul').slideToggle();
      $(this).siblings('#bs-example-navbar-collapse-1').children('ul').slideToggle();
    });
    //this.GetEventPosterImage();
  }
/////////////////////////  Cordinate Details ///////////// 
PosterEvent:any=[];
///////////////////////
Dbresponse:any;
//////////////////////////////  
response:any=[];

 ////////////// Events Back /////////////////////////

  
}

