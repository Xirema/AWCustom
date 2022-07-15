import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import {HttpClientModule} from '@angular/common/http';

import { AppComponent } from './app.component';
import { DataCompletenessCheckerComponent } from './data-completeness-checker/data-completeness-checker.component';
import { ModUploaderComponent } from './mod-uploader/mod-uploader.component';
import { TestComponentComponent } from './test-component/test-component.component';
import { DataCheckerTableComponent, DataCheckerRendererComponent } from './data-checker-table/data-checker-table.component';
import { AppRoutingModule } from './app-routing.module';

@NgModule({
  declarations: [
    AppComponent,
    DataCompletenessCheckerComponent,
    ModUploaderComponent,
    TestComponentComponent,
    DataCheckerTableComponent,
    DataCheckerRendererComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
