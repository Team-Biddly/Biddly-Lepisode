import { ComponentFixture, TestBed } from '@angular/core/testing';
import { InputKeywordComponent } from './input-keyword.component';

describe('InputKeywordComponent', () => {
  let component: InputKeywordComponent;
  let fixture: ComponentFixture<InputKeywordComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InputKeywordComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(InputKeywordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
