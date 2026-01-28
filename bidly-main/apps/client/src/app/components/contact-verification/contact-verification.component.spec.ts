import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ContactVerificationComponent } from './contact-verification.component';

describe('ContactVerificationComponent', () => {
  let component: ContactVerificationComponent;
  let fixture: ComponentFixture<ContactVerificationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ContactVerificationComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ContactVerificationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
