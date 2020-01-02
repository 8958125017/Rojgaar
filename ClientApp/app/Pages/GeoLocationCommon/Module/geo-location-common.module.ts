import { RouterModule } from "@angular/router";
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { GeoLocationCommonRoutes } from "./geo-location-common.routes";
// import { GeoLocationCommonComponent } from "../geo-location-common.component";


@NgModule({
    declarations: [
      // GeoLocationCommonComponent
    ],
    imports: [
     FormsModule,
     ReactiveFormsModule,
     RouterModule.forChild(GeoLocationCommonRoutes ) 
    ],
    exports: [
      //  GeoLocationCommonComponent
      ],
    providers: [],
  
  })

export class GeoLocationCommonModule { }