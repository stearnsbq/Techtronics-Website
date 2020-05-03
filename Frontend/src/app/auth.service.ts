import { Injectable } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { decode } from 'punycode';
import { Router } from '@angular/router';
import { ApiService } from './api.service';


@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http: HttpClient, private jwt: JwtHelperService, private router: Router) { }


  public login(username: string, password: string) {
    return this.http.post<{token: string}>(`${ApiService.API_URL}auth`, {username, password}).pipe(map(result => {
      if (result.token) {
        localStorage.setItem('token', result.token);
        return true;
      }
      return false;
    }));
  }


  public logout() {
    localStorage.clear();
    this.router.navigate(['']);
  }

  public getToken(): string {
    return localStorage.getItem('token');
  }


  public isAuthenticated(): boolean {
    const token = this.getToken();
    return !this.jwt.isTokenExpired(token);
  }


  public isEmployee(): boolean {
    const token = this.getToken();

    const decoded = this.jwt.decodeToken(token);

    return decoded ? decoded.Account_Level === 'Employee' && this.isAuthenticated() : false;
  }

  public isManager() {
    const token = this.getToken();

    const decoded = this.jwt.decodeToken(token);

    return decoded && this.isEmployee() ? decoded.Employee_Role === 'Manager' && this.isAuthenticated() : false;
  }



}
