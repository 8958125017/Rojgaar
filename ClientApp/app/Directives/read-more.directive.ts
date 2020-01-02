import { Component, Input, OnChanges } from '@angular/core';
@Component({
  selector: 'read-more',
  template: `
        <p [innerHTML]="currentText"></p>
        <span *ngIf="showToggleButton">
            <a (click)="toggleView()">Read {{isCollapsed? 'more':'less'}}</a>
        </span>`
})

export class ReadMoreDirective implements OnChanges {

  @Input('text') text: string;
  @Input('maxLength') maxLength: number = 100;
  @Input('showToggleButton') showToggleButton: boolean;

  currentText: string;

  public isCollapsed: boolean = true;

  constructor(
    //private elementRef: ElementRef
  ) {

  }
  toggleView() {
    this.isCollapsed = !this.isCollapsed;
    this.determineView();
  }

  determineView() {

    if (this.text.length <= this.maxLength) {
      this.currentText = this.text;
      this.isCollapsed = false;
      this.showToggleButton = false;
      return;
    }

    if (this.isCollapsed == true) {
      this.currentText = this.text.substring(0, this.maxLength);
      this.currentText = this.currentText.substr(0, Math.min(this.currentText.length, this.currentText.lastIndexOf(" ")))
      this.currentText = this.currentText + "..."
    } else if (this.isCollapsed == false) {
      this.currentText = this.text;
    }

  }

  ngOnChanges() {
    if (!this.validateSource(this.text)) {
      //throw 'Source must be a string.';

    }
    else {
      this.determineView();
    }
  }

  validateSource(s) {
    if (typeof s !== 'string') {
      return false;
    } else {
      return true;
    }
  }
}
