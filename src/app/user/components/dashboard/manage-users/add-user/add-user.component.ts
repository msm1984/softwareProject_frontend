import { Component, Inject, OnInit } from '@angular/core';
import { AdminService } from '../../../../services/admin/admin.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { RoleService } from '../../../../services/role/role.service';
import { Role } from '../../../../models/User';

@Component({
  selector: 'app-add-user',
  templateUrl: './add-user.component.html',
  styleUrl: './add-user.component.scss',
})
export class AddUserComponent implements OnInit {
  constructor(
    private adminService: AdminService,
    private roleService: RoleService,
    @Inject(MAT_DIALOG_DATA)
    public page: {
      pagSize: number;
      pageIndex: number;
    },
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
      firstName: new FormControl('', Validators.required),
      lastName: new FormControl('', Validators.required),
      userName: new FormControl('', Validators.required),
      password: new FormControl('', [
        Validators.required,
        Validators.pattern(
          '^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,}$',
        ),
      ]),
      confirmPassword: new FormControl('', Validators.required),
      email: new FormControl('', [
        Validators.required,
        Validators.email,
        Validators.pattern('^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$'),
      ]),
      phoneNumber: new FormControl('', [
        Validators.required,
        Validators.pattern('^09\\d{9}$'),
      ]),
      roleName: new FormControl(),
    });
  }

  onSubmit() {
    if (this.myForm.valid) {
      this.adminService.createUser(
        this.myForm.value,
        this.page.pagSize,
        this.page.pageIndex,
      );
    }
  }
}
