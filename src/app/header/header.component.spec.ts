import { Spectator, createComponentFactory, SpyObject } from '@ngneat/spectator';

import { HeaderComponent } from './header.component';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { TimeOptionsService } from '../core/services/time-options/time-options.service';
import { of } from 'rxjs';
import TimeOption from '../core/models/time-option.model';

describe('HeaderComponent', () => {
  let spectator: Spectator<HeaderComponent>;
  const createComponent = createComponentFactory({
    component: HeaderComponent,
    imports: [MatToolbarModule, MatSelectModule, MatButtonToggleModule],
    mocks: [TimeOptionsService],
    detectChanges: false,
  });
  let mockOption: SpyObject<TimeOptionsService>;

  beforeEach(() => {
    spectator = createComponent();
    mockOption = spectator.inject(TimeOptionsService);
  });

  it('should create', () => {
    mockOption.option.and.returnValue(of(new TimeOption()));
    spectator.detectChanges();
    const component = spectator.component;
    expect(component).toBeTruthy();
  });
});
