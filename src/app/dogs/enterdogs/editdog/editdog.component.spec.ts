import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditdogComponent } from './editdog.component';

describe('EditdogComponent', () => {
  let component: EditdogComponent;
  let fixture: ComponentFixture<EditdogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [EditdogComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditdogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
