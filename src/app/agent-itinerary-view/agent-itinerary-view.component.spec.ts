import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AgentItineraryViewComponent } from './agent-itinerary-view.component';

describe('AgentItineraryViewComponent', () => {
  let component: AgentItineraryViewComponent;
  let fixture: ComponentFixture<AgentItineraryViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AgentItineraryViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AgentItineraryViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
