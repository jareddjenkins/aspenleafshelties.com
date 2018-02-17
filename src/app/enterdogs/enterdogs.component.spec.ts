import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EnterdogsComponent } from './enterdogs.component';

describe('EnterdogsComponent', () => {
  let component: EnterdogsComponent;
  let fixture: ComponentFixture<EnterdogsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EnterdogsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EnterdogsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
