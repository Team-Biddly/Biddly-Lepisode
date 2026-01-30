import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DetailAdminPage } from './detail-admin.page';

describe('DetailAdminPage', () => {
  let component: DetailAdminPage;
  let fixture: ComponentFixture<DetailAdminPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DetailAdminPage],
    }).compileComponents();

    fixture = TestBed.createComponent(DetailAdminPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
