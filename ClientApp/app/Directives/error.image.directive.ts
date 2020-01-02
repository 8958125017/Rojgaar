import { Component, Directive, Output, EventEmitter, Input, SimpleChange } from '@angular/core'
import { Observable } from 'rxjs/Observable';
import { Observer } from 'rxjs/Observer';
import 'rxjs/Rx';

@Directive({
  selector: 'img[default]',
  host: {
    '(error)': 'updateUrl()',
    '[src]': 'src'
  }
})
export class DefaultImage {
  @Input() src: string;
  @Input() default: string;

  updateUrl() {
    this.src ="/assets/img/profile-image.jpg";
  }
}
