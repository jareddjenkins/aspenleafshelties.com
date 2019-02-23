import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditpagesComponent } from './editpages.component';

describe('EditpagesComponent', () => {
  let component: EditpagesComponent;
  let fixture: ComponentFixture<EditpagesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditpagesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditpagesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
