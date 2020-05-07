import { Component, OnInit, OnDestroy } from '@angular/core';
import TimeOption from '../core/models/time-option.model';
import { TimeOptionsService } from '../core/services/time-options/time-options.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit, OnDestroy {
  readonly hemispheres = [
    { value: true, viewValue: 'Northern' },
    { value: false, viewValue: 'Southern' },
  ];

  readonly months = [
    { Value: 0, Text: 'SHOW ALL' },
    { Value: 1, Text: 'January' },
    { Value: 2, Text: 'February' },
    { Value: 3, Text: 'March' },
    { Value: 4, Text: 'April' },
    { Value: 5, Text: 'May' },
    { Value: 6, Text: 'June' },
    { Value: 7, Text: 'July' },
    { Value: 8, Text: 'August' },
    { Value: 9, Text: 'September' },
    { Value: 10, Text: 'October' },
    { Value: 11, Text: 'November' },
    { Value: 12, Text: 'December' },
  ];

  private optionSubscription: Subscription;
  currentOption: TimeOption;

  constructor(private optionsService: TimeOptionsService) {}

  /* istanbul ignore next */
  set currentHemisphere(value: boolean) {
    this.currentOption.isNorth = value;
    this.optionsService.update(this.currentOption);
  }

  /* istanbul ignore next */
  get currentHemisphere() {
    return this.currentOption.isNorth;
  }

  /* istanbul ignore next */
  set currentMonth(value: number) {
    if (value === 0) {
      this.currentOption.isAll = true;
    } else {
      this.currentOption.isAll = false;
      this.currentOption.month = value;
    }

    this.optionsService.update(this.currentOption);
  }

  /* istanbul ignore next */
  get currentMonth() {
    if (this.currentOption.isAll) {
      return 0;
    }
    return this.currentOption.month;
  }

  ngOnInit(): void {
    this.optionSubscription = this.optionsService.option().subscribe((o) => (this.currentOption = o));
  }

  ngOnDestroy(): void {
    this.optionSubscription.unsubscribe();
  }
}
