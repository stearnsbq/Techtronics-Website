import { Component, OnInit } from '@angular/core';
import { ApiService } from '../api.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-verify',
  templateUrl: './verify.component.html',
  styleUrls: ['./verify.component.scss']
})
export class VerifyComponent implements OnInit {
  public verified = false;
  public expired = false;
  public invalid = false;

  constructor(private api: ApiService, private activatedRoute: ActivatedRoute) {

    this.activatedRoute.queryParams.subscribe(params => {
      const email = params.email;
      const token = params.token;



      if (email && token) {

        this.api.verifyEmail(email, token).subscribe(result => {
          console.log(result);

          if (result.result === 'success') {
              this.verified = true;
          } else {
            if (result.reason === 'Expired') {
              this.expired = true;
            } else if (result.reason === 'Not Found' || result.reason === 'general error') {
              this.invalid = true;
            }
          }

        });

      } else {
        this.invalid = true;
      }

    });



  }

  ngOnInit() {
  }

}
