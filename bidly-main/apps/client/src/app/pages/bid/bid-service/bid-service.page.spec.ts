import { ComponentFixture, TestBed } from '@angular/core/testing';
import BidServicePage from './bid-service.page';

describe('BidServicePage', () => {
  let component: BidServicePage;
  let fixture: ComponentFixture<BidServicePage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BidServicePage],
    }).compileComponents();

    fixture = TestBed.createComponent(BidServicePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
