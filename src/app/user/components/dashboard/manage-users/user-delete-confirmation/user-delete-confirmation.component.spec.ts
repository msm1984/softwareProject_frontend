import { ComponentFixture, TestBed } from '@angular/core/testing';
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { UserDeleteConfirmationComponent } from './user-delete-confirmation.component';
import { AdminService } from '../../../../services/admin/admin.service';
import { of } from 'rxjs';

class MockAdminService {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  deleteUser(guid: string, pageSize: number, pageIndex: number) {
    return of(true); // Mock deleteUser to return an observable
  }
}

describe('UserDeleteConfirmationComponent', () => {
  let component: UserDeleteConfirmationComponent;
  let fixture: ComponentFixture<UserDeleteConfirmationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [UserDeleteConfirmationComponent],
      imports: [MatDialogModule],
      providers: [
        {
          provide: MAT_DIALOG_DATA,
          useValue: {
            user: {
              guid: '12345',
              userName: 'testuser', // Mock data with username
            },
            pagSize: 10,
            pageIndex: 1,
          },
        },
        { provide: MatDialogRef, useValue: {} },
        { provide: AdminService, useClass: MockAdminService },
        provideHttpClient(),
        provideHttpClientTesting(),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(UserDeleteConfirmationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call deleteUser when the delete button is clicked', () => {
    const adminService = TestBed.inject(AdminService);
    spyOn(adminService, 'deleteUser').and.callThrough();

    component.deleteUser();

    expect(adminService.deleteUser).toHaveBeenCalledWith('12345', 10, 1);
  });
});
