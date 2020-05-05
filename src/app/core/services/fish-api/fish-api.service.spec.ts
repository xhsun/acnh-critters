import { SpectatorHttp, createHttpFactory, HttpMethod } from '@ngneat/spectator';
import { FishApiService } from './fish-api.service';
import * as faker from 'faker';
import { FISH_URL } from '../../injection-tokens.store';
import { LoggerTestingModule } from 'ngx-logger/testing';
import { HttpErrorResponse } from '@angular/common/http';
import { Fish } from '../../models/fish.model';

describe('FishApiService', () => {
  const url = faker.internet.url();
  let service: FishApiService;
  let spectator: SpectatorHttp<FishApiService>;
  const createHttp = createHttpFactory({
    service: FishApiService,
    providers: [{ provide: FISH_URL, useValue: url }],
    imports: [LoggerTestingModule],
  });

  beforeEach(() => {
    spectator = createHttp();
    service = spectator.service;
  });

  describe('update', () => {
    it('should cache API data', (done) => {
      const expected = [{ name: faker.random.word() } as Fish];

      service.fish().subscribe(
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
      service.fish().subscribe(
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
