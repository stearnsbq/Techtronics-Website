import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchAreaResultComponent } from './search-area-result.component';

describe('SearchAreaResultComponent', () => {
  let component: SearchAreaResultComponent;
  let fixture: ComponentFixture<SearchAreaResultComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SearchAreaResultComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchAreaResultComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
