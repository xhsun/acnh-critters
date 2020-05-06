import { Injectable } from '@angular/core';
import { TimeOptionsService } from '../time-options/time-options.service';
import { Month } from '../../models/month.model';

/**
 * Common utility/mapping functions shared between fish and bug
 */
@Injectable({
  providedIn: 'root',
})
export class CritterMappingService {
  constructor(private optionService: TimeOptionsService) {}

  /**
   * Provide the month array base on current hemisphere
   * @param month Availability of the given critter
   */
  getMonthArray(month: Month): number[] {
    return this.optionService.currentOption().isNorth ? month.north : month.south;
  }

  /**
   * Check if the given critter is available for next month;
   *
   * Always return false if time option isAll flag is set
   * @param month Availability of the given critter
   */
  availableNextMonth(month: Month) {
    const options = this.optionService.currentOption();
    if (options.isAll) {
      return false;
    }
    return this.getMonthArray(month).indexOf(options.month + 1) < 0;
  }

  /**
   * Convert the first time in the time frame string to number
   *
   * @param time Time frame string
   */
  convertTimeStringToNumber(time: string) {
    const token = time.split(' ');
    const hour = +token[0];
    if (!hour) {
      return 24;
    }

    return token[1].toUpperCase() === 'PM' ? hour + 12 : hour;
  }
}
