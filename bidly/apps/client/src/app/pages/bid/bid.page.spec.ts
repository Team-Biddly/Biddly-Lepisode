import { ComponentFixture, TestBed } from '@angular/core/testing';
import BidPage from './bid.page';

describe('BidPage', () => {
  let component: BidPage;
  let fixture: ComponentFixture<BidPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BidPage],
    }).compileComponents();

    fixture = TestBed.createComponent(BidPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
