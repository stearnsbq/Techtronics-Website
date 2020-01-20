import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header-bar',
  templateUrl: './header-bar.component.html',
  styleUrls: ['./header-bar.component.scss']
})
export class HeaderBarComponent implements OnInit {
  @Output() sidebarToggle = new EventEmitter();
  public searchQuery: string;

  constructor(public router: Router) { }

  ngOnInit() {
  }

  public onSearch(key) {

    if (key.keyCode === 13) {
      this.router.navigate(['/search'], {queryParams: {query: this.searchQuery}});
    }

  }


  public onSideBarToggle() {
    this.sidebarToggle.emit('toggle');
  }

}
