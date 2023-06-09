import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AvailableComponent } from './available.component';

describe('AvailableComponent', () => {
  let component: AvailableComponent;
  let fixture: ComponentFixture<AvailableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
    imports: [AvailableComponent]
})
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AvailableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
