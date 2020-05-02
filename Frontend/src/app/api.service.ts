import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Media } from './model/media';
import { Order } from './model/order';
import { HttpClient, HttpHeaders } from '@angular/common/http';


@Injectable({
  providedIn: 'root'
})
export class ApiService {
  public static API_URL = 'http://3.234.246.29:8081/api/';
  public loading = false;


  constructor(private http: HttpClient ) { }

  public getOrders() {
    return this.http.get<Order[]>(ApiService.API_URL + 'orders');
  }

  public getMedia(pageNum= 1): Observable<Media[]> {
    const params = {
    page : pageNum + ''
    };
    return this.http.get<Media[]>(ApiService.API_URL + 'media', {params});
  }

  public getGames() {
    return this.http.get<Media[]>(ApiService.API_URL + 'media/games');
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


  public createNewMedia(media) {
    return this.http.post<Media>(`${ApiService.API_URL}media/`, media);
  }

  public updateMedia(media) {
    return this.http.put<any>(`${ApiService.API_URL}media/`, media);
  }

  public getDevelopers() {
    return this.http.get<any>(`${ApiService.API_URL}companies/developers`);
  }

  public getPublishers() {
    return this.http.get<any>(`${ApiService.API_URL}companies/publishers`);
  }

  public getManufacturers() {
    return this.http.get<any>(`${ApiService.API_URL}companies/manufacturers`);
  }

  public uploadFiles(files, media_id) {
    const formData = new FormData();

    formData.append('media', media_id);

    for (const file of files) {
      console.log(file);
      formData.append('media_image', file, 'work boy');
    }


    return this.http.post<any>(`${ApiService.API_URL}media/upload`, formData);

  }

  public createNewSpecial(special) {
    return this.http.post(`${ApiService.API_URL}media/specials/`, special, {responseType: 'text'});
  }


  public register(data) {
    return this.http.post(`${ApiService.API_URL}register`, data, {responseType: 'text'});
  }


  public createOrder(order) {
    return this.http.post(`${ApiService.API_URL}orders`, order);

  }





}
