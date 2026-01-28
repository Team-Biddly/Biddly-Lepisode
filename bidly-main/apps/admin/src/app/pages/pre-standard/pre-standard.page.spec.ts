import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PreSpecPage } from './pre-standard.page';

describe('PreSpecPage', () => {
  let component: PreSpecPage;
  let fixture: ComponentFixture<PreSpecPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PreSpecPage],
    }).compileComponents();

    fixture = TestBed.createComponent(PreSpecPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
