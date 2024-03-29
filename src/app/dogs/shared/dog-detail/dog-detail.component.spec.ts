import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DogDetailComponent } from './dog-detail.component';

describe('DogDetailComponent', () => {
  let component: DogDetailComponent;
  let fixture: ComponentFixture<DogDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [DogDetailComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DogDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
