import { CommonModule } from '@angular/common';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { MatTabsModule } from '@angular/material/tabs';

import { AvailableComponent } from './available.component';
import { DogsComponent } from '../dogs.component';

describe('AvailableComponent', () => {
  let component: AvailableComponent;
  let fixture: ComponentFixture<AvailableComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [AvailableComponent, DogsComponent],
      imports: [CommonModule, RouterTestingModule, MatTabsModule, NoopAnimationsModule],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              data: {
                showPuppies: [],
                companionPuppies: [],
                adults: [],
              },
            },
          },
        },
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AvailableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should default to the first tab and create three tab groups', () => {
    expect(component.selectedIndex).toBe(0);
    expect(component.tabs.map((tab) => tab.status)).toEqual([
      'showavailable',
      'available',
      'adultavailable',
    ]);
  });
});
