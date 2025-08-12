import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AssignDialogComponent } from './assign-dialog.component';
import { FormsModule } from '@angular/forms';
import {
  MatAutocompleteModule,
  MatAutocompleteSelectedEvent,
} from '@angular/material/autocomplete';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatChipsModule } from '@angular/material/chips';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { AssignFileService } from '../../../../services/assign-file/assign-file.service';
import { LoadingService } from '../../../../../shared/services/loading.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { of, throwError } from 'rxjs';

describe('AssignDialogComponent', () => {
  let component: AssignDialogComponent;
  let fixture: ComponentFixture<AssignDialogComponent>;
  let assignFileService: jasmine.SpyObj<AssignFileService>;
  let loadingService: jasmine.SpyObj<LoadingService>;
  let snackBarSpy: jasmine.SpyObj<MatSnackBar>;

  beforeEach(async () => {
    const assignFileSpy = jasmine.createSpyObj('AssignFileService', [
      'setFileAccess',
      'search',
      'getFilesData',
      'getFileUserAccess',
    ]);
    const loadingSpy = jasmine.createSpyObj('LoadingService', ['setLoading']);
    const snackBarMock = jasmine.createSpyObj('MatSnackBar', [
      'openFromComponent',
    ]);

    await TestBed.configureTestingModule({
      declarations: [AssignDialogComponent],
      imports: [
        MatDialogModule,
        MatFormFieldModule,
        MatChipsModule,
        MatAutocompleteModule,
        FormsModule,
        NoopAnimationsModule,
      ],
      providers: [
        {
          provide: MAT_DIALOG_DATA,
          useValue: 5,
        },
        { provide: MatDialogRef, useValue: {} },
        { provide: AssignFileService, useValue: assignFileSpy },
        { provide: LoadingService, useValue: loadingSpy },
        { provide: MatSnackBar, useValue: snackBarMock },
        provideHttpClient(),
        provideHttpClientTesting(),
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AssignDialogComponent);
    component = fixture.componentInstance;

    assignFileService = TestBed.inject(
      AssignFileService,
    ) as jasmine.SpyObj<AssignFileService>;
    loadingService = TestBed.inject(
      LoadingService,
    ) as jasmine.SpyObj<LoadingService>;
    snackBarSpy = TestBed.inject(MatSnackBar) as jasmine.SpyObj<MatSnackBar>;

    assignFileService.getFileUserAccess.and.returnValue(of([]));
    spyOn(component, 'search');
    spyOn(component, 'onSubmit');

    fixture.detectChanges();
  });

  afterEach(() => {
    component.users = [];
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with an empty currentUser', () => {
    expect(component.currentUser).toBe('');
  });

  it('should call onSubmit() when form is submitted', () => {
    const form = fixture.nativeElement.querySelector('form');
    form.dispatchEvent(new Event('submit'));
    fixture.detectChanges();
    expect(component.onSubmit).toHaveBeenCalled();
  });

  it('should call search() and update currentUser', () => {
    component.search('newUser');
    expect(component.search).toHaveBeenCalledWith('newUser');
  });

  it('should call getFileUserAccess on ngOnInit()', () => {
    component.ngOnInit();
    expect(assignFileService.getFileUserAccess).toHaveBeenCalledWith(5);
  });

  it('should set loading to false after getFileUserAccess on success', () => {
    assignFileService.getFileUserAccess.and.returnValue(of([]));
    component.ngOnInit();
    expect(loadingService.setLoading).toHaveBeenCalledWith(false);
  });

  it('should handle error in getFileUserAccess and show notification', () => {
    const errorResponse = { error: { message: 'Error loading data' } };
    assignFileService.getFileUserAccess.and.returnValue(
      throwError(errorResponse),
    );

    component.ngOnInit();
    expect(snackBarSpy.openFromComponent).toHaveBeenCalled();
    expect(loadingService.setLoading).toHaveBeenCalledWith(false);
  });

  it('should reset allUsers when reset is called', () => {
    component.allUsers = [
      {
        id: '1',
        userName: 'testUser',
        firstName: '',
        lastName: '',
      },
    ];
    component.reset(); // Call the reset method
    expect(component.allUsers.length).toBe(0);
  });

  it('should add user to users list when selected is called', () => {
    const user = { id: '123', userName: 'testUser' };
    const event = {
      option: { value: user, deselect: jasmine.createSpy() },
    } as unknown as MatAutocompleteSelectedEvent;

    component.selected(event);
    expect(component.users.length).toBe(1);
    expect(component.users[0].id).toBe('123');
    expect(event.option.deselect).toHaveBeenCalled();
  });

  it('should not remove a user if it does not exist in the list', () => {
    component.users = [{ id: '123', userName: 'testUser' }];
    component.remove({ id: '999', userName: 'nonExistentUser' });
    expect(component.users.length).toBe(1);
  });
});
