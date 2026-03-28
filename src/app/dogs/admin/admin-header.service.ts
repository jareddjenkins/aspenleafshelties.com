import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export type AdminHeaderBanner = {
  label: string;
  message: string;
  tone: 'info' | 'success' | 'warning' | 'error';
};

export type AdminHeaderState = {
  title: string;
  subtitle: string;
  primaryActionLabel?: string;
  primaryActionPendingLabel?: string;
  primaryActionDisabled?: boolean;
  primaryActionBusy?: boolean;
  primaryAction?: () => void;
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
