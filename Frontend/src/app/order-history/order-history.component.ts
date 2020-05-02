import { Component, OnInit } from '@angular/core';
import { ApiService } from '../api.service'
import { Order } from '../model/order'

@Component({
  selector: 'app-order-history',
  templateUrl: './order-history.component.html',
  styleUrls: ['./order-history.component.scss']
})
export class OrderHistoryComponent implements OnInit {
  public allOrders: Order[]; 

  constructor(public api: ApiService) { 
    
    this.api.getOrders().subscribe((order) => {
      this.allOrders = order;  
    });

  }

  ngOnInit() { 
  }

}
