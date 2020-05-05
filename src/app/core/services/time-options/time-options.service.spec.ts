import { createServiceFactory, SpectatorService } from '@ngneat/spectator';
import { TimeOptionsService } from './time-options.service';
import { LoggerTestingModule } from 'ngx-logger/testing';
import TimeOption from '../../models/time-option.model';
import * as faker from 'faker';

describe('TimeOptionService', () => {
  let service: TimeOptionsService;
  let spectator: SpectatorService<TimeOptionsService>;
  const createService = createServiceFactory({
    service: TimeOptionsService,
    imports: [LoggerTestingModule],
  });

  beforeEach(() => {
    spectator = createService();
    service = spectator.service;
  });

  describe('update', () => {
    it('should update to the provided default option', (done) => {
      const expected = new TimeOption();
      service.update(expected);
      service.option.subscribe(
        (actual) => {
          expect(actual.month).toEqual(expected.month);
          expect(actual.isAll).toEqual(expected.isAll);
          done();
        },
        (err) => done.fail(`Unexpected error: ${err}`)
      );
    });

    it('should update to the provided option', (done) => {
      const expected = new TimeOption(faker.random.number());
      service.update(expected);
      service.option.subscribe(
        (actual) => {
          expect(actual.month).toEqual(expected.month);
          expect(actual.isAll).toEqual(expected.isAll);
          done();
        },
        (err) => done.fail(`Unexpected error: ${err}`)
      );
    });
  });
});
