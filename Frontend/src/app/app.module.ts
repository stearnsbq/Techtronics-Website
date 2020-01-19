import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { SearchAreaComponent } from './search-area/search-area.component';
import { LoginPageComponent } from './login-page/login-page.component';
import { SideNavbarComponent } from './side-navbar/side-navbar.component';
import { MainContentComponent } from './main-content/main-content.component';
import { HardwareContentComponent } from './hardware-content/hardware-content.component';
import { GamesContentComponent } from './games-content/games-content.component';
import { FrontPageContentComponent } from './front-page-content/front-page-content.component';
import { NotFoundComponent } from './not-found/not-found.component';


@NgModule({
  declarations: [
    AppComponent,
    SearchAreaComponent,
    LoginPageComponent,
    SideNavbarComponent,
    MainContentComponent,
    HardwareContentComponent,
    GamesContentComponent,
    FrontPageContentComponent,
    NotFoundComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    AppRoutingModule,
    RouterModule.forRoot([
      {path: '', component: MainContentComponent},
      {path: 'login', component: LoginPageComponent},
      {path: 'hardware/:platform', component: MainContentComponent},
      {path: 'games/:platform', component: MainContentComponent},
      {path: '**', component: NotFoundComponent},
    ]),
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
