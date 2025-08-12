import { Injectable } from '@angular/core';
import { CanActivate, CanActivateFn, Router, UrlTree } from '@angular/router';
import { catchError, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { AuthService } from '../../user/services/auth/auth.service';

export const loginGuard: CanActivateFn = (route, state) => {
  if (route && state) return true;
  return true;
};

@Injectable({
  providedIn: 'root',
})
export class LoginGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate():
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
    return this.authService.getPermissions().pipe(
      map((permissions) => {
        if (permissions?.permission.length) {
          return this.router.parseUrl('/dashboard');
        } else {
          return true;
        }
      }),
      catchError(() => {
        return [true];
      })
    );
  }
}
