import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecoverPassFormComponent } from './recover-pass-form.component';
import { FormsModule } from '@angular/forms';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';

describe('RecoverPassFormComponent', () => {
  let component: RecoverPassFormComponent;
  let fixture: ComponentFixture<RecoverPassFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RecoverPassFormComponent],
      imports: [
        FormsModule,
        MatCheckboxModule,
        MatIconModule,
        MatFormFieldModule,
        MatInputModule,
        MatButtonModule,
        BrowserAnimationsModule,
      ],
      providers: [provideHttpClient(), provideHttpClientTesting()],
    }).compileComponents();

    fixture = TestBed.createComponent(RecoverPassFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
