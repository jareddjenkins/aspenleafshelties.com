import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListdogsComponent } from './listdogs.component';
import { nameContainsPipe } from '../../namesearch.pipes';

describe('ListdogsComponent', () => {
  let component: ListdogsComponent;
  let fixture: ComponentFixture<ListdogsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [ListdogsComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListdogsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
