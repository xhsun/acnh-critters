import { HttpErrorResponse } from '@angular/common/http';
import { faker } from '@faker-js/faker';
import { createHttpFactory, HttpMethod, SpectatorHttp } from '@ngneat/spectator';
import { LoggerTestingModule } from 'ngx-logger/testing';
import { DEEP_SEA_URL } from '../../injection-tokens.store';
import { DeepSea } from '../../models/deep-sea.model';
import { DeepSeaApiService } from './deep-sea-api.service';

describe('DeepSeaApiService', () => {
  const url = faker.internet.url();
  let service: DeepSeaApiService;
  let spectator: SpectatorHttp<DeepSeaApiService>;
  const createHttp = createHttpFactory({
    service: DeepSeaApiService,
    providers: [{ provide: DEEP_SEA_URL, useValue: url }],
    imports: [LoggerTestingModule],
  });

  beforeEach(() => {
    spectator = createHttp();
    service = spectator.service;
  });

  describe('update', () => {
    it('should cache API data', (done) => {
      const expected = [{ name: faker.random.word() } as DeepSea];

      service.deepSeaCreature().subscribe(
        (actual) => {
          expect(actual).toEqual(expected);
          done();
        },
        (err) => done.fail(`Unexpected error: ${err}`)
      );

      const req = spectator.expectOne(url, HttpMethod.GET);
      req.flush(expected);
    });

    it('should provide error', (done) => {
      service.deepSeaCreature().subscribe(
        (actual) => {
          expect(actual).toBeInstanceOf(HttpErrorResponse);
          done();
        },
        (err) => done.fail(`Unexpected error: ${err}`)
      );

      const req = spectator.expectOne(url, HttpMethod.GET);
      req.flush('', { status: 404, statusText: 'Not Found' });
    });
  });
});
