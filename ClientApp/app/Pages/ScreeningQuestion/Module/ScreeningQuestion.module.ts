import { NgModule, NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ErrorsModule } from '../../../errors.component';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { SharedBootstrapModule } from '../../../shared-bootstrap.module';
import { AuthGuard } from '../../../Guards/auth.guard';
import { ScreeningQuestionComponent } from '../ScreeningQuestion.Component';
import { ScreeningQuestionRoutes } from './ScreeningQuestion.routes';
import { Ng5SliderModule } from 'ng5-slider';
import { ScreeningQuestionService } from '../../../Services/screeningQuestion.service';
import { DataTableModule} from 'primeng/datatable';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ErrorsModule,
    InfiniteScrollModule,
    ReactiveFormsModule,
    SharedBootstrapModule,
    RouterModule.forChild(ScreeningQuestionRoutes),
    Ng5SliderModule,
    DataTableModule
  ],
  declarations: [
    ScreeningQuestionComponent
  ],
  providers: [    
    AuthGuard,
    ScreeningQuestionService 
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
})

  export class ScreeningQuestionModule { }

