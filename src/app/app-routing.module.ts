import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router'; // CLI imports router
import{ModUploaderComponent} from './mod-uploader/mod-uploader.component'
import { DataCompletenessCheckerComponent } from './data-completeness-checker/data-completeness-checker.component';
import { GameStateRendererComponent } from './game-state-renderer/game-state-renderer.component';
import { PostTestComponent } from './post-test/post-test.component';
import { TestComponentComponent } from './test-component/test-component.component';
import { PackUploaderComponent } from './mod-uploader/pack-uploader.component';
import { ResourceCheckerComponent } from './resource-checker/resource-checker.component';

const routes: Routes = [
    {path: 'modUpload', component:ModUploaderComponent},
    {path: 'packUpload', component:PackUploaderComponent},
    {path: 'modChecker', component:DataCompletenessCheckerComponent},
    {path: 'game', component:GameStateRendererComponent},
    {path: 'postTest', component:PostTestComponent},
    {path: 'testComponent', component:TestComponentComponent},
    {path: 'packChecker', component:ResourceCheckerComponent}
]; // sets up routes constant where you define your routes

// configures NgModule imports and exports
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }