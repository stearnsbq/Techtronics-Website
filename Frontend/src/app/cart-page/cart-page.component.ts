import { Component, OnInit } from '@angular/core';
import { Media } from '../model/media';
import { LocalstorageService } from '../localstorage.service';
import { faMinus, faStar } from '@fortawesome/free-solid-svg-icons';
import { IconDefinition } from '@fortawesome/free-regular-svg-icons';
import { AuthService } from '../auth.service';
import { faSurprise } from '@fortawesome/free-regular-svg-icons';

@Component({
  selector: 'app-cart-page',
  templateUrl: './cart-page.component.html',
  styleUrls: ['./cart-page.component.scss'],
})
export class CartPageComponent implements OnInit {
  public allMedia: Media[];
  public minus: IconDefinition = faMinus;
  public star: IconDefinition = faStar;
  public has_items = false;
  public surprise: IconDefinition = faSurprise;

  ngOnInit() {}

  constructor(public local_storage: LocalstorageService) {
    local_storage.cartSubject.subscribe((media) => {
      this.allMedia = media;

      this.has_items = local_storage.itemsInCart() > 0;
    });
  }

  remove_from_cart(media) {
    this.local_storage.removeItemFromCart(media);
  }

  getDiscountPrice(index) {

    if (this.allMedia[index].Specials.length > 0) {
      let total = 0;
      for (const special of this.allMedia[index].Specials) {
         total += this.allMedia[index].Price / (1 + (special.Percentage_off / 100));
      }
      return total.toFixed(2);
    }
    return this.allMedia[index].Price.toFixed(2);
  }

  getTotalPrice() {
    let total = 0;
    for (const media of this.allMedia) {

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
}
