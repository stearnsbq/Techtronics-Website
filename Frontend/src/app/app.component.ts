import { Component, ViewChild } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  @ViewChild('sidebar', undefined) sidebar;
  @ViewChild('main', undefined) main;
  title = 'CMSC508';
  constructor(public router: Router) {

  }


  public sidebarToggle() {
    if (this.sidebar.nativeElement.style.width === '250px') {
      this.sidebar.nativeElement.style.width = '0';
      this.main.nativeElement.style.marginLeft = '0';
    } else {
      this.sidebar.nativeElement.style.width = '250px';
      this.main.nativeElement.style.marginLeft = '250px';
    }

  }
}
