import {
  AfterViewInit,
  Component,
  ElementRef,
  signal,
  ViewChild,
} from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { LoadingService } from '../../../../shared/services/loading.service';
import { UserService } from '../../../services/user/user.service';
import { DangerSuccessNotificationComponent } from '../../../../shared/components/danger-success-notification/danger-success-notification.component';
import { ActivatedRoute, Router } from '@angular/router';
import { ForgetPasswordRequest } from '../../../models/User';
import { Data, DataSet, Edge, Network, Node } from 'vis';
import { ThemeService } from '../../../../shared/services/theme.service';
import { getOptions, GRAPH_EDGES, GRAPH_NODES } from '../login-graph';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrl: './reset-password.component.scss',
})
export class ResetPasswordComponent implements AfterViewInit {
  hide = signal(true);
  password = '';
  confirmPassword = '';
  isLoading = false;
  @ViewChild('network') el!: ElementRef;
  private networkInstance!: Network;

  constructor(
    private _snackBar: MatSnackBar,
    private loadingService: LoadingService,
    private userService: UserService,
    private router: Router,
    private route: ActivatedRoute,
    private themeService: ThemeService,
  ) {
    this.loadingService.setLoading(false);
  }

  hidePassClick(event: MouseEvent) {
    this.hide.set(!this.hide());
    event.stopPropagation();
  }

  resetClick() {
    this.isLoading = true;
    this.loadingService.setLoading(true);

    const request: ForgetPasswordRequest = {
      email: this.route.snapshot.queryParams['email'],
      resetPasswordToken: this.route.snapshot.queryParams['token'],
      newPassword: this.password,
      confirmPassword: this.confirmPassword,
    };

    this.userService.resetPassword(request).subscribe({
      next: () => {
        this._snackBar.openFromComponent(DangerSuccessNotificationComponent, {
          data: 'Password reset successfully. Now you can login with your new password.',
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

  changeTheme() {
    this.themeService.changeThemeState();
    this.themeService.theme$.subscribe((data) => {
      const themeChanger = document.getElementById(
        'theme-changer-icon',
      ) as HTMLElement;
      themeChanger.textContent = data === 'dark' ? 'light_mode' : 'dark_mode';
      this.networkInstance.setOptions({
        nodes: {
          font: {
            color: data === 'dark' ? 'rgba(255,255,255,0.9)' : '#424242',
          },
        },
      });
    });
  }

  ngAfterViewInit() {
    const dataSetValue = document.body.getAttribute('data-theme');
    const labelColor: string =
      dataSetValue == 'dark' ? 'rgba(255,255,255,0.9)' : '#424242';

    const container = this.el.nativeElement;

    this.createGraph(labelColor, container);
  }

  private createGraph(labelColor: string, container: HTMLElement) {
    const nodes = new DataSet<Node>(GRAPH_NODES as unknown as Node[]);
    const edges = new DataSet<Edge>(GRAPH_EDGES as Edge[]);
    const data: Data = { nodes, edges };
    this.networkInstance = new Network(container, data, getOptions(labelColor));

    this.networkInstance.moveTo({
      animation: true,
      scale: 0.1,
    });
  }
}
