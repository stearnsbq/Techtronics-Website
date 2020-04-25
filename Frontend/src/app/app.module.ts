import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NavBarComponent } from './nav-bar/nav-bar.component';
import { FooterBarComponent } from './footer-bar/footer-bar.component';
import { ItemAreaComponent } from './item-area/item-area.component';
import { ProductPageComponent } from './product-page/product-page.component';
import { LoginModalComponent } from './login-modal/login-modal.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import {NgxPaginationModule} from 'ngx-pagination';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { ApiService } from './api.service';
import { SearchService } from './search.service';
import { JwtModule } from '@auth0/angular-jwt';

export function tokenGetter() {
  return localStorage.getItem('token');
}


@NgModule({
  declarations: [
    AppComponent,
    NavBarComponent,
    FooterBarComponent,
    ItemAreaComponent,
    ProductPageComponent,
    LoginModalComponent,
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    FormsModule,
    JwtModule.forRoot({
      config: {
        tokenGetter,
      }
    }),
    RouterModule.forRoot([
      {path: 'search', component: ItemAreaComponent},
      {path: 'product/:id',  component: ProductPageComponent}
    ]),
    ReactiveFormsModule,
    FontAwesomeModule,
    FontAwesomeModule,
    NgxPaginationModule
  ],
  providers: [
    ApiService,
    SearchService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
