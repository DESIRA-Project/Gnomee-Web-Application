import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ToolVisitsComponent } from './tool-visits.component';

describe('ToolVisitsComponent', () => {
  let component: ToolVisitsComponent;
  let fixture: ComponentFixture<ToolVisitsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ToolVisitsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ToolVisitsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
