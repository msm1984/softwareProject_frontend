import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth/auth.service';
import { Router } from '@angular/router';
import { LoadingService } from '../../../shared/services/loading.service';
import { LINKS } from './menu';

/** @title Responsive sidenav */
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
})
export class DashboardComponent implements OnInit {
  protected readonly links = LINKS;
  protected permissions: string[] = [];

  constructor(
    private authService: AuthService,
    private router: Router,
    private loadingService: LoadingService
  ) {}

  ngOnInit(): void {
    this.authService.getPermissions().subscribe((data) => {
      this.permissions = data!.permission;
    });
  }

  logoutClick() {
    this.loadingService.setLoading(true);
    this.authService.logout().subscribe(() => {
      this.router.navigate(['/login']);
    });
  }
}
