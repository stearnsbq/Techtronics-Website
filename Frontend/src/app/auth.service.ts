import { Injectable } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { decode } from 'punycode';
import { Router } from '@angular/router';


@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private API_URL = 'http://3.234.246.29:8081/api/';

  constructor(private http: HttpClient, private jwt: JwtHelperService, private router: Router) { }


  public login(username: string, password: string) {
    return this.http.post<{token: string}>(`${this.API_URL}auth`, {username, password}).pipe(map(result => {
      if (result.token) {
        localStorage.setItem('token', result.token);
        return true;
      }
      return false;
    }));
  }


  public logout() {
    localStorage.removeItem('token');
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



}
