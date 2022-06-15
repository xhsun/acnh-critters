import { faker } from '@faker-js/faker';
import { createServiceFactory, SpectatorService, SpyObject } from '@ngneat/spectator';
import { LoggerTestingModule } from 'ngx-logger/testing';
import { NEVER, of } from 'rxjs';
import { DeepSea } from '../../models/deep-sea.model';
import { Month } from '../../models/month.model';
import TimeOption from '../../models/time-option.model';
import { DeepSeaApiService } from '../deep-sea-api/deep-sea-api.service';
import { TimeOptionsService } from '../time-options/time-options.service';
import { DeepSeaService } from './deep-sea.service';

describe('DeepSeaService', () => {
  let service: DeepSeaService;
  let spectator: SpectatorService<DeepSeaService>;
  const createService = createServiceFactory({
    service: DeepSeaService,
    imports: [LoggerTestingModule],
    mocks: [TimeOptionsService, DeepSeaApiService],
  });
  let mockOptions: SpyObject<TimeOptionsService>;
  let mockApi: SpyObject<DeepSeaApiService>;

  beforeEach(() => {
    spectator = createService();
    service = spectator.service;
    mockOptions = spectator.inject(TimeOptionsService);
    mockApi = spectator.inject(DeepSeaApiService);
  });

  describe('deepSeaCreature', () => {
    it('should set options subscription', (done) => {
      const inputOptions = new TimeOption(faker.datatype.number(), true);
      const expected = [{ name: faker.random.word() } as DeepSea];

      mockOptions.option.and.returnValue(of(inputOptions));
      mockApi.deepSeaCreature.and.returnValue(of(expected));

      service.deepSeaCreature().subscribe(
        (actual) => {
          expect(actual).toEqual(expected);
          done();
        },
        (err) => done.fail(`Unexpected error: ${err}`)
      );
    });
  });

  describe('refresh', () => {
    it('should provide full creatures list when flag isAll is set', (done) => {
      const inputOptions = new TimeOption(faker.datatype.number(), true);
      const expected = [{ name: faker.random.word() } as DeepSea];

      mockOptions.option.and.returnValue(NEVER);
      mockOptions.currentOption.and.returnValue(inputOptions);
      mockApi.deepSeaCreature.and.returnValue(of(expected));

      service.deepSeaCreature().subscribe(
        (actual) => {
          expect(actual).toEqual(expected);
          done();
        },
        (err) => done.fail(`Unexpected error: ${err}`)
      );
      service.refresh();
    });

    it('should provide creatures with correct month', (done) => {
      const inputMonth = faker.datatype.number();
      const inputOptions = new TimeOption(inputMonth);
      const expected = [
        { name: faker.random.word(), month: { north: [inputMonth] } as Month } as DeepSea,
        { name: faker.random.word(), month: { north: [inputMonth + 1] } as Month } as DeepSea,
      ];

      mockOptions.option.and.returnValue(NEVER);
      mockOptions.currentOption.and.returnValue(inputOptions);
      mockApi.deepSeaCreature.and.returnValue(of(expected));

      service.deepSeaCreature().subscribe(
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
