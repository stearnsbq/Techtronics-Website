import { Component, OnInit, AfterViewInit, ElementRef, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Media } from '../model/media';
import { ApiService } from '../api.service';
import {faStar} from '@fortawesome/free-solid-svg-icons';
import { LocalstorageService } from '../localstorage.service';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-product-page',
  templateUrl: './product-page.component.html',
  styleUrls: ['./product-page.component.scss']
})
export class ProductPageComponent implements OnInit, AfterViewInit  {
  public media: Media;
  public star = faStar;
  public selectedImage = 1; 
  public is_logged_in: boolean = false;  

  public is_hardware: boolean = false;  
  public is_software: boolean = false;  
  public is_game: boolean = false;  
  public is_dlc: boolean = false;  
  public is_video: boolean = false; 

  @ViewChild("rating_star1",{static: false}) rstar1: ElementRef; 
  @ViewChild("rating_star2",{static: false}) rstar2: ElementRef; 
  @ViewChild("rating_star3",{static: false}) rstar3: ElementRef; 
  @ViewChild("rating_star4",{static: false}) rstar4: ElementRef; 
  @ViewChild("rating_star5",{static: false}) rstar5: ElementRef; 

  constructor(public auth: AuthService, private route: ActivatedRoute, public storage: LocalstorageService, private api: ApiService, ) {
    storage.syncStorage(); 

    if (auth.isAuthenticated()) { 
      this.is_logged_in = true; 
    }


    



    this.route.params.subscribe(params => {
      const id = params.id;


      // asynchronously executing.
      api.getMediaByID(id).subscribe(media => {
        this.media = media; 

        switch (this.media.Type) { 
          case "Game": {
            this.is_game = true; 
            break; 
          } 
          case "Video": {
            this.is_game = true; 
            break; 
          } 
          case "Hardware": {
            this.is_hardware = true; 
            break; 
          } 
          case "DLC": {
            this.is_dlc = true; 
            break; 
          } 
          case "Software": {
            this.is_software = true;  
            break; 
          } 
        }
        
        this.media.User_Rating = 5;

        if (1 <= this.media.User_Rating) { 
          this.rstar1.nativeElement.style.color = "#f5c433"; 
        } if (2 <= this.media.User_Rating) {
          this.rstar2.nativeElement.style.color = "#f5c433"; 
        } if (3 <= this.media.User_Rating) {
          this.rstar3.nativeElement.style.color = "#f5c433"; 
        }  if (4 <= this.media.User_Rating) {
          this.rstar4.nativeElement.style.color = "#f5c433"; 
        } if (5 == this.media.User_Rating) {
          this.rstar5.nativeElement.style.color = "#f5c433";   
        }
    
      });
      
      


    });

   }

  ngOnInit() { 

  }

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
