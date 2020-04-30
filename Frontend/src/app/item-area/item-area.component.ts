import { Component, OnInit } from '@angular/core';
import { Media } from '../model/media';
import { ApiService } from '../api.service';
import { ActivatedRoute, Router } from '@angular/router';
import { faSadTear } from '@fortawesome/free-regular-svg-icons';
import { SearchService } from '../search.service';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';

@Component({
  selector: 'app-item-area',
  templateUrl: './item-area.component.html',
  styleUrls: ['./item-area.component.scss']
})
export class ItemAreaComponent implements OnInit {
  public ITEMS_PER_PAGES = 12;
  public allMedia: Media[];
  public totalMedia = 0;
  public page = 1;
  public query = '';
  public sort = '';
  public sadtear = faSadTear;

  constructor(public apiService: ApiService, private activatedRoute: ActivatedRoute, private router: Router) {
    this.page = 1;
    this.activatedRoute.queryParams.subscribe(params => {
      this.page = params.page;
      this.query = params.query;
      this.sort = params.sortBy; 

      this.apiService.searchMedia(params.page, params.query, params.sortBy).subscribe(result => {
        this.allMedia = result; 
        this.apiService.totalMedia(params.query).subscribe(total => {
          this.totalMedia = total.total;
        });

      });


    });


  }

  ngOnInit() {



  }


  onRowClick(media) {
    window.scroll(0, 0);
    this.router.navigate(['/product', media]);
  }


  getImage(id: number, fileName: string) {
    return id && fileName ? `${ApiService.API_URL}uploads/media/${id}/${fileName}` : '';
  }


  gotoPage(page) {
    this.page = page;
    this.router.navigate(['/search'], {queryParams: {page, query: this.query, sortBy: this.sort}});
  }


  sortBy(type) {
    switch (type) {
      case 'lth':
        if (this.totalMedia <= this.ITEMS_PER_PAGES) {
          this.allMedia.sort((a, b) => a.Price - b.Price);
        } else {
          this.router.navigate(['/search'], {queryParams: {page: this.page , query: this.query, sortBy: 'asc'}});
        }

        break;
      case 'htl':
        if (this.totalMedia <= this.ITEMS_PER_PAGES) {
          this.allMedia.sort((a, b) => b.Price - a.Price);
        } else {
          this.router.navigate(['/search'], {queryParams: {page: this.page , query: this.query, sortBy: 'desc'}});
        }
        break;
    }
  }



}
