import { Component, forwardRef, Input, OnInit, Provider } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { MAT_MOMENT_DATE_ADAPTER_OPTIONS, MomentDateAdapter } from '@angular/material-moment-adapter';
import { DateAdapter, ErrorStateMatcher, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';

const DATE_FORMATS = {
  parse: {
    dateInput: 'YYYY-MM-DD',
  },
  display: {
    dateInput: 'YYYY-MM-DD',
    monthYearLabel: 'YYYY년 M월',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'YYYY년 M월'
  }
};

const CONTROL_ACCESSOR: Provider = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => DateTimeControlComponent),
  multi: true,
};

@Component({
  selector: 'sw-date-time-control',
  templateUrl: './date-time-control.component.html',
  styleUrls: ['./date-time-control.component.scss'],
  providers: [
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS]
    },
    {
      provide: MAT_DATE_FORMATS,
      useValue: DATE_FORMATS
    },
    CONTROL_ACCESSOR
  ],
})
export class DateTimeControlComponent implements ControlValueAccessor, OnInit {

  private onChange: any;
  private onTouched: any;

  hoursOptions = Array.from({ length: 24 }, (x, i) => i);
  minutesOptions = Array.from({ length: 60 }, (x, i) => i);

  dateTime = {
    date: null,
    hours: null,
    minutes: null,
  };

  @Input() errorStateMatcher: ErrorStateMatcher;

  constructor() {
  }

  changeDate(date: Date): void {
    this.dateTime.date = date;
    this.change();
  }

  changeHours(hours: number): void {
    this.dateTime.hours = hours;
    this.change();
  }

  changeMinutes(minutes: number): void {
    this.dateTime.minutes = minutes;
    this.change();
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  writeValue(obj: any): void {
    const dateTime = obj || null;

    if (dateTime) {
      const d = new Date(dateTime);
      this.dateTime.date = new Date(
        `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
      );
      this.dateTime.hours = d.getHours();
      this.dateTime.minutes = d.getMinutes();
    }
  }

  private change(): void {
    if (Object.keys(this.dateTime).every(key => this.dateTime[key] !== null)) {
      const dateTime = new Date(this.dateTime.date);
      dateTime.setHours(this.dateTime.hours);
      dateTime.setMinutes(this.dateTime.minutes);
      this.onChange(dateTime);
    } else {
      this.onChange(null);
    }
  }

  ngOnInit(): void {
  }
}
