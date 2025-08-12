import { ComponentFixture, TestBed } from '@angular/core/testing';

import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatRadioModule } from '@angular/material/radio';
import { EditUserComponent } from './edit-user.component';
import { ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

describe('EditUserComponent', () => {
  let component: EditUserComponent;
  let fixture: ComponentFixture<EditUserComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [EditUserComponent],
      imports: [
        MatFormFieldModule,
        MatRadioModule,
        ReactiveFormsModule,
        MatInputModule,
        BrowserAnimationsModule,
      ],
      providers: [
        {
          provide: MAT_DIALOG_DATA,
          useValue: {
            user: {
              guid: '12345',
              firstName: 'John',
              lastName: 'Doe',
              userName: 'johndoe',
              email: 'john.doe@example.com',
              phoneNumber: '1234567890',
              roleName: 'admin',
            },
            pagSize: 10,
            pageIndex: 1,
          },
        },
        { provide: MatDialogRef, useValue: {} },
        provideHttpClient(),
        provideHttpClientTesting(),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(EditUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
