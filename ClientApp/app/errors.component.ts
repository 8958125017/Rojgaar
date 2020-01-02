import { Component, Input } from '@angular/core';
import { AbstractControlDirective, AbstractControl } from '@angular/forms';

@Component({
  selector: 'errors',
  template: `
    <ul *ngIf="showErrors()" class="error-msg">
      <li style="color: red" *ngFor="let error of errors()">{{error}}</li>
    </ul>
  `,
})
export class ErrorsComponent {

  private static readonly errorMessages = {
    'required': () => 'This field is required',
    'minlength': (params) => 'The min number of characters is ' + params.requiredLength,
    'maxlength': (params) => 'The max allowed number of characters is ' + params.requiredLength,
    'pattern': (params) => 'The required pattern is: ' + params.requiredPattern,
    'age': (params) => params.message,
    'MatchPassword': (params) => 'Password not match',
    'vaildEmail': (params) => params.message ,
    'validName': (params) => ' Name is not Valid' ,
    'validPine': (params) => ' Pin code is not Valid'+params.message ,
    'validMobile': (params) => params.message ,
    'validpanformate': (params) => params.message ,
    'validgdteenformate': (params) => params.message,
    'PasswordPolicy': (params) => params.message,



  };

  @Input()
  private control: AbstractControlDirective | AbstractControl;

  showErrors(): boolean {
    return this.control &&
      this.control.errors &&
      (this.control.dirty || this.control.touched);
  }

  errors(): string[] {
    return Object.keys(this.control.errors)
      .map(field => this.getMessage(field, this.control.errors[field]));
  }

  private getMessage(type: string, params: any) {
    return ErrorsComponent.errorMessages[type](params);
  }

}


import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
  
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  declarations: [
    ErrorsComponent
  ],
  exports: [
    ErrorsComponent
  ]
})
export class ErrorsModule { }

