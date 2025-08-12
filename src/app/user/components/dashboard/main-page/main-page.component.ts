import { AfterContentInit, Component } from '@angular/core';
import { AuthService } from '../../../services/auth/auth.service';
import { LoadingService } from '../../../../shared/services/loading.service';
import { DangerSuccessNotificationComponent } from '../../../../shared/components/danger-success-notification/danger-success-notification.component';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-main-page',
  templateUrl: './main-page.component.html',
  styleUrl: './main-page.component.scss',
})
export class MainPageComponent implements AfterContentInit {
  fullName!: string;

  constructor(
    private authService: AuthService,
    private loadingService: LoadingService,
    private _snackBar: MatSnackBar
  ) {}

  ngAfterContentInit(): void {
    this.authService.getPermissions().subscribe({
      next: (data) => {
        this.fullName = `${data?.firstName} ${data?.lastName}`;
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
