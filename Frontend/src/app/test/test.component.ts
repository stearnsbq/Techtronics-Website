import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-test',
  templateUrl: './test.component.html',
  styleUrls: ['./test.component.scss']
})
export class TestComponent implements OnInit {
  public pages: number[] = [];
  public items: any[] = [];
  public currentPage: number;
  constructor() {
    this.currentPage = 0;
    this.pages = Array(5).fill(0).map((x, i) => i);
    for (let i = 0; i < 125; i++) {
      this.items[i] = {
        bleh: 'boob'
      };
    }
  }

  ngOnInit() {
  }

}
