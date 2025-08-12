export interface FileData {
  id: string;
  category: string;
  fileName: string;
  uploadDate: string;
}
export interface FileDataResponse {
  items: FileData[];
  totalCount: number;
  pageIndex: number;
}

export interface FileAccessUserResponse {
  id: string;
  userName: string;
  firstName: string;
  lastName: string;
}

export interface FileAccessUsers {
  id: string;
  userName: string;
}
