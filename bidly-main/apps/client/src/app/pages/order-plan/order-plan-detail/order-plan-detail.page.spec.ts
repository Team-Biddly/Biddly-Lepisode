import { ComponentFixture, TestBed } from '@angular/core/testing';
import { OrderPlanDetailPage } from './order-plan-detail.page';

describe('OrderPlanDetailPage', () => {
  let component: OrderPlanDetailPage;
  let fixture: ComponentFixture<OrderPlanDetailPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OrderPlanDetailPage],
    }).compileComponents();

    fixture = TestBed.createComponent(OrderPlanDetailPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
