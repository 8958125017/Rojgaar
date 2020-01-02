import { NgModule } from '@angular/core';
import { KeepHtml } from './Pipes/keepHtml.Pipes';
import { IntToFloat }  from './Pipes/custom.Pipes'
import { GeoLocationCommonComponent } from './Pages/GeoLocationCommon/geo-location-common.component';
import { PublicFooterComponent } from './Pages/Layouts/Public/Footer/Public-Footer.Component';
import { PublicHeaderComponent } from './Pages/Layouts/Public/Herder/Public-Header.Component';
import { RouterModule } from '@angular/router';
@NgModule({
  imports: [
    RouterModule
  ],
  declarations: [  
    KeepHtml,
    IntToFloat,
    GeoLocationCommonComponent,
    PublicFooterComponent,
    PublicHeaderComponent
  ],
   exports: [
    KeepHtml,
    IntToFloat,
    GeoLocationCommonComponent,
    PublicFooterComponent,
    PublicHeaderComponent
  ],
})
export class SharedModule {}

