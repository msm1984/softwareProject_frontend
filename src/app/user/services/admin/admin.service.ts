import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { RegisterRequest, UpdateUserRequest } from '../../models/User';
import { GetUserResponse } from '../../models/ManageUsers';
import { Subject } from 'rxjs';
import { environment } from '../../../../../api-config/api-url';
import { LoadingService } from '../../../shared/services/loading.service';

@Injectable({
  providedIn: 'root',
})
export class AdminService {
  private readonly apiUrl = environment.apiUrl + '/api/Admin';
  private usersData = new Subject<GetUserResponse>();
  private notification = new Subject<{ status: boolean; message: string }>();

  usersData$ = this.usersData.asObservable();
  notification$ = this.notification.asObservable();

  constructor(
    private http: HttpClient,
    private loadingService: LoadingService,
  ) {}

  createUser(request: RegisterRequest, pageSize: number, pageIndex: number) {
    this.loadingService.setLoading(true);
    return this.http
      .post(`${this.apiUrl}/register`, request, {
        withCredentials: true,
      })
      .subscribe({
        next: () => {
          this.getUsers(pageSize, pageIndex);
          this.notification.next({
            status: true,
            message: 'User added successfully!',
          });
          this.loadingService.setLoading(false);
        },
        error: (error) => {
          this.notification.next({
            status: false,
            message: error.error.message,
          });
          this.loadingService.setLoading(false);
        },
      });
  }

  getUsers(limit = 10, page = 0) {
    this.loadingService.setLoading(true);
    this.http
      .get<GetUserResponse>(
        `${this.apiUrl}/users?limit=${limit}&page=${page}`,
        {
          withCredentials: true,
        },
      )
      .subscribe({
        next: (users) => {
          this.usersData.next(users);
          this.loadingService.setLoading(false);
        },
        error: (error) => {
          this.notification.next({
            status: false,
            message: error.error.message,
          });
          this.loadingService.setLoading(false);
        },
      });
  }

  deleteUser(id: string, pageSize: number, pageIndex: number) {
    this.loadingService.setLoading(true);
    this.http
      .delete(`${this.apiUrl}/users/${id}`, {
        withCredentials: true,
      })
      .subscribe({
        next: () => {
          this.getUsers(pageSize, pageIndex);
          this.notification.next({
            status: true,
            message: 'User deleted successfully!',
          });
          this.loadingService.setLoading(false);
        },
        error: (error) => {
          this.notification.next({
            status: false,
            message: error.error.message,
          });
          this.loadingService.setLoading(false);
        },
      });
  }

  updateUser(
    id: string,
    request: UpdateUserRequest,
    pageSize: number,
    pageIndex: number,
  ) {
    this.loadingService.setLoading(true);
    return this.http
      .put(`${this.apiUrl}/users/${id}`, request, {
        withCredentials: true,
      })
      .subscribe({
        next: () => {
          this.getUsers(pageSize, pageIndex);
          this.notification.next({
            status: true,
            message: 'User updated successfully!',
          });
          this.loadingService.setLoading(false);
        },
        error: (error) => {
          this.notification.next({
            status: false,
            message: error.error.message,
          });
          this.loadingService.setLoading(false);
        },
      });
  }
}
