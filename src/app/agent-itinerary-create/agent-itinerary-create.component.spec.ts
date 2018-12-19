import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AgentItineraryCreateComponent } from './agent-itinerary-create.component';

describe('AgentItineraryCreateComponent', () => {
  let component: AgentItineraryCreateComponent;
  let fixture: ComponentFixture<AgentItineraryCreateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AgentItineraryCreateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AgentItineraryCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
