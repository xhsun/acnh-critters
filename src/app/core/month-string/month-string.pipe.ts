import { Pipe, PipeTransform } from '@angular/core';
import { Month } from '../models/month.model';
import { DatePipe } from '@angular/common';
import { TimeOptionsService } from '../services/time-options/time-options.service';

@Pipe({
  name: 'monthString',
})
export class MonthStringPipe implements PipeTransform {
  constructor(private datePipe: DatePipe, private optionService: TimeOptionsService) {}

  /**
   * Transform the given month to its string representation
   * @param value Month
   */
  transform(value: Month): string {
    const options = this.optionService.currentOption();

    // Group month into consecutive months
    const month = (options.isNorth ? value.north : value.south).reduce((p, c) => {
      const previousGroup = p[p.length - 1];
      if (!previousGroup || previousGroup[previousGroup.length - 1] !== c - 1) {
        p.push([]);
      }
      p[p.length - 1].push(c);
      return p;
    }, [] as number[][]);

    // Map those consecutive months to string
    const monthString = month.map((m) => {
      if (m.length > 11) {
        return 'All Year';
      }

      const first = new Date();
      first.setMonth(m[0] - 1);
      const firstDate = this.datePipe.transform(first, 'MMM');
      if (m.length < 2) {
        return firstDate;
      }

      const last = new Date();
      last.setMonth(m[m.length - 1] - 1);
      return `${firstDate} to ${this.datePipe.transform(last, 'MMM')}`;
    });

    return monthString.join(', ');
  }
}
