import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GamesContentComponent } from './games-content.component';

describe('GamesContentComponent', () => {
  let component: GamesContentComponent;
  let fixture: ComponentFixture<GamesContentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GamesContentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GamesContentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
