import { MonthStringPipe } from './month-string.pipe';
import { Component, Input } from '@angular/core';
import { Month } from '../models/month.model';
import { createPipeFactory, SpyObject, mockProvider } from '@ngneat/spectator';
import { TimeOptionsService } from '../services/time-options/time-options.service';
import { DatePipe, CommonModule } from '@angular/common';
import TimeOption from '../models/time-option.model';

/*istanbul ignore file*/
@Component({
  template: ` <div>{{ prop | monthString }}</div> `,
})
class TestHostComponent {
  @Input() public prop: Month;
}

describe('MonthStringPipe', () => {
  const createPipe = createPipeFactory({
    pipe: MonthStringPipe,
    host: TestHostComponent,
    imports: [CommonModule],
    providers: [mockProvider(TimeOptionsService, { currentOption: () => new TimeOption(1, true) }), DatePipe],
  });

  it('should display one months', () => {
    const input = { north: [4], south: [1] } as Month;
    const expected = 'Apr';

    const spectator = createPipe({
      hostProps: {
        prop: input,
      },
    });

    const actual = spectator.element;

    expect(actual).toHaveExactText(expected);
  });

  it('should display segmented months', () => {
    const input = { north: [1, 2, 4, 5], south: [1] } as Month;
    const expected = 'Jan to Feb, Apr to May';

    const spectator = createPipe({
      hostProps: {
        prop: input,
      },
    });

    const actual = spectator.element;

    expect(actual).toHaveExactText(expected);
  });

  it('should display all year', () => {
    const input = { north: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12], south: [1] } as Month;
    const expected = 'All Year';

    const spectator = createPipe({
      hostProps: {
        prop: input,
      },
    });

    const actual = spectator.element;

    expect(actual).toHaveExactText(expected);
  });
});
