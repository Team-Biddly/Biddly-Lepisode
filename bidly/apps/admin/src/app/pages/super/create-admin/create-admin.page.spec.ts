import { ComponentFixture, TestBed } from '@angular/core/testing';
import CreateAdminPage from './create-admin.page';

describe('CreateAdminPage', () => {
  let component: CreateAdminPage;
  let fixture: ComponentFixture<CreateAdminPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateAdminPage],
    }).compileComponents();

    fixture = TestBed.createComponent(CreateAdminPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
