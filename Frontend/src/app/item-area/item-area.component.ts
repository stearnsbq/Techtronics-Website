import { Component, OnInit } from '@angular/core';
import { Media } from '../model/media';
import { ApiService } from '../api.service';
import { ActivatedRoute, Router } from '@angular/router';
import { SearchService } from '../search.service';

@Component({
  selector: 'app-item-area',
  templateUrl: './item-area.component.html',
  styleUrls: ['./item-area.component.scss']
})
export class ItemAreaComponent implements OnInit {
  public ITEMS_PER_PAGES = 10;
  public allMedia: Media[];
  public totalPages = 1;
  public page = 1;
  public query = '';

  constructor(public apiService: ApiService, private activatedRoute: ActivatedRoute, private router: Router) {
    this.page = 1;
    this.activatedRoute.queryParams.subscribe(params => {
      this.page = params.page;
      this.query = params.query;

      this.apiService.searchMedia(params.page, params.query).subscribe(result => {

        this.apiService.totalMedia(params.query).subscribe(total => {
          this.totalPages = Math.ceil(total.total / this.ITEMS_PER_PAGES);
          this.allMedia = result;

        });

      });


    });


  }

  ngOnInit() {



  }


  getImage(id: number, fileName: string) {
    return id && fileName ? `${this.apiService.API_URL}uploads/media/${id}/${fileName}` : '';
  }


  nextPage() {
    this.page++;
    this.router.navigate(['/search'], {queryParams: {page: this.page}});
  }

  prevPage() {
    this.page--;
    this.router.navigate(['/search'], {queryParams: {page: this.page}});
  }


}
