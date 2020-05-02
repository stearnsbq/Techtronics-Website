import { Component, OnInit } from '@angular/core';
import { Media } from '../model/media';
import { ApiService } from '../api.service';
import * as icons from '@fortawesome/free-solid-svg-icons';


@Component({
  selector: 'app-inventory',
  templateUrl: './inventory.component.html',
  styleUrls: ['./inventory.component.scss'],
})
export class InventoryComponent implements OnInit {
  public inventory: Media[];
  public page = 1;
  public bottom = false;
  public totalItems = 0;
  public query = '';
  public exitIcon = icons.faTimes;

  public selectedImage: any;

  public createNewMediaModalShow = false;
  public createNewSpecialModalShow = false;

  public selectedMediaType = '';

  public games: Media[];
  public editedInventory: any[];

  public showMedia = false;
  public selectedMedia: Media;

  public publishers: any[];
  public developers: any[];
  public manufacturers: any[];

  public invalidCompany = false;

  public images: File[];
  public imagePreviews: any[];

  public itemsForSpecial: Media[];

  constructor(public api: ApiService) {
    this.inventory = [];
    this.games = [];
    this.editedInventory = [];
    this.publishers = [];
    this.developers = [];
    this.manufacturers = [];
    this.images = [];
    this.imagePreviews = [];
    this.itemsForSpecial = [];

    api.searchMedia(this.page, this.query).subscribe((media) => {
      this.inventory.push.apply(this.inventory, media);
    });

    api.totalMedia().subscribe((count) => (this.totalItems = count.total));

    api.getGames().subscribe((games) => (this.games = games));

    api
      .getDevelopers()
      .subscribe((developers) => (this.developers = developers));

    api
      .getManufacturers()
      .subscribe((manufacturers) => (this.manufacturers = manufacturers));

    api
      .getPublishers()
      .subscribe((publishers) => (this.publishers = publishers));
  }

  ngOnInit() {}

  // checks when bottom of page is met so we can load more items
  scroll(event) {
    if (
      event.target.offsetHeight + event.target.scrollTop >=
        event.target.scrollHeight &&
      !this.bottom
    ) {
      this.page++;
      this.api.searchMedia(this.page, this.query).subscribe((media) => {
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
    this.api.searchMedia(this.page, this.query).subscribe((media) => {
      this.inventory = media;
    });
  }

  change(event, i) {
    const field = event.target.getAttribute('name');
    const indexOf = this.editedInventory.findIndex(
      (e) => e.Media_ID === this.editedInventory[i].Media_ID
    );

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

  getMediaFields(data, type) {
    switch (type) {
      case 'Game':
        return Object.assign(
          {},
          { genre: data.Game_Genre },
          { esrb_rating: data.ESRB },
          data.DLC.length <= 0 ? null : { dlc: data.DLC.length }
        );
      case 'Video':
        return {
          genre: data.Video_Genre,
          mpaa_rating: data.MPAA_Rating,
        };
      case 'Hardware':
        return {
          type: data.Hardware_Type,
        };
      case 'Software':
        return {
          type: data.Software_Type,
        };
    }
  }

  handleImage(images) {
    this.images.push(images[0]);

    const reader = new FileReader();

    reader.onload = e => this.imagePreviews.push(e.target.result);

    reader.readAsDataURL(images[0]);
  }


  changeImage(event) {
    this.selectedImage = event;
  }


  addNewMediaForSpecial(event) {
    this.itemsForSpecial.push(event.target.ngValue);
  }

  createNew(data) {
    console.log(data);
    if (
      data.Publisher.length <= 0 &&
      data.Manufacturer.length <= 0 &&
      data.Developer.length <= 0
    ) {
      this.invalidCompany = true;
    } else {
      const newMedia = {
        name: data.Name,
        platform: data.Platform,
        price: data.Price,
        type: data.Type,
        condition: data.Condition,
        quantity: data.Quantity,
        mediaType: data.Type,
        mediaFields: this.getMediaFields(data, data.Type),
        companyInfo: Object.assign(
          {},
          data.Publisher.length <= 0 ? null : { publisher: data.Publisher },
          data.Developer.length <= 0 ? null : { developer: data.Developer },
          data.Manufacturer.length <= 0 ? null : { manufacturer: data.Manufacturer }
        ),
      };

      this.api.createNewMedia(newMedia).subscribe(result => {
        this.api.uploadFiles(this.images, result.Media_ID).subscribe(result => {
          this.createNewMediaModalShow = false;
        });
      });
    }
  }


  createNewSpecial(data) {
    this.api.createNewSpecial(data).subscribe(result => {});
  }

  getSpecialPrice(media) {
    let price = media.Price;
    for (const special of media.Specials) {
      price /= 1 + (special.Percentage_off / 100);
    }
    return price.toFixed(2);
  }


}
