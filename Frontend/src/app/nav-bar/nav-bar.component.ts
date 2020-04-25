import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SearchService } from '../search.service';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.scss']
})
export class NavBarComponent implements OnInit {

  constructor(private router: Router, private searchService: SearchService, public auth: AuthService ) { }

  ngOnInit() {
  }


  public search(query) {

    this.router.navigate(['/search'], {queryParams: {query}});
    this.searchService.search(query);


  }

}
