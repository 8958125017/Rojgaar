//import { Component, OnInit, Input, OnChanges, ElementRef, Output, EventEmitter, HostListener } from '@angular/core';

//@Component({
//  // moduleId: module.id,
//  selector: 'fdms-month-picker',
//  template: `<div class="input-group fdms-mp-input">
//    <input type="text" readonly value="{{model|date: 'MM/yyyy'}}" class="form-control"  />
//    <span class="input-group-addon" (click)="onCalendarIconClick()"><i class="fa fa-calendar"></i></span>
//    <div class="fdms-month-picker" *ngIf="__monthPicker.state=='open'">
//    <div class="col-md-12 d-title">{{__monthPicker.selectedMonth}}, {{__monthPicker.selectedYear}}</div>
//    <div class="col-md-12 d-nav">
//    <div class="col-md-3" (click)="onPrevYearSelection()"><span ><</span></div>
//    <div class="col-md-6"><span (click)="switchToYearMode()">{{__monthPicker.displayYear}}</span></div>
//    <div class="col-md-3"><span (click)="onNextYearSelection()">></span></div>
//    </div>
//    <div class="col-md-12 d-selection-wraper">
//    <div class="col-md-3 d-selection-item" *ngFor="let item of __monthPicker.selectionItems">
//                <span (click)="onselectionItemClick(item)">{{item.text}}</span></div>
//    </div>
//    <div class="col-md-12 d-actions">
//            <span class="d-action d-action-cancel" (click)="onCancel()">Cancel</span></div>
//    </div>
//    </div>`
//})
//export class monthPickerDirective implements OnInit, OnChanges {
//  @Input() model: string | Date;
//  @Input() config: ImonthPickerConfig;
//  @Output() modelChange = new EventEmitter();
//  __monthPicker: monthPicker;
//  constructor(private _elementRef: ElementRef) {
//    this.__monthPicker = new monthPicker();
//  }
//  ngOnInit() {
//  }
//  ngOnChanges(changes: any) {
//    if (this.model) {
//      this.__monthPicker.setCurrentdate(new Date(this.model));
//    }
//  }

//  onCalendarIconClick() {
//    this.switchToMonthMode();
//    this.__monthPicker.setCurrentdate(this.model ? new Date(this.model) : new Date());
//    this.__monthPicker.toggleState();
//  }
//  switchToYearMode() {
//    this.__monthPicker.viewMode = 'y';
//    this.__monthPicker.fillYearsInSelectionList();
//  }
//  switchToMonthMode() {
//    this.__monthPicker.viewMode = 'm';
//    this.__monthPicker.fillMonthsInSelectionList();
//  }
//  onselectionItemClick(item: IDatePickerSelectionItem) {
//    if (item.type == 'y') {
//      this.__monthPicker.displayYear = item.value;
//      this.switchToMonthMode();
//    } else if (item.type == 'm') {
//      this.onSelectMonth(item);
//    }
//  }
//  onSelectMonth(item: IDatePickerSelectionItem) {
//    this.__monthPicker.displayMonth = item.text;
//    this.__monthPicker.displayMonthIndex = item.value;

//    this.__monthPicker.selectedMonth = item.text;
//    this.__monthPicker.selectedMonthIndex = item.value;
//    this.__monthPicker.selectedYear = this.__monthPicker.displayYear;

//    this.model = (this.__monthPicker.selectedMonthIndex + 1) + "/01/" + this.__monthPicker.selectedYear;
//    //this.model = new Date(this.__monthPicker.selectedYear, this.__monthPicker.selectedMonthIndex, 1);
//    this.__monthPicker.state = "closed";
//    this.modelChange.next(this.model);
//  }

//  onPrevYearSelection() {
//    this.__monthPicker.displayYear--;
//    if (this.__monthPicker.viewMode == 'y') { this.__monthPicker.fillYearsInSelectionList(); }
//  }
//  onNextYearSelection() {
//    this.__monthPicker.displayYear++;
//    if (this.__monthPicker.viewMode == 'y') { this.__monthPicker.fillYearsInSelectionList(); }
//  }

//  onCancel() {
//    this.__monthPicker.state = "closed";
//  }

//  @HostListener('document:click', ['$event', '$event.target'])
//  public onClick(event: MouseEvent, targetElement: HTMLElement): void {
//    if (!targetElement) {
//      return;
//    }

//    const clickedInside = this._elementRef.nativeElement.contains(targetElement);
//    if (!clickedInside) {
//      this.__monthPicker.state = "closed";
//    }
//  }
//}
//export interface ImonthPickerConfig {
//  readonly?: boolean;
//  cssClass?: string;
//  placeHolder?: string;
//}
//export interface IDatePickerSelectionItem {
//  text: string;
//  value: number;
//  type: string;
//}
//class monthPicker {
//  state: string;
//  selectionItems: Array<IDatePickerSelectionItem>;
//  selectedMonth: string;
//  selectedMonthIndex: number;
//  selectedYear: number;
//  displayMonth: string;
//  displayMonthIndex: number;
//  displayYear: number;
//  viewMode: string;
//  private months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
//  constructor() {
//    this.state = "closed";
//    this.viewMode = 'm';
//    this.fillMonthsInSelectionList();
//    let currentDate = new Date();
//    this.setCurrentdate(currentDate);
//  }
//  toggleState() {
//    this.state = this.state == "closed" ? "open" : "closed";
//  }

//  fillMonthsInSelectionList() {
//    this.selectionItems = [];
//    this.months.forEach((v: string, i: number) => this.selectionItems.push({ text: v, value: i, type: 'm' }));
//  }
//  fillYearsInSelectionList() {
//    this.selectionItems = [];
//    for (let start = this.displayYear - 6; start <= this.displayYear + 5; start++) {
//      this.selectionItems.push({ text: start.toString(), value: start, type: 'y' });
//    }
//  }
//  setCurrentdate(currentDate: Date) {
//    this.displayMonth = this.months[(currentDate.getMonth() - 1)];
//    this.displayMonthIndex = currentDate.getMonth();
//    this.displayYear = currentDate.getFullYear();

//    this.selectedMonth = this.displayMonth;
//    this.selectedMonthIndex = this.displayMonthIndex;
//    this.selectedYear = this.displayYear;
//  }
//}
