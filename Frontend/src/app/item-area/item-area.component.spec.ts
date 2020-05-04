import { async, ComponentFixture, TestBed } from '@angular/core/testing';


import { ItemAreaComponent } from './item-area.component';

describe('ItemAreaComponent', () => {
  let component: ItemAreaComponent;
  let fixture: ComponentFixture<ItemAreaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ItemAreaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ItemAreaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
