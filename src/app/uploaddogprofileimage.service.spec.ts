import { TestBed, inject } from '@angular/core/testing';

import { UploaddogprofileimageService } from './uploaddogprofileimage.service';

describe('UploaddogprofileimageService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [UploaddogprofileimageService]
    });
  });

  it('should be created', inject([UploaddogprofileimageService], (service: UploaddogprofileimageService) => {
    expect(service).toBeTruthy();
  }));
});
