import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SearchFilterPanelComponent } from './search-filter-panel.component';

describe('SearchFilterPanelComponent', () => {
  let component: SearchFilterPanelComponent;
  let fixture: ComponentFixture<SearchFilterPanelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SearchFilterPanelComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SearchFilterPanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
