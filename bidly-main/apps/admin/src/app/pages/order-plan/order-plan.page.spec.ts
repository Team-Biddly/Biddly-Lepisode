import { ComponentFixture, TestBed } from '@angular/core/testing';
import { OrderPlanPage } from './order-plan.page';

describe('OrderPlanPage', () => {
  let component: OrderPlanPage;
  let fixture: ComponentFixture<OrderPlanPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OrderPlanPage],
    }).compileComponents();

    fixture = TestBed.createComponent(OrderPlanPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
