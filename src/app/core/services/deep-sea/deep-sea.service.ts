import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { NGXLogger } from 'ngx-logger';
import { Observable, ReplaySubject, Subscription } from 'rxjs';
import { DeepSea } from '../../models/deep-sea.model';
import TimeOption from '../../models/time-option.model';
import { DeepSeaApiService } from '../deep-sea-api/deep-sea-api.service';
import { TimeOptionsService } from '../time-options/time-options.service';
import { map, take } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class DeepSeaService {
  private seaSubject: ReplaySubject<DeepSea[]>;
  private seaCache: Observable<DeepSea[]>;
  private optionSubscription: Subscription;

  constructor(private logger: NGXLogger, private optionsService: TimeOptionsService, private apiService: DeepSeaApiService) {
    this.seaSubject = new ReplaySubject<DeepSea[]>(1);
    this.seaCache = this.seaSubject.asObservable();
  }

  /**
   * Observable created from ReplaySubject of the deep sea creature list
   */
   deepSeaCreature(): Observable<DeepSea[]> {
    if (!this.optionSubscription) {
      this.optionSubscription = this.optionsService.option().subscribe((option) => {
        this.logger.debug(`DeepSeaService: Time options updated, start updating deep sea creature list`);
        this._refresh(option);
      });
    }

    return this.seaCache;
  }

  /**
   * Update ReplaySubject of the deep sea creature list with new data
   */
  refresh() {
    this.logger.debug(`DeepSeaService.refresh: Start refreshing the deep sea creature list`);
    this._refresh(this.optionsService.currentOption());
  }

  /**
   * Update ReplaySubject by calling the endpoints with the provided options
   */
  private _refresh(options: TimeOption) {
    this.logger.debug(`FishService._refresh: Refresh fish list using `, options);
    this.apiService
      .deepSeaCreature()
      .pipe(
        take(1),
        map((fs) => {
          if (fs instanceof HttpErrorResponse || options.isAll) {
            return fs;
          }
          return fs.filter((f) => (options.isNorth ? f.month.north.indexOf(options.month) : f.month.south.indexOf(options.month)) > -1);
        })
      )
      .subscribe((s) => this.seaSubject.next(s));
  }
}
