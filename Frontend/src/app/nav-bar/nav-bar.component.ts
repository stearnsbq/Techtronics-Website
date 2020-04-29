import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SearchService } from '../search.service';
import { AuthService } from '../auth.service';
import * as icons from '@fortawesome/free-solid-svg-icons';
import { LocalstorageService } from '../localstorage.service';

@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.scss']
})
export class NavBarComponent implements OnInit {

  public menuShown = false;
  public bars = icons.faBars;
  public cart = icons.faShoppingCart;
  public itemsInCart = 0;


  constructor(private router: Router, public auth: AuthService, public storage: LocalstorageService ) {
    storage.syncStorage();
    storage.cartSubject.subscribe(media => {
      this.itemsInCart = storage.itemsInCart();
    });

  }

  ngOnInit() {
  }


  public search(query) {

    this.router.navigate(['/search'], {queryParams: {query}});
  //  this.searchService.search(query);

  }

  public onLogOut() {
    this.auth.logout();
  }

  public showMenu(event) {
    this.menuShown = !this.menuShown;
  }

}
