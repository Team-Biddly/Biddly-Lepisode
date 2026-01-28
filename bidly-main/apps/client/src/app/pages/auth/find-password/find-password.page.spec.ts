import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FindPasswordPage } from './find-password.page';

describe('FindPasswordPage', () => {
  let component: FindPasswordPage;
  let fixture: ComponentFixture<FindPasswordPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FindPasswordPage],
    }).compileComponents();

    fixture = TestBed.createComponent(FindPasswordPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
