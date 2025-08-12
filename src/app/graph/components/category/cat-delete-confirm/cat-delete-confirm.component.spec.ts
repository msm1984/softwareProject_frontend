import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { of, Subscription, throwError } from 'rxjs';
import { CategoryService } from '../../../services/category/category.service';
import { LoadingService } from '../../../../shared/services/loading.service';
import { CatDeleteConfirmComponent } from './cat-delete-confirm.component';
import { DangerSuccessNotificationComponent } from '../../../../shared/components/danger-success-notification/danger-success-notification.component';
import { MatButtonModule } from '@angular/material/button';

describe('CatDeleteConfirmComponent', () => {
  let component: CatDeleteConfirmComponent;
  let fixture: ComponentFixture<CatDeleteConfirmComponent>;
  let categoryServiceSpy: jasmine.SpyObj<CategoryService>;
  let snackBarSpy: jasmine.SpyObj<MatSnackBar>;
  let loadingServiceSpy: jasmine.SpyObj<LoadingService>;

  beforeEach(async () => {
    const categoryServiceMock = jasmine.createSpyObj('CategoryService', [
      'deleteCategory',
      'getCategories',
    ]);
    const snackBarMock = jasmine.createSpyObj('MatSnackBar', [
      'openFromComponent',
    ]);
    const loadingServiceMock = jasmine.createSpyObj('LoadingService', [
      'setLoading',
    ]);

    await TestBed.configureTestingModule({
      declarations: [CatDeleteConfirmComponent],
      imports: [MatDialogModule, MatSnackBarModule, MatButtonModule],
      providers: [
        {
          provide: MAT_DIALOG_DATA,
          useValue: {
            category: { id: 1, name: 'Test Category', totalNumber: 100 },
            pageSize: 10,
            pageIndex: 1,
          },
        },
        { provide: CategoryService, useValue: categoryServiceMock },
        { provide: MatSnackBar, useValue: snackBarMock },
        { provide: LoadingService, useValue: loadingServiceMock },
      ],
    }).compileComponents();

    categoryServiceSpy = TestBed.inject(
      CategoryService,
    ) as jasmine.SpyObj<CategoryService>;
    snackBarSpy = TestBed.inject(MatSnackBar) as jasmine.SpyObj<MatSnackBar>;
    loadingServiceSpy = TestBed.inject(
      LoadingService,
    ) as jasmine.SpyObj<LoadingService>;

    fixture = TestBed.createComponent(CatDeleteConfirmComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call deleteCategory and getCategories on deleteUser success', () => {
    const mockSubscription = new Subscription();

    categoryServiceSpy.deleteCategory.and.returnValue(of({}));
    categoryServiceSpy.getCategories.and.returnValue(mockSubscription);
    component.deleteUser();

    expect(loadingServiceSpy.setLoading).toHaveBeenCalledWith(true);
    expect(categoryServiceSpy.deleteCategory).toHaveBeenCalledWith(1);
    expect(categoryServiceSpy.getCategories).toHaveBeenCalledWith(10, 1);
    expect(snackBarSpy.openFromComponent).toHaveBeenCalledWith(
      DangerSuccessNotificationComponent,
      {
        data: 'Category created successfully.',
        panelClass: ['notification-class-success'],
        duration: 2000,
      },
    );
    expect(loadingServiceSpy.setLoading).toHaveBeenCalledWith(false);
  });

  it('should show error message on deleteUser error', () => {
    const errorResponse = { error: { message: 'Error deleting category' } };
    categoryServiceSpy.deleteCategory.and.returnValue(
      throwError(() => errorResponse),
    );

    component.deleteUser();

    expect(loadingServiceSpy.setLoading).toHaveBeenCalledWith(true);
    expect(categoryServiceSpy.deleteCategory).toHaveBeenCalledWith(1);
    expect(snackBarSpy.openFromComponent).toHaveBeenCalledWith(
      DangerSuccessNotificationComponent,
      {
        data: 'Error deleting category',
        panelClass: ['notification-class-danger'],
        duration: 2000,
      },
    );
    expect(loadingServiceSpy.setLoading).toHaveBeenCalledWith(false);
  });
});
