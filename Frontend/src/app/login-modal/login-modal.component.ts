import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import {
  FormGroup,
  FormControl,
  FormBuilder,
  Validators
} from '@angular/forms';
import {
  faUser,
  faLock,
  faUserCircle,
  faTimesCircle
} from '@fortawesome/free-solid-svg-icons';
import {style, state, animate, transition, trigger} from '@angular/animations';
import { ApiService } from '../api.service';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-login-page',
  templateUrl: './login-modal.component.html',
  styleUrls: ['./login-modal.component.scss']
})
export class LoginModalComponent implements OnInit {
  @ViewChild('Login', undefined) login_modal;
  public submitted: boolean;
  public invalid: boolean;

  // icons for the login
  public user = faUser;
  public lock = faLock;
  public login_icon = faUserCircle;

  constructor(public auth: AuthService, private router: Router) {
    this.submitted = false;
    this.invalid = false;
  }

  ngOnInit() {}

  public onModalOpen() {
    if (
      this.login_modal.nativeElement.style.display === 'none' ||
      this.login_modal.nativeElement.style.display === ''
    ) {
      this.login_modal.nativeElement.style.display = 'block';
    } else {
      this.login_modal.nativeElement.style.display = 'none';
    }
  }


  public onLogout() {
    this.auth.logout();
    this.router.navigate(['login']);
  }

  // login event handler need to refactor as it is a little quirky doe

  public onLogin(formData) {
    this.submitted = true;

    this.auth.login(formData.Username, formData.Password).subscribe(result => {
        if (result) {
          this.onModalOpen();
        }
    }, error => {

      this.invalid = true;



    });


  }
}
