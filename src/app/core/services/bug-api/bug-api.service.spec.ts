import { createHttpFactory, HttpMethod, SpectatorHttp } from '@ngneat/spectator';
import { BugApiService } from './bug-api.service';
import { BUG_URL } from '../../injection-tokens.store';
import * as faker from 'faker';
import { LoggerTestingModule } from 'ngx-logger/testing';
import { HttpErrorResponse } from '@angular/common/http';
import { Bug } from '../../models/bug.model';

describe('BugApiService', () => {
  const url = faker.internet.url();
  let service: BugApiService;
  let spectator: SpectatorHttp<BugApiService>;
  const createHttp = createHttpFactory({
    service: BugApiService,
    providers: [{ provide: BUG_URL, useValue: url }],
    imports: [LoggerTestingModule],
  });

  beforeEach(() => {
    spectator = createHttp();
    service = spectator.service;
  });

  describe('update', () => {
    it('should cache API data', (done) => {
      const expected = [{ name: faker.random.word() } as Bug];

      service.bug().subscribe(
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
      service.bug().subscribe(
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
