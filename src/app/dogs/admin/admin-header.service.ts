import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export type AdminHeaderBanner = {
  label: string;
  message: string;
  tone: 'info' | 'success' | 'warning' | 'error';
};

export type AdminHeaderAction = {
  label: string;
  pendingLabel?: string;
  disabled?: boolean;
  busy?: boolean;
  handler: () => void;
};

export type AdminHeaderState = {
  actions: AdminHeaderAction[];
  banners: AdminHeaderBanner[];
};

@Injectable({ providedIn: 'root' })
export class AdminHeaderService {
  private readonly stateSubject = new BehaviorSubject<AdminHeaderState | null>(null);

  readonly state$ = this.stateSubject.asObservable();

  setState(state: AdminHeaderState): void {
    this.stateSubject.next(state);
  }

  clear(): void {
    this.stateSubject.next(null);
  }
}
