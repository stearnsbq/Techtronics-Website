import { Component, OnInit } from '@angular/core';
import { ApiService } from '../api.service'
import { Order } from '../model/order'
import { faSmileWink } from '@fortawesome/free-regular-svg-icons';

@Component({
  selector: 'app-order-history',
  templateUrl: './order-history.component.html',
  styleUrls: ['./order-history.component.scss']
})
export class OrderHistoryComponent implements OnInit {
  public allOrders: Order[]; 
  public has_order_history: boolean = false; 
  public smile_wink = faSmileWink;

  constructor(public api: ApiService) { 
    
    this.api.getOrders().subscribe((order) => {
      this.allOrders = order;  

      this.has_order_history = this.allOrders.length > 0; 

    });

  }

  ngOnInit() { 
  }

}
