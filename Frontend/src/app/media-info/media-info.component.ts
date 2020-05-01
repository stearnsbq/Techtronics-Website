import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { Media } from '../model/media';

@Component({
  selector: 'app-media-info',
  templateUrl: './media-info.component.html',
  styleUrls: ['./media-info.component.scss']
})
export class MediaInfoComponent implements OnInit {
  @Input() media: Media;

  constructor() { }

  ngOnInit() {
  }




}
