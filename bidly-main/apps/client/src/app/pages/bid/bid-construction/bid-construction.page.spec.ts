import { ComponentFixture, TestBed } from '@angular/core/testing';
import BidConstructionPage from './bid-construction.page';

describe('BidConstructionPage', () => {
  let component: BidConstructionPage;
  let fixture: ComponentFixture<BidConstructionPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BidConstructionPage],
    }).compileComponents();

    fixture = TestBed.createComponent(BidConstructionPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
