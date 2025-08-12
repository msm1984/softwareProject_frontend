import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { PageEvent } from '@angular/material/paginator';
import { CategoryData, GetCategoriesResponse } from '../../model/Category';
import { CatDeleteConfirmComponent } from './cat-delete-confirm/cat-delete-confirm.component';
import { CategoryService } from '../../services/category/category.service';
import { LoadingService } from '../../../shared/services/loading.service';
import { DangerSuccessNotificationComponent } from '../../../shared/components/danger-success-notification/danger-success-notification.component';

@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrl: './category.component.scss',
})
export class CategoryComponent implements OnInit {
  categoriesData: CategoryData[] = [];
  displayedColumns: string[] = ['id', 'name', 'count', 'edit/delete'];

  length!: number;
  pageSize = 10;
  pageIndex = 0;
  pageSizeOptions = [5, 10, 25];
  hidePageSize = false;
  showPageSizeOptions = true;
  showFirstLastButtons = true;

  nameValue = '';
  isAdding = false;
  editingId = -1;
  updateNameValue!: string;

  constructor(
    private readonly dialog: MatDialog,
    private _snackBar: MatSnackBar,
    private categoryService: CategoryService,
    private loadingService: LoadingService
  ) {}

  ngOnInit(): void {
    this.categoryService.categoriesData$.subscribe({
      next: (response: GetCategoriesResponse) => {
        this.categoriesData = response.paginateList;
        this.length = response.totalCount;
        this.pageIndex = response.pageIndex;
        this.loadingService.setLoading(false);
      },
      error: (error) => {
        this._snackBar.openFromComponent(DangerSuccessNotificationComponent, {
          data: error.error.message,
          panelClass: ['notification-class-danger'],
          duration: 2000,
        });
        this.loadingService.setLoading(false);
      },
    });

    this.categoryService.notification$.subscribe(
      (data: { status: boolean; message: string }) => {
        this._snackBar.openFromComponent(DangerSuccessNotificationComponent, {
          data: data.message,
          panelClass: data.status
            ? ['notification-class-success']
            : ['notification-class-danger'],
          duration: 2000,
        });

        if (data.status) {
          this.dialog.closeAll();
        }
      }
    );

    this.categoryService.getCategories(this.pageSize, this.pageIndex);
  }

  addCategory() {
    this.isAdding = true;
  }

  editCategory(categoryData: CategoryData) {
    this.editingId = categoryData.id;
    this.updateNameValue = categoryData.name;
  }

  deleteCategory(categoryData: CategoryData) {
    this.dialog.open(CatDeleteConfirmComponent, {
      width: '22rem',
      data: {
        category: categoryData,
        pageSize: this.pageSize,
        pageIndex: this.pageIndex,
      },
    });
  }

  saveNewCategory() {
    if (this.nameValue) {
      this.loadingService.setLoading(true);
      this.categoryService.createCategory(this.nameValue).subscribe({
        next: () => {
          this.categoryService.getCategories(this.pageSize, this.pageIndex);
          this.isAdding = false;
          this.nameValue = '';
          this._snackBar.openFromComponent(DangerSuccessNotificationComponent, {
            data: 'Category created successfully.',
            panelClass: ['notification-class-success'],
            duration: 2000,
          });
          this.loadingService.setLoading(false);
        },
        error: (error) => {
          this._snackBar.openFromComponent(DangerSuccessNotificationComponent, {
            data: error.error.message,
            panelClass: ['notification-class-danger'],
            duration: 2000,
          });
          this.loadingService.setLoading(false);
        },
      });
    }
  }

  cancelNewCategory() {
    this.isAdding = false;
    this.nameValue = '';
  }

  cancelEditCategory() {
    this.editingId = -1;
  }

  saveEditCategory(categoryData: CategoryData) {
    this.loadingService.setLoading(true);
    this.categoryService
      .updateCategory(categoryData.id, this.updateNameValue)
      .subscribe({
        next: () => {
          this.categoryService.getCategories(this.pageSize, this.pageIndex);
          this.editingId = -1;
          this.updateNameValue = '';
          this._snackBar.openFromComponent(DangerSuccessNotificationComponent, {
            data: 'Category updated successfully.',
            panelClass: ['notification-class-success'],
            duration: 2000,
          });
          this.loadingService.setLoading(false);
        },
        error: (error) => {
          this._snackBar.openFromComponent(DangerSuccessNotificationComponent, {
            data: error.error.message,
            panelClass: ['notification-class-danger'],
            duration: 2000,
          });
          this.loadingService.setLoading(false);
        },
      });
  }

  handlePageEvent(e: PageEvent) {
    this.pageSize = e.pageSize;
    this.pageIndex = e.pageIndex;
    this.length = e.length;
    this.categoryService.getCategories(e.pageSize, e.pageIndex);
  }
}
