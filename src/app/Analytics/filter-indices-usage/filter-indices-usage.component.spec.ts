import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FilterIndicesUsageComponent } from './filter-indices-usage.component';

describe('FilterIndicesUsageComponent', () => {
  let component: FilterIndicesUsageComponent;
  let fixture: ComponentFixture<FilterIndicesUsageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FilterIndicesUsageComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FilterIndicesUsageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
