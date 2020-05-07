import { MonthStringPipe } from './month-string.pipe';
import { Component, Input } from '@angular/core';
import { createPipeFactory } from '@ngneat/spectator';
import { DatePipe, CommonModule } from '@angular/common';

/*istanbul ignore file*/
@Component({
  template: ` <div>{{ prop | monthString }}</div> `,
})
class TestHostComponent {
  @Input() public prop: number[];
}

describe('MonthStringPipe', () => {
  const createPipe = createPipeFactory({
    pipe: MonthStringPipe,
    host: TestHostComponent,
    imports: [CommonModule],
    providers: [DatePipe],
  });

  it('should display one months', () => {
    const input = [4];
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
    const input = [1, 2, 4, 5];
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
    const input = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
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
