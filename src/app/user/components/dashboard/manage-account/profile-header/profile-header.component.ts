import { Component, Input } from '@angular/core';
import { UserInformation } from '../../../../models/ManageUsers';
import { UserService } from '../../../../services/user/user.service';
import { DangerSuccessNotificationComponent } from '../../../../../shared/components/danger-success-notification/danger-success-notification.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { LoadingService } from '../../../../../shared/services/loading.service';

@Component({
  selector: 'app-profile-header',
  templateUrl: './profile-header.component.html',
  styleUrl: './profile-header.component.scss',
})
export class ProfileHeaderComponent {
  @Input({ required: true }) userInfo!: UserInformation;

  constructor(
    private userService: UserService,
    private _snackBar: MatSnackBar,
    private loadingService: LoadingService,
  ) {}

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];

      this.userService.uploadImage(file).subscribe({
        next: () => {
          this._snackBar.openFromComponent(DangerSuccessNotificationComponent, {
            data: 'User profile image updated successfully!',
            panelClass: ['notification-class-success'],
            duration: 2000,
          });

          this.userService.getLoginUserInfo().subscribe({
            next: (data: UserInformation) => {
              this.userInfo = data;
              this.loadingService.setLoading(false);
            },
            error: () => {
              this.loadingService.setLoading(false);
            },
          });

          this.loadingService.setLoading(false);
        },
        error: (error) => {
          this._snackBar.openFromComponent(DangerSuccessNotificationComponent, {
            data: error.error.message,
            panelClass: ['notification-class-danger'],
            duration: 2000,
          });
          this.loadingService.setLoading(false);
        },
      });
    }
  }
}
