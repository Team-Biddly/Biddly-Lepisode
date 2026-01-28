import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BidDetailPage } from './bid-detail.page';

describe('BidDetailPage', () => {
  let component: BidDetailPage;
  let fixture: ComponentFixture<BidDetailPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BidDetailPage],
    }).compileComponents();

    fixture = TestBed.createComponent(BidDetailPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
