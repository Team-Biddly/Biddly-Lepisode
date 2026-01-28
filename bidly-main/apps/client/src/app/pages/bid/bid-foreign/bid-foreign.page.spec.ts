import { ComponentFixture, TestBed } from '@angular/core/testing';
import BidForeignPage from './bid-foreign.page';

describe('BidForeignPage', () => {
  let component: BidForeignPage;
  let fixture: ComponentFixture<BidForeignPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BidForeignPage],
    }).compileComponents();

    fixture = TestBed.createComponent(BidForeignPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
