import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NavBarComponent } from './nav-bar/nav-bar.component';
import { FooterBarComponent } from './footer-bar/footer-bar.component';
import { ItemAreaComponent } from './item-area/item-area.component';
<<<<<<< HEAD
import { ProductPageComponent } from './product-page/product-page.component';
=======
import { LoginModalComponent } from './login-modal/login-modal.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { TestComponent } from './test/test.component';
>>>>>>> 4e603d448607a98e5d61ff8f7014dbbdfe226d02

@NgModule({
  declarations: [
    AppComponent,
    NavBarComponent,
    FooterBarComponent,
<<<<<<< HEAD
    ItemAreaComponent,
    ProductPageComponent
  ], 
=======
    ItemAreaComponent
    LoginModalComponent,
    TestComponent
  ],
>>>>>>> 4e603d448607a98e5d61ff8f7014dbbdfe226d02
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
