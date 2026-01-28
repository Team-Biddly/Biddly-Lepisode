import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BookMarkPage } from './book-mark.page';

describe('BookMarkPage', () => {
  let component: BookMarkPage;
  let fixture: ComponentFixture<BookMarkPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BookMarkPage],
    }).compileComponents();

    fixture = TestBed.createComponent(BookMarkPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
