import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PreStandardDetailPage } from './pre-standard-detail.page';

describe('PreStandardDetailPage', () => {
  let component: PreStandardDetailPage;
  let fixture: ComponentFixture<PreStandardDetailPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PreStandardDetailPage],
    }).compileComponents();

    fixture = TestBed.createComponent(PreStandardDetailPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
