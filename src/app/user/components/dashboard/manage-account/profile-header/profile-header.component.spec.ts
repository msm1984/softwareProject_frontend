import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfileHeaderComponent } from './profile-header.component';
import { CardComponent } from '../../../../../shared/components/card/card.component';
import { MatIconModule } from '@angular/material/icon';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';

describe('ProfileHeaderComponent', () => {
  let component: ProfileHeaderComponent;
  let fixture: ComponentFixture<ProfileHeaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ProfileHeaderComponent, CardComponent],
      imports: [MatIconModule],
      providers: [provideHttpClient(), provideHttpClientTesting()],
    }).compileComponents();

    fixture = TestBed.createComponent(ProfileHeaderComponent);
    component = fixture.componentInstance;

    component.userInfo = {
      firstName: 'Kevin',
      lastName: 'Smith',
      email: 'kevin.smith@example.com',
      phoneNumber: '+123456789',
      image: 'image.jpg',
    };

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
