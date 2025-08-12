import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './user/components/login/login.component';
import { DashboardComponent } from './user/components/dashboard/dashboard.component';
import { MainPageComponent } from './user/components/dashboard/main-page/main-page.component';
import { ManageAccountComponent } from './user/components/dashboard/manage-account/manage-account.component';
import { DataAnalysisComponent } from './graph/components/data-analysis/data-analysis.component';
import { ManageUsersComponent } from './user/components/dashboard/manage-users/manage-users.component';
import { AuthGuard } from './guards/auth/auth.guard';
import { PermissionGuard } from './guards/permissions/permission.guard';
import { AddGraphComponent } from './graph/components/add-graph/add-graph.component';
import { AssignFileComponent } from './user/components/dashboard/assign-file/assign-file.component';
import { CategoryComponent } from './graph/components/category/category.component';
import { RecoverPassFormComponent } from './user/components/login/recover-pass-form/recover-pass-form.component';
import { LoginFormComponent } from './user/components/login/login-form/login-form.component';
import { ResetPasswordComponent } from './user/components/login/reset-password/reset-password.component';
import { LoginGuard } from './guards/auth/login.guard';

const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  {
    path: '',
    component: LoginComponent,
    canActivate: [LoginGuard],
    children: [
      {
        path: 'recover-password',
        component: RecoverPassFormComponent,
        title: 'StarData | Recover Password',
      },
      {
        path: 'login',
        component: LoginFormComponent,
        title: 'StarData | Login',
      },
    ],
  },
  {
    path: 'dashboard',
    component: DashboardComponent,
    title: 'StarData | Dashboard',
    canActivate: [AuthGuard],
    canActivateChild: [PermissionGuard],
    children: [
      {
        path: '',
        component: MainPageComponent,
        title: 'StarData | Dashboard',
      },
      {
        path: 'manage-users',
        component: ManageUsersComponent,
        title: 'StarData | Manage Users',
        data: { permission: 'Register' },
      },
      {
        path: 'manage-account',
        component: ManageAccountComponent,
        title: 'StarData | Manage Account',
      },
      {
        path: 'data-analysis',
        component: DataAnalysisComponent,
        title: 'StarData | Data Analysis',
        data: { permission: 'GetNodesAsync' },
      },
      {
        path: 'add-graph',
        component: AddGraphComponent,
        title: 'StarData | Add Graph',
        data: { permission: 'UploadNodeFile' },
      },
      {
        path: 'assign-file',
        component: AssignFileComponent,
        title: 'StarData | Assign File',
        data: { permission: 'AccessFileToUser' },
      },
      {
        path: 'manage-category',
        component: CategoryComponent,
        title: 'StarData | Manage Category',
        data: { permission: 'GetCategories' },
      },
    ],
  },
  {
    path: 'reset-password',
    component: ResetPasswordComponent,
    title: 'StarData | Reset Password',
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
