import { Component } from '@angular/core';
import { NgProgress } from 'ngx-progressbar';
import { Router, RouterEvent, NavigationStart, NavigationEnd, NavigationCancel, NavigationError } from '@angular/router';
import { AppConfig } from './Globals/app.config';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'app';
  showLoader: number = 0;
  
  constructor(public ngProgress: NgProgress
    , private router: Router
    , private appConfig: AppConfig
  ) {
  
  }
  ngOnInit() {
    /** request started */
     
    this.router.events.subscribe((event: RouterEvent) => {
      //this.appConfig.SetUserInfoDetails(localStorage.getItem("UserInfo"));
      this.appConfig.UserInfoDetails();
      this.navigationInterceptor(event);
      window.scroll(0, 0);
    })
     
  }
  // Shows and hides the loading spinner during RouterEvent changes
  navigationInterceptor(event: RouterEvent): void {
    if (event instanceof NavigationStart) {
      this.ngProgress.start();
    }
    if (event instanceof NavigationEnd) {
      this.ngProgress.done();
    }

    // Set loading state to false in both of the below events to hide the spinner in case a request fails
    if (event instanceof NavigationCancel) {
      this.ngProgress.done();
    }
    if (event instanceof NavigationError) {
      this.ngProgress.done();
    }
  }

}
