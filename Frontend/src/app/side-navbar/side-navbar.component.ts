import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-side-navbar',
  templateUrl: './side-navbar.component.html',
  styleUrls: ['./side-navbar.component.scss']
})
export class SideNavbarComponent implements OnInit {
  public xbox_is_dropdown: boolean;
  public ps_is_dropdown: boolean;
  public nintendo_is_dropdown: boolean;

  constructor() {
    this.xbox_is_dropdown = false;
    this.ps_is_dropdown = false;
    this.nintendo_is_dropdown = false;
   }

  ngOnInit() {
  }

}
