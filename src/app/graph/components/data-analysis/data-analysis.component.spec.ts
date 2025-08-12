import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DataAnalysisComponent } from './data-analysis.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SharedModule } from '../../../shared/shared.module';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { SearchNodesComponent } from './search-nodes/search-nodes.component';
import { MatSelectModule } from '@angular/material/select';
import { FormsModule } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { LoadGraphService } from '../../services/load-graph/load-graph.service';
import { MatDialog } from '@angular/material/dialog';
import { LoadingService } from '../../../shared/services/loading.service';
import { ThemeService } from '../../../shared/services/theme.service';
import { BehaviorSubject, of, Subject } from 'rxjs';
import { AllNodes } from '../../model/graph';

describe('DataAnalysisComponent', () => {
  let component: DataAnalysisComponent;
  let fixture: ComponentFixture<DataAnalysisComponent>;
  let mockMatSnackBar: jasmine.SpyObj<MatSnackBar>;
  let mockMatDialog: jasmine.SpyObj<MatDialog>;
  let mockLoadingService: jasmine.SpyObj<LoadingService>;
  let themeSubject: BehaviorSubject<string>;
  let mockLoadGraphService: jasmine.SpyObj<LoadGraphService>;
  let nodesData: Subject<AllNodes>;

  beforeEach(async () => {
    mockMatSnackBar = jasmine.createSpyObj<MatSnackBar>(['openFromComponent']);
    mockMatDialog = jasmine.createSpyObj<MatDialog>(['open']);
    mockLoadingService = jasmine.createSpyObj<LoadingService>(['setLoading']);
    themeSubject = new BehaviorSubject<string>('light');
    mockLoadGraphService = jasmine.createSpyObj<LoadGraphService>([
      'getAllNodes',
      'getNodeInfo',
      'getEdgeInfo',
      'nodesData$',
      'getGraph',
    ]);
    nodesData = new Subject<AllNodes>();
    mockLoadGraphService.nodesData$ = nodesData.asObservable();

    await TestBed.configureTestingModule({
      declarations: [DataAnalysisComponent, SearchNodesComponent],
      imports: [
        MatFormFieldModule,
        MatPaginatorModule,
        MatMenuModule,
        MatIconModule,
        MatInputModule,
        BrowserAnimationsModule,
        SharedModule,
        MatSelectModule,
        FormsModule,
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
        {
          provide: ThemeService,
          useValue: { theme$: themeSubject.asObservable() },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(DataAnalysisComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    spyOn(document, 'getElementById').and.returnValue({
      dataset: { nodeid: '123', edgeid: '123' },
    } as unknown as HTMLElement);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('colors SHOULD change WHEN theme changes', () => {
    expect(component.isDarkMode).toBeFalse();
    themeSubject.next('dark');
    expect(component.isDarkMode).toBeTrue();
  });

  it('getNodeInfo SHOULD show info WHEN get data successfully', () => {
    // Arrange
    mockLoadGraphService.getNodeInfo
      .withArgs('123')
      .and.returnValue(of({ name: 'mamad', id: 1 }));
    // Act
    component.getNodeInfo();
    // Assert
    expect(mockMatDialog.open).toHaveBeenCalled();
  });

  it('getEdgeInfo SHOULD show info WHEN get data successfully', () => {
    // Arrange
    mockLoadGraphService.getEdgeInfo
      .withArgs('123')
      .and.returnValue(of({ name: 'mamad', id: 1 }));
    // Act
    component.getEdgeInfo();
    // Assert
    expect(mockMatDialog.open).toHaveBeenCalled();
  });

  it('showAsGraph SHOULD add node WHEN called', () => {
    // Arrange
    spyOn(component.nodes, 'add');
    // Act
    component.showAsGraph({
      id: '1',
      entityName: 'mamad',
    });
    // Assert
    expect(component.nodes.add).toHaveBeenCalled();
  });

  it('getGraph SHOULD get data WHEN called', () => {
    // Arrange
    const getGraphResponse = {
      nodes: [
        {
          id: 'e73813ee-5f00-4d3d-b0e1-2050c370804a',
          label: '3084026274',
        },
        {
          id: '43f45cbb-53d2-4c87-b5ea-30d4b256a4f9',
          label: '4727992815',
        },
        {
          id: '1b450254-dbbf-4735-8c73-4947158a9883',
          label: '7434776097',
        },
      ],
      edges: [
        {
          from: '43f45cbb-53d2-4c87-b5ea-30d4b256a4f9',
          to: 'e73813ee-5f00-4d3d-b0e1-2050c370804a',
          id: '4a3231bb-835e-48ee-ac65-0ad2bf021588',
        },
        {
          from: '43f45cbb-53d2-4c87-b5ea-30d4b256a4f9',
          to: '1b450254-dbbf-4735-8c73-4947158a9883',
          id: 'bb4c8c15-ed87-44a8-888a-e7080c91e478',
        },
      ],
    };
    mockLoadGraphService.getGraph.and.returnValue(of(getGraphResponse));
    // Act
    component.getGraph();
    // Assert
    expect(component.edges.get()).toEqual(getGraphResponse.edges);
    expect(component.nodes.get()).toEqual(getGraphResponse.nodes);
  });

  it('changeState SHOULD change animation state WHEN called', () => {
    component.state = 'startRound';
    component.changeState();
    expect(component.state).toBe('endRound');
    component.changeState();
    expect(component.state).toBe('startRound');
  });

  it('closeSearchBar SHOULD call changeState WHEN called', () => {
    // Arrange
    spyOn(component, 'changeState');
    // Act
    component.closeSearchBar();
    // Assert
    expect(component.changeState).toHaveBeenCalledTimes(1);
  });

  it('clearGraph SHOULD clear all nodes WHEN called', () => {
    // Arrange
    spyOn(component.nodes, 'clear');
    // Act
    component.clearGraph();
    // Assert
    expect(component.nodes.clear).toHaveBeenCalledTimes(1);
  });
});
