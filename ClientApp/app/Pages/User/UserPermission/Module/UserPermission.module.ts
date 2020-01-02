import { NgModule, NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ErrorsModule } from '../../../../errors.component';
import { AppConfig } from '../../../../Globals/app.config';
import { AuthenticationService } from '../../../../Services/authenticate.service';
import { AuthGuard } from '../../../../Guards/auth.guard';
import { UserPermissionComponent } from '../UserPermission.Component';
import { UserPermissionRoutes } from './UserPermission.routes';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ErrorsModule,
    ReactiveFormsModule,
    RouterModule.forChild(UserPermissionRoutes)
  ],
  declarations: [
    UserPermissionComponent
  ],

  schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
})
export class UserPermissionModule { }

