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
import * as $ from 'jquery';

@Component({
  selector: 'app-Left-Sidebar',
  templateUrl: './Left-Sidebar.Component.html'
})
export class LeftSidebar {
  UserInfo: any;
  loginType:any="Agency";
  constructor(private appConfig: AppConfig) {
    this.UserInfo = appConfig.UserInfo;   
  }

  ngOnInit() {

    if ($(window).width() > 1024) {
      $('.side-menu').click(function () {
        $('.dash-left-part').toggleClass('dash-left-active');
        $('.dash-right-part').toggleClass('dash-right-active');
        $('body').toggleClass('sm-active');
        $('.side-menu').toggleClass('sidemenu-active');
        $('.side-menu').find('i').toggleClass('fa-chevron-left fa-chevron-right');
      });
    }
    else {
      //alert('More than 960');
    }

    if ($(window).width() < 1024 && $(window).width() > 767) {
      $('.dash-left-part').addClass('dash-left-active');
      $('.dash-right-part').addClass('dash-right-active');
      $('.side-menu').addClass('sidemenu-active');
      $('.side-menu').find('i').addClass('fa-chevron-right');
      $('body').addClass('sm-active');
      $('.side-menu').click(function () {
        $('.dash-left-part').toggleClass('dash-left-active');
        $('.dash-right-part').toggleClass('dash-right-active');
        $('body').toggleClass('sm-active');
        $('.side-menu').toggleClass('sidemenu-active');
        $('.side-menu').find('i').toggleClass('fa-chevron-right');
      });
    }
    else {
      //alert('More than 960');
    }
    //New side bar slidetoggle
    $('.left-nav .panel-heading').click(function () {
      $(this).next('.panel-collapse').slideToggle();
      $(this).parent().siblings().children('.panel-collapse').slideUp();
      $(this).find('.arrow').toggleClass('rotated');
      $(this).parent().siblings().find('.arrow').removeClass('rotated');
    });

    
    $(".left-sm-nav-tgl").click(function () {
      $('.dash-left-part').toggleClass('active');
      //$('body').toggleClass('sm-nav-active');
    });

    $('.left-nav ul li a').click(function () {
      //$('body').removeClass('sm-nav-active');
    });
    //add active navigations
    //$(function () {
    //  var current = location.pathname;
    //  $('.left-nav ul li a').each(function () {
    //    var $this = $(this);
    //    // if the current path is like this link, make it active
    //    if ($this.attr('href').indexOf(current) !== -1) {
    //      $(this).parent().addClass('active');
    //      $(this).parent().parent().parent().parent().addClass('in');
    //      $(this).parent().parent().parent().parent().addClass('in');
    //      $(this).parent().parent().parent().parent().siblings().find('.arrow').addClass('rotated');
    //      //$(this).addClass('active');
    //    }
    //  });
    //});


  }
}




