import { NgModule } from '@angular/core';
import { AsyncPipe, CommonModule } from '@angular/common';
import { LoginComponent } from './components/login/login.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatListModule } from '@angular/material/list';
import { MatRippleModule } from '@angular/material/core';
import { AppRoutingModule } from '../app-routing.module';
import { MainPageComponent } from './components/dashboard/main-page/main-page.component';
import { SharedModule } from '../shared/shared.module';
import { AddUserComponent } from './components/dashboard/manage-users/add-user/add-user.component';
import { MatRadioModule } from '@angular/material/radio';
import { ManageAccountComponent } from './components/dashboard/manage-account/manage-account.component';
import { ManageUsersComponent } from './components/dashboard/manage-users/manage-users.component';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { UserDeleteConfirmationComponent } from './components/dashboard/manage-users/user-delete-confirmation/user-delete-confirmation.component';
import {
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogTitle,
} from '@angular/material/dialog';
import { EditUserComponent } from './components/dashboard/manage-users/edit-user/edit-user.component';
import { MatSnackBarLabel } from '@angular/material/snack-bar';
import { AssignFileComponent } from './components/dashboard/assign-file/assign-file.component';
import { AssignDialogComponent } from './components/dashboard/assign-file/assign-dialog/assign-dialog.component';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatChipsModule } from '@angular/material/chips';
import { MatTooltipModule } from '@angular/material/tooltip';
import { LoginFormComponent } from './components/login/login-form/login-form.component';
import { RecoverPassFormComponent } from './components/login/recover-pass-form/recover-pass-form.component';
import { ProfileHeaderComponent } from './components/dashboard/manage-account/profile-header/profile-header.component';
import { ResetPasswordComponent } from './components/login/reset-password/reset-password.component';

@NgModule({
  declarations: [
    LoginComponent,
    DashboardComponent,
    MainPageComponent,
    AddUserComponent,
    ManageAccountComponent,
    ManageUsersComponent,
    UserDeleteConfirmationComponent,
    EditUserComponent,
    AssignFileComponent,
    AssignDialogComponent,
    LoginFormComponent,
    RecoverPassFormComponent,
    ProfileHeaderComponent,
    ResetPasswordComponent,
  ],
  imports: [
    CommonModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatButtonModule,
    MatCheckboxModule,
    FormsModule,
    MatSidenavModule,
    MatToolbarModule,
    ReactiveFormsModule,
    MatListModule,
    MatRippleModule,
    AppRoutingModule,
    SharedModule,
    MatRadioModule,
    MatTableModule,
    MatPaginatorModule,
    MatDialogContent,
    MatDialogActions,
    MatDialogClose,
    MatDialogTitle,
    MatSnackBarLabel,
    MatAutocompleteModule,
    AsyncPipe,
    MatChipsModule,
    MatTooltipModule,
  ],
})
export class UserModule {}
