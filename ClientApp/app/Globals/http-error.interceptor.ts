import { Injectable, HostListener } from '@angular/core';
import {
  HttpInterceptor,
  HttpRequest,
  HttpResponse,
  HttpErrorResponse,
  HttpHandler,
  HttpEvent
} from '@angular/common/http';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';
import 'rxjs/add/observable/of';
import { CookieService } from 'ngx-cookie-service';
import { AppConfig } from '../Globals/app.config';
// import { ErrorHandler } from './Globals/error_handler';
import { TimeoutError } from 'rxjs';
import { Router } from '@angular/router';


@Injectable()
export class HttpErrorInterceptor implements HttpInterceptor {
  constructor(private _cookieService: CookieService, private config: AppConfig, public router: Router) {
  }
  lsUserInfo: any;
  ckUserInfo: any;
  imagepath: any;
  newimagepath: any;
  UserInfo: any;

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {  
      return next.handle(request).do((event: HttpEvent<any>) => {
        if (event instanceof HttpResponse) {
        }
      }, (err: any) => {
       
        if (err instanceof HttpErrorResponse) {
          //this.errorHandler.handleError(err);
          if (err.status === 404) {  
            // localStorage.removeItem('UserInfo');
            // this._cookieService.deleteAll('/', this.config.DomainName);
           
            // window.location.href = "/login?for=login";
            return Observable.empty();
          }
          else if (err.status === 402)
          {
            return Observable.empty;
          }
          else {
            return Observable.throw(err);
          }
        }

        if (err instanceof TimeoutError) {
          return Observable.throw("Timeout has occurred");
        }
      });
  }
}