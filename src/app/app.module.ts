import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FISH_URL, BUG_URL } from './core/injection-tokens.store';

@NgModule({
  declarations: [AppComponent],
  imports: [BrowserModule, BrowserAnimationsModule],
  providers: [
    { provide: FISH_URL, useValue: 'https://www.xhsun.me/acnh-api/data/v1/fish.json' },
    { provide: BUG_URL, useValue: 'https://www.xhsun.me/acnh-api/data/v1/bug.json' },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
