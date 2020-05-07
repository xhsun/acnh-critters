import { createServiceFactory, SpectatorService, SpyObject } from '@ngneat/spectator';
import { CritterMappingService } from './critter-mapping.service';
import { TimeOptionsService } from '../time-options/time-options.service';
import TimeOption from '../../models/time-option.model';
import * as faker from 'faker';
import { Month } from '../../models/month.model';

describe('CreatureMappingService', () => {
  let service: CritterMappingService;
  let spectator: SpectatorService<CritterMappingService>;
  const createService = createServiceFactory({
    service: CritterMappingService,
    mocks: [TimeOptionsService],
  });
  let mockOptions: SpyObject<TimeOptionsService>;

  beforeEach(() => {
    spectator = createService();
    service = spectator.service;
    mockOptions = spectator.inject(TimeOptionsService);
  });

  describe('getMonthArray', () => {
    it('should return correct month array', () => {
      const inputOptions = new TimeOption(faker.random.number(), false, false);
      const expected = [1, 2, 5, 7];
      const inputMonth = { north: [], south: expected } as Month;

      mockOptions.currentOption.and.returnValue(inputOptions);

      const actual = service.getMonthArray(inputMonth);
      expect(actual).toEqual(expected);
    });
  });

  describe('availableNextMonth', () => {
    it('should return false when isAll flag is set', () => {
      const inputOptions = new TimeOption(faker.random.number(), true);
      const inputMonth = {} as Month;

      mockOptions.currentOption.and.returnValue(inputOptions);

      expect(service.availableNextMonth(inputMonth)).toBeFalsy();
    });

    it('should return true when critter not available', () => {
      const inputOptions = new TimeOption(2, false);
      const inputMonth = { north: [1, 2, 5, 7] } as Month;

      mockOptions.currentOption.and.returnValue(inputOptions);

      expect(service.availableNextMonth(inputMonth)).toBeTruthy();
    });

    it('should return false when critter is available', () => {
      const inputOptions = new TimeOption(1, false);
      const inputMonth = { north: [1, 2, 5, 7] } as Month;

      mockOptions.currentOption.and.returnValue(inputOptions);

      expect(service.availableNextMonth(inputMonth)).toBeFalsy();
    });
  });

  describe('convertTimeStringToNumber', () => {
    it('should return 24 for invalid string', () => {
      const input = faker.random.word();

      const actual = service.convertTimeStringToNumber(input);
      expect(actual).toEqual(24);
    });

    it('should return correct time number', () => {
      const input = faker.random.number({ min: 1, max: 11 });
      const inputStr = `${input} pm`;

      const expected = input + 12;

      const actual = service.convertTimeStringToNumber(inputStr);
      expect(actual).toEqual(expected);
    });
  });
});
