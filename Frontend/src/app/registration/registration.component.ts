import { Component, OnInit } from '@angular/core';
import * as solidIcons from '@fortawesome/free-solid-svg-icons';
import * as regIcons from '@fortawesome/free-regular-svg-icons';
import { ApiService } from '../api.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.scss']
})
export class RegistrationComponent implements OnInit {


  constructor(private api: ApiService, private router: Router) {


  }

  ngOnInit() {
  }


  onRegister(form) {
    form.account_level = 'Customer';
    form.phoneNumbers = [form.phone_number + ''];
    delete form.phone_number;

    this.api.register(form).subscribe(result => {
      this.router.navigate(['login']);
    });

  }

}
