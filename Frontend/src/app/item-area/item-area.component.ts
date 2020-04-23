import { Component, OnInit } from '@angular/core';
import { Media } from '../model/media';
import { ApiService } from '../api.service';
import { ActivatedRoute, Router } from '@angular/router';
import { SearchService } from '../search.service';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';

@Component({
  selector: 'app-item-area',
  templateUrl: './item-area.component.html',
  styleUrls: ['./item-area.component.scss']
})
export class ItemAreaComponent implements OnInit {
  public ITEMS_PER_PAGES = 10;
  public PAGES = 10;
  public allMedia: Media[];
  public totalMedia = 1;
  public page = 1;
  public pages;
  public query = '';

  constructor(public apiService: ApiService, private activatedRoute: ActivatedRoute, private router: Router) {
    this.page = 1;
    this.activatedRoute.queryParams.subscribe(params => {
      this.page = params.page;
      this.query = params.query;

      this.apiService.searchMedia(params.page, params.query).subscribe(result => {
        this.allMedia = result;
        this.apiService.totalMedia(params.query).subscribe(total => {
          this.totalMedia = total.total;
        });

      });


    });


  }

  ngOnInit() {



  }


  getImage(id: number, fileName: string) {
    return id && fileName ? `${this.apiService.API_URL}uploads/media/${id}/${fileName}` : '';
  }


  gotoPage(page) {
    this.page = page;
    this.router.navigate(['/search'], {queryParams: {page, query: this.query}});
  }



}
