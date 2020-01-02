import { NgModule } from '@angular/core';
import { AccordionModule } from 'ngx-bootstrap/accordion'
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { ModalModule } from 'ngx-bootstrap/modal';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { ProgressbarModule} from 'ngx-bootstrap';
import { CarouselModule } from 'ngx-bootstrap/carousel';
import { CollapseModule } from 'ngx-bootstrap/collapse';
@NgModule({
  imports: [AccordionModule.forRoot(), CollapseModule.forRoot(), CarouselModule.forRoot(), BsDropdownModule.forRoot(), ModalModule.forRoot(), TabsModule.forRoot(),  ProgressbarModule.forRoot()],
  exports: [AccordionModule, BsDropdownModule, CollapseModule, CarouselModule, ModalModule, TabsModule, ProgressbarModule],
  declarations: [],
  providers: []
})

export class SharedBootstrapModule {

}  
