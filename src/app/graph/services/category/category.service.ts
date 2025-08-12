import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../../api-config/api-url';
import { Subject } from 'rxjs';
import { AllCategories, GetCategoriesResponse } from '../../model/Category';
import { LoadingService } from '../../../shared/services/loading.service';

@Injectable({
  providedIn: 'root',
})
export class CategoryService {
  private readonly apiUrl = environment.apiUrl + '/api/Categories';

  private notification = new Subject<{ status: boolean; message: string }>();
  notification$ = this.notification.asObservable();

  private categoriesData = new Subject<GetCategoriesResponse>();
  categoriesData$ = this.categoriesData.asObservable();

  constructor(
    private httpClient: HttpClient,
    private loadingService: LoadingService
  ) {}

  getCategories(pageSize = 10, pageNumber = 0) {
    this.loadingService.setLoading(true);
    return this.httpClient
      .get<GetCategoriesResponse>(
        this.apiUrl + `?pageNumber=${pageNumber}&pageSize=${pageSize}`,
        {
          withCredentials: true,
        }
      )
      .subscribe((cats) => {
        this.categoriesData.next(cats);
      });
  }

  createCategory(name: string) {
    this.loadingService.setLoading(true);
    return this.httpClient.post(
      this.apiUrl,
      { name: name },
      {
        withCredentials: true,
      }
    );
  }

  updateCategory(id: number, name: string) {
    this.loadingService.setLoading(true);
    console.log(name);

    return this.httpClient.put(
      this.apiUrl,
      { id: id, name: name },
      {
        withCredentials: true,
      }
    );
  }

  deleteCategory(id: number) {
    this.loadingService.setLoading(true);
    return this.httpClient.delete(this.apiUrl + `/${id}`, {
      withCredentials: true,
    });
  }

  getAllCategories() {
    this.loadingService.setLoading(true);
    return this.httpClient.get<AllCategories[]>(
      this.apiUrl + `/all-category-without-pagination`,
      {
        withCredentials: true,
      }
    );
  }
}
