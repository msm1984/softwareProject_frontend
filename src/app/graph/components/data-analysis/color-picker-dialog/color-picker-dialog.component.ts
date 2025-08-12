import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-color-picker-dialog',
  templateUrl: './color-picker-dialog.component.html',
  styleUrls: ['./color-picker-dialog.component.scss'],
})
export class ColorPickerDialogComponent {
  colors: string[] = [
    '#FFD700',
    '#FF8C00',
    '#FF69B4',
    '#00CED1',
    '#7B68EE',
    '#32CD32',
  ];

  // colors: string[] = [
  //   '#F9D776', // Soft Gold
  //   '#F4A261', // Soft Orange
  //   '#F3A6B3', // Soft Pink
  //   '#9DD6D2', // Soft Turquoise
  //   '#A5A8F4', // Soft Blue
  //   '#A6D49F', // Soft Green
  // ];

  // colors: string[] = [
  //   '#E1B84E', // Darker Soft Gold
  //   '#E2884A', // Darker Soft Orange
  //   '#E38C9F', // Darker Soft Pink
  //   '#83C5C2', // Darker Soft Turquoise
  //   '#8587D8', // Darker Soft Blue
  //   '#89B882', // Darker Soft Green
  // ];

  constructor(public dialogRef: MatDialogRef<ColorPickerDialogComponent>) {}

  selectColor(color: string): void {
    this.dialogRef.close(color);
  }
}
