import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { Media } from '../model/media';
import {faEdit, faTrash} from '@fortawesome/free-solid-svg-icons';
import { FormArray, FormGroup, FormControl } from '@angular/forms';
import { ApiService } from '../api.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-media-info',
  templateUrl: './media-info.component.html',
  styleUrls: ['./media-info.component.scss']
})
export class MediaInfoComponent implements OnInit {
  @Input() media: Media;
  public selectedImage = 1;
  public editIcon = faEdit;
  public removeIcon = faTrash;

  public editMode = false;

  public control: FormGroup;


  constructor(public api: ApiService, public router: Router) {



  }

  ngOnInit() {
    this.control =  new FormGroup({
      Name: new FormControl(this.media.Name),
      Condition: new FormControl(this.media.Condition),
      Price: new FormControl(this.media.Price),
      Quantity: new FormControl(this.media.Quantity),
      Type: new FormControl(this.media.Type),
      Specials: new FormControl(this.media.Specials),
      Game_Genre: new FormControl(this.media.Game_Genre),
      ESRB_Rating: new FormControl(this.media.ESRB_Rating),
      Video_Genre: new FormControl(this.media.Video_Genre),
      Hardware_Type: new FormControl(this.media.Hardware_Type),
      MPAA_Rating: new FormControl(this.media.MPAA_Rating),
      Software_Type: new FormControl(this.media.Software_Type),
      images: new FormControl(this.media.images),
      companyInfo: new FormControl(this.media.companyInfo),
    });

   
  }

  deleteItem() {
    this.api.deleteMedia(this.media.Media_ID).subscribe(result => {
      location.reload();
    });
  }

  update(field) {
    this.media[field] = this.control.value[field];
  }


  getField(field) {
    return this.control.get(field);
  }


  changeImage(selectedImage) {
    this.selectedImage = selectedImage;
  }

  saveChanges(event) {
    this.api.updateMedia(this.media).subscribe(result => {
        this.media = result;
    });
  }




}
