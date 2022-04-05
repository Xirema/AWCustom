import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { DataCompletenessCheckerComponent } from './data-completeness-checker/data-completeness-checker.component';

@NgModule({
  declarations: [
    AppComponent,
    DataCompletenessCheckerComponent
  ],
  imports: [
    BrowserModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
