import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SearchAreaComponent } from './search-area/search-area.component';
import { SearchAreaResultComponent } from './search-area-result/search-area-result.component';
import { FooterBarComponent } from './footer-bar/footer-bar.component';
import { HeaderBarComponent } from './header-bar/header-bar.component';

@NgModule({
  declarations: [
    AppComponent,
    SearchAreaComponent,
    SearchAreaResultComponent,
    FooterBarComponent,
    HeaderBarComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
