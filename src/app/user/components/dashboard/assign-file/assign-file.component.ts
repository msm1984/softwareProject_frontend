import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FileData, FileDataResponse } from '../../../models/File';
import { PageEvent } from '@angular/material/paginator';
import { AssignDialogComponent } from './assign-dialog/assign-dialog.component';
import { DangerSuccessNotificationComponent } from '../../../../shared/components/danger-success-notification/danger-success-notification.component';
import { AssignFileService } from '../../../services/assign-file/assign-file.service';
import { LoadingService } from '../../../../shared/services/loading.service';

@Component({
  selector: 'app-assign-file',
  templateUrl: './assign-file.component.html',
  styleUrl: './assign-file.component.scss',
})
export class AssignFileComponent implements OnInit {
  filesData: FileData[] = [];
  displayedColumns: string[] = ['name', 'category', 'createDate', 'assign'];
  length!: number;
  pageSize = 10;
  pageIndex = 0;
  pageSizeOptions = [5, 10, 25];

  hidePageSize = false;
  showPageSizeOptions = true;
  showFirstLastButtons = true;
  disabled = false;

  constructor(
    private readonly dialog: MatDialog,
    private assignFileService: AssignFileService,
    private _snackBar: MatSnackBar,
    private loadingService: LoadingService
  ) {}

  ngOnInit(): void {
    this.assignFileService.filesData$.subscribe({
      next: (response: FileDataResponse) => {
        this.filesData = response.items;
        this.length = response.totalCount;
        this.pageIndex = response.pageIndex;
        this.loadingService.setLoading(false);
      },
      error: (error) => {
        this._snackBar.openFromComponent(DangerSuccessNotificationComponent, {
          data: error.error.message,
          panelClass: ['notification-class-danger'],
          duration: 2000,
        });
        this.loadingService.setLoading(false);
      },
    });

    this.assignFileService.notification$.subscribe(
      (data: { status: boolean; message: string }) => {
        this._snackBar.openFromComponent(DangerSuccessNotificationComponent, {
          data: data.message,
          panelClass: data.status
            ? ['notification-class-success']
            : ['notification-class-danger'],
          duration: 2000,
        });
        if (data.status) {
          this.dialog.closeAll();
        }
      }
    );
    this.assignFileService.getFilesData(this.pageSize, this.pageIndex);
  }

  handlePageEvent(e: PageEvent) {
    this.pageSize = e.pageSize;
    this.pageIndex = e.pageIndex;
    this.length = e.length;
    this.assignFileService.getFilesData(e.pageSize, e.pageIndex);
  }

  assignUser(id: number) {
    this.dialog.open(AssignDialogComponent, {
      width: '105rem',
      data: id,
    });
  }

  parseDate(isoTimestamp: string) {
    const date = new Date(isoTimestamp);
    return date.toLocaleString();
  }
}
