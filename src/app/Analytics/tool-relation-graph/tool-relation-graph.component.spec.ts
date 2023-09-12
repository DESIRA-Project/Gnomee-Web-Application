import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ToolRelationGraphComponent } from './tool-relation-graph.component';

describe('ToolRelationGraphComponent', () => {
  let component: ToolRelationGraphComponent;
  let fixture: ComponentFixture<ToolRelationGraphComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ToolRelationGraphComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ToolRelationGraphComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
