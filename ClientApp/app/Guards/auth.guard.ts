import { HostListener, Injectable } from '@angular/core';
import { CanActivate, CanDeactivate, Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { AppConfig } from '../Globals/app.config';
@Injectable()
export class AuthGuard implements CanActivate {
  lsUserInfo: any;
  ckUserInfo: any;
  constructor(private router: Router, private config: AppConfig, private _cookieService: CookieService
  ) { }

  canActivate() {    
    const host = window.location.host;
    var isverified=JSON.parse(sessionStorage.getItem('isverified'));
    if (this._cookieService.get('UserInfo') != null) {
      this.ckUserInfo = JSON.stringify(this._cookieService.get('UserInfo'));
      if (localStorage.getItem('UserInfo')) {
        this.lsUserInfo = this.config.UserInfo;
        if (this.lsUserInfo.token === this.ckUserInfo.token ) {         
          return true; 
        } else if(isverified){
          return true; 
        } else{
          this.config.UserInfoDetails();
          return true;
        }
      } else {
        localStorage.removeItem('UserInfo');
        this._cookieService.deleteAll('/', this.config.DomainName);
        this.router.navigate(['/']);       
        return false;
      }

    }
  }
}


@Injectable()
export class CanDeactivateGuard implements CanDeactivate<ComponentCanDeactivate> {
  canDeactivate(component: ComponentCanDeactivate): boolean {
    if (!component.canDeactivate()) {
      if (confirm("Your Online examination running! If you leave to click ok button other otherwise cancel button.")) {
        return true;
      } else {
        return false;
      }
    }
    return true;
  }
}


export abstract class ComponentCanDeactivate {
  abstract canDeactivate(): boolean;
  @HostListener('window:beforeunload', ['$event'])
  unloadNotification($event: any) {
    if (!this.canDeactivate()) {
      $event.returnValue = true;
    }
  }
}


  
