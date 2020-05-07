import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { NGXLogger } from 'ngx-logger';
import { FishService } from '../core/services/fish/fish.service';
import { Subscription } from 'rxjs';
import { Fish } from '../core/models/fish.model';
import { HttpErrorResponse } from '@angular/common/http';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { CritterMappingService } from '../core/services/critter-mapping/critter-mapping.service';

@Component({
  selector: 'app-fish-table',
  templateUrl: './fish-table.component.html',
  styleUrls: ['./fish-table.component.scss'],
})
export class FishTableComponent implements OnInit, OnDestroy {
  private fishSubscription: Subscription;
  columnsToDisplay = ['name', 'shadowSize', 'location', 'time', 'price', 'month'];
  dataSource: MatTableDataSource<Fish>;
  fishError: string;

  constructor(private logger: NGXLogger, private fishService: FishService, private utilService: CritterMappingService) {
    this.fishError = 'Loading fish information';
    this.dataSource = new MatTableDataSource([]);
  }

  /**
   * Set MatSort for the table
   */
  /* istanbul ignore next */
  @ViewChild(MatSort, { static: false })
  set sort(sort: MatSort) {
    this.dataSource.sort = sort;
  }

  ngOnInit(): void {
    this.fishSubscription = this.fishService.fish().subscribe((f) => this.updateFish(f));
    this.dataSource.sortingDataAccessor = (data: Fish, sortHeaderId: string) => {
      switch (sortHeaderId) {
        case 'time':
          return this.utilService.convertTimeStringToNumber(data.time);
        case 'month':
          return this.monthArray(data);
        default:
          return data[sortHeaderId];
      }
    };
  }

  ngOnDestroy(): void {
    this.fishSubscription.unsubscribe();
  }

  /**
   * Set table filter using the given filter string, default to empty string
   * @param value Input filter string
   */
  /* istanbul ignore next */
  filter(value: string = '') {
    this.dataSource.filter = value;
  }

  /**
   * Get month array of the given fish info
   * @param fish Information used to extract correct month array
   */
  /* istanbul ignore next */
  monthArray(fish: Fish) {
    return this.utilService.getMonthArray(fish.month);
  }

  /**
   * Check if this month is the last chance to catch the given fish
   *
   * @param value Information used to check if the fish is available next month
   */
  /* istanbul ignore next */
  isLastChance(value: Fish) {
    return this.utilService.availableNextMonth(value.month);
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
      this.dataSource.data = data;
      this.fishError = data.length > 0 ? '' : 'No fishes to display';
    }
  }
}
