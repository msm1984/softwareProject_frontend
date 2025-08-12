import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssignFileComponent } from './assign-file.component';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { SharedModule } from '../../../../shared/shared.module';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatTableModule } from '@angular/material/table';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

describe('AssignFileComponent', () => {
  let component: AssignFileComponent;
  let fixture: ComponentFixture<AssignFileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AssignFileComponent],
      providers: [provideHttpClient(), provideHttpClientTesting()],
      imports: [
        SharedModule,
        MatPaginatorModule,
        MatTableModule,
        NoopAnimationsModule,
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(AssignFileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
