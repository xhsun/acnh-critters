import { Injectable, Inject } from '@angular/core';
import { BUG_URL } from '../../injection-tokens.store';
import { NGXLogger } from 'ngx-logger';
import { HttpClient } from '@angular/common/http';
import { ReplaySubject, Observable } from 'rxjs';
import { Bug } from '../../models/bug.model';

/**
 * Service for retrieving bug list from API endpoint
 */
@Injectable({
  providedIn: 'root',
})
export class BugApiService {
  private shouldUpdate = true;
  private bugSubject: ReplaySubject<Bug[]>;
  private bugCache: Observable<Bug[]>;

  constructor(private http: HttpClient, private logger: NGXLogger, @Inject(BUG_URL) private readonly url: string) {
    this.bugSubject = new ReplaySubject<Bug[]>(1);
    this.bugCache = this.bugSubject.asObservable();
  }

  /**
   * Observable created from ReplaySubject of the bug list
   */
  /* istanbul ignore next */
  bug(): Observable<Bug[]> {
    if (this.shouldUpdate) {
      this.shouldUpdate = false;
      this.update();
    }
    return this.bugCache;
  }

  /**
   * Get the bug list from API endpoint
   */
  update() {
    return this.http.get<Bug[]>(`${this.url}`).subscribe(
      (s) => this.bugSubject.next(s),
      (err) => {
        this.logger.error(`BugApiService.update: Unable to retrieve the bug list due to `, err);
        this.bugSubject.next(err);
      }
    );
  }
}
