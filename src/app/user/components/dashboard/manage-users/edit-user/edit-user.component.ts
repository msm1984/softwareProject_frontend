import { Component, Inject, OnInit } from '@angular/core';
import { AdminService } from '../../../../services/admin/admin.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { UserData } from '../../../../models/ManageUsers';
import { RoleService } from '../../../../services/role/role.service';
import { Role } from '../../../../models/User';

@Component({
  selector: 'app-edit-user',
  templateUrl: './edit-user.component.html',
  styleUrl: './edit-user.component.scss',
})
export class EditUserComponent implements OnInit {
  constructor(
    private adminService: AdminService,
    private roleService: RoleService,
    @Inject(MAT_DIALOG_DATA)
    protected pageData: {
      user: UserData;
      pagSize: number;
      pageIndex: number;
    }
  ) {}

  myForm: FormGroup = new FormGroup({});
  roles!: Role[];

  ngOnInit() {
    this.roleService.getRoles(0, 100).subscribe({
      next: (data) => {
        this.roles = data.roles;
      },
      error: () => {
        this.roles = [];
      },
    });

    this.myForm = new FormGroup({
      firstName: new FormControl(
        this.pageData.user.firstName,
        Validators.required
      ),
      lastName: new FormControl(
        this.pageData.user.lastName,
        Validators.required
      ),
      userName: new FormControl(
        this.pageData.user.userName,
        Validators.required
      ),
      email: new FormControl(this.pageData.user.email, [
        Validators.required,
        Validators.email,
        Validators.pattern('^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$'),
      ]),
      phoneNumber: new FormControl(this.pageData.user.phoneNumber, [
        Validators.required,
        Validators.pattern('^09\\d{9}$'),
      ]),
      roleName: new FormControl(this.pageData.user.roleName),
    });
  }

  onSubmit() {
    if (this.myForm.valid) {
      this.adminService.updateUser(
        this.pageData.user.guid,
        this.myForm.value,
        this.pageData.pagSize,
        this.pageData.pageIndex
      );
    }
  }
}
