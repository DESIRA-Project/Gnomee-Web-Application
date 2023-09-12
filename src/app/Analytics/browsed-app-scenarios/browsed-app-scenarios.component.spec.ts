import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BrowsedAppScenariosComponent } from './browsed-app-scenarios.component';

describe('BrowsedAppScenariosComponent', () => {
  let component: BrowsedAppScenariosComponent;
  let fixture: ComponentFixture<BrowsedAppScenariosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BrowsedAppScenariosComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BrowsedAppScenariosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
