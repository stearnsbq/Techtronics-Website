import {
  Component,
  OnInit,
  AfterViewInit,
  ElementRef,
  ViewChild,
  AfterContentInit,
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Media } from '../model/media';
import { ApiService } from '../api.service';
import { faStar } from '@fortawesome/free-solid-svg-icons';
import { LocalstorageService } from '../localstorage.service';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-product-page',
  templateUrl: './product-page.component.html',
  styleUrls: ['./product-page.component.scss'],
})
export class ProductPageComponent implements OnInit, AfterViewInit {
  public media: Media;
  public star = faStar;
  public selectedImage = 1;
  public is_logged_in = false;

  public loaded = false;

  public is_hardware = false;
  public is_software = false;
  public is_game = false;
  public is_dlc = false;
  public is_video = false;

  constructor(
    public auth: AuthService,
    private route: ActivatedRoute,
    public storage: LocalstorageService,
    private api: ApiService
  ) {
    storage.syncStorage();

    if (auth.isAuthenticated()) {
      this.is_logged_in = true;
    }




  }

  ngOnInit() {}

  ngAfterViewInit() {


    this.route.params.subscribe((params) => {
      const id = params.id;

      // asynchronously executing.
      this.api.getMediaByID(id).subscribe((media) => {
        this.media = media;
        this.loaded = true;

        console.log(this.media);
        switch (this.media.Type) {
          case 'Game': {
            this.is_game = true;
            break;
          }
          case 'Video': {
            console.log("chickens");
            this.is_video = true;
            break;
          }
          case 'Hardware': {
            this.is_hardware = true;
            break;
          }
          case 'DLC': {
            this.is_dlc = true;
            break;
          }
          case 'Software': {
            this.is_software = true;
            break;
          }
        }


        

      });
    });


  }

  hoverEvent(event) {
    console.log(event);
  }

  addToCart(media) {
    this.storage.addItemToCart(media);
  }

  changeImage(selectedImage) {
    this.selectedImage = selectedImage;
  }


}
