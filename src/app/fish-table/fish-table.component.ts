import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { NGXLogger } from 'ngx-logger';
import { FishService } from '../core/services/fish/fish.service';
import { Subscription } from 'rxjs';
import { Fish } from '../core/models/fish.model';
import { HttpErrorResponse } from '@angular/common/http';
import { MatTableDataSource } from '@angular/material/table';
import { SelectionModel } from '@angular/cdk/collections';
import { MatSort } from '@angular/material/sort';
import { TimeOptionsService } from '../core/services/time-options/time-options.service';
import TimeOption from '../core/models/time-option.model';

@Component({
  selector: 'app-fish-table',
  templateUrl: './fish-table.component.html',
  styleUrls: ['./fish-table.component.scss'],
})
export class FishTableComponent implements OnInit, OnDestroy {
  private fishSubscription: Subscription;
  private optionsSubscription: Subscription;
  currentOptions: TimeOption;

  columnsToDisplay = ['name', 'shadowSize', 'location', 'time', 'price', 'month'];
  fishError: string;
  loading: boolean;
  selection: SelectionModel<Fish>;
  dataSource: MatTableDataSource<Fish>;

  constructor(private logger: NGXLogger, private fishService: FishService, private optionService: TimeOptionsService) {
    this.fishError = 'Loading fish information';
    this.loading = true;
    this.selection = new SelectionModel<Fish>(true, []);
    this.dataSource = new MatTableDataSource([]);
  }

  ngOnInit(): void {
    this.optionsSubscription = this.optionService.option().subscribe((o) => (this.currentOptions = o));
    this.fishSubscription = this.fishService.fish().subscribe((f) => this.updateFish(f));
    this.dataSource.sortingDataAccessor = (data: Fish, sortHeaderId: string) => {
      switch (sortHeaderId) {
        case 'time':
          return this.convertTimeStringToNumber(data.time);
        case 'month':
          return this.currentOptions.isNorth ? data.month.north : data.month.south;
        default:
          return data[sortHeaderId];
      }
    };
  }

  ngOnDestroy(): void {
    this.optionsSubscription.unsubscribe();
    this.fishSubscription.unsubscribe();
  }

  @ViewChild(MatSort, { static: false })
  set sort(sort: MatSort) {
    this.dataSource.sort = sort;
  }

  convertTimeStringToNumber(time: string) {
    const token = time.split(' ');
    const hour = +token[0];
    if (token.indexOf('-') < 0) {
      return 24;
    }
    return token[1].toUpperCase() === 'PM' ? hour + 12 : hour;
  }

  /**
   * Update fish table
   * @param data List of fish information or HttpErrorResponse
   */
  private updateFish(data: Fish[] | HttpErrorResponse) {
    if (data instanceof HttpErrorResponse) {
      this.fishError = 'Unable to load any information, please refresh the page to try again';
    } else {
      this.logger.debug(`FishTableComponent.updateFish: Update fish list to`, data);
      this.selection.clear();
      this.dataSource.data = data;
      this.fishError = data.length > 0 ? '' : 'No fishes to display';
    }
    this.loading = false;
  }
}
