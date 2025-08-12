import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivateChild,
  CanActivateFn,
  Router,
} from '@angular/router';
import { catchError } from 'rxjs';
import { map } from 'rxjs/operators';
import { AuthService } from '../../user/services/auth/auth.service';

export const permissionGuard: CanActivateFn = (route, state) => {
  if (route && state) return true;
  return true;
};

@Injectable({
  providedIn: 'root',
})
export class PermissionGuard implements CanActivateChild {
  constructor(
    private authService: AuthService,
    private router: Router,
  ) {}

  canActivateChild(childRoute: ActivatedRouteSnapshot) {
    const requiredPermission = childRoute.data['permission'];
    if (requiredPermission === undefined) {
      return true;
    }

    return this.authService.getPermissions().pipe(
      map((permissions) => {
        return !!permissions?.permission.includes(requiredPermission);
      }),
      catchError(() => {
        this.router.navigate(['/login']);
        return [false];
      }),
    );
  }
}
