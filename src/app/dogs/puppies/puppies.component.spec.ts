import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PuppiesComponent } from './puppies.component';

describe('PuppiesComponent', () => {
  let component: PuppiesComponent;
  let fixture: ComponentFixture<PuppiesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PuppiesComponent]
    });
    fixture = TestBed.createComponent(PuppiesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
