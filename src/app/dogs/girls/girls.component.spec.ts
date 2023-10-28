import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GirlsComponent } from './girls.component';

describe('GirlsComponent', () => {
  let component: GirlsComponent;
  let fixture: ComponentFixture<GirlsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [GirlsComponent]
    });
    fixture = TestBed.createComponent(GirlsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
