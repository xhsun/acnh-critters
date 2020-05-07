import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { BugService } from '../core/services/bug/bug.service';
import { NGXLogger } from 'ngx-logger';
import { CritterMappingService } from '../core/services/critter-mapping/critter-mapping.service';
import { Subscription } from 'rxjs';
import { Bug } from '../core/models/bug.model';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-bug-table',
  templateUrl: './bug-table.component.html',
  styleUrls: ['./bug-table.component.scss'],
})
export class BugTableComponent implements OnInit, OnDestroy {
  private bugSubscription: Subscription;
  columnsToDisplay = ['name', 'location', 'time', 'price', 'month'];
  dataSource: MatTableDataSource<Bug>;
  bugError: string;

  constructor(private logger: NGXLogger, private bugService: BugService, private utilService: CritterMappingService) {
    this.bugError = 'Loading bug information';
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
    this.bugSubscription = this.bugService.bug().subscribe((b) => this.updateBug(b));
    this.dataSource.sortingDataAccessor = (data: Bug, sortHeaderId: string) => {
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
    this.bugSubscription.unsubscribe();
  }

  /**
   * Get month array of the given bug info
   * @param bug Information used to extract correct month array
   */
  /* istanbul ignore next */
  monthArray(bug: Bug) {
    return this.utilService.getMonthArray(bug.month);
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
   * Check if this month is the last chance to catch the given bug
   *
   * @param value Information used to check if the bug is available next month
   */
  /* istanbul ignore next */
  isLastChance(value: Bug) {
    return this.utilService.availableNextMonth(value.month);
  }

  /**
   * Update bug table
   * @param data List of bug information or HttpErrorResponse
   */
  private updateBug(data: Bug[] | HttpErrorResponse) {
    if (data instanceof HttpErrorResponse) {
      this.bugError = 'Unable to load any information, please refresh the page to try again';
    } else {
      this.logger.debug(`BugTableComponent.updateBug: Update bug list to`, data);
      this.dataSource.data = data;
      this.bugError = data.length > 0 ? '' : 'No bugs to display';
    }
  }
}
