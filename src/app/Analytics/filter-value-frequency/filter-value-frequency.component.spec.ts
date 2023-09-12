import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FilterValueFrequencyComponent } from './filter-value-frequency.component';

describe('FilterValueFrequencyComponent', () => {
  let component: FilterValueFrequencyComponent;
  let fixture: ComponentFixture<FilterValueFrequencyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FilterValueFrequencyComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FilterValueFrequencyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
