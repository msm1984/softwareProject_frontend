import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, tap } from 'rxjs';
import { LoginRequest, UserPermissions } from '../../models/User';
import { environment } from '../../../../../api-config/api-url';
import { LoadingService } from '../../../shared/services/loading.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = environment.apiUrl + '/api/User';
  private permissions = new BehaviorSubject<UserPermissions | null>(null);
  permissions$ = this.permissions.asObservable();

  constructor(
    private http: HttpClient,
    private loadingService: LoadingService
  ) {}

  login(loginRequest: LoginRequest) {
    this.loadingService.setLoading(true);
    return this.http.post(this.apiUrl + '/login', loginRequest, {
      withCredentials: true,
    });
  }

  getPermissions() {
    this.loadingService.setLoading(true);
    if (!this.permissions.value) {
      return this.http
        .get<UserPermissions>(this.apiUrl + '/permissions', {
          withCredentials: true,
        })
        .pipe(
          tap((response) => {
            this.permissions.next(response);
          })
        );
    }
    return this.permissions$;
  }

  logout() {
    this.loadingService.setLoading(true);
    return this.http
      .post(this.apiUrl + '/logout', null, { withCredentials: true })
      .pipe(
        tap(() => {
          this.permissions.next(null);
        })
      );
  }
}
