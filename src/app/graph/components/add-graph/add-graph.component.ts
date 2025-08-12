import { ChangeDetectorRef, Component, ViewChild } from '@angular/core';
import { Papa } from 'ngx-papaparse';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AddGraphService } from '../../services/add-graph/add-graph.service';
import { CategoryData } from '../../model/Category';
import { LoadingService } from '../../../shared/services/loading.service';
import { DangerSuccessNotificationComponent } from '../../../shared/components/danger-success-notification/danger-success-notification.component';

@Component({
  selector: 'app-add-graph',
  templateUrl: './add-graph.component.html',
  styleUrl: './add-graph.component.scss',
})
export class AddGraphComponent {
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  isHighlighted = false;
  selectedFile!: File;
  csvData: unknown[] = [];
  headers: string[] = [];
  categories: CategoryData[] = [];
  isLoaded = false;
  isUploading = false;
  wrongFormat = false;
  displayedColumns: string[] = [];
  dataSource = new MatTableDataSource<unknown>();
  csvType = 'node';
  selectedId = '';
  selectedSource = '';
  selectedDestination = '';
  categoryName = '';
  name = '';

  constructor(
    private papaParseService: Papa,
    private changeDetector: ChangeDetectorRef,
    private _snackBar: MatSnackBar,
    private addGraphService: AddGraphService,
    private loadingService: LoadingService
  ) {}

  loadCategory() {
    this.addGraphService.getCategories().subscribe({
      next: (data) => {
        this.categories = data.paginateList;
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

  highlight() {
    this.isHighlighted = true;
  }

  unhighlight() {
    this.isHighlighted = false;
  }

  readFile(event: Event) {
    this.loadingService.setLoading(true);
    this.wrongFormat = false;
    this.isLoaded = false;
    this.isHighlighted = false;
    const target = event.target as HTMLInputElement;
    this.selectedFile = (target.files as FileList)[0];
    const fileName = this.selectedFile.name;
    const fileExtension = fileName.split('.').pop()?.toLowerCase();

    if (fileExtension !== 'csv') {
      this.wrongFormat = true;
      this._snackBar.openFromComponent(DangerSuccessNotificationComponent, {
        data: 'Please upload a CSV file',
        panelClass: ['notification-class-danger'],
        duration: 2000,
      });
      this.loadingService.setLoading(false);
      return;
    }

    this.csvData = [];
    this.headers = [];

    const reader = new FileReader();
    reader.readAsText(this.selectedFile);
    reader.onload = (event: ProgressEvent<FileReader>) => {
      const textContent = event.target!.result as string; // Type assertion (use with caution)
      const csvData = this.papaParseService.parse(textContent, {
        header: true,
      });
      this.csvData = csvData.data;
      this.headers = Object.keys(csvData.data[0]);
      this.isLoaded = true;
      this.displayedColumns = this.headers;
      this.changeDetector.detectChanges();
      this.dataSource.data = this.csvData;
      this.dataSource.paginator = this.paginator;
      if (!this.categories.length) {
        this.loadCategory();
      }
      this.loadingService.setLoading(false);
    };
  }

  uploadFile() {
    this.isUploading = true;
    this.loadingService.setLoading(true);
    if (this.csvType === 'node') {
      this.addGraphService
        .uploadNode(
          this.selectedFile,
          this.selectedId,
          this.categoryName,
          this.name
        )
        .subscribe({
          next: () => {
            this.reset();
            this._snackBar.openFromComponent(
              DangerSuccessNotificationComponent,
              {
                data: 'Node added successfully!',
                panelClass: ['notification-class-success'],
                duration: 2000,
              }
            );
            this.loadingService.setLoading(false);
          },
          error: (error) => {
            this.isUploading = false;
            this._snackBar.openFromComponent(
              DangerSuccessNotificationComponent,
              {
                data: error.error.message,
                panelClass: ['notification-class-danger'],
                duration: 2000,
              }
            );
            this.loadingService.setLoading(false);
          },
        });
    } else {
      this.addGraphService
        .uploadEdge(
          this.selectedFile,
          this.selectedSource,
          this.selectedDestination
        )
        .subscribe({
          next: () => {
            this.reset();
            this._snackBar.openFromComponent(
              DangerSuccessNotificationComponent,
              {
                data: 'Edge added successfully!',
                panelClass: ['notification-class-success'],
                duration: 2000,
              }
            );
            this.loadingService.setLoading(false);
          },
          error: (error) => {
            this.isUploading = false;
            this._snackBar.openFromComponent(
              DangerSuccessNotificationComponent,
              {
                data: error.error.message,
                panelClass: ['notification-class-danger'],
                duration: 2000,
              }
            );
            this.loadingService.setLoading(false);
          },
        });
    }
  }

  private reset() {
    this.isHighlighted = false;
    this.csvData = [];
    this.headers = [];
    this.isLoaded = false;
    this.isUploading = false;
    this.wrongFormat = false;
    this.displayedColumns = [];
    this.dataSource.data = [];
    this.csvType = 'node';
    this.selectedId = '';
    this.selectedSource = '';
    this.selectedDestination = '';
    this.categoryName = '';
    this.name = '';
  }
}
