export interface UserData {
  guid: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  userName: string;
  roleName: string;
}

export interface UserInformation {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  image: string;
}

export interface GetUserResponse {
  users: UserData[];
  count: number;
  thisPage: number;
}
