import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ColorPickerDialogComponent } from './color-picker-dialog.component';

describe('ColorPickerDialogComponent', () => {
  let component: ColorPickerDialogComponent;
  let fixture: ComponentFixture<ColorPickerDialogComponent>;
  let dialogRefSpy: jasmine.SpyObj<MatDialogRef<ColorPickerDialogComponent>>;

  beforeEach(async () => {
    const dialogRefMock = jasmine.createSpyObj('MatDialogRef', ['close']);

    await TestBed.configureTestingModule({
      declarations: [ColorPickerDialogComponent],
      providers: [
        { provide: MatDialogRef, useValue: dialogRefMock },
        { provide: MAT_DIALOG_DATA, useValue: {} },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ColorPickerDialogComponent);
    component = fixture.componentInstance;
    dialogRefSpy = TestBed.inject(MatDialogRef) as jasmine.SpyObj<
      MatDialogRef<ColorPickerDialogComponent>
    >;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should have a default list of colors', () => {
    expect(component.colors.length).toBeGreaterThan(0);
  });

  it('should close the dialog with the selected color when selectColor is called', () => {
    const color = '#FF0000';
    component.selectColor(color);
    expect(dialogRefSpy.close).toHaveBeenCalledWith(color);
  });

  it('should have the same number of colors in the template as in the component', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const colorElements = compiled.querySelectorAll('.color-box');
    expect(colorElements.length).toBe(component.colors.length);
  });

  it('should close the dialog with the correct color when a color box is clicked', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const colorElements = compiled.querySelectorAll('.color-box');

    colorElements.forEach((element, index) => {
      element.dispatchEvent(new Event('click'));
      expect(dialogRefSpy.close).toHaveBeenCalledWith(component.colors[index]);
    });
  });
});
