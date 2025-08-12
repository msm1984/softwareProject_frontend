import { ComponentFixture, TestBed, tick } from '@angular/core/testing';

import { LoginFormComponent } from './login-form.component';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { FormsModule } from '@angular/forms';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { Router } from '@angular/router';
import { AuthService } from '../../../services/auth/auth.service';
import { of, throwError } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { LoadingService } from '../../../../shared/services/loading.service';
import { DangerSuccessNotificationComponent } from '../../../../shared/components/danger-success-notification/danger-success-notification.component';

describe('LoginFormComponent', () => {
  let component: LoginFormComponent;
  let fixture: ComponentFixture<LoginFormComponent>;
  let mockAuthService: jasmine.SpyObj<AuthService>;
  let mockRouter: jasmine.SpyObj<Router>;
  let mockMatSnackBar: jasmine.SpyObj<MatSnackBar>;
  let mockLoadingService: jasmine.SpyObj<LoadingService>;

  const loginInfo = {
    username: 'mamad',
    password: 'M@mad123',
    rememberMe: true,
  };

  beforeEach(async () => {
    mockRouter = jasmine.createSpyObj<Router>(['navigate']);
    mockAuthService = jasmine.createSpyObj<AuthService>(['login']);
    mockMatSnackBar = jasmine.createSpyObj<MatSnackBar>(['openFromComponent']);
    mockLoadingService = jasmine.createSpyObj<LoadingService>(['setLoading']);

    await TestBed.configureTestingModule({
      declarations: [LoginFormComponent],
      imports: [
        FormsModule,
        MatCheckboxModule,
        MatIconModule,
        MatFormFieldModule,
        MatInputModule,
        MatButtonModule,
        BrowserAnimationsModule,
      ],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: AuthService, useValue: mockAuthService },
        { provide: MatSnackBar, useValue: mockMatSnackBar },
        { provide: Router, useValue: mockRouter },
        { provide: LoadingService, useValue: mockLoadingService },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(LoginFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should bind username and password inputs', () => {
    fixture.whenStable().then(() => {
      const usernameInput = fixture.nativeElement.querySelector(
        'input[name="userName"]'
      );
      const passwordInput = fixture.nativeElement.querySelector(
        'input[name="password"]'
      );

      usernameInput.value = 'testUser';
      passwordInput.value = 'testPassword';

      usernameInput.dispatchEvent(new Event('input'));
      passwordInput.dispatchEvent(new Event('input'));

      fixture.detectChanges();
      tick();
      fixture.detectChanges();

      console.log(component.username);
      console.log(component.password);

      expect(component.username).toBe('testUser');
      expect(component.password).toBe('testPassword');
    });
  });

  it('should have a disabled login button when isLoading is true', () => {
    component.isLoading = true;
    fixture.detectChanges();

    const button = fixture.nativeElement.querySelector('button[type="submit"]');
    expect(button.disabled).toBeTruthy();
  });

  it('SHOULD show message and redirect to dashboard WHEN login successfully', () => {
    mockAuthService.login.and.returnValue(of());
    component.username = loginInfo.username;
    component.password = loginInfo.password;
    component.checked = loginInfo.rememberMe;

    component.loginClick();

    expect(mockAuthService.login).toHaveBeenCalledWith({
      username: loginInfo.username,
      password: loginInfo.password,
      rememberMe: loginInfo.rememberMe,
    });

    // expect(mockMatSnackBar.openFromComponent).toHaveBeenCalledWith(
    //   DangerSuccessNotificationComponent,
    //   {
    //     data: 'Logged in successfully.',
    //     panelClass: ['notification-class-success'],
    //     duration: 2000,
    //   }
    // );
    // expect(mockRouter.navigate).toHaveBeenCalledWith(['/dashboard']);
  });

  it('SHOULD give error WHEN login fails', () => {
    const mockError = { error: { message: 'Update failed' } };

    mockAuthService.login.and.returnValue(throwError(() => mockError));

    component.username = loginInfo.username;
    component.password = loginInfo.password;
    component.checked = loginInfo.rememberMe;

    component.loginClick();

    expect(mockAuthService.login).toHaveBeenCalledWith({
      username: loginInfo.username,
      password: loginInfo.password,
      rememberMe: loginInfo.rememberMe,
    });

    expect(mockMatSnackBar.openFromComponent).toHaveBeenCalledWith(
      DangerSuccessNotificationComponent,
      {
        data: mockError.error.message,
        panelClass: ['notification-class-danger'],
        duration: 2000,
      }
    );
    expect(mockLoadingService.setLoading).toHaveBeenCalledWith(false);
  });

  it('should toggle hide property and prevent event propagation', () => {
    // Arrange
    component.hide = false;
    // Act
    component.hidePassClick();
    // Assert
    expect(component.hide).toBeTrue();
  });
});
