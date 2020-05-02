import { Component, OnInit } from '@angular/core';
import { LocalstorageService } from '../localstorage.service';
import { ApiService } from '../api.service';

@Component({
  selector: 'app-order-details',
  templateUrl: './order-details.component.html',
  styleUrls: ['./order-details.component.scss']
})
export class OrderDetailsComponent implements OnInit {

  constructor(private storage: LocalstorageService, public api: ApiService) { }

  ngOnInit() {
  }




  onOrder(form) {
    this.storage.cartSubject.subscribe(items => {
      form.items = [];
      form.count = items.length;
      for (const item of items) {
        form.items.push(item.Media_ID);
      }


      this.api.createOrder(form).subscribe(result => {
        console.log(result);
      });

    });
  }

}
