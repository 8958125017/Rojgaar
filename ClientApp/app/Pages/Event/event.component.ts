import { Component, OnInit, ViewChild, ElementRef, TemplateRef, HostListener } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RegistrationService } from '../../Services/registration.service';
import { AuthenticationService } from '../../Services/authenticate.service';
import { CookieService } from 'ngx-cookie-service';
import { AppConfig } from '../../Globals/app.config';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
import { ToastrService, } from 'ngx-toastr';
import { CustomValidators } from '../../Validators/custom-validator.directive';
import { MasterService } from '../../Services/master.service';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { BsModalService } from 'ngx-bootstrap/modal';
import { EventService } from '../../Services/Event.service';
import { CarouselConfig } from 'ngx-bootstrap/carousel';
import { GeoLocationCommonComponent } from '../GeoLocationCommon/geo-location-common.component';
import { NgxGalleryOptions, NgxGalleryImage, NgxGalleryAnimation } from 'ngx-gallery';
import { NgxCarousel } from 'ngx-carousel';

@Component({
  selector: 'app-eventComponent',
  templateUrl: './event.component.html',
  styleUrls: ['./event.component.css']

})

export class EventComponent implements OnInit {
  @ViewChild(GeoLocationCommonComponent) GetLocation: GeoLocationCommonComponent;
  public carouselOne: NgxCarousel;

  modalRef: BsModalRef;
  myInterval = 3000;
  //itemsPerSlide = 5;
  //singleSlideOffset = true;
  galleryOptions: NgxGalleryOptions[];
  galleryImages: NgxGalleryImage[];
  ImageData: any;
  imgags: string[];
  galleryImagesEventWise: NgxGalleryImage[];
  galleryImagesEventIdWise:any;
  PosterImage:any;

