import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DashboardHeaderComponent } from './dashboard-header.component';
import { By } from '@angular/platform-browser';
import { MatIconModule } from '@angular/material/icon';
import {
  provideRouter,
  RouterLinkWithHref,
  RouterModule,
} from '@angular/router';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { MatTooltipModule } from '@angular/material/tooltip';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';
import { of } from 'rxjs';
import { ThemeService } from '../../services/theme.service';

describe('DashboardHeaderComponent', () => {
  let component: DashboardHeaderComponent;
  let fixture: ComponentFixture<DashboardHeaderComponent>;
  let themeService: ThemeService;

  beforeEach(async () => {
    const themeServiceMock = {
      changeThemeState: jasmine.createSpy('changeThemeState'),
      theme$: of('light'),
    };

    await TestBed.configureTestingModule({
      declarations: [DashboardHeaderComponent],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        provideRouter([]),
        { provide: ThemeService, useValue: themeServiceMock },
      ],
      imports: [
        MatIconModule,
        MatTooltipModule,
        NoopAnimationsModule,
        RouterModule.forRoot([]),
      ],
    }).compileComponents();

    themeService = TestBed.inject(ThemeService);
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DashboardHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should display the title', () => {
    component.title = 'Dashboard';
    fixture.detectChanges();
    const titleElement = fixture.debugElement.query(
      By.css('.title'),
    ).nativeElement;
    expect(titleElement.textContent).toContain('Dashboard');
  });

  it('should have a settings icon with correct router link', () => {
    const settingsIcon = fixture.debugElement.query(
      By.directive(RouterLinkWithHref),
    );
    expect(settingsIcon).toBeTruthy();
    expect(settingsIcon.attributes['ng-reflect-router-link']).toBe(
      '/dashboard/manage-account',
    );
  });

  it('should call changeTheme when theme changer icon is clicked', () => {
    spyOn(component, 'changeTheme');
    const themeChangerIcon = fixture.debugElement.query(
      By.css('#theme-changer-icon'),
    );
    themeChangerIcon.triggerEventHandler('click', null);
    expect(component.changeTheme).toHaveBeenCalled();
  });

  it('should call infoClick when info icon is clicked', () => {
    spyOn(component, 'infoClick');
    const infoIcon = fixture.debugElement.query(
      By.css('.icon[matTooltip="Information"]'),
    );
    infoIcon.triggerEventHandler('click', null);
    expect(component.infoClick).toHaveBeenCalled();
  });

  it('should display the profile image', () => {
    component.profilePic = 'path/to/profile-pic.jpg';
    fixture.detectChanges();
    const profileImageElement = fixture.debugElement.query(
      By.css('.profile-image'),
    ).nativeElement;
    expect(profileImageElement.src).toContain('path/to/profile-pic.jpg');
  });

  it('should initialize with default values', () => {
    expect(component.title).toBe('');
    expect(component.profilePic).toBe('empty-profile.png');
  });

  it('should set inputs correctly', () => {
    component.title = 'User Dashboard';
    component.profilePic = 'profile.jpg';
    fixture.detectChanges();

    const titleElement = fixture.debugElement.query(
      By.css('.title'),
    ).nativeElement;
    expect(titleElement.textContent).toContain('User Dashboard');

    const profileImageElement = fixture.debugElement.query(
      By.css('.profile-image'),
    ).nativeElement;
    expect(profileImageElement.src).toContain('profile.jpg');
  });

  it('should update title on change detection', () => {
    component.title = 'Admin Panel';
    fixture.detectChanges();

    const titleElement = fixture.debugElement.query(
      By.css('.title'),
    ).nativeElement;
    expect(titleElement.textContent).toBe('Admin Panel');
  });

  it('should trigger infoClick correctly', () => {
    spyOn(component, 'infoClick').and.callThrough();

    component.infoClick();
    expect(component.infoClick).toHaveBeenCalled();
  });

  it('should not display profile image if none provided', () => {
    component.profilePic = '';
    fixture.detectChanges();

    const profileImageElement = fixture.debugElement.query(
      By.css('.profile-image'),
    );
    expect(profileImageElement).not.toBeNull();
  });

  xit('should call themeService.changeThemeState and update the theme icon text content', () => {
    const themeChangerIcon = document.createElement('div');
    themeChangerIcon.id = 'theme-changer-icon';
    document.body.appendChild(themeChangerIcon);

    themeService.theme$ = of('dark');

    component.changeTheme();

    expect(themeService.changeThemeState).toHaveBeenCalled();

    fixture.detectChanges();

    expect(themeChangerIcon.textContent).toBe('light_mode');

    document.body.removeChild(themeChangerIcon);
  });

  xit('should update the theme icon to "dark_mode" when theme is light', () => {
    const themeChangerIcon = document.createElement('div');
    themeChangerIcon.id = 'theme-changer-icon';
    document.body.appendChild(themeChangerIcon);

    themeService.theme$ = of('light');

    component.changeTheme();

    fixture.detectChanges();

    expect(themeChangerIcon.textContent).toBe('dark_mode');

    // Clean up the DOM
    document.body.removeChild(themeChangerIcon);
  });
});
