import { AppComponent } from './app.component';
import { Spectator, createComponentFactory } from '@ngneat/spectator';
import { MatTabsModule } from '@angular/material/tabs';

describe('AppComponent', () => {
  let spectator: Spectator<AppComponent>;
  const createComponent = createComponentFactory({
    component: AppComponent,
    imports: [MatTabsModule],
    detectChanges: false,
    shallow: true,
  });

  beforeEach(() => {
    spectator = createComponent();
  });

  it('should create the app', () => {
    spectator.detectChanges();
    const component = spectator.component;
    expect(component).toBeTruthy();
  });
});