  public carouselTileOneItems: Array<any> = [];
  public carouselTileOne: NgxCarousel;

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
    private EventService: EventService
  ) {


  }
  openModal(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template);
  }

  resolved(captchaResponse: string) {

  }

  eventView: Boolean = false;
  EventDetails: any;
  EventID: number;
  BannerImage: any;
 
 
  goToEvent(EventID: any, Image: any) {
    window.scroll(0, 0);
    this.spinnerService.show();
    this.BannerImage = Image;
    this.EventListStatus = false;
    this.EventID = EventID;
    var latLng;
    localStorage.removeItem("lattlngt");
    this.EventService.GetEventDetailIdWiseHome(2, this.EventID).subscribe(res => {
      this.Dbresponse = res;
      if (this.Dbresponse != null) {
        this.EventDetails = this.Dbresponse.adminGetEventDetailIdWise[0];
       
        this.PosterImage = this.EventDetails.lstEventPoster[0]? this.EventDetails.lstEventPoster[0]:'';
        latLng = this.EventDetails.lattitude + ',' + this.EventDetails.longitutde;
        // this.GetLocation.callMethodForEvent(latLng);
        this.galleryImagesEventIdWise = this.EventDetails.lstEventGallery;
        this.galleryImagesEventWise = this.galleryImagesEventIdWise.map(item => ({ small: item.imagePath, medium: item.imagePath, big: item.imagePath, description: item.description != '' ? item.description : '' }));
        localStorage.setItem("lattlngt", latLng);
        this.eventView = !this.eventView;
        this.spinnerService.hide();

      }
      else {
        this.EventDetails = [];
      }

    });

  }


  scroll(el) {
    el.scrollIntoView();
  }

  ngOnInit() {
    this.imgags = [
      'assets/bg.jpg',
      'assets/car.png',
      'assets/canberra.jpg',
      'assets/holi.jpg'
    ];

    this.carouselTileOne = {
      grid: { xs: 1, sm: 2, md: 4, lg: 4, all: 0 },
      speed: 600,
      interval: 3000,
      point: {
       visible: true,
       pointStyles: `
         .ngxcarouselPoint {
           list-style-type: none;
           text-align: center;
           padding: 12px;
           margin: 0;
           white-space: nowrap;
           overflow: auto;
           box-sizing: border-box;
         }
         .ngxcarouselPoint li {
           display: inline-block;
           border-radius: 50%;
           background: #6b6b6b;
           padding: 5px;
           margin: 0 3px;
           transition: .4s;
         }
         .ngxcarouselPoint li.active {
             border: 2px solid rgba(0, 0, 0, 0.55);
             transform: scale(1.2);
             background: transparent;
           }
       `
      },
      load: 2,
      loop: true,
      touch: true,
      easing: 'ease',
      animation: 'lazy'
    };
    this.carouselTileOneLoad();
   


    this.galleryOptions = [
      {
        width: '100%',
        height: '400px',
        //thumbnailsColumns: 20,
        //thumbnailsRows:1,
        //imageAutoPlay: true,
        //imageAutoPlayInterval: 3000,
        //imageAutoPlayPauseOnHover: true,
        //fullWidth:true,
        //imageSize:'contain',
        //thumbnailSize:'contain',
        //imageDescription:true,
        //thumbnailsPercent:15,
        //imageAnimation: NgxGalleryAnimation.Zoom
        //layout: "thumbnails-top",
        image: true,
        thumbnails: false,
        //height: "200px",
        //width: '100%',
        imageAutoPlay: true,
        //imageAutoPlayInterval: 3000,
        imageAutoPlayPauseOnHover: true,
        fullWidth: true,
        imageAnimation: NgxGalleryAnimation.Zoom,
        //imageDescription: true,
        imageSize: 'contain',
        previewAutoPlay: true,
        previewAutoPlayPauseOnHover: true,
        //thumbnailsMoveSize: 1,
        imageAutoPlayInterval: 3000,
        imageInfinityMove: true,
        imagePercent: 100,

      },
      // max-width 800
      {
        // breakpoint: 800,
        // width: '100%',
        // height: '500px',
        // imagePercent: 80,
        // thumbnailsPercent: 20,
        // thumbnailsMargin: 20,
        // thumbnailMargin: 20,
        // imageSize:'contain',
        "breakpoint": 500, "width": "100%"

      },
      // max-width 767
      {
        breakpoint: 767,
        preview: true,
        height: "160px",
      },
      // max-width 400
      {
        breakpoint: 400,
        preview: true,
        height: "130px",
      },
      // max-width 350
      {
        breakpoint: 350,
        preview: false,
        height: "120px",
      },
      // max-width 320
      {
        breakpoint: 320,
        preview: true,
        height: "110px",
        //imageAutoPlay: false,
      },
    ];

    ////////////////////////////


    /////////////////////////
    // $('.carousel.carousel-multi-item.v-2 .carousel-item').each(function(){
    //   var next = $(this).next();
    //   if (!next.length) {
    //     next = $(this).siblings(':first');
    //   }
    //   next.children(':first-child').clone().appendTo($(this));

    //   for (var i=0;i<4;i++) {
    //     next=next.next();
    //     if (!next.length) {
    //       next=$(this).siblings(':first');
    //     }
    //     next.children(':first-child').clone().appendTo($(this));
    //   }
    // });

    /////////////////////
    $(".mobile-tgl-menu").click(function () {
      //$('.header .main_menu_bg #bs-example-navbar-collapse-1 ul').slideToggle();
      $(this).siblings('#bs-example-navbar-collapse-1').children('ul').slideToggle();
    });
    localStorage.removeItem("lattlngt");
    this.FilterForm();
    this.GetEventList(this.pagenumber, '', 'init');
    this.GetAllStates();
    this.GetEventPosterImage();
    //this.GetLocation.callMethodForEvent();
  }
  /////////////////////////  Cordinate Details ///////////// 
  FilterEventForm: FormGroup;
  FilterForm() {
    this.FilterEventForm = this.formBuilder.group({
      EvenType: ['', [Validators.nullValidator,]],
      stateId: ['', [Validators.nullValidator,]],
      districtId: ['', [Validators.nullValidator,]],
      Search: ['', [Validators.nullValidator, Validators.compose([CustomValidators.removeSpaces])]],
      filterstartDate: ['', [Validators.nullValidator,]],
      filterendDate: ['', [Validators.nullValidator,]],

    });
  }
  ////////////////// 
  // itemsPerSlide = 5;
  // singleSlideOffset = true;
  // noWrap = true;

  // slides = [
  //   {image: 'https://valor-software.com/ngx-bootstrap/assets/images/nature/1.jpg'},
  //   {image: 'https://valor-software.com/ngx-bootstrap/assets/images/nature/2.jpg'},
  //   {image: 'https://valor-software.com/ngx-bootstrap/assets/images/nature/3.jpg'},
  //   {image: 'https://valor-software.com/ngx-bootstrap/assets/images/nature/4.jpg'},
  //   {image: 'https://valor-software.com/ngx-bootstrap/assets/images/nature/5.jpg'},
  //   {image: 'https://valor-software.com/ngx-bootstrap/assets/images/nature/6.jpg'},
  //   {image: 'https://valor-software.com/ngx-bootstrap/assets/images/nature/7.jpg'},
  //   {image: 'https://valor-software.com/ngx-bootstrap/assets/images/nature/8.jpg'},
  //   {image: 'https://valor-software.com/ngx-bootstrap/assets/images/nature/1.jpg'},
  //   {image: 'https://valor-software.com/ngx-bootstrap/assets/images/nature/2.jpg'}
  // ];




  ////////////////////////
  PosterEvent: any = [];
  GetEventPosterImage() {
    try {
      this.EventService.GetEventPosterImage().subscribe(res => {
        this.Dbresponse = res
        if (this.Dbresponse != null) {
          this.PosterEvent = this.Dbresponse.objEventPoster;
          this.ImageData = this.PosterEvent;
          this.galleryImages = this.ImageData.map(item => ({ small: item.posterImagePath, medium: item.posterImagePath, big: item.posterImagePath, description: item.eventDescription != '' ? item.eventDescription : '' }));
        }
      });
    } catch  { }
  }
  public myfunc(event: Event) {

  }
  onmoveFn(data) {
    // console.log(data);
  }
  
   public carouselTileOneLoad() {
    const len = this.carouselTileOneItems.length;
    if (len <= 30) {
      for (let i = len; i < len + 15; i++) {
        this.carouselTileOneItems.push(
          this.imgags[Math.floor(Math.random() * this.imgags.length)]
        );
      }
    }
  }

  
  ///////////////////////
  State: any = [];
  Dbresponse: any;
  private GetAllStates() {
    try {
      this.masterService.GetAllStates().subscribe(res => {
        this.Dbresponse = res
        if (this.Dbresponse != null) {
          this.State = this.Dbresponse;
        }

      });
    } catch  { }
  }

  onChangeState(statename: any) {

    this.GetAllDistrict(statename);
  }
  district: any = [];
  GetAllDistrict(id: any) {
    try {
      if (id != null && id != '') {
        // this.district = [];
        this.masterService.GetAllDistrict(id).subscribe(res => {
          this.district = res;
          if (this.district != null && this.district.length > 0) {
            this.district = this.district;

          }
          else {
            this.district = [];
          }
        });
      }
      else {
        this.district = [];
      }
    } catch  { }
  }


  /////////////
  //////////////////  scroll function //////////
  @HostListener('window:scroll', ['$event'])
  scrollHandler(event) {
    if (this.EventListStatus) {
      let pos = (document.documentElement.scrollTop || document.body.scrollTop) + document.documentElement.offsetHeight;
      let max = document.documentElement.scrollHeight;
      // if (pos >= (0.8 * max)) {
      if ($(window).scrollTop() == ($(document).height() - $(window).height())) {
        if (this.delay) {
          return
        }
        this.delay = true;
        if (this.GetRegisteredEventList.length >= 10 && this.EventListStatus) {
          this.pagenumber = this.pagenumber + 1;
          this.GetEventList(this.pagenumber, 'scroll', '');
        }
      }
    }
  }
  ////////////////////
  EventReset() {
    this.FilterEventForm.reset();
    this.pagenumber = 0;
    this.GetEventList(this.pagenumber, '', 'init');

  }
  //////////////////////////////  
  response: any = [];
  GetRegisteredEventList: any = [];
  from: any;
  pagenumber: number = 0;
  delay: boolean = false;
  EventListStatus: boolean = true;
  GetEventList(pagenumber: any, from: any, src: any) {
    this.spinnerService.show();
    this.pagenumber = pagenumber;
    this.from = from;
    this.from = from;
    var Data = {
      "eventFlag": this.FilterEventForm.value.EvenType != 'undefined' && this.FilterEventForm.value.EvenType != '' && this.FilterEventForm.value.EvenType != null ? this.FilterEventForm.value.EvenType : "",
      "stateId": this.FilterEventForm.value.stateId != 'undefined' && this.FilterEventForm.value.stateId != '' && this.FilterEventForm.value.stateId != null ? this.FilterEventForm.value.stateId : 0,
      "districtId": this.FilterEventForm.value.districtId != 'undefined' && this.FilterEventForm.value.districtId != '' && this.FilterEventForm.value.districtId != null ? this.FilterEventForm.value.districtId : 0,
      "eventType": this.FilterEventForm.value.EvenType != 'undefined' && this.FilterEventForm.value.EvenType != '' && this.FilterEventForm.value.EvenType != null ? this.FilterEventForm.value.EvenType : 0,
      "searchKey": this.FilterEventForm.value.Search != 'undefined' && this.FilterEventForm.value.Search != '' && this.FilterEventForm.value.Search != null ? this.FilterEventForm.value.Search : "",
      "startDate": this.FilterEventForm.value.filterstartDate != 'undefined' && this.FilterEventForm.value.filterstartDate != '' && this.FilterEventForm.value.filterstartDate != null ? this.FilterEventForm.value.filterstartDate : null,
      "endDate": this.FilterEventForm.value.filterendDate != 'undefined' && this.FilterEventForm.value.filterendDate != '' && this.FilterEventForm.value.filterendDate != null ? this.FilterEventForm.value.filterendDate : null,
      "pagenumber": this.pagenumber,
      "REGISTRATIONSTATUS": 0

    }
    if (this.from == 'scroll') {
      this.EventService.RegisteredEventList(Data).subscribe(res => {
        this.response = res;
        this.spinnerService.hide();
        if (this.response.lstRojgaarEventList != null) {
          this.GetRegisteredEventList = this.GetRegisteredEventList.concat(this.response.lstRojgaarEventList);
          this.from = 'scroll';
        } else {
          //this.batchcodeId = [];
          this.from = '';
        }
        this.delay = false;
      });
    } else {
      this.EventService.RegisteredEventList(Data).subscribe(res => {
        this.response = res;
        this.spinnerService.hide();
        if (this.response.lstRojgaarEventList != null) {
          this.GetRegisteredEventList = this.response.lstRojgaarEventList;
          this.from = '';
        }
        else {
          // this.batchcodeId=[];
          this.from = '';
        }
        this.delay = false;
        this.EventListStatus = true;
      });
    }

  }
  // Start Feed Back form work Done By Pankaj Joshi

  btnsts: boolean = true;
  ///////////// Remove Specail Char //////////////
  removeSpecialnamechar(event) {
    var regex = new RegExp("^[0-9+?=.*!;:,/><}`~{|)(_'@#$%^&*]+$");
    var key = String.fromCharCode(event.charCode ? event.which : event.charCode);
    if (regex.test(key)) {
      // event.preventDefault();
      return false;
    }
    var keycode = event.which;
    if (keycode == 34 || keycode == 92 || keycode == 45 || keycode == 91 || keycode == 93) {
      //event.preventDefault();
      return false;
    }
  }
  ////////////////////// End Reomve Special Char ////////////////

  ///////////// Remove Specail Char //////////////
  removeSpecialemailchar(event) {
    var regex = new RegExp("^[+?=*!;:,/><}`~{|)(_'#$%^&*]+$");
    var key = String.fromCharCode(event.charCode ? event.which : event.charCode);
    if (regex.test(key)) {
      // event.preventDefault();
      return false;
    }
    var keycode = event.which;
    if (keycode == 34 || keycode == 92 || keycode == 45 || keycode == 91 || keycode == 93) {
      // event.preventDefault();
      return false;
    }
  }
  ////////////////////// End Reomve Special Char ////////////////
  decimals(e) {
    if (e.keyCode === 190 || e.keyCode == 110) {
      return false;
    }
    if (e.keyCode === 189) {
      return false;
    }
  }
  ////////////// Events Back /////////////////////////
  EventsBack() {
    this.EventListStatus = true;
    this.eventView = false;
    this.EventID = 0;
  }

}

