import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';
import { AdminService } from './admin.service';
import { LoadingService } from '../../../shared/services/loading.service';
import { RegisterRequest, UpdateUserRequest } from '../../models/User';
import { GetUserResponse } from '../../models/ManageUsers';
import { environment } from '../../../../../api-config/api-url';

describe('AdminService', () => {
  let service: AdminService;
  let httpTestingController: HttpTestingController;
  let loadingServiceSpy: jasmine.SpyObj<LoadingService>;

  beforeEach(() => {
    const loadingServiceMock = jasmine.createSpyObj('LoadingService', [
      'setLoading',
    ]);

    TestBed.configureTestingModule({
      providers: [
        AdminService,
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: LoadingService, useValue: loadingServiceMock },
      ],
    });

    service = TestBed.inject(AdminService);
    httpTestingController = TestBed.inject(HttpTestingController);
    loadingServiceSpy = TestBed.inject(
      LoadingService
    ) as jasmine.SpyObj<LoadingService>;
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should call setLoading(true), make a POST request, and trigger notification on createUser', () => {
    const request: RegisterRequest = {
      username: 'newuser',
      password: 'password123',
      confirmPassword: 'password123',
      firstName: 'New',
      lastName: 'User',
      email: 'newuser@example.com',
      phoneNumber: '1234567890',
      roleName: 'User',
    };
    const pageSize = 10;
    const pageIndex = 0;

    service.createUser(request, pageSize, pageIndex);

    expect(loadingServiceSpy.setLoading).toHaveBeenCalledWith(true);

    const postReq = httpTestingController.expectOne(
      `${environment.apiUrl}/api/Admin/register`
    );
    expect(postReq.request.method).toEqual('POST');
    expect(postReq.request.body).toEqual(request);
    expect(postReq.request.withCredentials).toBeTrue();

    postReq.flush({});

    // Handle the GET request triggered by getUsers
    const getReq = httpTestingController.expectOne(
      `${environment.apiUrl}/api/Admin/users?limit=${pageSize}&page=${pageIndex}`
    );
    expect(getReq.request.method).toEqual('GET');
    expect(getReq.request.withCredentials).toBeTrue();

    getReq.flush({
      users: [],
      count: 0,
      thisPage: pageIndex,
    });

    service.notification$.subscribe((notification) => {
      expect(notification.status).toBeTrue();
      expect(notification.message).toBe('User added successfully!');
    });

    expect(loadingServiceSpy.setLoading).toHaveBeenCalledWith(false);
  });

  it('should call setLoading(true), make a GET request, and update usersData on getUsers', () => {
    const mockResponse: GetUserResponse = {
      users: [
        {
          guid: '1',
          userName: 'user1',
          firstName: 'User',
          lastName: 'One',
          email: 'user1@example.com',
          phoneNumber: '1234567890',
          roleName: 'Admin',
        },
        {
          guid: '2',
          userName: 'user2',
          firstName: 'User',
          lastName: 'Two',
          email: 'user2@example.com',
          phoneNumber: '0987654321',
          roleName: 'User',
        },
      ],
      count: 2,
      thisPage: 0,
    };
    const limit = 10;
    const page = 0;

    service.getUsers(limit, page);

    expect(loadingServiceSpy.setLoading).toHaveBeenCalledWith(true);

    const req = httpTestingController.expectOne(
      `${environment.apiUrl}/api/Admin/users?limit=${limit}&page=${page}`
    );
    expect(req.request.method).toEqual('GET');
    expect(req.request.withCredentials).toBeTrue();

    req.flush(mockResponse);

    service.usersData$.subscribe((users) => {
      expect(users).toEqual(mockResponse);
    });

    expect(loadingServiceSpy.setLoading).toHaveBeenCalledWith(false);
  });

  it('should call setLoading(true), make a DELETE request, and trigger notification on deleteUser', () => {
    const id = '12345';
    const pageSize = 10;
    const pageIndex = 0;

    service.deleteUser(id, pageSize, pageIndex);

    expect(loadingServiceSpy.setLoading).toHaveBeenCalledWith(true);

    const deleteReq = httpTestingController.expectOne(
      `${environment.apiUrl}/api/Admin/users/${id}`
    );
    expect(deleteReq.request.method).toEqual('DELETE');
    expect(deleteReq.request.withCredentials).toBeTrue();

    deleteReq.flush({});

    // Handle the GET request triggered by getUsers
    const getReq = httpTestingController.expectOne(
      `${environment.apiUrl}/api/Admin/users?limit=${pageSize}&page=${pageIndex}`
    );
    expect(getReq.request.method).toEqual('GET');
    expect(getReq.request.withCredentials).toBeTrue();

    getReq.flush({
      users: [],
      count: 0,
      thisPage: pageIndex,
    });

    service.notification$.subscribe((notification) => {
      expect(notification.status).toBeTrue();
      expect(notification.message).toBe('User deleted successfully!');
    });

    expect(loadingServiceSpy.setLoading).toHaveBeenCalledWith(false);
  });

  it('should call setLoading(true), make a PUT request, and trigger notification on updateUser', () => {
    const id = '12345';
    const request: UpdateUserRequest = {
      username: 'updateduser',
      firstName: 'Updated',
      lastName: 'User',
      email: 'updateduser@example.com',
      phoneNumber: '9876543210',
      roleName: 'Admin',
    };
    const pageSize = 10;
    const pageIndex = 0;

    service.updateUser(id, request, pageSize, pageIndex);

    expect(loadingServiceSpy.setLoading).toHaveBeenCalledWith(true);

    const putReq = httpTestingController.expectOne(
      `${environment.apiUrl}/api/Admin/users/${id}`
    );
    expect(putReq.request.method).toEqual('PUT');
    expect(putReq.request.body).toEqual(request);
    expect(putReq.request.withCredentials).toBeTrue();

    putReq.flush({});

    // Handle the GET request triggered by getUsers
    const getReq = httpTestingController.expectOne(
      `${environment.apiUrl}/api/Admin/users?limit=${pageSize}&page=${pageIndex}`
    );
    expect(getReq.request.method).toEqual('GET');
    expect(getReq.request.withCredentials).toBeTrue();

    getReq.flush({
      users: [],
      count: 0,
      thisPage: pageIndex,
    });

    service.notification$.subscribe((notification) => {
      expect(notification.status).toBeTrue();
      expect(notification.message).toBe('User updated successfully!');
    });

    expect(loadingServiceSpy.setLoading).toHaveBeenCalledWith(false);
  });

  it('should handle error scenarios correctly in createUser', () => {
    const request: RegisterRequest = {
      username: 'newuser',
      password: 'password123',
      confirmPassword: 'password123',
      firstName: 'New',
      lastName: 'User',
      email: 'newuser@example.com',
      phoneNumber: '1234567890',
      roleName: 'User',
    };
    const pageSize = 10;
    const pageIndex = 0;
    const errorMessage = 'Failed to create user';

    service.createUser(request, pageSize, pageIndex);

    const postReq = httpTestingController.expectOne(
      `${environment.apiUrl}/api/Admin/register`
    );
    postReq.flush(
      { error: { message: errorMessage } },
      { status: 400, statusText: 'Bad Request' }
    );

    service.notification$.subscribe((notification) => {
      expect(notification.status).toBeFalse();
      expect(notification.message).toBe(errorMessage);
    });

    expect(loadingServiceSpy.setLoading).toHaveBeenCalledWith(false);
  });
});
