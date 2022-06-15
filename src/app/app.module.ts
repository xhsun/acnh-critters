import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { environment } from 'src/environments/environment';

import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FISH_URL, BUG_URL, DEEP_SEA_URL } from './core/injection-tokens.store';
import { FishTableComponent } from './fish-table/fish-table.component';
import { MatTableModule } from '@angular/material/table';
import { MonthStringPipe } from './core/month-string/month-string.pipe';
import { LoggerModule, NgxLoggerLevel } from 'ngx-logger';
import { HttpClientModule } from '@angular/common/http';
import { MatSortModule } from '@angular/material/sort';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatInputModule } from '@angular/material/input';
import { BugTableComponent } from './bug-table/bug-table.component';
import { MatTabsModule } from '@angular/material/tabs';
import { MatToolbarModule } from '@angular/material/toolbar';
import { HeaderComponent } from './header/header.component';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { DatePipe } from '@angular/common';

@NgModule({
  declarations: [AppComponent, FishTableComponent, MonthStringPipe, BugTableComponent, HeaderComponent],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    MatTableModule,
    MatSortModule,
    MatIconModule,
    MatTooltipModule,
    MatInputModule,
    MatTabsModule,
    MatToolbarModule,
    MatSelectModule,
    MatButtonToggleModule,
    HttpClientModule,
    LoggerModule.forRoot({
      level: environment.production ? NgxLoggerLevel.ERROR : NgxLoggerLevel.DEBUG,
    }),
  ],
  providers: [
    DatePipe,
    { provide: FISH_URL, useValue: 'https://www.xhsun.me/acnh-api/data/v1/fish.json' },
    { provide: BUG_URL, useValue: 'https://www.xhsun.me/acnh-api/data/v1/bug.json' },
    { provide: DEEP_SEA_URL, useValue: 'https://www.xhsun.me/acnh-api/data/v1/deepSeaCreatures.json' },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
