import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import {HttpClientModule} from '@angular/common/http';

import { AppComponent } from './app.component';
import { DataCompletenessCheckerComponent } from './data-completeness-checker/data-completeness-checker.component';
import { ModUploaderComponent } from './mod-uploader/mod-uploader.component';
import { TestComponentComponent } from './test-component/test-component.component';
import { DataCheckerTableComponent } from './data-checker-table/data-checker-table.component';

@NgModule({
  declarations: [
    AppComponent,
    DataCompletenessCheckerComponent,
    ModUploaderComponent,
    TestComponentComponent,
    DataCheckerTableComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
