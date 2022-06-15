import { Injectable, Inject } from '@angular/core';
import { ReplaySubject, Observable } from 'rxjs';
import { Fish } from '../../models/fish.model';
import { HttpClient } from '@angular/common/http';
import { NGXLogger } from 'ngx-logger';
import { FISH_URL } from '../../injection-tokens.store';

/**
 * Service for retrieving fish list from API endpoint
 */
@Injectable({
  providedIn: 'root',
})
export class FishApiService {
  private shouldUpdate = true;
  private fishSubject: ReplaySubject<Fish[]>;
  private fishCache: Observable<Fish[]>;

  constructor(private http: HttpClient, private logger: NGXLogger, @Inject(FISH_URL) private readonly url: string) {
    this.fishSubject = new ReplaySubject<Fish[]>(1);
    this.fishCache = this.fishSubject.asObservable();
  }

  /**
   * Observable created from ReplaySubject of the fish list
   */
  /* istanbul ignore next */
  fish(): Observable<Fish[]> {
    if (this.shouldUpdate) {
      this.shouldUpdate = false;
      this.update();
    }
    return this.fishCache;
  }

  /**
   * Get the fish list from API endpoint
   */
  update() {
    return this.http.get<Fish[]>(`${this.url}`).subscribe({
      next: (bugs)=> this.fishSubject.next(bugs),
      error: (err)=>{
        this.logger.error(`FishApiService.update: Unable to retrieve the fish list due to `, err);
        this.fishSubject.next(err);
    }});
  }
}
