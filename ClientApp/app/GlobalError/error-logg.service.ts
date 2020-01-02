import { Injectable } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { AppConstants } from '../GlobalError/app-constants'
import { ToastrService } from 'ngx-toastr';

@Injectable()
export class ErrorLoggService {

  constructor(private toastrService: ToastrService) { }

  //Log error method
  logError(error: any) {
    //Returns a date converted to a string using Universal Coordinated Time (UTC).
    const date = new Date().toUTCString();

    if (error instanceof HttpErrorResponse) {
      //The response body may contain clues as to what went wrong,
      console.error(date, AppConstants.httpError, error.message, 'Status code:',
        (<HttpErrorResponse>error).status);
    }
    else if (error instanceof TypeError) {
      console.error(date, AppConstants.typeError, error.message, error.stack);
    }
    else if (error instanceof Error) {
      console.error(date, AppConstants.generalError, error.message, error.stack);
    }
    else if (error instanceof ErrorEvent) {
      //A client-side or network error occurred. Handle it accordingly.
      console.error(date, AppConstants.generalError, error.message);
    }
    else {
      console.error(date, AppConstants.somethingHappened, error.message, error.stack);
    }
  }
}
