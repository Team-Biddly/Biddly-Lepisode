import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PreStandardItemComponent } from './pre-standard-item.component';

describe('PreStandardItemComponent', () => {
  let component: PreStandardItemComponent;
  let fixture: ComponentFixture<PreStandardItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PreStandardItemComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(PreStandardItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
