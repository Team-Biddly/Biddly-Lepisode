import { ComponentFixture, TestBed } from '@angular/core/testing';
import { IntroducePage } from './introduce.page';

describe('IntroducePage', () => {
  let component: IntroducePage;
  let fixture: ComponentFixture<IntroducePage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IntroducePage],
    }).compileComponents();

    fixture = TestBed.createComponent(IntroducePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
