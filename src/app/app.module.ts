import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { environment } from 'src/environments/environment';

import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FISH_URL, BUG_URL } from './core/injection-tokens.store';
import { FishTableComponent } from './fish-table/fish-table.component';
import { MatTableModule } from '@angular/material/table';
import { MonthStringPipe } from './core/month-string/month-string.pipe';
import { LoggerModule, NgxLoggerLevel } from 'ngx-logger';
import { HttpClientModule } from '@angular/common/http';
import { MatSortModule } from '@angular/material/sort';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatInputModule } from '@angular/material/input';

@NgModule({
  declarations: [AppComponent, FishTableComponent, MonthStringPipe],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    MatTableModule,
    MatSortModule,
    MatIconModule,
    MatTooltipModule,
    MatInputModule,
    HttpClientModule,
    LoggerModule.forRoot({
      level: environment.production ? NgxLoggerLevel.ERROR : NgxLoggerLevel.DEBUG,
    }),
  ],
  providers: [
    { provide: FISH_URL, useValue: 'https://www.xhsun.me/acnh-api/data/v1/fish.json' },
    { provide: BUG_URL, useValue: 'https://www.xhsun.me/acnh-api/data/v1/bug.json' },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
