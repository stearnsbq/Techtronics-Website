import { Component, OnInit, Input, Output } from '@angular/core';
import { EventEmitter } from '@angular/core';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.scss']
})
export class ModalComponent implements OnInit {
  @Input() toggle: boolean;
  @Input() title: string;
  @Output() toggleChange: EventEmitter<boolean> = new EventEmitter();

  constructor() {
  }


  changeToggled(toggle) {
    this.toggle = toggle;
    this.toggleChange.emit(this.toggle);
  }

  ngOnInit() {
  }

}
