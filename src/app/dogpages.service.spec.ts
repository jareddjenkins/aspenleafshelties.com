import { TestBed, inject } from '@angular/core/testing';

import { DogpagesService } from './dogpages.service';

describe('DogpagesService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [DogpagesService]
    });
  });

  it('should be created', inject([DogpagesService], (service: DogpagesService) => {
    expect(service).toBeTruthy();
  }));
});
