import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Media } from '../model/media';
import { ApiService } from '../api.service';
import {faStar} from '@fortawesome/free-solid-svg-icons';
import { LocalstorageService } from '../localstorage.service';

@Component({
  selector: 'app-product-page',
  templateUrl: './product-page.component.html',
  styleUrls: ['./product-page.component.scss']
})
export class ProductPageComponent implements OnInit {
  public media: Media;
  public star = faStar;
  public selectedImage = 1;

   constructor(private route: ActivatedRoute, public storage: LocalstorageService, private api: ApiService) {
     storage.syncStorage();


     this.route.params.subscribe(params => {
      const id = params.id;


      api.getMediaByID(id).subscribe(media => {
        this.media = media;
      });



    });

   }

  ngOnInit() {



  }


  addToCart(media) {

    this.storage.addItemToCart(media);

  }

  changeImage(selectedImage) {
    this.selectedImage = selectedImage;
  }

}
