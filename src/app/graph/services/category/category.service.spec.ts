import { TestBed } from '@angular/core/testing';
import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';
import { LoadingService } from '../../../shared/services/loading.service';
import { environment } from '../../../../../api-config/api-url';
import { GetCategoriesResponse } from '../../model/Category';
import { provideHttpClient } from '@angular/common/http';
import { CategoryService } from './category.service';

describe('CategoryService', () => {
  let service: CategoryService;
  let httpTestingController: HttpTestingController;
  let loadingServiceSpy: jasmine.SpyObj<LoadingService>;

  beforeEach(() => {
    const loadingServiceMock = jasmine.createSpyObj('LoadingService', [
      'setLoading',
    ]);

    TestBed.configureTestingModule({
      providers: [
        CategoryService,
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: LoadingService, useValue: loadingServiceMock },
      ],
    });

    service = TestBed.inject(CategoryService);
    httpTestingController = TestBed.inject(HttpTestingController);
    loadingServiceSpy = TestBed.inject(
      LoadingService
    ) as jasmine.SpyObj<LoadingService>;
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should call setLoading(true) and make a GET request in getCategories', () => {
    const mockResponse: GetCategoriesResponse = {
      paginateList: [{ id: 1, name: 'Category 1', totalNumber: 10 }],
      totalCount: 1,
      pageIndex: 0,
    };

    service.getCategories(10, 0);

    expect(loadingServiceSpy.setLoading).toHaveBeenCalledWith(true);

    const req = httpTestingController.expectOne(
      `${environment.apiUrl}/api/Categories?pageNumber=0&pageSize=10`
    );
    expect(req.request.method).toEqual('GET');
    req.flush(mockResponse);

    service.categoriesData$.subscribe((data) => {
      expect(data).toEqual(mockResponse);
    });
  });

  it('should call setLoading(true) and make a POST request in createCategory', () => {
    const categoryName = 'New Category';

    service.createCategory(categoryName).subscribe();

    expect(loadingServiceSpy.setLoading).toHaveBeenCalledWith(true);

    const req = httpTestingController.expectOne(
      `${environment.apiUrl}/api/Categories`
    );
    expect(req.request.method).toEqual('POST');
    expect(req.request.body).toEqual({ name: categoryName });
    req.flush({});
  });

  it('should call setLoading(true) and make a PUT request in updateCategory', () => {
    const category = { id: 1, name: 'Updated Category' };

    service.updateCategory(category.id, category.name).subscribe();

    expect(loadingServiceSpy.setLoading).toHaveBeenCalledWith(true);

    const req = httpTestingController.expectOne(
      `${environment.apiUrl}/api/Categories`
    );
    expect(req.request.method).toEqual('PUT');
    expect(req.request.body).toEqual({ id: category.id, name: category.name });
    req.flush({});
  });

  it('should call setLoading(true) and make a DELETE request in deleteCategory', () => {
    const categoryId = 1;

    service.deleteCategory(categoryId).subscribe();

    expect(loadingServiceSpy.setLoading).toHaveBeenCalledWith(true);

    const req = httpTestingController.expectOne(
      `${environment.apiUrl}/api/Categories/1`
    );
    expect(req.request.method).toEqual('DELETE');
    req.flush({});
  });

  it('should update categoriesData after successful getCategories call', () => {
    const mockResponse: GetCategoriesResponse = {
      paginateList: [{ id: 1, name: 'Category 1', totalNumber: 10 }],
      totalCount: 1,
      pageIndex: 0,
    };

    service.getCategories(10, 0);

    const req = httpTestingController.expectOne(
      `${environment.apiUrl}/api/Categories?pageNumber=0&pageSize=10`
    );
    req.flush(mockResponse);

    service.categoriesData$.subscribe((data) => {
      expect(data).toEqual(mockResponse);
    });
  });

  it('should update notification subject on category creation', () => {
    const categoryName = 'New Category';
    const mockResponse = {};

    service.createCategory(categoryName).subscribe();

    const req = httpTestingController.expectOne(
      `${environment.apiUrl}/api/Categories`
    );
    req.flush(mockResponse);

    service.notification$.subscribe((notification) => {
      expect(notification.status).toBeTrue();
      expect(notification.message).toBe('Category created successfully.');
    });
  });
});
