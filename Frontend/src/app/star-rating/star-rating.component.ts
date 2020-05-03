import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-star-rating',
  templateUrl: './star-rating.component.html',
  styleUrls: ['./star-rating.component.scss']
})
export class StarRatingComponent implements OnInit {
  @Input() starCount: number;
  @Input() rating: number;
  @Input() readOnly: boolean;
  @Input() fontSize: number = 25;
  public selected = -1;

  constructor() {

  }

  ngOnInit() {
  }


  select(i) {
    if (!this.readOnly) {
      this.selected = i;
    }
  }

}
