import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EstimateComponentComponent } from './estimate.component';

describe('EstimateComponentComponent', () => {
  let component: EstimateComponentComponent;
  let fixture: ComponentFixture<EstimateComponentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EstimateComponentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EstimateComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
