import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { AppConfig } from '../Globals/app.config';
import { Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { environment } from '../../environments/environment';
import { FormGroup } from '@angular/forms';


@Injectable()
export class WalkinPostService {

  constructor(private httpClient: HttpClient, private http: Http, private config: AppConfig) { }

  AddWalkinId(walkindetail:any):Observable<any> {

     const token = sessionStorage.getItem('usertoken');        // const token = this.config.UserInfo.token;
    const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' , 'Authorization': token}) };
    return this.httpClient.post(environment.apiUrl + 'CandidateWalkIn/CandidateWalkInJob/',walkindetail, httpOptions);
  }

  addWalkinListing(walkinlisting:any,jobId:any):Observable<any> {

     const token = sessionStorage.getItem('usertoken');        // const token = this.config.UserInfo.token;
    const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' , 'Authorization': token}) };
    return this.httpClient.post(environment.apiUrl + 'CandidateWalkIn/SaveWalkInOpening/'+jobId,walkinlisting, httpOptions);
  }

  GetAllWalkin(WalkinId: any):Observable<any> {
     const token = sessionStorage.getItem('usertoken');
     // const token = this.config.UserInfo.token;
    const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' , 'Authorization': token}) };
    return this.httpClient.post(environment.apiUrl + 'CandidateWalkIn/GetCandidateWalkIn/' ,WalkinId , httpOptions);
  }

  getWalkinDetails(walkinid):Observable<any>{
     const token = sessionStorage.getItem('usertoken');        // const token = this.config.UserInfo.token;
    const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' , 'Authorization': token}) };
    return this.httpClient.get(environment.apiUrl + 'CandidateWalkIn/GetWalkInOpening/' + walkinid, httpOptions);
  }

  DeletWalkin(id: any):Observable<any> {
     const token = sessionStorage.getItem('usertoken');        // const token = this.config.UserInfo.token;
    const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': token }) };
    return this.httpClient.get(environment.apiUrl + 'CandidateWalkIn/DeleteWalkInOpening/' + id, httpOptions);
  }

  updatwWalkin(formvalue,walkinid):Observable<any>{

     const token = sessionStorage.getItem('usertoken');        // const token = this.config.UserInfo.token;
    const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' , 'Authorization': token}) };
    return this.httpClient.post(environment.apiUrl + 'CandidateWalkIn/CandidateWalkInJob/'+walkinid,formvalue, httpOptions);

  }

  updateWalkinListing(openingdetail, walkinid):Observable<any>{

     const token = sessionStorage.getItem('usertoken');        // const token = this.config.UserInfo.token;
    const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' , 'Authorization': token}) };
    return this.httpClient.post(environment.apiUrl + 'CandidateWalkIn/UpdateWalkInOpening/' + walkinid,openingdetail, httpOptions);

  }

  GetFilterData(SearchData:any):Observable<any> {

     const token = sessionStorage.getItem('usertoken');        // const token = this.config.UserInfo.token;
    const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json','Authorization': token }) };
  return this.httpClient.post(environment.apiUrl +'CandidateWalkIn/GetCandidateWalkIn/',SearchData, httpOptions);
}

closeWalkin(walkinId:any)
{
  const token = sessionStorage.getItem('usertoken');
   // const token = this.config.UserInfo.token;
  const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' , 'Authorization': token}) };
  return this.httpClient.get(environment.apiUrl + 'job/ClosedJob/' + walkinId , httpOptions);
}

scrapWalkin(walkinid:any)
 {
   const token = sessionStorage.getItem('usertoken');
   // const token = this.config.UserInfo.token;
  const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' , 'Authorization': token}) };
  return this.httpClient.get(environment.apiUrl + 'job/ScrapJob/' + walkinid , httpOptions);
}

DeleteSectorWalking(JobID:any,TblID:any,SecID:any,TradID:any)
 {

   const token = sessionStorage.getItem('usertoken');
   // const token = this.config.UserInfo.token;
  const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' , 'Authorization': token}) };
  const body = JSON.stringify({
        'JobId': JobID, 'Id': TblID
        , 'SectorId': SecID, 'TradeId': TradID
      });
  return this.httpClient.post(environment.apiUrl + 'CandidateWalkIn/DeleteSectorTrade' , body , httpOptions);
}


updateWalkinDate(walkindatedata):Observable<any>{

  const token = sessionStorage.getItem('usertoken');        // const token = this.config.UserInfo.token;
 const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' , 'Authorization': token}) };
 return this.httpClient.post(environment.apiUrl + 'CandidateWalkIn/SaveWalkInOpeningDate' ,walkindatedata, httpOptions);

}


}




