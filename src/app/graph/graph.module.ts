import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DataAnalysisComponent } from './components/data-analysis/data-analysis.component';
import { SharedModule } from '../shared/shared.module';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatTooltipModule } from '@angular/material/tooltip';
import { AddGraphComponent } from './components/add-graph/add-graph.component';
import { MatTableModule } from '@angular/material/table';
import { MatSlideToggle } from '@angular/material/slide-toggle';
import { MatRadioButton, MatRadioGroup } from '@angular/material/radio';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { InfoDialogComponent } from './components/data-analysis/info-dialog/info-dialog.component';
import {
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogModule,
  MatDialogTitle,
} from '@angular/material/dialog';
import { CategoryComponent } from './components/category/category.component';
import { MatRippleModule } from '@angular/material/core';
import { CatDeleteConfirmComponent } from './components/category/cat-delete-confirm/cat-delete-confirm.component';
import { CdkDrag, CdkDragHandle } from '@angular/cdk/drag-drop';
import { ColorPickerDialogComponent } from './components/data-analysis/color-picker-dialog/color-picker-dialog.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SearchNodesComponent } from './components/data-analysis/search-nodes/search-nodes.component';

@NgModule({
  declarations: [
    DataAnalysisComponent,
    AddGraphComponent,
    InfoDialogComponent,
    CategoryComponent,
    CatDeleteConfirmComponent,
    ColorPickerDialogComponent,
    SearchNodesComponent,
  ],
  imports: [
    CommonModule,
    SharedModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatPaginatorModule,
    MatTooltipModule,
    MatTableModule,
    MatSlideToggle,
    MatRadioGroup,
    MatRadioButton,
    FormsModule,
    MatSelectModule,
    MatButtonModule,
    MatMenuModule,
    MatDialogContent,
    MatDialogTitle,
    MatDialogActions,
    MatDialogClose,
    ReactiveFormsModule,
    MatRippleModule,
    CdkDrag,
    CdkDragHandle,
    MatDialogModule,
    BrowserAnimationsModule,
  ],
})
export class GraphModule {}
