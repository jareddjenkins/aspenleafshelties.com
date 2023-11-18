import { TestBed } from '@angular/core/testing';

import { DogsInterceptorService } from './dogs-interceptor.service';

describe('DogsInterceptorService', () => {
  let service: DogsInterceptorService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DogsInterceptorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
