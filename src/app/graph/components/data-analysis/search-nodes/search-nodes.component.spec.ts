import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SearchNodesComponent } from './search-nodes.component';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { FormsModule } from '@angular/forms';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { LoadingService } from '../../../../shared/services/loading.service';
import { LoadGraphService } from '../../../services/load-graph/load-graph.service';
import { of, Subject } from 'rxjs';
import { AllNodes } from '../../../model/graph';
import { By } from '@angular/platform-browser';

describe('SearchNodesComponent', () => {
  let component: SearchNodesComponent;
  let fixture: ComponentFixture<SearchNodesComponent>;
  let mockMatSnackBar: jasmine.SpyObj<MatSnackBar>;
  let mockMatDialog: jasmine.SpyObj<MatDialog>;
  let mockLoadingService: jasmine.SpyObj<LoadingService>;
  let mockLoadGraphService: jasmine.SpyObj<LoadGraphService>;
  let nodesData: Subject<AllNodes>;
  const allNodes = {
    items: [
      {
        id: '0f179481-1203-4a93-ad5f-de68cc6e5fd5',
        entityName: '5718373092',
      },
      {
        id: '144f0830-445d-4c7e-a44c-2ed555b19183',
        entityName: '9862369812',
      },
    ],
    pageIndex: 0,
    totalItems: 2,
    categoryName: null,
  };

  beforeEach(async () => {
    mockMatSnackBar = jasmine.createSpyObj<MatSnackBar>(['openFromComponent']);
    mockMatDialog = jasmine.createSpyObj<MatDialog>(['open']);
    mockLoadingService = jasmine.createSpyObj<LoadingService>(['setLoading']);
    mockLoadGraphService = jasmine.createSpyObj<LoadGraphService>([
      'getAllNodes',
      'getNodeInfo',
      'nodesData$',
      'search',
    ]);
    nodesData = new Subject<AllNodes>();
    mockLoadGraphService.nodesData$ = nodesData.asObservable();

    await TestBed.configureTestingModule({
      declarations: [SearchNodesComponent],
      imports: [
        MatPaginatorModule,
        MatIconModule,
        MatInputModule,
        MatSelectModule,
        FormsModule,
        NoopAnimationsModule,
      ],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: MatSnackBar, useValue: mockMatSnackBar },
        {
          provide: LoadGraphService,
          useValue: mockLoadGraphService,
        },
        { provide: MatDialog, useValue: mockMatDialog },
        { provide: LoadingService, useValue: mockLoadingService },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(SearchNodesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('SHOULD get nodes data WHEN loaded', () => {
    // Arrange
    nodesData.next(allNodes);
    // Act
    fixture.detectChanges();
    // Assert
    expect(component.accounts).toEqual(allNodes.items);
    expect(component.length).toEqual(allNodes.totalItems);
    expect(component.pageIndex).toEqual(allNodes.pageIndex);
  });

  it('searchNodes SHOULD not search WHEN there is no input', () => {
    // Arrange
    component.searchInput = '';
    // Act
    fixture.detectChanges();
    component.searchNodes();
    // Assert
    expect(mockLoadGraphService.getAllNodes).toHaveBeenCalledTimes(2);
  });

  it('showAsGraph SHOULD send account data to parent WHEN called', () => {
    // Arrange
    spyOn(component.showGraph, 'emit');
    // Act
    component.showAsGraph(allNodes.items[0]);
    // Assert
    expect(component.showGraph.emit).toHaveBeenCalled();
  });

  it('getInfo SHOULD show info WHEN get data successfully', () => {
    // Arrange
    mockLoadGraphService.getNodeInfo
      .withArgs('123')
      .and.returnValue(of({ name: 'mamad', id: 1 }));
    // Act
    component.getInfo('123');
    // Assert
    expect(mockMatDialog.open).toHaveBeenCalled();
  });

  it('should paginate categories', () => {
    const paginator = fixture.debugElement.query(By.css('mat-paginator'));
    paginator.triggerEventHandler('page', { pageIndex: 1, pageSize: 10 });
    expect(mockLoadGraphService.getAllNodes).toHaveBeenCalledWith(1);
  });
});
