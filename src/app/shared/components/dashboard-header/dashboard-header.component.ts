import { AfterViewInit, Component, Input } from '@angular/core';
import { ThemeService } from '../../services/theme.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService } from '../../../user/services/auth/auth.service';
import { DangerSuccessNotificationComponent } from '../danger-success-notification/danger-success-notification.component';
import { LoadingService } from '../../services/loading.service';
import { UserInformation } from '../../../user/models/ManageUsers';

@Component({
  selector: 'app-dashboard-header',
  templateUrl: './dashboard-header.component.html',
  styleUrl: './dashboard-header.component.scss',
})
export class DashboardHeaderComponent implements AfterViewInit {
  @Input({ required: true }) title = '';
  @Input() userInfo!: UserInformation;
  profilePic = 'empty-profile.png';

  constructor(
    private themeService: ThemeService,
    private _snackBar: MatSnackBar,
    private authService: AuthService,
    private loadingService: LoadingService,
  ) {}

  ngAfterViewInit(): void {
    this.authService.getPermissions().subscribe({
      next: (data) => {
        console.log(123, data);
        this.profilePic =
          data?.image == 'default-image-url' || !data?.image
            ? 'empty-profile.png'
            : data?.image;
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

  changeTheme() {
    this.themeService.changeThemeState();
    this.themeService.theme$.subscribe((data) => {
      const themeChanger = document.getElementById(
        'theme-changer-icon',
      ) as HTMLElement;
      themeChanger.textContent = data === 'dark' ? 'light_mode' : 'dark_mode';
    });
  }

  infoClick() {
    this._snackBar.open(
      "No Problem! Here's the Information About the Mercedes CLR GTR",
      'LOL',
      {
        duration: 2000,
        panelClass: ['info-notification'],
      },
    );
  }
}
