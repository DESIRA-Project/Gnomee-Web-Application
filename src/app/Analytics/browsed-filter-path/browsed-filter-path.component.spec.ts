import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BrowsedFilterPathComponent } from './browsed-filter-path.component';

describe('BrowsedFilterPathComponent', () => {
  let component: BrowsedFilterPathComponent;
  let fixture: ComponentFixture<BrowsedFilterPathComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BrowsedFilterPathComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BrowsedFilterPathComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
