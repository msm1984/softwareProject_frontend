import { TestBed } from '@angular/core/testing';
import {
  ActivatedRouteSnapshot,
  Router,
  UrlSegment,
  UrlTree,
} from '@angular/router';
import { Observable, of, throwError } from 'rxjs';
import { AuthGuard } from './auth.guard';
import { AuthService } from '../../user/services/auth/auth.service';

describe('AuthGuard', () => {
  let guard: AuthGuard;
  let authService: jasmine.SpyObj<AuthService>;
  let router: jasmine.SpyObj<Router>;
  let route: ActivatedRouteSnapshot;
  // let state: RouterStateSnapshot;

  beforeEach(() => {
    const authServiceSpy = jasmine.createSpyObj('AuthService', [
      'getPermissions',
    ]);
    const routerSpy = jasmine.createSpyObj('Router', ['navigate', 'parseUrl']);

    TestBed.configureTestingModule({
      providers: [
        AuthGuard,
        { provide: AuthService, useValue: authServiceSpy },
        { provide: Router, useValue: routerSpy },
      ],
    });

    guard = TestBed.inject(AuthGuard);
    authService = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
    router = TestBed.inject(Router) as jasmine.SpyObj<Router>;

    route = {} as ActivatedRouteSnapshot;
    // state = {} as RouterStateSnapshot;
  });

  function createMockUrlSegment(path: string): UrlSegment {
    return new UrlSegment(path, {});
  }

  function handleResult(
    result:
      | boolean
      | UrlTree
      | Observable<boolean | UrlTree>
      | Promise<boolean | UrlTree>,
    done: DoneFn
  ) {
    if (result instanceof Observable) {
      result.subscribe((value) => {
        expect(value).toBeTruthy();
        done();
      });
    } else if (result instanceof Promise) {
      result.then((value) => {
        expect(value).toBeTruthy();
        done();
      });
    } else {
      expect(result).toBeTruthy();
      done();
    }
  }

  it('should allow access to the dashboard if the user has permissions', (done) => {
    const mockPermissions = {
      permission: ['viewDashboard'],
      firstName: 'John',
      lastName: 'Doe',
      image: 'some-image-url',
    };

    route.url = [createMockUrlSegment('dashboard')];

    authService.getPermissions.and.returnValue(of(mockPermissions));

    const result = guard.canActivate();

    handleResult(result, done);
  });

  it('should redirect to /login if the user does not have permissions and tries to access a non-login page', (done) => {
    const mockPermissions = {
      permission: [],
      firstName: 'John',
      lastName: 'Doe',
      image: 'some-image-url',
    };

    route.url = [createMockUrlSegment('dashboard')];

    authService.getPermissions.and.returnValue(of(mockPermissions));
    router.parseUrl.and.returnValue('/login' as unknown as UrlTree);

    const result = guard.canActivate();

    handleResult(result, done);
  });

  it('should navigate to login on error', (done) => {
    route.url = [createMockUrlSegment('dashboard')];
    authService.getPermissions.and.returnValue(throwError('Error'));

    const result = guard.canActivate();

    if (result instanceof Observable) {
      result.subscribe((value) => {
        expect(value).toBe(false);
        expect(router.navigate).toHaveBeenCalledWith(['/login']);
        done();
      });
    } else {
      done.fail('Expected an Observable to be returned');
    }
  });
});
