import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AgentItinerariesComponent } from './agent-itineraries.component';

describe('AgentItinerariesComponent', () => {
  let component: AgentItinerariesComponent;
  let fixture: ComponentFixture<AgentItinerariesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AgentItinerariesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AgentItinerariesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
