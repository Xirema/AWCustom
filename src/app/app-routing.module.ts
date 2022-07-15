import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router'; // CLI imports router
import{ModUploaderComponent} from './mod-uploader/mod-uploader.component'
import { DataCompletenessCheckerComponent } from './data-completeness-checker/data-completeness-checker.component';

const routes: Routes = [
    {path: 'modUpload', component:ModUploaderComponent},
    {path: 'dataChecker', component:DataCompletenessCheckerComponent}
]; // sets up routes constant where you define your routes

// configures NgModule imports and exports
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }