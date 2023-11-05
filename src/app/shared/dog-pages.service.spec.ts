import { TestBed } from '@angular/core/testing';

import { DogPagesService } from './dog-pages.service';

describe('DogPagesService', () => {
  let service: DogPagesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DogPagesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
