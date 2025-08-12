import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { LoadingService } from '../../../shared/services/loading.service';
import { environment } from '../../../../../api-config/api-url';
import { Subject } from 'rxjs';
import {
  FileAccessUserResponse,
  FileAccessUsers,
  FileDataResponse,
} from '../../models/File';

@Injectable({
  providedIn: 'root',
})
export class AssignFileService {
  private readonly apiUrl = environment.apiUrl + '/api/FileAccess';
  private filesData = new Subject<FileDataResponse>();
  private notification = new Subject<{ status: boolean; message: string }>();

  filesData$ = this.filesData.asObservable();
  notification$ = this.notification.asObservable();

  constructor(
    private httpClient: HttpClient,
    private loadingService: LoadingService
  ) {}

  getFilesData(pageSize = 10, pageNumber = 0) {
    this.loadingService.setLoading(true);
    return this.httpClient
      .get<FileDataResponse>(
        this.apiUrl + `/files?page=${pageNumber}&limit=${pageSize}`,
        {
          withCredentials: true,
        }
      )
      .subscribe((files) => {
        this.filesData.next(files);
      });
  }

  getFileUserAccess(id: number) {
    this.loadingService.setLoading(true);
    return this.httpClient.get<FileAccessUsers[]>(
      this.apiUrl + `/files/users?fileId=${id}`,
      {
        withCredentials: true,
      }
    );
  }

  search(username: string) {
    this.loadingService.setLoading(true);
    return this.httpClient.get<FileAccessUserResponse[]>(
      this.apiUrl + `/users?username=${username}`,
      {
        withCredentials: true,
      }
    );
  }

  setFileAccess(users: FileAccessUsers[], id: number) {
    this.loadingService.setLoading(true);
    return this.httpClient
      .post<FileAccessUserResponse[]>(
        this.apiUrl + `/files/access`,
        {
          userGuidIds: users.map((user) => user.id),
          fileId: id,
        },
        {
          withCredentials: true,
        }
      )
      .subscribe({
        next: () => {
          this.notification.next({
            status: true,
            message: 'Users are assigned to file successfully!',
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
