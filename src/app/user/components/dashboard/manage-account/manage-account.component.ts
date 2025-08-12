import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { UserService } from '../../../services/user/user.service';
import { UserInformation } from '../../../models/ManageUsers';
import { MatSnackBar } from '@angular/material/snack-bar';
import { LoadingService } from '../../../../shared/services/loading.service';
import { DangerSuccessNotificationComponent } from '../../../../shared/components/danger-success-notification/danger-success-notification.component';

@Component({
  selector: 'app-manage-account',
  templateUrl: './manage-account.component.html',
  styleUrl: './manage-account.component.scss',
})
export class ManageAccountComponent implements OnInit {
  myForm: FormGroup;
  userInfo!: UserInformation;
  focusedField!: string | null;

  validationFields = [
    { control: 'firstName', message: 'First name field should not be empty.' },
    { control: 'lastName', message: 'Last name field should not be empty.' },
    {
      control: 'email',
      message:
        'Email format: example@domain.com (no spaces, one "@" symbol, and a valid domain).',
    },
    {
      control: 'phoneNumber',
      message:
        'Phone number format: A 10-digit number starting with 09 (e.g. 0912345678).',
    },
  ];

  constructor(
    private userService: UserService,
    private _snackBar: MatSnackBar,
    private loadingService: LoadingService,
  ) {
    this.myForm = new FormGroup({
      firstName: new FormControl('', Validators.required),
      lastName: new FormControl('', Validators.required),
      email: new FormControl('', [
        Validators.required,
        Validators.email,
        Validators.pattern('^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$'),
      ]),
      phoneNumber: new FormControl('', [
        Validators.required,
        Validators.pattern('^09\\d{9}$'),
      ]),
    });
  }

  ngOnInit() {
    this.userService.getLoginUserInfo().subscribe((data: UserInformation) => {
      this.userInfo = data;
      this.myForm.patchValue({
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        phoneNumber: data.phoneNumber,
      });
    });
  }

  onSubmit() {
    if (this.myForm.valid) {
      this.userService.updateUser(this.myForm.value).subscribe({
        next: () => {
          this._snackBar.openFromComponent(DangerSuccessNotificationComponent, {
            data: 'User information updated successfully!',
            panelClass: ['notification-class-success'],
            duration: 2000,
          });
          this.loadingService.setLoading(false);
          this.userInfo = this.myForm.value;
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
    }
  }

  resetUserInfo() {
    this.myForm.patchValue({
      firstName: this.userInfo.firstName,
      lastName: this.userInfo.lastName,
      email: this.userInfo.email,
      phoneNumber: this.userInfo.phoneNumber,
    });
  }
}
