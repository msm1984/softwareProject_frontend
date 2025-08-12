import { TestBed } from '@angular/core/testing';
import { AssignFileService } from './assign-file.service';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';

describe('AssignFileService', () => {
  let service: AssignFileService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    service = TestBed.inject(AssignFileService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
