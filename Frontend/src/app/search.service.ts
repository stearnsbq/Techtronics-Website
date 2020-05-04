import { Injectable, EventEmitter } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SearchService {

  public eventEmitter = new EventEmitter<any>();

  constructor() { }

  search(query) {
    this.eventEmitter.emit({query});
  }

}
