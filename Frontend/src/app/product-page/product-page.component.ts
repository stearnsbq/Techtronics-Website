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

    this.route.params.subscribe((params) => { 
      const id = params.id;

      // asynchronously executing.
      this.api.getMediaByID(id).subscribe((media) => {
        this.media = media;
      });
    });

  }

  ngOnInit() {}

  ngAfterViewInit() {

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
