import { Spectator, createComponentFactory, SpyObject } from '@ngneat/spectator';

import { BugTableComponent } from './bug-table.component';
import * as faker from 'faker';
import { LoggerTestingModule } from 'ngx-logger/testing';
import { MatTableModule } from '@angular/material/table';
import { MatSortModule } from '@angular/material/sort';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatInputModule } from '@angular/material/input';
import { MonthStringPipe } from '../core/month-string/month-string.pipe';
import { BugService } from '../core/services/bug/bug.service';
import { CritterMappingService } from '../core/services/critter-mapping/critter-mapping.service';
import { fakeAsync } from '@angular/core/testing';
import { of } from 'rxjs';
import { Month } from '../core/models/month.model';
import { HttpErrorResponse } from '@angular/common/http';
import { Bug } from '../core/models/bug.model';

describe('BugTableComponent', () => {
  let component: BugTableComponent;
  let spectator: Spectator<BugTableComponent>;
  const createComponent = createComponentFactory({
    component: BugTableComponent,
    imports: [LoggerTestingModule, MatTableModule, MatSortModule, MatIconModule, MatTooltipModule, MatInputModule],
    declarations: [MonthStringPipe],
    mocks: [BugService, CritterMappingService],
    detectChanges: false,
  });
  let mockApi: SpyObject<BugService>;

  beforeEach(() => {
    spectator = createComponent();
    mockApi = spectator.inject(BugService);
    component = spectator.component;
  });

  describe('updateBug', () => {
    it('should update data source with bug info', fakeAsync(() => {
      const input = [{ name: faker.random.word(), month: { north: [], south: [] } as Month } as Bug];
      mockApi.bug.and.returnValue(of(input));
      spectator.detectChanges();
      expect(component.dataSource.data).toEqual(input);
    }));

    it('should update error message when received HttpErrorResponse', fakeAsync(() => {
      const input = new HttpErrorResponse({});
      mockApi.bug.and.returnValue(of(input));
      spectator.detectChanges();
      expect(component.bugError).not.toBeEmpty();
    }));
  });
});