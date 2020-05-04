import { Component, OnInit } from '@angular/core';
import { ApiService } from '../api.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-forgotpassword',
  templateUrl: './forgotpassword.component.html',
  styleUrls: ['./forgotpassword.component.scss']
})
export class ForgotpasswordComponent implements OnInit {
  public passwordsDoNotMatch = false;
  private token: string;
  private email: string;

  constructor(private api: ApiService, private activeRoute: ActivatedRoute, private router: Router) {
    this.activeRoute.queryParams.subscribe(params => {
      this.token = params.token;
      this.email = params.email;
    });
  }

  ngOnInit() {
  }


  async onReset(form) {
    console.log(form);
    const newPassword = form.password;
    const confirm = form.confirm;

    if (newPassword === confirm) {
      const result = await this.api.verifyForgotPassword(this.email, this.token).toPromise();

      if (result.result === 'success') {
        this.api.resetPassword(newPassword, result['reset-token']).subscribe(result => {
              this.router.navigate(['login']);
            });
        }

    } else {
      this.passwordsDoNotMatch = true;
    }

  }
}
