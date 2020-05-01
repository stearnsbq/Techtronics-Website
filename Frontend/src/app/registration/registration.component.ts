import { Component, OnInit } from '@angular/core';
import * as solidIcons from '@fortawesome/free-solid-svg-icons';
import * as regIcons from '@fortawesome/free-regular-svg-icons';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.scss']
})
export class RegistrationComponent implements OnInit {


  constructor() {


  }

  ngOnInit() {
  }


  onRegister(form) {
    console.log(form);

  }

}
