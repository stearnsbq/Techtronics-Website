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
  public submitted: boolean;
  public invalid: boolean;

  public showForgotPassword = false;
  public showEmailPrompt = false;

  // icons for the login
  public user = faUser;
  public lock = faLock;
  public login_icon = faUserCircle;

  constructor(public auth: AuthService, private router: Router, public api: ApiService) {
    this.submitted = false;
    this.invalid = false;
  }

  ngOnInit() {}


  public onLogout() {
    this.auth.logout();
    this.router.navigate(['login']);
  }

  // login event handler need to refactor as it is a little quirky doe

  public onLogin(formData) {
    this.submitted = true;

    this.auth.login(formData.Username, formData.Password).subscribe(result => {
        if (result) {
          this.router.navigate(['']);
        }
    }, error => {

      this.invalid = true;



    });


  }


  public async validate(form) {
    const email = form.email;
    const result = await this.api.validateEmail(email).toPromise();

    if (result) {
     await this.api.forgotPassword(email).toPromise().then(result => {
       this.showEmailPrompt = true;
     });
    }
  }


}
