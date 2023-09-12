/*
From: https://ng-bootstrap.github.io/#/components/datepicker/examples#range-popup
 */

import {Component, Input, Output, EventEmitter, OnChanges} from '@angular/core';
import {NgbDate, NgbCalendar, NgbDateParserFormatter} from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-ngbd-datepicker-range-popup',
  templateUrl: './datepicker-range-popup.component.html',
  styleUrls: ['../analytics.component.css', './datepicker-range-popup.component.css']
})
export class DatepickerRangePopupComponent implements OnChanges {

  hoveredDate: NgbDate | null = null;

  @Input() fromDate: NgbDate | null = null;
  @Input() toDate: NgbDate | null = null;
  @Output() newFilter = new EventEmitter<boolean>();
  @Output() resetEvent = new EventEmitter<boolean>();
  initialFromDate: NgbDate | null = null;
  initialToDate: NgbDate | null = null;

  ngOnChanges(): void {
    this.initialFromDate = this.fromDate;
    this.initialToDate = this.toDate;
  }

  constructor(private calendar: NgbCalendar, public formatter: NgbDateParserFormatter) {}

  onDateSelection(date: NgbDate): void {
    if (!this.fromDate && !this.toDate) {
      this.fromDate = date;
    } else if (this.fromDate && !this.toDate && date && date.after(this.fromDate)) {
      this.toDate = date;
    } else {
      this.toDate = null;
      this.fromDate = date;
    }
  }

  isHovered(date: NgbDate): boolean | null {
    return this.fromDate && !this.toDate && this.hoveredDate && date.after(this.fromDate) && date.before(this.hoveredDate);
  }

  isInside(date: NgbDate): boolean | null {
    return this.toDate && date.after(this.fromDate) && date.before(this.toDate);
  }

  isRange(date: NgbDate): boolean | null {
    return date.equals(this.fromDate) || (this.toDate && date.equals(this.toDate)) || this.isInside(date) || this.isHovered(date);
  }

  validateInput(currentValue: NgbDate | null, input: string): NgbDate | null {
    const parsed = this.formatter.parse(input);
    return parsed && this.calendar.isValid(NgbDate.from(parsed)) ? NgbDate.from(parsed) : currentValue;
  }

  filter(): void {
    this.newFilter.emit(true);
  }

  reset(): void {
    this.resetEvent.emit(true);
  }

}
