import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ItineraryBookComponent } from './itinerary-book.component';

describe('ItineraryBookComponent', () => {
  let component: ItineraryBookComponent;
  let fixture: ComponentFixture<ItineraryBookComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ItineraryBookComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ItineraryBookComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
