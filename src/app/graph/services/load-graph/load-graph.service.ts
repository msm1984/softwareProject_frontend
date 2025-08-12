import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../../api-config/api-url';
import { AllNodes, Graph } from '../../model/graph';
import { Subject } from 'rxjs';
import { LoadingService } from '../../../shared/services/loading.service';

@Injectable({
  providedIn: 'root',
})
export class LoadGraphService {
  private readonly apiUrl = environment.apiUrl + '/api/GraphEav';

  private nodesData = new Subject<AllNodes>();

  nodesData$ = this.nodesData.asObservable();

  constructor(
    private http: HttpClient,
    private loadingService: LoadingService
  ) {}

  getAllNodes(pageIndex = 0, category = '') {
    this.loadingService.setLoading(true);
    const pageSize = 10;

    this.http
      .get<AllNodes>(
        `${this.apiUrl}/nodes?pageIndex=${pageIndex}&pageSize=${pageSize}&category=${category}`,
        {
          withCredentials: true,
        }
      )
      .subscribe((nodes) => {
        this.nodesData.next(nodes);
      });
  }

  getNodeInfo(headerUniqueId: string) {
    this.loadingService.setLoading(true);
    return this.http.get<unknown>(
      `${this.apiUrl}/nodes/${headerUniqueId}/attributes`,
      {
        withCredentials: true,
      }
    );
  }

  getEdgeInfo(headerUniqueId: string) {
    this.loadingService.setLoading(true);
    return this.http.get<unknown>(
      `${this.apiUrl}/edges/${headerUniqueId}/attributes?id=${headerUniqueId}`,
      {
        withCredentials: true,
      }
    );
  }

  getGraph(nodeId: string) {
    this.loadingService.setLoading(true);
    return this.http.get<Graph>(
      `${this.apiUrl}/nodes-relation?nodeId=${nodeId}`,
      {
        withCredentials: true,
      }
    );
  }

  search(searchInput: string, searchType: string, pageIndex = 0) {
    this.loadingService.setLoading(true);
    const pageSize = 10;

    return this.http.get<AllNodes>(
      this.apiUrl +
        `/Search?searchInput=${searchInput}&searchType=${searchType}&pageIndex=${pageIndex}&pageSize=${pageSize}`,
      {
        withCredentials: true,
      }
    );
  }
}
