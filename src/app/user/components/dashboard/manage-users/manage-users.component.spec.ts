import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageUsersComponent } from './manage-users.component';
import { DashboardHeaderComponent } from '../../../../shared/components/dashboard-header/dashboard-header.component';
import { CardComponent } from '../../../../shared/components/card/card.component';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatTableModule } from '@angular/material/table';
import { RouterModule } from '@angular/router';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ValidationStatusComponent } from '../../../../shared/components/validation-status/validation-status.component';

describe('ManageUsersComponent', () => {
  let component: ManageUsersComponent;
  let fixture: ComponentFixture<ManageUsersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        ManageUsersComponent,
        DashboardHeaderComponent,
        CardComponent,
        ValidationStatusComponent,
      ],
      imports: [
        MatIconModule,
        MatPaginatorModule,
        MatTableModule,
        RouterModule.forRoot([]),
        BrowserAnimationsModule,
      ],
      providers: [provideHttpClient(), provideHttpClientTesting()],
    }).compileComponents();

    fixture = TestBed.createComponent(ManageUsersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
