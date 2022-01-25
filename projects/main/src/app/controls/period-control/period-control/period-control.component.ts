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
  useExisting: forwardRef(() => PeriodControlComponent),
  multi: true,
};

@Component({
  selector: 'sw-period-control',
  templateUrl: './period-control.component.html',
  styleUrls: ['./period-control.component.scss'],
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
    CONTROL_ACCESSOR,
  ]
})
export class PeriodControlComponent implements ControlValueAccessor, OnInit {

  private onChange: any;
  private onTouched: any;

  hoursOptions = Array.from({ length: 24 }, (x, i) => i);
  minutesOptions = Array.from({ length: 60 }, (x, i) => i);

  start = {
    date: null,
    hours: null,
    minutes: null,
  };

  end = {
    date: null,
    hours: null,
    minutes: null,
  };

  @Input() errorStateMatcher: ErrorStateMatcher;

  constructor() {
  }

  changeStartDate(date: Date): void {
    this.start.date = date;
    this.change();
  }

  changeStartHours(hours: number): void {
    this.start.hours = hours;
    this.change();
  }

  changeStartMinutes(minutes: number): void {
    this.start.minutes = minutes;
    this.change();
  }

  changeEndDate(date: Date): void {
    this.end.date = date;
    this.change();
  }

  changeEndHours(hours: number): void {
    this.end.hours = hours;
    this.change();
  }

  changeEndMinute(minutes: number): void {
    this.end.minutes = minutes;
    this.change();
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  writeValue(obj: any): void {
    const { start, end } = obj || {};

    const mapping = (date, o) => {
      date = new Date(date);
      // date.setHours(date.getHours() + 9);
      o.date = new Date(
        `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
      );
      o.hours = date.getHours();
      o.minutes = date.getMinutes();
    };

    if (start) {
      mapping(start, this.start);
    }
    if (end) {
      mapping(end, this.end);
    }
  }

  private change(): void {

    if (Object.keys(this.start).every(key => this.start[key] !== null) && Object.keys(this.end).every(key => this.end[key] !== null)) {
      const start = new Date(this.start.date);
      const end = new Date(this.end.date);
      start.setHours(this.start.hours);
      start.setMinutes(this.start.minutes);
      end.setHours(this.end.hours);
      end.setMinutes(this.end.minutes);
      this.onChange({ start, end });
    } else {
      this.onChange(null);
    }
  }

  ngOnInit(): void {
  }
}
