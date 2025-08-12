import { TestBed } from '@angular/core/testing';
import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';
import { LoadGraphService } from './load-graph.service';
import { LoadingService } from '../../../shared/services/loading.service';
import { AllNodes, Graph } from '../../model/graph';
import { environment } from '../../../../../api-config/api-url';
import { provideHttpClient } from '@angular/common/http';

describe('LoadGraphService', () => {
  let service: LoadGraphService;
  let httpMock: HttpTestingController;
  let loadingService: jasmine.SpyObj<LoadingService>;
  const apiUrl = environment.apiUrl + '/api/GraphEav';

  beforeEach(() => {
    const loadingSpy = jasmine.createSpyObj('LoadingService', ['setLoading']);

    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        LoadGraphService,
        { provide: LoadingService, useValue: loadingSpy },
      ],
    });

    service = TestBed.inject(LoadGraphService);
    httpMock = TestBed.inject(HttpTestingController);
    loadingService = TestBed.inject(
      LoadingService,
    ) as jasmine.SpyObj<LoadingService>;
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should get all nodes with default parameters', () => {
    const mockNodes: AllNodes = {
      items: [
        { id: '1', entityName: 'Node 1' },
        { id: '2', entityName: 'Node 2' },
      ],
      pageIndex: 0,
      totalItems: 2,
      categoryName: null,
    };

    service.getAllNodes();
    service.nodesData$.subscribe((nodes) => {
      expect(nodes).toEqual(mockNodes);
    });

    const req = httpMock.expectOne(
      `${apiUrl}/nodes?pageIndex=0&pageSize=10&category=`,
    );
    expect(req.request.method).toBe('GET');
    expect(req.request.withCredentials).toBeTrue();
    req.flush(mockNodes);

    expect(loadingService.setLoading).toHaveBeenCalledWith(true);
  });

  it('should get node information by headerUniqueId', () => {
    const headerUniqueId = 'test-id';
    const mockResponse = { id: 'test-id', attributes: {} };

    service.getNodeInfo(headerUniqueId).subscribe((response) => {
      expect(response).toEqual(mockResponse);
    });

    const req = httpMock.expectOne(
      `${apiUrl}/nodes/${headerUniqueId}/attributes`,
    );
    expect(req.request.method).toBe('GET');
    expect(req.request.withCredentials).toBeTrue();
    req.flush(mockResponse);

    expect(loadingService.setLoading).toHaveBeenCalledWith(true);
  });

  it('should get graph by nodeId', () => {
    const nodeId = 'node123';
    const mockGraph: Graph = {
      nodes: [
        { id: '1', label: 'Node 1' },
        { id: '2', label: 'Node 2' },
      ],
      edges: [{ id: 'e1', from: '1', to: '2' }],
    };

    service.getGraph(nodeId).subscribe((graph) => {
      expect(graph).toEqual(mockGraph);
    });

    const req = httpMock.expectOne(`${apiUrl}/nodes-relation?nodeId=${nodeId}`);
    expect(req.request.method).toBe('GET');
    expect(req.request.withCredentials).toBeTrue();
    req.flush(mockGraph);

    expect(loadingService.setLoading).toHaveBeenCalledWith(true);
  });

  it('should search for nodes', () => {
    const searchInput = 'test';
    const searchType = 'type1';
    const mockNodes: AllNodes = {
      items: [
        { id: '1', entityName: 'Test Node 1' },
        { id: '2', entityName: 'Test Node 2' },
      ],
      pageIndex: 0,
      totalItems: 2,
      categoryName: null,
    };

    service.search(searchInput, searchType).subscribe((nodes) => {
      expect(nodes).toEqual(mockNodes);
    });

    const req = httpMock.expectOne(
      `${apiUrl}/Search?searchInput=${searchInput}&searchType=${searchType}&pageIndex=0&pageSize=10`,
    );
    expect(req.request.method).toBe('GET');
    expect(req.request.withCredentials).toBeTrue();
    req.flush(mockNodes);

    expect(loadingService.setLoading).toHaveBeenCalledWith(true);
  });

  it('should trigger next on nodesData when getAllNodes is called', () => {
    const mockNodes: AllNodes = {
      items: [
        { id: '1', entityName: 'Node 1' },
        { id: '2', entityName: 'Node 2' },
      ],
      pageIndex: 0,
      totalItems: 2,
      categoryName: null,
    };

    service.getAllNodes();

    const req = httpMock.expectOne(
      `${apiUrl}/nodes?pageIndex=0&pageSize=10&category=`,
    );
    req.flush(mockNodes);

    service.nodesData$.subscribe((nodes) => {
      expect(nodes).toEqual(mockNodes);
    });

    expect(loadingService.setLoading).toHaveBeenCalledWith(true);
  });
});
