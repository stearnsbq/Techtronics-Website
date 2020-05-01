import { Injectable } from '@angular/core';
import { Media } from './model/media';
import { Subject, BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LocalstorageService {

  public _cart: Media[];

  public _cartSubject: BehaviorSubject<Media[]>;

  constructor() {
      this._cart = [];
      this._cartSubject = new BehaviorSubject<Media[]>(this._cart);
      this.syncStorage();
  }

  removeItemFromCart(media) {
    if (this._cart) {
      this._cart = this._cart.filter(a => a.Media_ID !== media);
    }
    this._cartSubject.next(this._cart);
    this.saveToStorage();
  }

  itemsInCart() {
    return this._cart.length;
  }

  get cartSubject(): Subject<Media[]> {
    return this._cartSubject;
  }

  addItemToCart(media) {
    if (!this._cart.some(e => e.Media_ID === media.Media_ID)) {
      this._cart.push(media);

      this._cartSubject.next(this._cart);
      this.saveToStorage();
    }
  }


  cartContains(media) {
    return this._cart.some(e => e.Media_ID === media.Media_ID);
  }

  get cart(): Media[] {
    return this._cart;
  }

  set cart(cart: Media[]) {
    this._cart = cart;
    this.saveToStorage();
  }


  syncStorage() {
    if (localStorage.getItem('cart')) {
      this._cart = JSON.parse(localStorage.getItem('cart'));
      this._cartSubject.next(this._cart);   
    }
  }

  saveToStorage() { 
      localStorage.setItem('cart', JSON.stringify(this._cart));
  }

}
