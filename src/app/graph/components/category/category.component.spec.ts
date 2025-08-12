import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CategoryComponent } from './category.component';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { SharedModule } from '../../../shared/shared.module';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BehaviorSubject, of } from 'rxjs';
import { By } from '@angular/platform-browser';
import { CategoryService } from '../../services/category/category.service';
import { MatDialog } from '@angular/material/dialog';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { CatDeleteConfirmComponent } from './cat-delete-confirm/cat-delete-confirm.component';
import { GetCategoriesResponse } from '../../model/Category';

describe('CategoryComponent', () => {
  let component: CategoryComponent;
  let fixture: ComponentFixture<CategoryComponent>;
  let categoryService: CategoryService;
  let dialog: MatDialog;
  let mockCategories$: BehaviorSubject<GetCategoriesResponse>;

  beforeEach(async () => {
    mockCategories$ = new BehaviorSubject<GetCategoriesResponse>({
      paginateList: [{ id: 1, name: 'Category 1', totalNumber: 5 }],
      pageIndex: 0,
      totalCount: 1,
    });

    await TestBed.configureTestingModule({
      declarations: [CategoryComponent, CatDeleteConfirmComponent],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        {
          provide: CategoryService,
          useValue: {
            categoriesData$: mockCategories$.asObservable(),
            notification$: of({ status: true, message: 'Test message' }),
            getCategories: jasmine
              .createSpy('getCategories')
              .and.callFake(() => {
                mockCategories$.next({
                  paginateList: [{ id: 1, name: 'Category 1', totalNumber: 5 }],
                  pageIndex: 0,
                  totalCount: 1,
                });
                return of();
              }),
            createCategory: jasmine
              .createSpy('createCategory')
              .and.returnValue(of({})),
            updateCategory: jasmine
              .createSpy('updateCategory')
              .and.returnValue(of({})),
            deleteCategory: jasmine
              .createSpy('deleteCategory')
              .and.returnValue(of({})),
          },
        },
        {
          provide: MatDialog,
          useValue: {
            open: jasmine.createSpy('open').and.returnValue({
              afterClosed: () => of(true),
              componentInstance: {
                deleteUser: jasmine.createSpy('deleteUser').and.callFake(() => {
                  categoryService.deleteCategory(1).subscribe();
                }),
              },
            }),
          },
        },
      ],
      imports: [
        SharedModule,
        MatPaginatorModule,
        MatIconModule,
        MatTableModule,
        MatFormFieldModule,
        MatInputModule,
        FormsModule,
        BrowserAnimationsModule,
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(CategoryComponent);
    component = fixture.componentInstance;
    categoryService = TestBed.inject(CategoryService);
    dialog = TestBed.inject(MatDialog);

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load categories on init', () => {
    expect(categoryService.getCategories).toHaveBeenCalled();
    expect(component.categoriesData.length).toBe(1);
    expect(component.categoriesData[0].name).toBe('Category 1');
  });

  it('should show add form when addCategory is called', () => {
    component.addCategory();
    fixture.detectChanges();
    expect(component.isAdding).toBeTrue();

    const addButton = fixture.debugElement.query(By.css('.add-user'));
    expect(addButton).toBeNull();

    const formField = fixture.debugElement.query(By.css('.form-field'));
    expect(formField).not.toBeNull();
  });

  it('should call createCategory when saveNewCategory is called', () => {
    component.isAdding = true;
    component.nameValue = 'New Category';
    component.saveNewCategory();
    expect(categoryService.createCategory).toHaveBeenCalledWith('New Category');
    expect(component.isAdding).toBeFalse();
  });

  it('should show edit form when editCategory is called', () => {
    component.editCategory({ id: 1, name: 'Category 1', totalNumber: 5 });
    fixture.detectChanges();
    expect(component.editingId).toBe(1);

    const editField = fixture.debugElement.query(By.css('.edit-field'));
    expect(editField).not.toBeNull();
  });

  it('should call updateCategory when saveEditCategory is called', () => {
    const category = { id: 1, name: 'Updated Category', totalNumber: 5 };

    component.editingId = category.id;
    component.updateNameValue = category.name;
    component.saveEditCategory(category);

    fixture.detectChanges();

    expect(categoryService.updateCategory).toHaveBeenCalledWith(
      category.id,
      category.name
    );
    expect(component.editingId).toBe(-1);
  });

  it('should call deleteCategory when deleteCategory is called', () => {
    const category = { id: 1, name: 'Category 1', totalNumber: 5 };

    component.deleteCategory(category);
    fixture.detectChanges();

    const dialogRef = dialog.open(CatDeleteConfirmComponent, {
      data: { category, pageSize: 10, pageIndex: 0 },
    });
    dialogRef.componentInstance.deleteUser();

    expect(dialog.open).toHaveBeenCalled();
    expect(categoryService.deleteCategory).toHaveBeenCalledWith(1);
  });

  it('should paginate categories', () => {
    const paginator = fixture.debugElement.query(By.css('mat-paginator'));
    paginator.triggerEventHandler('page', { pageIndex: 1, pageSize: 10 });
    expect(categoryService.getCategories).toHaveBeenCalledWith(10, 1);
  });

  it('cancelNewCategory SHOULD reset form WHEN called', () => {
    // Arrange
    component.isAdding = true;
    component.nameValue = 'test';
    component.cancelNewCategory();
    // Assert
    expect(component.isAdding).toBeFalse();
    expect(component.nameValue).toBeFalsy();
  });

  it('cancelEditCategory SHOULD reset form WHEN called', () => {
    // Arrange
    component.editingId = 2;
    component.cancelEditCategory();
    // Assert
    expect(component.editingId).toBe(-1);
  });
});
