import { Component } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { LoadingService } from '../../../../shared/services/loading.service';
import { UserService } from '../../../services/user/user.service';
import { DangerSuccessNotificationComponent } from '../../../../shared/components/danger-success-notification/danger-success-notification.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-recover-pass-form',
  templateUrl: './recover-pass-form.component.html',
  styleUrl: './recover-pass-form.component.scss',
})
export class RecoverPassFormComponent {
  isLoading = false;
  recover_email = '';

  constructor(
    private _snackBar: MatSnackBar,
    private loadingService: LoadingService,
    private userService: UserService,
    private router: Router,
  ) {
    this.loadingService.setLoading(false);
  }

  recoverClick(event: Event) {
    event.preventDefault();
    this.isLoading = true;
    this.userService.requestResetPassword(this.recover_email).subscribe({
      next: () => {
        this._snackBar.openFromComponent(DangerSuccessNotificationComponent, {
          data: 'Password reset link sent to your email.\nPlease check your email.',
          panelClass: ['notification-class-success'],
          duration: 5000,
        });
        this.router.navigate(['/login']);
        this.loadingService.setLoading(false);
        this.isLoading = false;
      },
      error: (error) => {
        this._snackBar.openFromComponent(DangerSuccessNotificationComponent, {
          data: error.error.message,
          panelClass: ['notification-class-danger'],
          duration: 2000,
        });
        this.loadingService.setLoading(false);
        this.isLoading = false;
      },
    });
  }
}
