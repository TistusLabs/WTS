import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AgentItineraryComponent } from './agent-itinerary.component';

describe('AgentItineraryComponent', () => {
  let component: AgentItineraryComponent;
  let fixture: ComponentFixture<AgentItineraryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AgentItineraryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AgentItineraryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
