export interface CategoryData {
  id: number;
  name: string;
  totalNumber: number;
}

export interface GetCategoriesResponse {
  paginateList: CategoryData[];
  pageIndex: number;
  totalCount: number;
}

export interface AllCategories {
  id: number;
  name: string;
}
