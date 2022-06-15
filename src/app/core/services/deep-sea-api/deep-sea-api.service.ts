import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { NGXLogger } from 'ngx-logger';
import { Observable, ReplaySubject } from 'rxjs';
import { DEEP_SEA_URL } from '../../injection-tokens.store';
import { DeepSea } from '../../models/deep-sea.model';

@Injectable({
  providedIn: 'root'
})
export class DeepSeaApiService {
  private shouldUpdate = true;
  private seaSubject: ReplaySubject<DeepSea[]>;
  private seaCache: Observable<DeepSea[]>;

  constructor(private http: HttpClient, private logger: NGXLogger, @Inject(DEEP_SEA_URL) private readonly url: string) {
    this.seaSubject = new ReplaySubject<DeepSea[]>(1);
    this.seaCache = this.seaSubject.asObservable();
  }

  /**
   * Observable created from ReplaySubject of the deep sea creature list
   */
  /* istanbul ignore next */
  fish(): Observable<DeepSea[]> {
    if (this.shouldUpdate) {
      this.shouldUpdate = false;
      this.update();
    }
    return this.seaCache;
  }

  /**
   * Get the deep sea creature list from API endpoint
   */
  update() {
    return this.http.get<DeepSea[]>(`${this.url}`).subscribe({
      next: (bugs)=> this.seaSubject.next(bugs),
      error: (err)=>{
        this.logger.error(`DeepSeaApiService.update: Unable to retrieve the deep sea creature list due to `, err);
        this.seaSubject.next(err);
    }});
  }
}
