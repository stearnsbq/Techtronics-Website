import { Injectable } from '@angular/core';
import { Media } from './model/media';
import { Subject, BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
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
      this._cart = this._cart.filter((a) => a.Media_ID !== media);
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
    if (!this._cart.some((e) => e.Media_ID === media.Media_ID)) {
      this._cart.push(media);

      this._cartSubject.next(this._cart);
      this.saveToStorage();
    }
  }

  getCartTotal() {
    if (!this._cart) {
      return 0;
    }

    let total = 0;
    for (const media of this._cart) {

      if (media.Specials && media.Specials.length > 0) {

        for (const special of media.Specials) {
           total += media.Price / (1 + (special.Percentage_off / 100));
        }

      } else {

        total += media.Price;

      }
    }

    return total.toFixed(2);
  }

  getDiscountPrice(index) {

    if (!this.cart[index] || index > this.cart.length) {
      return 0;
    }

    if (this.cart[index].Specials.length > 0) {
      let total = 0;
      for (const special of this.cart[index].Specials) {
         total += this.cart[index].Price / (1 + (special.Percentage_off / 100));
      }
      return total.toFixed(2);
    }
    return this.cart[index].Price.toFixed(2);
  }


  cartContains(media) {
    if (!media) {
      return;
    }
    return this._cart.some((e) => e.Media_ID === media.Media_ID);
  }

  get cart(): Media[] {
    return this._cart;
  }

  set cart(cart: Media[]) {
    this._cart = cart;
    this.saveToStorage();
  }


  clearCart() {
    this._cart = [];
    this._cartSubject.next(this._cart);
    this.saveToStorage();
  }

  syncStorage() {
    if (localStorage.getItem('cart')) {
      this._cart = JSON.parse(localStorage.getItem('cart'));
      +this._cartSubject.next(this._cart);
    }
  }

  saveToStorage() {
    localStorage.setItem('cart', JSON.stringify(this._cart));
  }

}
