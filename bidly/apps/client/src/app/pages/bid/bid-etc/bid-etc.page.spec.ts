import { ComponentFixture, TestBed } from '@angular/core/testing';
import BidEtcPage from './bid-etc.page';

describe('BidEtcPage', () => {
  let component: BidEtcPage;
  let fixture: ComponentFixture<BidEtcPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BidEtcPage],
    }).compileComponents();

    fixture = TestBed.createComponent(BidEtcPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
