import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FindEmailPage } from './find-email.page';

describe('FindEmailPage', () => {
  let component: FindEmailPage;
  let fixture: ComponentFixture<FindEmailPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FindEmailPage],
    }).compileComponents();

    fixture = TestBed.createComponent(FindEmailPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
