import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UpdateInfoPage } from './update-info.page';

describe('UpdateInfoPage', () => {
  let component: UpdateInfoPage;
  let fixture: ComponentFixture<UpdateInfoPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UpdateInfoPage],
    }).compileComponents();

    fixture = TestBed.createComponent(UpdateInfoPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
