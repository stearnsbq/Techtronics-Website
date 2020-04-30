import { Component, OnInit } from '@angular/core';
import { Media } from '../model/media';
import { ApiService } from '../api.service';
import * as icons from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-inventory',
  templateUrl: './inventory.component.html',
  styleUrls: ['./inventory.component.scss']
})
export class InventoryComponent implements OnInit {
  public inventory: Media[];
  public page = 1;
  public bottom = false;
  public totalItems = 0;
  public query = '';
  public exitIcon = icons.faTimes;
  public allChecked = false;



  public createNewMediaModalShow = false;
  public createNewSpecialModalShow = false;

  public selectedMediaType = '';

  public games: Media[];
  public editedInventory: any[];

  public showMedia = false;
  public selectedMedia: Media;

  constructor(public api: ApiService) {
    this.inventory = [];
    this.games = [];
    this.editedInventory = [];

    api.searchMedia(this.page, this.query).subscribe(media => {
      console.log(media);
      this.inventory.push.apply(this.inventory, media);
    });

    api.totalMedia().subscribe(count => this.totalItems = count.total);

    api.getGames().subscribe(games => this.games = games );


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


  search() {
    this.page = 1;
    this.bottom = false;
    this.api.searchMedia(this.page, this.query).subscribe(media => {
      this.inventory = media;
    });
  }


  change(event, i) {
    const field = event.target.getAttribute('name');
    const indexOf = this.editedInventory.findIndex(e => e.Media_ID === this.editedInventory[i].Media_ID);

    if (indexOf >= 0) {
       this.editedInventory[indexOf][field] = event.target.outerText;
     } else {
       const copy: any = {};
       copy[field] = event.target.outerText;
       Object.assign(copy, this.inventory[i]);
       this.editedInventory.push(copy);
    }
  }



  showMediaModal(media) {
    this.showMedia = true;
    this.selectedMedia = media;
  }

  save() {
    this.api.updateMedia(this.editedInventory);
  }

  createNew(data) {
    console.log(data);

  }


}
