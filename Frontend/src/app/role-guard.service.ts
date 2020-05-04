import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, Router } from '@angular/router';
import { AuthGuard } from './auth.guard';
import { AuthService } from './auth.service';
import { JwtHelperService } from '@auth0/angular-jwt';


@Injectable({
  providedIn: 'root'
})
export class RoleGuardService implements CanActivate {

  constructor(public auth: AuthService, public router: Router, public jwt: JwtHelperService) { }

  canActivate(route: ActivatedRouteSnapshot): boolean {
    const neededRole = route.data.neededRole;

    const token = localStorage.getItem('token');


    const decodedToken = this.jwt.decodeToken(token);


    if (!this.auth.isAuthenticated() || decodedToken.Account_Level !== neededRole) {
      this.router.navigate(['login']);
      return false;
    }


    return true;
  }

}
