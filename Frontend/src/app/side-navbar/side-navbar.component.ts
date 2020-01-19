import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-side-navbar',
  templateUrl: './side-navbar.component.html',
  styleUrls: ['./side-navbar.component.scss']
})
export class SideNavbarComponent implements OnInit {
  public platform_dropdown: boolean;
  public genre_dropdown: boolean;

  constructor() {
    this.platform_dropdown = false;
    this.genre_dropdown = false;
   }

  ngOnInit() {
  }

}
