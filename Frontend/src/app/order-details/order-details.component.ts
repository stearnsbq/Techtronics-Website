import { Component, OnInit, EventEmitter, Output, Input } from '@angular/core';
import { LocalstorageService } from '../localstorage.service';
import { ApiService } from '../api.service';

@Component({
  selector: 'app-order-details',
  templateUrl: './order-details.component.html',
  styleUrls: ['./order-details.component.scss']
})
export class OrderDetailsComponent implements OnInit {

  @Input() toggle: boolean;
  @Output() toggleChange: EventEmitter<boolean> = new EventEmitter();


  constructor(private storage: LocalstorageService, public api: ApiService) { }

  ngOnInit() {
  }


  changeToggled(toggle) {
    this.toggle = toggle;
    this.toggleChange.emit(this.toggle);
  }



  onOrder(form) {
    this.storage.cartSubject.subscribe(items => {
      form.items = [];
      form.count = items.length;
      form.price = this.storage.getCartTotal();
      for (const item of items) {
        form.items.push(item.Media_ID);
      }


      this.api.createOrder(form).subscribe(result => {
        console.log(result);
      });

    });
  }

}
