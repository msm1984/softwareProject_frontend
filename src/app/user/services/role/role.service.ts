import { Injectable } from '@angular/core';
import { environment } from '../../../../../api-config/api-url';
import { HttpClient } from '@angular/common/http';
import { GetRoleResponse } from '../../models/User';

@Injectable({
  providedIn: 'root',
})
export class RoleService {
  private apiUrl = environment.apiUrl + '/api/Role';

  constructor(private httpClient: HttpClient) {}

  getRoles(page = 0, limit = 10) {
    return this.httpClient.get<GetRoleResponse>(
      this.apiUrl + `?page=${page}&limit=${limit}`,
      {
        withCredentials: true,
      },
    );
  }
}
