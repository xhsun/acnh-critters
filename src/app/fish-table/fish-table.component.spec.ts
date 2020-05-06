import { Spectator, createComponentFactory } from '@ngneat/spectator';

import { FishTableComponent } from './fish-table.component';

describe('FishTableComponent', () => {
  let spectator: Spectator<FishTableComponent>;
  const createComponent = createComponentFactory(FishTableComponent);

  it('should create', () => {
    spectator = createComponent();

    expect(spectator.component).toBeTruthy();
  });
});
