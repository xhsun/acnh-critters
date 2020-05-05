import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import TimeOption from '../../models/time-option.model';
import { NGXLogger } from 'ngx-logger';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class TimeOptionsService {
  private optionsSubject: BehaviorSubject<TimeOption>;
  private optionsCache: Observable<TimeOption>;

  constructor(private logger: NGXLogger) {
    this.optionsSubject = new BehaviorSubject(new TimeOption());
    this.optionsCache = this.optionsSubject.asObservable();
  }

  /**
   * Observable created from BehaviorSubject of the time option
   */
  /* istanbul ignore next */
  get option(): Observable<TimeOption> {
    return this.optionsCache.pipe(map((o) => (!o ? new TimeOption() : { ...o })));
  }

  /**
   * Retrieve the current time option from the BehaviorSubject
   */
  /* istanbul ignore next */
  get currentOption(): TimeOption {
    let option = this.optionsSubject.getValue();
    option = !option ? new TimeOption() : { ...option };
    return option;
  }

  /**
   * Update the time option to the provided option
   * @param option Time option
   */
  update(option: TimeOption) {
    const newOption = !option ? new TimeOption() : { ...option };
    this.logger.debug(`TimeOptionsService.update: Change current time option to `, newOption);
    this.optionsSubject.next(newOption);
  }
}
