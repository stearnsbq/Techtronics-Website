import { Component, OnInit, EventEmitter, Output, Input } from '@angular/core';
import { LocalstorageService } from '../localstorage.service';
import { ApiService } from '../api.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-order-details',
  templateUrl: './order-details.component.html',
  styleUrls: ['./order-details.component.scss']
})
export class OrderDetailsComponent implements OnInit {

  @Input() toggle: boolean;
  @Output() toggleChange: EventEmitter<boolean> = new EventEmitter();


  constructor(private storage: LocalstorageService, public api: ApiService, public router: Router) { }

  ngOnInit() {
  }


  changeToggled(toggle) {
    this.toggle = toggle;
    this.toggleChange.emit(this.toggle);
  }



  onOrder(form) {
     const items = this.storage.cart;

     form.items = [];
     form.count = items.length;
     form.price = this.storage.getCartTotal();
     for (let i = 0 ; i < items.length; i++) {
        form.items.push({Media_ID: items[i].Media_ID, Price: this.storage.getDiscountPrice(i)});
      }

     this.api.createOrder(form).subscribe(result => {
      this.storage.clearCart();
      this.router.navigate(['order_details']);
    });

  }

}
