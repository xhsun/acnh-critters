import { Injectable } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { NGXLogger } from 'ngx-logger';
import { ReplaySubject, Observable, Subscription } from 'rxjs';
import { Fish } from '../../models/fish.model';
import TimeOption from '../../models/time-option.model';
import { map, take } from 'rxjs/operators';
import { TimeOptionsService } from '../time-options/time-options.service';
import { FishApiService } from '../fish-api/fish-api.service';

@Injectable({
  providedIn: 'root',
})
export class FishService {
  private fishSubject: ReplaySubject<Fish[]>;
  private fishCache: Observable<Fish[]>;
  private optionSubscription: Subscription;

  constructor(private logger: NGXLogger, private optionsService: TimeOptionsService, private apiService: FishApiService) {
    this.fishSubject = new ReplaySubject<Fish[]>(1);
    this.fishCache = this.fishSubject.asObservable();
  }

  /**
   * Observable created from ReplaySubject of the fish list
   */
  fish(): Observable<Fish[]> {
    if (!this.optionSubscription) {
      this.optionSubscription = this.optionsService.option().subscribe((option) => {
        this.logger.debug(`FishService: Time options updated, start updating fish list`);
        this._refresh(option);
      });
    }

    return this.fishCache;
  }

  /**
   * Update ReplaySubject of the fish list with new data
   */
  refresh() {
    this.logger.debug(`FishService.refresh: Start refreshing the fish list`);
    this._refresh(this.optionsService.currentOption());
  }

  /**
   * Update ReplaySubject by calling the endpoints with the provided options
   */
  private _refresh(options: TimeOption) {
    this.logger.debug(`FishService._refresh: Refresh fish list using `, options);
    this.apiService
      .fish()
      .pipe(
        take(1),
        map((fs) => {
          if (fs instanceof HttpErrorResponse || options.isAll) {
            return fs;
          }
          return fs.filter((f) => (options.isNorth ? f.month.north.indexOf(options.month) : f.month.south.indexOf(options.month)) > -1);
        })
      )
      .subscribe((s) => this.fishSubject.next(s));
  }
}
