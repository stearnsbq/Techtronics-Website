import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { faUser, faLock, faUserCircle } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-login-page',
  templateUrl: './login-modal.component.html',
  styleUrls: ['./login-modal.component.scss']
})
export class LoginModalComponent implements OnInit {
  @ViewChild('Login', undefined) login_modal;
  public submitted: boolean;

  // icons for the login
  public user = faUser;
  public lock = faLock;
  public login_icon = faUserCircle;


  constructor() {
    this.submitted = false;
  }

  ngOnInit() {

  }


  public onModalOpen() {
    if (this.login_modal.nativeElement.style.display === 'none' || this.login_modal.nativeElement.style.display === '') {
      this.login_modal.nativeElement.style.display = 'block';
    } else {
      this.login_modal.nativeElement.style.display = 'none';
    }

  }


  // login event handler need to refactor as it is a little quirky doe

  public onLogin(formData) {

    this.submitted = true;

    console.log(formData);

  }



}
