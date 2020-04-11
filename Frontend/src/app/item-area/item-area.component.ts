import { Component, OnInit } from '@angular/core';
import { Media } from '../model/media';
import { ApiService } from '../api.service';
import { ActivatedRoute } from '@angular/router';
import { SearchService } from '../search.service';

@Component({
  selector: 'app-item-area',
  templateUrl: './item-area.component.html',
  styleUrls: ['./item-area.component.scss']
})
export class ItemAreaComponent implements OnInit {
  public allMedia: Media[];
  public page = '1';
  public query = '';

  constructor(public apiService: ApiService, private activatedRoute: ActivatedRoute) {
    this.activatedRoute.queryParams.subscribe(params => {
      this.page = params.page;
      this.query = params.query;

      apiService.searchDonations(params.page, params.query).subscribe(result => {
        this.allMedia = result;
      });


    });

    apiService.getDonations().subscribe(result => {
      this.allMedia = result;
    });


  }

  ngOnInit() {
  }


  getImage(id: number, fileName: string) {
    return id && fileName ? `${this.apiService.API_URL}uploads/media/${id}/${fileName}` : '';
  }


}
