import { Component, OnInit } from '@angular/core';
import { Media } from '../model/media';
import { ApiService } from '../api.service';

@Component({
  selector: 'app-inventory',
  templateUrl: './inventory.component.html',
  styleUrls: ['./inventory.component.scss']
})
export class InventoryComponent implements OnInit {
  public inventory: Media[];
  public page = 1;
  public bottom = false;
  public query = '';

  constructor(public api: ApiService) {
    this.inventory = [];

    api.searchMedia(this.page, this.query).subscribe(media => {
      console.log(media);
      this.inventory.push.apply(this.inventory, media);
    });

   }

  ngOnInit() {
  }

  // checks when bottom of page is met so we can load more items
  scroll(event) {
    if (event.target.offsetHeight + event.target.scrollTop >= event.target.scrollHeight && !this.bottom) {
      this.page++;
      this.api.searchMedia(this.page, this.query).subscribe(media => {
        if (media.length <= 0) {
          this.bottom = true;
        } else {
          this.inventory.push.apply(this.inventory, media);
        }
      });
    }
  }


  search(event) {
    this.page = 1;
    this.bottom = false;
    this.api.searchMedia(this.page, this.query).subscribe(media => {
      this.inventory = media;
    });
  }

}
