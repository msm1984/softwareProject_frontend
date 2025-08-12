import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { UserData } from '../../../../models/ManageUsers';
import { AdminService } from '../../../../services/admin/admin.service';

@Component({
  selector: 'app-user-delete-confirmation',
  template: `
    <h2 mat-dialog-title>Delete User</h2>
    <mat-dialog-content>
      Would you like to delete <b>{{ this.pageData.user.userName }}</b
      >?
    </mat-dialog-content>
    <mat-dialog-actions>
      <button mat-button mat-dialog-close>Cancel</button>
      <button
        mat-button
        mat-dialog-close
        cdkFocusInitial
        (click)="deleteUser()"
      >
        Delete
      </button>
    </mat-dialog-actions>
  `,
})
export class UserDeleteConfirmationComponent {
  constructor(
    @Inject(MAT_DIALOG_DATA)
    protected pageData: {
      user: UserData;
      pagSize: number;
      pageIndex: number;
    },
    private adminService: AdminService
  ) {}

  deleteUser() {
    this.adminService.deleteUser(
      this.pageData.user.guid,
      this.pageData.pagSize,
      this.pageData.pageIndex
    );
  }
}
