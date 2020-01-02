import { Component, HostListener } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { AppConfig } from '../../../Globals/app.config';
import { AuthenticationService } from '../../../Services/authenticate.service';
import { BsModalRef } from 'ngx-bootstrap';
import { FormBuilder } from '@angular/forms';
declare var jquery: any;
declare var $: any;
@Component({
  selector: 'app-layout',
  templateUrl: './Secure-Layout.Component.html'
})
export class SecureLayoutComponent {
  constructor(
    private authenticationService: AuthenticationService
    , private cookieService: CookieService
  
    , private router: Router
    , private formBuilder: FormBuilder

  ) {


  }

  ngOnInit() {
    function resize() {
      var x = window.innerHeight;
     // alert(x);      
      $('#dashRightPart').css({ "height" : x });
    };
    resize();
    window.onresize = function () {       
      resize();
    };
  }


}

