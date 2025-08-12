import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterModule } from '@angular/router';
import { AppComponent } from './app.component';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { LoadingService } from './shared/services/loading.service';

describe('AppComponent', () => {
  let component: AppComponent;
  let fixture: ComponentFixture<AppComponent>;
  let loadingService: LoadingService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RouterModule.forRoot([]), MatProgressBarModule],
      declarations: [AppComponent],
      providers: [LoadingService],
    }).compileComponents();
    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
    loadingService = TestBed.inject(LoadingService);
  });

  it('should create the app', () => {
    expect(component).toBeTruthy();
  });

  it('should initially display no loading', () => {
    fixture.detectChanges();
    expect(component.displayLoading).toBe('none');
  });

  it('should subscribe to loading$ and update displayLoading', () => {
    // Arrange
    const expectedDisplayLoading = 'block';

    // Act
    loadingService.setLoading(true);
    fixture.detectChanges();

    // Assert
    expect(component.displayLoading).toBe(expectedDisplayLoading);
  });
});
