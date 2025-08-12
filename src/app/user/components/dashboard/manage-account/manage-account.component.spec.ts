import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ManageAccountComponent } from './manage-account.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { SharedModule } from '../../../../shared/shared.module';
import { UserInformation } from '../../../models/ManageUsers';
import { of, throwError } from 'rxjs';
import { UserService } from '../../../services/user/user.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { LoadingService } from '../../../../shared/services/loading.service';
import { DangerSuccessNotificationComponent } from '../../../../shared/components/danger-success-notification/danger-success-notification.component';
import { ProfileHeaderComponent } from './profile-header/profile-header.component';
import { MatIconModule } from '@angular/material/icon';

describe('ManageAccountComponent', () => {
  let component: ManageAccountComponent;
  let fixture: ComponentFixture<ManageAccountComponent>;
  let userServiceSpy: jasmine.SpyObj<UserService>;
  let snackBarSpy: jasmine.SpyObj<MatSnackBar>;
  let loadingServiceSpy: jasmine.SpyObj<LoadingService>;

  beforeEach(async () => {
    const userServiceMock = jasmine.createSpyObj('UserService', [
      'updateUser',
      'getLoginUserInfo',
    ]);
    const snackBarMock = jasmine.createSpyObj('MatSnackBar', [
      'openFromComponent',
    ]);
    const loadingServiceMock = jasmine.createSpyObj('LoadingService', [
      'setLoading',
    ]);

    await TestBed.configureTestingModule({
      declarations: [ManageAccountComponent, ProfileHeaderComponent],
      imports: [
        SharedModule,
        MatIconModule,
        ReactiveFormsModule,
        FormsModule,
        MatFormFieldModule,
        MatInputModule,
        MatButtonModule,
        BrowserAnimationsModule,
      ],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: UserService, useValue: userServiceMock },
        { provide: MatSnackBar, useValue: snackBarMock },
        { provide: LoadingService, useValue: loadingServiceMock },
      ],
    }).compileComponents();

    userServiceSpy = TestBed.inject(UserService) as jasmine.SpyObj<UserService>;
    snackBarSpy = TestBed.inject(MatSnackBar) as jasmine.SpyObj<MatSnackBar>;
    loadingServiceSpy = TestBed.inject(
      LoadingService,
    ) as jasmine.SpyObj<LoadingService>;
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ManageAccountComponent);
    component = fixture.componentInstance;
    const mockUserInfo: UserInformation = {
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@example.com',
      phoneNumber: '09123456789',
      image: 'image.jpg',
    };

    userServiceSpy.getLoginUserInfo.and.returnValue(of(mockUserInfo));
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should populate the form with user information on init', () => {
    const mockUserInfo: UserInformation = {
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@example.com',
      phoneNumber: '09123456789',
      image: 'image.jpg',
    };

    userServiceSpy.getLoginUserInfo.and.returnValue(of(mockUserInfo));
    component.ngOnInit();
    fixture.detectChanges();

    expect(component.userInfo).toEqual(mockUserInfo);

    expect(component.myForm.get('firstName')?.value).toBe('John');
    expect(component.myForm.get('lastName')?.value).toBe('Doe');
    expect(component.myForm.get('email')?.value).toBe('john.doe@example.com');
    expect(component.myForm.get('phoneNumber')?.value).toBe('09123456789');
  });

  it('should create a form with controls', () => {
    expect(component.myForm.contains('firstName')).toBeTruthy();
    expect(component.myForm.contains('lastName')).toBeTruthy();
    expect(component.myForm.contains('email')).toBeTruthy();
    expect(component.myForm.contains('phoneNumber')).toBeTruthy();
  });

  it('should make the email control required', () => {
    const emailControl = component.myForm.get('email');
    emailControl?.setValue('');
    expect(emailControl?.valid).toBeFalsy();
  });

  it('should submit the form when valid', () => {
    spyOn(component, 'onSubmit');

    component.myForm.get('firstName')?.setValue('John');
    component.myForm.get('lastName')?.setValue('Doe');
    component.myForm.get('email')?.setValue('john.doe@example.com');
    component.myForm.get('phoneNumber')?.setValue('1234567890');

    const form = fixture.nativeElement.querySelector('form');
    form.dispatchEvent(new Event('submit'));

    expect(component.onSubmit).toHaveBeenCalled();
  });

  it('should reset the form when the reset button is clicked', () => {
    component.userInfo = {
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@example.com',
      phoneNumber: '09123456789',
      image: 'image.jpg',
    };

    component.myForm.patchValue({
      firstName: 'Jane',
      lastName: 'Smith',
      email: 'jane.smith@example.com',
      phoneNumber: '09876543210',
    });

    component.resetUserInfo();

    expect(component.myForm.get('firstName')?.value).toBe(
      component.userInfo.firstName,
    );
    expect(component.myForm.get('lastName')?.value).toBe(
      component.userInfo.lastName,
    );
    expect(component.myForm.get('email')?.value).toBe(component.userInfo.email);
    expect(component.myForm.get('phoneNumber')?.value).toBe(
      component.userInfo.phoneNumber,
    );
  });

  it('should set focusedField when input is focused', () => {
    const firstNameInput = fixture.nativeElement.querySelector(
      'input[name="firstName"]',
    );
    firstNameInput.dispatchEvent(new Event('focus'));

    expect(component.focusedField).toBe('firstName');
  });

  it('should call updateUser and show success notification when form is valid and update is successful', () => {
    // Arrange
    component.myForm.patchValue({
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@example.com',
      phoneNumber: '09123456789',
    });
    component.myForm.markAsDirty();
    userServiceSpy.updateUser.and.returnValue(of({}));

    // Act
    component.onSubmit();

    // Assert
    expect(userServiceSpy.updateUser).toHaveBeenCalledWith(
      component.myForm.value,
    );
    expect(snackBarSpy.openFromComponent).toHaveBeenCalledWith(
      DangerSuccessNotificationComponent,
      {
        data: 'User information updated successfully!',
        panelClass: ['notification-class-success'],
        duration: 2000,
      },
    );
    expect(loadingServiceSpy.setLoading).toHaveBeenCalledWith(false);
    expect(component.userInfo).toEqual(component.myForm.value);
  });

  it('should show error notification when updateUser fails', () => {
    component.myForm.patchValue({
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@example.com',
      phoneNumber: '09123456789',
    });
    component.myForm.markAsDirty();

    const mockError = { error: { message: 'Update failed' } };
    userServiceSpy.updateUser.and.returnValue(throwError(() => mockError));

    component.onSubmit();

    expect(userServiceSpy.updateUser).toHaveBeenCalledWith(
      component.myForm.value,
    );
    expect(snackBarSpy.openFromComponent).toHaveBeenCalledWith(
      DangerSuccessNotificationComponent,
      {
        data: 'Update failed',
        panelClass: ['notification-class-danger'],
        duration: 2000,
      },
    );
    expect(loadingServiceSpy.setLoading).toHaveBeenCalledWith(false);
  });

  it('should not call updateUser if form is invalid', () => {
    // Arrange
    component.myForm.patchValue({
      firstName: '',
      lastName: 'Doe',
      email: 'john.doe@example.com',
      phoneNumber: '09123456789',
    });

    // Act
    component.onSubmit();

    // Assert
    expect(userServiceSpy.updateUser).not.toHaveBeenCalled();
  });
});
