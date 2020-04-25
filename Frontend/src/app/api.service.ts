import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Media } from './model/media';
import { HttpClient } from '@angular/common/http';


@Injectable({
  providedIn: 'root'
})
export class ApiService {
  public API_URL = 'http://localhost:8081/api/';


  constructor(private http: HttpClient ) { }


  public getMedia(pageNum): Observable<Media[]> {
    const params = {
    page : pageNum + ''
    };
    return this.http.get<Media[]>(this.API_URL + 'media', {params});
  }


  public getMediaByID(id): Observable<Media> {
    return this.http.get<Media>(this.API_URL + 'media/' + id);
  }


  public searchMedia(pageNum, searchQuery = ''): Observable<Media[]> {
    const params = {
      page : pageNum + '',
      query: searchQuery
      };

    return this.http.get<Media[]>(`${this.API_URL}media/search`, {params});

  }


  public totalMedia(searchQuery = '') {
    const params = {
      query: searchQuery
      };
    return this.http.get<any>(`${this.API_URL}media/total`, {params});
  }



  public login(form) {
    return this.http.post<any>(`${this.API_URL}auth/`, form);
  }







}
