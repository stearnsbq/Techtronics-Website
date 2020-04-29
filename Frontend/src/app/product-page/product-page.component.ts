import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Media } from '../model/media';
import { ApiService } from '../api.service';
import {faStar} from '@fortawesome/free-solid-svg-icons'; 

@Component({
  selector: 'app-product-page',
  templateUrl: './product-page.component.html',
  styleUrls: ['./product-page.component.scss']
})
export class ProductPageComponent implements OnInit {
  public media: Media;
  public star = faStar;

   constructor(private route: ActivatedRoute, private api: ApiService) {
    const params = this.route.params.subscribe(params => {
      const id = params.id;


      api.getMediaByID(id).subscribe(media => {
        this.media = media;
      });



    });

   }

  ngOnInit() {



  }

}
