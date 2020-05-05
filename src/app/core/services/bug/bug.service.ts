import { Injectable } from '@angular/core';
import { Bug } from '../../models/bug.model';
import { Subscription, Observable, ReplaySubject } from 'rxjs';
import { BugApiService } from '../bug-api/bug-api.service';
import { TimeOptionsService } from '../time-options/time-options.service';
import { NGXLogger } from 'ngx-logger';
import { HttpErrorResponse } from '@angular/common/http';
import TimeOption from '../../models/time-option.model';
import { take, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class BugService {
  private bugSubject: ReplaySubject<Bug[]>;
  private bugCache: Observable<Bug[]>;
  private optionSubscription: Subscription;

  constructor(private logger: NGXLogger, private optionsService: TimeOptionsService, private apiService: BugApiService) {
    this.bugSubject = new ReplaySubject<Bug[]>(1);
    this.bugCache = this.bugSubject.asObservable();
  }

  /**
   * Observable created from ReplaySubject of the bug list
   */
  bug(): Observable<Bug[]> {
    if (!this.optionSubscription) {
      this.optionSubscription = this.optionsService.option().subscribe((option) => {
        this.logger.debug(`BugService: Time options updated, start updating bug list`);
        this._refresh(option);
      });
    }

    return this.bugCache;
  }

  /**
   * Update ReplaySubject of the bug list with new data
   */
  refresh() {
    this.logger.debug(`BugService.refresh: Start refreshing the bug list`);
    this._refresh(this.optionsService.currentOption());
  }

  /**
   * Update ReplaySubject by calling the endpoints with the provided options
   */
  private _refresh(options: TimeOption) {
    this.logger.debug(`BugService._refresh: Refresh bug list using `, options);
    this.apiService
      .bug()
      .pipe(
        take(1),
        map((fs) => {
          if (fs instanceof HttpErrorResponse || options.isAll) {
            return fs;
          }
          return fs.filter((f) => (options.isNorth ? f.month.north.indexOf(options.month) : f.month.south.indexOf(options.month)) > -1);
        })
      )
      .subscribe((s) => this.bugSubject.next(s));
  }
}
