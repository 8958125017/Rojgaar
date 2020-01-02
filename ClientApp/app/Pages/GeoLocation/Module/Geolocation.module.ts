 //import {GeolocationComponent } from '../Geolocation.Component'
import { GeolocationRoutes } from "./Geolocation.routes";
import { RouterModule } from "@angular/router";
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from "@angular/forms";

@NgModule({
    declarations: [
     //   GeolocationComponent
    ],
    imports: [
     FormsModule,
     ReactiveFormsModule,
     RouterModule.forChild(GeolocationRoutes ) 
    ],
    exports: [
     //   GeolocationComponent
      ],
    providers: [],
  
  })

export class GeolocationModule { }