import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BoysComponent } from './boys.component';

describe('BoysComponent', () => {
  let component: BoysComponent;
  let fixture: ComponentFixture<BoysComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [BoysComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BoysComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
