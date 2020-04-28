import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ItemAreaComponent } from './item-area/item-area.component';
import { ProductPageComponent } from './product-page/product-page.component';
import { ProfileComponent } from './profile/profile.component';
import { AuthGuard } from './auth.guard';
import { RoleGuardService } from './role-guard.service'; 


const routes: Routes = [

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
