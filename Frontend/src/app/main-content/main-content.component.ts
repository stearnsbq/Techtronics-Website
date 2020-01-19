import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-main-content',
  templateUrl: './main-content.component.html',
  styleUrls: ['./main-content.component.scss']
})
export class MainContentComponent implements OnInit {
  public currentRoute: string;
  public params: any;

  constructor(private route: ActivatedRoute) {
    this.currentRoute = '';
    this.params = {};
  }

  ngOnInit() {

    this.route.url.subscribe(url => {
      this.currentRoute = url[0].path;
    });

    this.route.queryParams.subscribe(params => {
      this.params = params;
    });

  }

}
