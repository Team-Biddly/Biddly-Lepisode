import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PreStandardFilterComponent } from './pre-standard-filter.component';

describe('PreStandardFilterComponent', () => {
  let component: PreStandardFilterComponent;
  let fixture: ComponentFixture<PreStandardFilterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PreStandardFilterComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(PreStandardFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
