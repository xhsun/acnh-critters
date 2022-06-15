import { DatePipe } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { fakeAsync, flush } from '@angular/core/testing';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { faker } from '@faker-js/faker';
import { Spectator, createComponentFactory, SpyObject } from '@ngneat/spectator';
import { LoggerTestingModule } from 'ngx-logger/testing';
import { of } from 'rxjs';
import { DeepSea } from '../core/models/deep-sea.model';
import { Month } from '../core/models/month.model';
import { MonthStringPipe } from '../core/month-string/month-string.pipe';
import { CritterMappingService } from '../core/services/critter-mapping/critter-mapping.service';
import { DeepSeaService } from '../core/services/deep-sea/deep-sea.service';

import { DeepSeaTableComponent } from './deep-sea-table.component';

describe('DeepSeaTableComponent', () => {
  let component: DeepSeaTableComponent;
  let spectator: Spectator<DeepSeaTableComponent>;
  const createComponent = createComponentFactory({
    component: DeepSeaTableComponent,
    imports: [LoggerTestingModule, MatTableModule, MatSortModule, MatIconModule, MatTooltipModule, MatInputModule],
    declarations: [MonthStringPipe],
    mocks: [DeepSeaService, CritterMappingService],
    detectChanges: false,
    providers:[DatePipe]
  });
  let mockApi: SpyObject<DeepSeaService>;
  let mockUtil: SpyObject<CritterMappingService>;

  beforeEach(() => {
    spectator = createComponent();
    mockApi = spectator.inject(DeepSeaService);
    mockUtil = spectator.inject(CritterMappingService);
    component = spectator.component;
  });

  describe('updateDeepSea', () => {
    it('should update data source with deep sea creature info', fakeAsync(() => {
      const input = [{ name: faker.random.word(), month: { north: [], south: [] } as Month } as DeepSea];
      mockApi.deepSeaCreature.and.returnValue(of(input));
      mockUtil.getMonthArray.and.returnValue([]);
      spectator.detectChanges();
      expect(component.dataSource.data).toEqual(input);
      flush();
    }));

    it('should update error message when received HttpErrorResponse', fakeAsync(() => {
      const input = new HttpErrorResponse({});
      mockApi.deepSeaCreature.and.returnValue(of(input));
      spectator.detectChanges();
      expect(component.error).not.toBeEmpty();
    }));
  });
});
