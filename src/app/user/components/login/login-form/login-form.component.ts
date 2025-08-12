import { Component } from '@angular/core';
import { LoginRequest } from '../../../models/User';
import { DangerSuccessNotificationComponent } from '../../../../shared/components/danger-success-notification/danger-success-notification.component';
import { AuthService } from '../../../services/auth/auth.service';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { LoadingService } from '../../../../shared/services/loading.service';

@Component({
  selector: 'app-login-form',
  templateUrl: './login-form.component.html',
  styleUrl: './login-form.component.scss',
})
export class LoginFormComponent {
  hide = true;
  checked = false;
  username = '';
  password = '';
  isLoading = false;

  constructor(
    private authService: AuthService,
    private router: Router,
    private _snackBar: MatSnackBar,
    private loadingService: LoadingService
  ) {
    this.loadingService.setLoading(false);
  }

  loginClick() {
    this.isLoading = true;
    this.loadingService.setLoading(true);

    const loginRequest: LoginRequest = {
      username: this.username,
      password: this.password,
      rememberMe: this.checked,
    };

    this.authService.login(loginRequest).subscribe({
      next: () => {
        this._snackBar.openFromComponent(DangerSuccessNotificationComponent, {
          data: 'Logged in successfully.',
          panelClass: ['notification-class-success'],
          duration: 2000,
        });
        this.router.navigate(['/dashboard']);
      },
      error: (error) => {
        this.isLoading = false;
        this.loadingService.setLoading(false);
        this._snackBar.openFromComponent(DangerSuccessNotificationComponent, {
          data: error.error.message,
          panelClass: ['notification-class-danger'],
          duration: 2000,
        });
      },
    });
  }

  hidePassClick() {
    this.hide = !this.hide;
  }
}
