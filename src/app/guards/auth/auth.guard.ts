import { Injectable } from '@angular/core';
import { CanActivate, Router, UrlTree } from '@angular/router';
import { catchError, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { AuthService } from '../../user/services/auth/auth.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate():
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
    return this.authService.getPermissions().pipe(
      map((permissions) => {
        if (permissions?.permission.length) {
          return true;
        } else {
          return this.router.parseUrl('/login');
        }
      }),
      catchError(() => {
        this.router.navigate(['/login']);
        return [false];
      })
    );
  }
}
