import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { faUser, faLock } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.scss']
})
export class LoginPageComponent implements OnInit {
  public submitted: boolean;
  public user = faUser;
  public lock = faLock;


  constructor() {
    this.submitted = false;
  }

  ngOnInit() {

  }

  public onLogin(formData) {

    this.submitted = true;

    console.log(formData);

  }



}
