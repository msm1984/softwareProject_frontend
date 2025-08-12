import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';
import { AddGraphService } from './add-graph.service';
import { LoadingService } from '../../../shared/services/loading.service';
import { environment } from '../../../../../api-config/api-url';
import { GetCategoriesResponse } from '../../model/Category';

describe('AddGraphService', () => {
  let service: AddGraphService;
  let httpTestingController: HttpTestingController;
  let loadingServiceSpy: jasmine.SpyObj<LoadingService>;

  beforeEach(() => {
    const loadingServiceMock = jasmine.createSpyObj('LoadingService', [
      'setLoading',
    ]);

    TestBed.configureTestingModule({
      providers: [
        AddGraphService,
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: LoadingService, useValue: loadingServiceMock },
      ],
    });

    service = TestBed.inject(AddGraphService);
    httpTestingController = TestBed.inject(HttpTestingController);
    loadingServiceSpy = TestBed.inject(
      LoadingService,
    ) as jasmine.SpyObj<LoadingService>;
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should call setLoading(true) and make a POST request in uploadNode', () => {
    const mockFile = new File([''], 'filename.txt');
    const header = 'Test Header';
    const category = 'TestCategory';
    const name = 'TestName';

    service.uploadNode(mockFile, header, category, name).subscribe();

    expect(loadingServiceSpy.setLoading).toHaveBeenCalledWith(true);

    const req = httpTestingController.expectOne(
      service['apiUrl'] + '/upload-file-node',
    );
    expect(req.request.method).toEqual('POST');
    expect(req.request.body instanceof FormData).toBeTrue();
    expect(req.request.withCredentials).toBeTrue();

    req.flush({});
  });

  it('should call setLoading(true) and make a POST request in uploadEdge', () => {
    const mockFile = new File([''], 'filename.txt');
    const from = 'NodeA';
    const to = 'NodeB';

    service.uploadEdge(mockFile, from, to).subscribe();

    expect(loadingServiceSpy.setLoading).toHaveBeenCalledWith(true);

    const req = httpTestingController.expectOne(
      service['apiUrl'] + '/upload-file-edge',
    );
    expect(req.request.method).toEqual('POST');
    expect(req.request.body instanceof FormData).toBeTrue();
    expect(req.request.withCredentials).toBeTrue();

    req.flush({});
  });

  it('should call setLoading(true) and make a GET request in getCategories', () => {
    const mockResponse: GetCategoriesResponse = {
      paginateList: [
        { id: 1, name: 'Category 1', totalNumber: 10 },
        { id: 2, name: 'Category 2', totalNumber: 20 },
      ],
      pageIndex: 0,
      totalCount: 2,
    };

    service.getCategories().subscribe((response) => {
      expect(response).toEqual(mockResponse);
    });

    expect(loadingServiceSpy.setLoading).toHaveBeenCalledWith(true);

    const req = httpTestingController.expectOne(
      `${environment.apiUrl}/api/Categories?pageNumber=0&pageSize=999`,
    );
    expect(req.request.method).toEqual('GET');
    expect(req.request.withCredentials).toBeTrue();

    req.flush(mockResponse);
  });
});
