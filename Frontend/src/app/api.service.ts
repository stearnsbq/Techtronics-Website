import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Media } from './model/media';
import { HttpClient } from '@angular/common/http';


@Injectable({
  providedIn: 'root'
})
export class ApiService {
  public static API_URL = 'http://3.234.246.29:8081/api/';
  public loading = false;


  constructor(private http: HttpClient ) { }


  public getMedia(pageNum= 1): Observable<Media[]> {
    const params = {
    page : pageNum + ''
    };
    return this.http.get<Media[]>(ApiService.API_URL + 'media', {params});
  }


  public getMediaByID(id): Observable<Media> {
    return this.http.get<Media>(ApiService.API_URL + 'media/' + id);
  }


  public searchMedia(pageNum, searchQuery = '', sortBy= 'DESC'): Observable<Media[]> {
    const params = {
      page : pageNum + '',
      query: searchQuery,
      sortBy
      };

    return this.http.get<Media[]>(`${ApiService.API_URL}media/search`, {params});

  }


  public totalMedia(searchQuery = '') {
    const params = {
      query: searchQuery
      };
    return this.http.get<any>(`${ApiService.API_URL}media/total`, {params});
  }



  public login(form) {
    return this.http.post<any>(`${ApiService.API_URL}auth/`, form);
  }







}
