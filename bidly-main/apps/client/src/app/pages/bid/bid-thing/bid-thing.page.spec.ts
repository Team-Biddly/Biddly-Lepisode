import { ComponentFixture, TestBed } from '@angular/core/testing';
import BidThingPage from './bid-thing.page';

describe('BidThingPage', () => {
  let component: BidThingPage;
  let fixture: ComponentFixture<BidThingPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BidThingPage],
    }).compileComponents();

    fixture = TestBed.createComponent(BidThingPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
