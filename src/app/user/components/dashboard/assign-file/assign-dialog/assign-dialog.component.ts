import { Component, computed, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { AssignFileService } from '../../../../services/assign-file/assign-file.service';
import {
  FileAccessUserResponse,
  FileAccessUsers,
} from '../../../../models/File';
import { LoadingService } from '../../../../../shared/services/loading.service';
import { DangerSuccessNotificationComponent } from '../../../../../shared/components/danger-success-notification/danger-success-notification.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { debounceTime, Observable, Subject } from 'rxjs';

@Component({
  selector: 'app-assign-dialog',
  templateUrl: './assign-dialog.component.html',
  styleUrl: './assign-dialog.component.scss',
})
export class AssignDialogComponent implements OnInit {
  readonly separatorKeysCodes: number[] = [ENTER, COMMA];
  currentUser = '';
  users: FileAccessUsers[] = [];
  allUsers: FileAccessUserResponse[] = [];

  private searchText$ = new Subject<string>();
  userName$!: Observable<string>;

  readonly filteredUsers = computed(() => {
    const currentUser = this.currentUser.toLowerCase();
    return currentUser
      ? this.allUsers.filter((user) =>
          user.userName.toLowerCase().includes(currentUser)
        )
      : this.allUsers.slice();
  });

  constructor(
    @Inject(MAT_DIALOG_DATA) protected id: number,
    private assignFileService: AssignFileService,
    private loadingService: LoadingService,
    private _snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.assignFileService.getFileUserAccess(this.id).subscribe({
      next: (data) => {
        this.users = data;
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

    this.userName$ = this.searchText$.pipe(debounceTime(500));

    this.userName$.subscribe((searchInput) => {
      this.assignFileService.search(searchInput).subscribe({
        next: (users) => {
          this.allUsers = users;
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
    });
  }

  search(userName: string) {
    this.loadingService.setLoading(true);
    if (!userName) {
      this.reset();
      this.loadingService.setLoading(false);
      return;
    }
    if (userName == '[object Object]') {
      return;
    }
    this.searchText$.next(userName);
  }

  reset() {
    this.allUsers = [];
  }

  onSubmit() {
    this.assignFileService.setFileAccess(this.users, this.id);
  }

  selected(event: MatAutocompleteSelectedEvent): void {
    const user: FileAccessUsers = {
      id: event.option.value.id,
      userName: event.option.value.userName,
    };

    if (!this.users.some((existingUser) => existingUser.id === user.id)) {
      this.users.push(user);
    }

    this.currentUser = '';
    this.allUsers = [];
    event.option.deselect();
  }

  remove(user: FileAccessUsers) {
    const index = this.users.indexOf(user);
    if (index < 0) {
      return this.users;
    }

    this.users.splice(index, 1);
    return [...this.users];
  }
}
