import { Component, OnInit } from '@angular/core';
import { TabComponent } from '../tab/tab.component';

@Component({
  selector: 'app-tabs',
  templateUrl: './tabs.component.html',
  styleUrls: ['./tabs.component.scss']
})
export class TabsComponent implements OnInit {
  public tabs: TabComponent[];

  constructor() {
    this.tabs = [];
  }

  ngOnInit() {
  }


  addTab(tab: TabComponent) {

    if (this.tabs.length === 0) {
      tab.active = true;
    }

    this.tabs.push(tab);
  }


  selectTab(tab) {
    this.tabs.forEach(currTab => {
      currTab.active = false;
    });
    tab.active = true;
  }

}
