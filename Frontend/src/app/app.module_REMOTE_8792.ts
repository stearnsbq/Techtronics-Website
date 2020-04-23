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
import { TestComponent } from './test/test.component';

@NgModule({
  declarations: [
    AppComponent,
    NavBarComponent,
    FooterBarComponent,
    ItemAreaComponent,
    ProductPageComponent,
    LoginModalComponent,
    TestComponent 
  ], 
  imports: [ 
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    FontAwesomeModule, 
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
