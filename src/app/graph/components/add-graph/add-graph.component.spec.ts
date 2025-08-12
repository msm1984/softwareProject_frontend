import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AddGraphComponent } from './add-graph.component';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';
import { DashboardHeaderComponent } from '../../../shared/components/dashboard-header/dashboard-header.component';
import { CardComponent } from '../../../shared/components/card/card.component';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { CategoryData, GetCategoriesResponse } from '../../model/Category';
import { AddGraphService } from '../../services/add-graph/add-graph.service';
import { DangerSuccessNotificationComponent } from '../../../shared/components/danger-success-notification/danger-success-notification.component';
import { SharedModule } from '../../../shared/shared.module';
import { of, throwError } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { LoadingService } from '../../../shared/services/loading.service';

describe('AddGraphComponent', () => {
  let component: AddGraphComponent;
  let fixture: ComponentFixture<AddGraphComponent>;
  let mockAddGraphService: jasmine.SpyObj<AddGraphService>;
  let mockSnackBar: jasmine.SpyObj<MatSnackBar>;
  let mockLoadingService: jasmine.SpyObj<LoadingService>;

  beforeEach(async () => {
    mockAddGraphService = jasmine.createSpyObj<AddGraphService>([
      'getCategories',
      'uploadNode',
      'uploadEdge',
    ]);
    mockSnackBar = jasmine.createSpyObj<MatSnackBar>(['openFromComponent']);
    mockLoadingService = jasmine.createSpyObj<LoadingService>(['setLoading']);

    await TestBed.configureTestingModule({
      declarations: [
        AddGraphComponent,
        DashboardHeaderComponent,
        CardComponent,
        DangerSuccessNotificationComponent,
      ],
      imports: [MatIconModule, RouterModule.forRoot([]), SharedModule],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: AddGraphService, useValue: mockAddGraphService },
        { provide: MatSnackBar, useValue: mockSnackBar },
        { provide: LoadingService, useValue: mockLoadingService },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(AddGraphComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('box SHOULD highlight WHEN drag over and unhighlight when leave', () => {
    component.highlight();
    expect(component.isHighlighted).toBeTrue();

    component.unhighlight();
    expect(component.isHighlighted).toBeFalse();
  });

  it('load categories should work when called', () => {
    const categories: CategoryData[] = [
      { id: 1, name: 'Category 1', totalNumber: 2 },
      { id: 2, name: 'Category 2', totalNumber: 0 },
    ];
    const categoryResponse: GetCategoriesResponse = {
      paginateList: categories,
      pageIndex: 10,
      totalCount: 5,
    };

    mockAddGraphService.getCategories.and.returnValue(of(categoryResponse));

    component.loadCategory();

    expect(component.categories).toEqual(categories);
    expect(mockLoadingService.setLoading).toHaveBeenCalledWith(false);
  });

  it('should show error notification when loadCategory fails', () => {
    const mockError = { error: { message: 'Update failed' } };
    mockAddGraphService.getCategories.and.returnValue(
      throwError(() => mockError)
    );

    component.loadCategory();

    expect(mockSnackBar.openFromComponent).toHaveBeenCalledWith(
      DangerSuccessNotificationComponent,
      {
        data: 'Update failed',
        panelClass: ['notification-class-danger'],
        duration: 2000,
      }
    );
    expect(mockLoadingService.setLoading).toHaveBeenCalledWith(false);
  });

  describe('upload functionality', () => {
    beforeEach(() => {
      mockAddGraphService.uploadNode.and.returnValue(of(Object));
      mockAddGraphService.uploadEdge.and.returnValue(of(Object));
    });

    it('should upload node data successfully', () => {
      component.csvType = 'node';
      component.selectedId = '1';
      component.categoryName = 'Category 1';
      component.name = 'Node Name';

      component.uploadFile();

      expect(mockSnackBar.openFromComponent).toHaveBeenCalledWith(
        DangerSuccessNotificationComponent,
        {
          data: 'Node added successfully!',
          panelClass: ['notification-class-success'],
          duration: 2000,
        }
      );
      expect(mockLoadingService.setLoading).toHaveBeenCalledWith(false);
    });

    it('should upload edge data successfully', () => {
      component.csvType = 'edge';
      component.selectedSource = '1';
      component.selectedDestination = '2';

      component.uploadFile();

      expect(mockSnackBar.openFromComponent).toHaveBeenCalledWith(
        DangerSuccessNotificationComponent,
        {
          data: 'Edge added successfully!',
          panelClass: ['notification-class-success'],
          duration: 2000,
        }
      );
      expect(mockLoadingService.setLoading).toHaveBeenCalledWith(false);
    });

    it('should handle node upload errors', () => {
      const mockError = { error: { message: 'Update failed' } };

      mockAddGraphService.uploadNode.and.returnValue(
        throwError(() => mockError)
      );

      component.csvType = 'node';
      component.selectedId = '1';
      component.categoryName = 'Category 1';
      component.name = 'Node Name';

      component.uploadFile();

      expect(mockSnackBar.openFromComponent).toHaveBeenCalledWith(
        DangerSuccessNotificationComponent,
        {
          data: 'Update failed',
          panelClass: ['notification-class-danger'],
          duration: 2000,
        }
      );
      expect(mockLoadingService.setLoading).toHaveBeenCalledWith(false);
    });

    it('should handle edge upload errors', () => {
      const mockError = { error: { message: 'Update failed' } };

      mockAddGraphService.uploadEdge.and.returnValue(
        throwError(() => mockError)
      );

      component.csvType = 'edge';
      component.selectedSource = '1';
      component.selectedDestination = '2';

      component.uploadFile();

      expect(mockSnackBar.openFromComponent).toHaveBeenCalledWith(
        DangerSuccessNotificationComponent,
        {
          data: 'Update failed',
          panelClass: ['notification-class-danger'],
          duration: 2000,
        }
      );
      expect(mockLoadingService.setLoading).toHaveBeenCalledWith(false);
    });
  });
});
