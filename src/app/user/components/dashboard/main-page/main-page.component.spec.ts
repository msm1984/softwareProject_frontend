import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MainPageComponent } from './main-page.component';
import { CardComponent } from '../../../../shared/components/card/card.component';
import { DashboardHeaderComponent } from '../../../../shared/components/dashboard-header/dashboard-header.component';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';

describe('MainPageComponent', () => {
  let component: MainPageComponent;
  let fixture: ComponentFixture<MainPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        MainPageComponent,
        CardComponent,
        DashboardHeaderComponent,
      ],
      imports: [MatIconModule, RouterModule.forRoot([])],
      providers: [provideHttpClient(), provideHttpClientTesting()],
    }).compileComponents();

    fixture = TestBed.createComponent(MainPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
