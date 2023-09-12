import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VisitorCountriesComponent } from './visitor-countries.component';

describe('VisitorCountriesComponent', () => {
  let component: VisitorCountriesComponent;
  let fixture: ComponentFixture<VisitorCountriesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VisitorCountriesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VisitorCountriesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
