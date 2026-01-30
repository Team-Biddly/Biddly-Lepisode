import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MyPagePage } from './my-page.page';

describe('MyPagePage', () => {
  let component: MyPagePage;
  let fixture: ComponentFixture<MyPagePage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MyPagePage],
    }).compileComponents();

    fixture = TestBed.createComponent(MyPagePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
