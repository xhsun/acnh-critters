import { Spectator, createComponentFactory, SpyObject } from '@ngneat/spectator';

import { BugTableComponent } from './bug-table.component';
import { faker } from '@faker-js/faker';
import { LoggerTestingModule } from 'ngx-logger/testing';
import { MatTableModule } from '@angular/material/table';
import { MatSortModule } from '@angular/material/sort';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatInputModule } from '@angular/material/input';
import { MonthStringPipe } from '../core/month-string/month-string.pipe';
import { BugService } from '../core/services/bug/bug.service';
import { CritterMappingService } from '../core/services/critter-mapping/critter-mapping.service';
import { fakeAsync, flush } from '@angular/core/testing';
import { of } from 'rxjs';
import { Month } from '../core/models/month.model';
import { HttpErrorResponse } from '@angular/common/http';
import { Bug } from '../core/models/bug.model';
import { DatePipe } from '@angular/common';

describe('BugTableComponent', () => {
  let component: BugTableComponent;
  let spectator: Spectator<BugTableComponent>;
  const createComponent = createComponentFactory({
    component: BugTableComponent,
    imports: [LoggerTestingModule, MatTableModule, MatSortModule, MatIconModule, MatTooltipModule, MatInputModule],
    declarations: [MonthStringPipe],
    mocks: [BugService, CritterMappingService],
    detectChanges: false,
    providers:[DatePipe]
  });
  let mockApi: SpyObject<BugService>;
  let mockUtil: SpyObject<CritterMappingService>;

  beforeEach(() => {
    spectator = createComponent();
    mockApi = spectator.inject(BugService);
    mockUtil = spectator.inject(CritterMappingService);
    component = spectator.component;
  });

  describe('updateBug', () => {
    it('should update data source with bug info', fakeAsync(() => {
      const input = [{ name: faker.random.word(), month: { north: [], south: [] } as Month } as Bug];
      mockApi.bug.and.returnValue(of(input));
      mockUtil.getMonthArray.and.returnValue([]);
      spectator.detectChanges();
      expect(component.dataSource.data).toEqual(input);
      flush();
    }));

    it('should update error message when received HttpErrorResponse', fakeAsync(() => {
      const input = new HttpErrorResponse({});
      mockApi.bug.and.returnValue(of(input));
      spectator.detectChanges();
      expect(component.bugError).not.toBeEmpty();
    }));
  });
});
