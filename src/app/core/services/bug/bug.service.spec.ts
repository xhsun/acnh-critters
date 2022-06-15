import { createServiceFactory, SpectatorService, SpyObject } from '@ngneat/spectator';
import { BugService } from './bug.service';
import { BugApiService } from '../bug-api/bug-api.service';
import { TimeOptionsService } from '../time-options/time-options.service';
import { faker } from '@faker-js/faker';
import { LoggerTestingModule } from 'ngx-logger/testing';
import TimeOption from '../../models/time-option.model';
import { Bug } from '../../models/bug.model';
import { of, NEVER } from 'rxjs';
import { Month } from '../../models/month.model';

describe('BugService', () => {
  let service: BugService;
  let spectator: SpectatorService<BugService>;
  const createService = createServiceFactory({
    service: BugService,
    imports: [LoggerTestingModule],
    mocks: [TimeOptionsService, BugApiService],
  });
  let mockOptions: SpyObject<TimeOptionsService>;
  let mockApi: SpyObject<BugApiService>;

  beforeEach(() => {
    spectator = createService();
    service = spectator.service;
    mockOptions = spectator.inject(TimeOptionsService);
    mockApi = spectator.inject(BugApiService);
  });

  describe('bug', () => {
    it('should set options subscription', (done) => {
      const inputOptions = new TimeOption(faker.datatype.number(), true);
      const expected = [{ name: faker.random.word() } as Bug];

      mockOptions.option.and.returnValue(of(inputOptions));
      mockApi.bug.and.returnValue(of(expected));

      service.bug().subscribe(
        (actual) => {
          expect(actual).toEqual(expected);
          done();
        },
        (err) => done.fail(`Unexpected error: ${err}`)
      );
    });
  });

  describe('refresh', () => {
    it('should provide full bug list when flag isAll is set', (done) => {
      const inputOptions = new TimeOption(faker.datatype.number(), true);
      const expected = [{ name: faker.random.word() } as Bug];

      mockOptions.option.and.returnValue(NEVER);
      mockOptions.currentOption.and.returnValue(inputOptions);
      mockApi.bug.and.returnValue(of(expected));

      service.bug().subscribe(
        (actual) => {
          expect(actual).toEqual(expected);
          done();
        },
        (err) => done.fail(`Unexpected error: ${err}`)
      );
      service.refresh();
    });

    it('should provide bug with correct month', (done) => {
      const inputMonth = faker.datatype.number();
      const inputOptions = new TimeOption(inputMonth);
      const expected = [
        { name: faker.random.word(), month: { north: [inputMonth] } as Month } as Bug,
        { name: faker.random.word(), month: { north: [inputMonth + 1] } as Month } as Bug,
      ];

      mockOptions.option.and.returnValue(NEVER);
      mockOptions.currentOption.and.returnValue(inputOptions);
      mockApi.bug.and.returnValue(of(expected));

      service.bug().subscribe(
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
