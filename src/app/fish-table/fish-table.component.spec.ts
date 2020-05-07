import { Spectator, createComponentFactory, SpyObject } from '@ngneat/spectator';
import { FishTableComponent } from './fish-table.component';
import * as faker from 'faker';
import { LoggerTestingModule } from 'ngx-logger/testing';
import { MonthStringPipe } from '../core/month-string/month-string.pipe';
import { MatTableModule } from '@angular/material/table';
import { MatSortModule } from '@angular/material/sort';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatInputModule } from '@angular/material/input';
import { FishService } from '../core/services/fish/fish.service';
import { CritterMappingService } from '../core/services/critter-mapping/critter-mapping.service';
import { of } from 'rxjs';
import { Fish } from '../core/models/fish.model';
import { fakeAsync } from '@angular/core/testing';
import { Month } from '../core/models/month.model';
import { HttpErrorResponse } from '@angular/common/http';

describe('FishTableComponent', () => {
  let component: FishTableComponent;
  let spectator: Spectator<FishTableComponent>;
  const createComponent = createComponentFactory({
    component: FishTableComponent,
    imports: [LoggerTestingModule, MatTableModule, MatSortModule, MatIconModule, MatTooltipModule, MatInputModule],
    declarations: [MonthStringPipe],
    mocks: [FishService, CritterMappingService],
    detectChanges: false,
  });
  let mockApi: SpyObject<FishService>;
  let mockUtil: SpyObject<CritterMappingService>;

  beforeEach(() => {
    spectator = createComponent();
    mockApi = spectator.inject(FishService);
    mockUtil = spectator.inject(CritterMappingService);
    component = spectator.component;
  });

  describe('updateFish', () => {
    it('should update data source with fish info', fakeAsync(() => {
      const input = [{ name: faker.random.word(), month: { north: [], south: [] } as Month } as Fish];
      mockApi.fish.and.returnValue(of(input));
      mockUtil.getMonthArray.and.returnValue([]);
      spectator.detectChanges();
      expect(component.dataSource.data).toEqual(input);
    }));

    it('should update error message when received HttpErrorResponse', fakeAsync(() => {
      const input = new HttpErrorResponse({});
      mockApi.fish.and.returnValue(of(input));
      spectator.detectChanges();
      expect(component.fishError).not.toBeEmpty();
    }));
  });
});
