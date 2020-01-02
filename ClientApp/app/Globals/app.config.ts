import { Injectable } from "@angular/core";
import { environment } from '../../environments/environment';
import { Router, ActivatedRoute, Params } from '@angular/router';

import { HttpClient, HttpHeaders } from '@angular/common/http';
import { DatePipe } from "@angular/common";



@Injectable()
export class AppConfig {
 // public ApiEndpoint: string = 'http://localhost:50615/api/';
  public DomainName: string = environment.DomainName;
  public headers = new Headers({ 'Content-Type': 'application/json' });
  public UserInfo: any;
  public loginType:any;
  public Usertoken:any;
  public CountryCode: string = "91";
  public CountryID: any = 103;
  public token:string = sessionStorage.getItem('usertoken');
  isverify:any;
  constructor(private datePipe: DatePipe, private router: Router) {      
      this.UserInfoDetails(); 
  }

  
  UserInfoDetails() {
   //alert(this.usertoken);
    this.UserInfo = {};
    this.UserInfo = JSON.parse(localStorage.getItem("UserInfo"))
    this.Usertoken=sessionStorage.getItem('usertoken');
    this.loginType=sessionStorage.getItem('loginType');
    this.isverify=JSON.parse(sessionStorage.getItem('isverified'));
   // alert(this.loginType);
    if(this.UserInfo && !this.Usertoken)
    {
      //alert("ram");
      //sessionStorage.setItem("usertoken", this.UserInfo )
      //this.Usertoken=sessionStorage.getItem('usertoken');
     // localStorage.removeItem('UserInfo');
      //this.router.navigate(['index']);
    }
    if(!this.UserInfo && !this.Usertoken)
    {
     
    }
   
      if(!this.UserInfo && (this.Usertoken || this.loginType))
      {
        //alert(this.UserInfo);
        //alert(this.Usertoken);
        sessionStorage.clear();
        //this.router.navigate(['/']);
     }
     if(!this.UserInfo && this.Usertoken)
     {
     // this.router.navigate(['index']);
     }
  }
  SetUserInfoDetails(userInfo) {
    localStorage.setItem('UserInfo', JSON.stringify(userInfo));
  }
  transformDate(myDate) {
    this.datePipe.transform(myDate, 'DD-MM-YYYY'); //whatever format you need. 
  }
  isverified(){
    const token = sessionStorage.getItem('usertoken');
      this.isverify = JSON.parse(sessionStorage.getItem('isverified')); 
      if(!this.isverify){
        this.router.navigate(['/companyprofile']);
        return false
      }
  }


  stringToDate(_date, _format, _delimiter) {
    if (_date != null && _date != "") {

      var formatLowerCase = _format.toLowerCase();
      var formatItems = formatLowerCase.split(_delimiter);
      var dateItems = _date.split(_delimiter);
      var monthIndex = formatItems.indexOf("mm");
      var dayIndex = formatItems.indexOf("dd");
      var yearIndex = formatItems.indexOf("yyyy");
      var month = parseInt(dateItems[monthIndex].substr(0, 2));
      month -= 1;
      var formatedDate = new Date(dateItems[yearIndex].substr(0, 4), month, dateItems[dayIndex].substr(0, 2));
      return formatedDate;
    }
    return "";
  }
  isEmpty(str: any) {
    if (str) {
      return false;
    }
    return true;
  }

  toInt(str: any) {
    if (str) {
      return str;
    }
    return 0;
  }
  DownloadFile(FileUrl: string) {
    var url = FileUrl;
    var a = document.createElement('a');
    document.body.appendChild(a);
    a.setAttribute('style', 'display: none');
    a.href = url;
    a.target = "_blank";
    a.download = "File";
    a.click();
    window.URL.revokeObjectURL(url);
    a.remove(); // remove the element
    window.open(url);
  }

 
}
