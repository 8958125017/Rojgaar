import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { AppConfig } from '../Globals/app.config';
import { Observable } from 'rxjs/Observable';
import { environment } from '../../environments/environment';



@Injectable()
export class AgencyListService {
  constructor(private httpClient: HttpClient, private http: Http, private config: AppConfig) { }
  GetAllAgency(pageNumber:any):Observable<any> {   
       const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json'}) };
        return this.httpClient.get(environment.apiUrl + 'Agency/GetAgencyListForEmployer/'+ pageNumber,httpOptions);
      }
}
