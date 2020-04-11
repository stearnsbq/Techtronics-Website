import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Media } from './model/media';
import { HttpClient } from '@angular/common/http';


@Injectable({
  providedIn: 'root'
})
export class ApiService {
  public API_URL = 'http://localhost:8080/api/';


  constructor(private http: HttpClient ) { }


  public getDonations(pageNum= '1'): Observable<Media[]> {
    const params = {
    page : pageNum
    };
    return this.http.get<Media[]>(this.API_URL + 'media', {params});
  }


  public searchDonations(pageNum= '1', searchQuery = ''): Observable<Media[]> {
    const params = {
      page : pageNum,
      query: searchQuery
      };

    return this.http.get<Media[]>(`${this.API_URL}media/search`, {params});

  }







}
