import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { NGXLogger } from 'ngx-logger';
import { Subscription } from 'rxjs';
import { DeepSea } from '../core/models/deep-sea.model';
import { CritterMappingService } from '../core/services/critter-mapping/critter-mapping.service';
import { DeepSeaService } from '../core/services/deep-sea/deep-sea.service';

@Component({
  selector: 'app-deep-sea-table',
  templateUrl: './deep-sea-table.component.html',
  styleUrls: ['./deep-sea-table.component.scss']
})
export class DeepSeaTableComponent implements OnInit {
  private subscription: Subscription;
  columnsToDisplay = ['name', 'shadowSize', 'swimmingPattern', 'time', 'price', 'month'];
  dataSource: MatTableDataSource<DeepSea>;
  error: string;

  constructor(private logger: NGXLogger, private deepSeaService: DeepSeaService, private utilService: CritterMappingService) {
    this.error = 'Loading deep sea creature information';
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
    this.subscription = this.deepSeaService.deepSeaCreature().subscribe((f) => this.updateDeepSea(f));
    this.dataSource.sortingDataAccessor = (data: DeepSea, sortHeaderId: string) => {
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
    this.subscription.unsubscribe();
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
   * Get month array of the given deep sea creature info
   * @param creature Information used to extract correct month array
   */
  /* istanbul ignore next */
  monthArray(creature: DeepSea) {
    return this.utilService.getMonthArray(creature.month);
  }

  /**
   * Check if this month is the last chance to catch the given deep sea creature
   *
   * @param value Information used to check if the deep sea creature is available next month
   */
  /* istanbul ignore next */
  isLastChance(value: DeepSea) {
    return this.utilService.availableNextMonth(value.month);
  }

  /**
   * Update deep sea creature table
   * @param data List of deep sea creature information or HttpErrorResponse
   */
  private updateDeepSea(data: DeepSea[] | HttpErrorResponse) {
    if (data instanceof HttpErrorResponse) {
      this.error = 'Unable to load any information, please refresh the page to try again';
    } else {
      this.logger.debug(`DeepSeaTableComponent.updateDeepSea: Update deep sea creature list to`, data);
      this.dataSource.data = data;
      this.error = data.length > 0 ? '' : 'No deep sea creature to display';
    }
  }

}
