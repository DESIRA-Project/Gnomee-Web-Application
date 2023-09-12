import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { AdvancedSearchComponent } from './ToolFilterPage/advanced-search.component';

describe('AppComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        RouterTestingModule
      ],
      declarations: [
        AdvancedSearchComponent
      ],
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AdvancedSearchComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it(`should have as title 'KnowledgeBaseTool-Frontend'`, () => {
    const fixture = TestBed.createComponent(AdvancedSearchComponent);
    const app = fixture.componentInstance;
    expect(app.title).toEqual('KnowledgeBaseTool-Frontend');
  });

  it('should render title', () => {
    const fixture = TestBed.createComponent(AdvancedSearchComponent);
    fixture.detectChanges();
    const compiled = fixture.nativeElement;
    expect(compiled.querySelector('.content span').textContent).toContain('KnowledgeBaseTool-Frontend app is running!');
  });
});
