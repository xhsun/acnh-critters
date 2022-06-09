import { SpectatorService, createServiceFactory, SpyObject } from '@ngneat/spectator';
import { FishService } from './fish.service';
import { faker } from '@faker-js/faker';
import { LoggerTestingModule } from 'ngx-logger/testing';
import { Fish } from '../../models/fish.model';
import { TimeOptionsService } from '../time-options/time-options.service';
import { FishApiService } from '../fish-api/fish-api.service';
import TimeOption from '../../models/time-option.model';
import { of, NEVER } from 'rxjs';
import { Month } from '../../models/month.model';

describe('FishService', () => {
  let service: FishService;
  let spectator: SpectatorService<FishService>;
  const createService = createServiceFactory({
    service: FishService,
    imports: [LoggerTestingModule],
    mocks: [TimeOptionsService, FishApiService],
  });
  let mockOptions: SpyObject<TimeOptionsService>;
  let mockApi: SpyObject<FishApiService>;

  beforeEach(() => {
    spectator = createService();
    service = spectator.service;
    mockOptions = spectator.inject(TimeOptionsService);
    mockApi = spectator.inject(FishApiService);
  });

  describe('fish', () => {
    it('should set options subscription', (done) => {
      const inputOptions = new TimeOption(faker.datatype.number(), true);
      const expected = [{ name: faker.random.word() } as Fish];

      mockOptions.option.and.returnValue(of(inputOptions));
      mockApi.fish.and.returnValue(of(expected));

      service.fish().subscribe(
        (actual) => {
          expect(actual).toEqual(expected);
          done();
        },
        (err) => done.fail(`Unexpected error: ${err}`)
      );
    });
  });

  describe('refresh', () => {
    it('should provide full fish list when flag isAll is set', (done) => {
      const inputOptions = new TimeOption(faker.datatype.number(), true);
      const expected = [{ name: faker.random.word() } as Fish];

      mockOptions.option.and.returnValue(NEVER);
      mockOptions.currentOption.and.returnValue(inputOptions);
      mockApi.fish.and.returnValue(of(expected));

      service.fish().subscribe(
        (actual) => {
          expect(actual).toEqual(expected);
          done();
        },
        (err) => done.fail(`Unexpected error: ${err}`)
      );
      service.refresh();
    });

    it('should provide fish with correct month', (done) => {
      const inputMonth = faker.datatype.number();
      const inputOptions = new TimeOption(inputMonth);
      const expected = [
        { name: faker.random.word(), month: { north: [inputMonth] } as Month } as Fish,
        { name: faker.random.word(), month: { north: [inputMonth + 1] } as Month } as Fish,
      ];

      mockOptions.option.and.returnValue(NEVER);
      mockOptions.currentOption.and.returnValue(inputOptions);
      mockApi.fish.and.returnValue(of(expected));

      service.fish().subscribe(
        (actual) => {
          expect(actual.length).toEqual(1);
          done();
        },
        (err) => done.fail(`Unexpected error: ${err}`)
      );
      service.refresh();
    });
  });
});
