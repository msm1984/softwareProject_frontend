export interface LoginRequest {
  username: string;
  password: string;
  rememberMe: boolean;
}

export interface UserPermissions {
  firstName: string;
  lastName: string;
  image: string | null;
  permission: string[];
}

export interface RegisterRequest {
  username: string;
  password: string;
  confirmPassword: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  roleName: string;
}

export interface UpdateUserRequest {
  username: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  roleName: string;
}

export interface ForgetPasswordRequest {
  email: string;
  resetPasswordToken: string;
  newPassword: string;
  confirmPassword: string;
}

export interface NewPasswordRequest {
  oldPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export interface Role {
  id: string;
  name: string;
  policy: string;
}

export interface GetRoleResponse {
  roles: Role[];
  count: number;
  thisPage: number;
}
