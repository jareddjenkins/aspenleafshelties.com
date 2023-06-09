import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EnterdogsnavComponent } from './enterdogsnav.component';

describe('EnterdogsnavComponent', () => {
  let component: EnterdogsnavComponent;
  let fixture: ComponentFixture<EnterdogsnavComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
    imports: [EnterdogsnavComponent]
})
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EnterdogsnavComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
