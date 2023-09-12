import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MostPopularValueInFiltersComponent } from './most-popular-value-in-filters.component';

describe('MostPopularValueInFiltersComponent', () => {
  let component: MostPopularValueInFiltersComponent;
  let fixture: ComponentFixture<MostPopularValueInFiltersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MostPopularValueInFiltersComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MostPopularValueInFiltersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
