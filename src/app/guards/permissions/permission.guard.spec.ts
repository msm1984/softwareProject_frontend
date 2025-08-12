import { TestBed } from '@angular/core/testing';
import {
  ActivatedRouteSnapshot,
  CanActivateChildFn,
  provideRouter,
  Router,
  RouterStateSnapshot,
} from '@angular/router';
import { of, throwError } from 'rxjs';
import { permissionGuard, PermissionGuard } from './permission.guard';
import { AuthService } from '../../user/services/auth/auth.service';

describe('PermissionGuard', () => {
  let guard: PermissionGuard;
  let authService: AuthService;
  let router: Router;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideRouter([]),
        PermissionGuard,
        {
          provide: AuthService,
          useValue: {
            getPermissions: () =>
              of({
                firstName: 'John',
                lastName: 'Doe',
                image: 'some-image-url',
                permission: ['user'],
              }),
          },
        },
      ],
    });
    guard = TestBed.inject(PermissionGuard);
    authService = TestBed.inject(AuthService);
    router = TestBed.inject(Router);
    spyOn(router, 'navigate').and.returnValue(Promise.resolve(true));
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });

  it('should allow activation if permission is granted', () => {
    const route = new ActivatedRouteSnapshot();
    route.data = { permission: 'admin' };

    spyOn(authService, 'getPermissions').and.returnValue(
      of({
        firstName: 'John',
        lastName: 'Doe',
        image: 'some-image-url',
        permission: ['admin'],
      }),
    );

    const result = guard.canActivateChild(route);
    if (typeof result === 'boolean') {
      expect(result).toBe(true);
    } else {
      result.subscribe((res) => {
        expect(res).toBe(true);
      });
    }
  });

  it('should prevent activation if permission is not granted', () => {
    const route = new ActivatedRouteSnapshot();
    route.data = { permission: 'admin' };

    spyOn(authService, 'getPermissions').and.returnValue(
      of({
        firstName: 'John',
        lastName: 'Doe',
        image: 'some-image-url',
        permission: ['user'],
      }),
    );

    const result = guard.canActivateChild(route);
    if (typeof result === 'boolean') {
      expect(result).toBe(false);
    } else {
      result.subscribe((res) => {
        expect(res).toBe(false);
      });
    }
  });

  it('should redirect to login on error', () => {
    const route = new ActivatedRouteSnapshot();
    route.data = { permission: 'admin' };

    spyOn(authService, 'getPermissions').and.returnValue(
      throwError(() => new Error('error')),
    );

    const result = guard.canActivateChild(route);
    if (typeof result === 'boolean') {
      expect(result).toBe(false);
    } else {
      result.subscribe((res) => {
        expect(res).toBe(false);
        expect(router.navigate).toHaveBeenCalledWith(['/login']);
      });
    }
  });
});

describe('permissionGuard', () => {
  const executeGuard: CanActivateChildFn = (...guardParameters) =>
    TestBed.runInInjectionContext(() => permissionGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });

  // fix this test
  it('should always return true (dummy implementation)', () => {
    const mockActivatedRouteSnapshot = {} as ActivatedRouteSnapshot;
    const mockRouterStateSnapshot = {} as RouterStateSnapshot;

    const result = executeGuard(
      mockActivatedRouteSnapshot,
      mockRouterStateSnapshot,
    );
    expect(result).toBe(true);
  });
});
