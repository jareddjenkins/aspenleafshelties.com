import { TestBed } from '@angular/core/testing';

import { DogService } from './dog.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { Dog } from './model';

describe('DogService', () => {
  let service: DogService;
  let httpMock: HttpTestingController

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [DogService]
    });
    service = TestBed.inject(DogService);
    httpMock = TestBed.inject(HttpTestingController)
  });

  afterEach(() => {
    httpMock.verify()
  })

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should retrive dog data', () => {
    const dogs: Dog[] = [{
      id: 1,
      cname: "Dog Common Name",
      rname: "Registered Name",
      comments: "Some test about the dog",
      damId: 2,
      damName: "Dam Name",
      sireId: 3,
      sireName: "Sire Name",
      profileImageUrl: "http://fakeurl",
      dob: new Date(),
      gender: true
    }] 
    service.fetchDogs()
    service.getDogs().subscribe(dogs => {

    })
  })
})
