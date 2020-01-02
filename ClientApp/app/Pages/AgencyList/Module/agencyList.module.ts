import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { CommonModule } from "@angular/common";
import { ErrorsModule } from "../../../errors.component";
import { RouterModule } from "@angular/router";
import { AgencyListComponent } from "../agencyList.component"; 
import { AppConfig } from "../../../Globals/app.config"; 
import { AccordionModule, TypeaheadModule } from 'ngx-bootstrap';
import { HttpClientModule } from '@angular/common/http';
import { AgencyListRoutes } from './agencyList.routes';
import { Ng5SliderModule } from 'ng5-slider';
import { AgencyListService } from '../../../Services/agencylist.service';
@NgModule({
  imports: [
    FormsModule,
    CommonModule,
    AccordionModule,
    HttpClientModule,  
    TypeaheadModule,
    ReactiveFormsModule,
    ErrorsModule,
    Ng5SliderModule,
    RouterModule.forChild(AgencyListRoutes )  
  ],
  declarations: [
    AgencyListComponent,
  ],
  providers: [
      AgencyListService,
      AppConfig,       
  ],
})
export class AgencyListModule { }

