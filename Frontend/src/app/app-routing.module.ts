import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ItemAreaComponent } from './item-area/item-area.component';


const routes: Routes = [];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
