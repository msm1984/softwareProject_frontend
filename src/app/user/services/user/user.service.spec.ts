import { TestBed } from '@angular/core/testing';
import { UserService } from './user.service';
import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';
import { LoadingService } from '../../../shared/services/loading.service';
import { ForgetPasswordRequest, NewPasswordRequest } from '../../models/User';
import { UserInformation } from '../../models/ManageUsers';
import { environment } from '../../../../../api-config/api-url';
import { provideHttpClient } from '@angular/common/http';

describe('UserService', () => {
  let service: UserService;
  let httpMock: HttpTestingController;
  let loadingService: jasmine.SpyObj<LoadingService>;
  const apiUrl = environment.apiUrl + '/api/User';

  beforeEach(() => {
    const loadingSpy = jasmine.createSpyObj('LoadingService', ['setLoading']);

    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        UserService,
        { provide: LoadingService, useValue: loadingSpy },
      ],
    });

    service = TestBed.inject(UserService);
    httpMock = TestBed.inject(HttpTestingController);
    loadingService = TestBed.inject(
      LoadingService,
    ) as jasmine.SpyObj<LoadingService>;
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should send request-reset-password request', () => {
    const email = 'test@example.com';

    service.requestResetPassword(email).subscribe();

    const req = httpMock.expectOne(`${apiUrl}/request-reset-password`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual({ email });
    expect(loadingService.setLoading).toHaveBeenCalledWith(true);
    req.flush({});
  });

  it('should send reset-password request', () => {
    const resetRequest: ForgetPasswordRequest = {
      email: 'test@example.com',
      resetPasswordToken: '123456',
      newPassword: 'newpassword123',
      confirmPassword: 'newpassword123',
    };

    service.resetPassword(resetRequest).subscribe();

    const req = httpMock.expectOne(`${apiUrl}/reset-password`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(resetRequest);
    expect(loadingService.setLoading).toHaveBeenCalledWith(true);
    req.flush({});
  });

  it('should send new-password request', () => {
    const newPasswordRequest: NewPasswordRequest = {
      oldPassword: 'oldpassword123',
      newPassword: 'newpassword123',
      confirmPassword: 'newpassword123',
    };

    service.newPassword(newPasswordRequest).subscribe();

    const req = httpMock.expectOne(`${apiUrl}/new-password`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(newPasswordRequest);
    expect(loadingService.setLoading).toHaveBeenCalledWith(true);
    req.flush({});
  });

  it('should get login user information', () => {
    const mockUserInfo: UserInformation = {
      firstName: 'string',
      lastName: 'string',
      email: 'test@example.com',
      phoneNumber: '09121112233',
      image: 'string.jpg',
    };

    service.getLoginUserInfo().subscribe((userInfo) => {
      expect(userInfo).toEqual(mockUserInfo);
    });

    const req = httpMock.expectOne(`${apiUrl}/get-user-information`);
    expect(req.request.method).toBe('GET');
    expect(loadingService.setLoading).toHaveBeenCalledWith(true);
    req.flush(mockUserInfo);
  });

  it('should send update-user request', () => {
    const userInfo: UserInformation = {
      firstName: 'string',
      lastName: 'string',
      email: 'test@example.com',
      phoneNumber: '09121112233',
      image: 'string.jpg',
    };

    service.updateUser(userInfo).subscribe();

    const req = httpMock.expectOne(`${apiUrl}/update-user`);
    expect(req.request.method).toBe('PUT');
    expect(req.request.body).toEqual(userInfo);
    expect(loadingService.setLoading).toHaveBeenCalledWith(true);
    req.flush({});
  });

  it('should upload image', () => {
    const file = new File([''], 'filename.jpg');

    service.uploadImage(file).subscribe();

    const req = httpMock.expectOne(`${apiUrl}/upload-image`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body instanceof FormData).toBeTrue();
    expect(req.request.withCredentials).toBeTrue();
    expect(loadingService.setLoading).toHaveBeenCalledWith(true);
    req.flush({});
  });
});
