import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { FormBuilder, Validators, FormGroup, AbstractControl } from '@angular/forms';
import { AuthenticationService } from '../../../../Services/authenticate.service';
import { CookieService } from 'ngx-cookie-service';
import { AppConfig } from '../../../../Globals/app.config';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
import { Http } from '@angular/http';
import * as $ from 'jquery';


@Component({
  selector: 'app-PublicHeader',
  templateUrl: './Public-Header.Component.html'
})
export class PublicHeaderComponent { 
  constructor(
      private http: Http,
      private router: Router 
  ) {
  } 
  ngOnInit() {
    
  }
  IndexPage() {
    this.router.navigate(['/index?']);
   // this.jobList = [];

  }
}
