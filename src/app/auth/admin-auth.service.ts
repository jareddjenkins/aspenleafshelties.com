import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import {
  Auth,
  GoogleAuthProvider,
  User,
  connectAuthEmulator,
  getAuth,
  signInWithRedirect,
  onAuthStateChanged,
  signInWithPopup,
  signOut,
} from 'firebase/auth';

import { environment } from '../../environments/environment';
import { FirebaseAppService } from '../firebase/firebase-app.service';
import { resolveFirebaseEmulatorHost } from '../firebase/firebase-web-config';

export interface AdminSessionState {
  isReady: boolean;
  user: User | null;
  isSignedIn: boolean;
  isEditor: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class AdminAuthService {
  private static readonly REDIRECT_URL_STORAGE_KEY = 'admin_redirect_url';
  private readonly sessionStateSubject = new BehaviorSubject<AdminSessionState>({
    isReady: false,
    user: null,
    isSignedIn: false,
    isEditor: false,
  });
  private readonly provider = new GoogleAuthProvider();
  private readonly auth = this.createAuth();
  private readonly readyPromise = this.initializeAuthState();

  readonly sessionState$: Observable<AdminSessionState> = this.sessionStateSubject.asObservable();
  readonly isEditor$: Observable<boolean> = this.sessionState$.pipe(map((state) => state.isEditor));

  constructor(
    private firebaseAppService: FirebaseAppService,
    private router: Router,
  ) {
    this.provider.setCustomParameters({
      prompt: 'select_account',
    });
  }

  async signInWithGoogle(redirectUrl?: string | null): Promise<void> {
    if (!this.auth) {
      throw new Error('Firebase Auth is not configured.');
    }

    this.storePendingRedirectUrl(redirectUrl);

    if (this.shouldUseRedirectSignIn()) {
      await signInWithRedirect(this.auth, this.provider);
      return;
    }

    await signInWithPopup(this.auth, this.provider);
    await this.waitUntilReady();
    await this.navigateToPendingRedirectUrl();
  }

  async signOut(): Promise<void> {
    if (!this.auth) {
      return;
    }

    await signOut(this.auth);
    await this.router.navigate(['/admin']);
  }

  async waitUntilReady(): Promise<AdminSessionState> {
    await this.readyPromise;
    return this.sessionStateSubject.value;
  }

  async canEdit(): Promise<boolean> {
    const state = await this.waitUntilReady();
    return state.isEditor;
  }

  private createAuth(): Auth | null {
    const app = this.firebaseAppService.getApp();
    if (!app) {
      return null;
    }

    const auth = getAuth(app);
    const emulatorConfig = environment.firebaseEmulators?.auth;
    if (emulatorConfig) {
      connectAuthEmulator(auth, `http://${resolveFirebaseEmulatorHost(emulatorConfig.host)}:${emulatorConfig.port}`, {
        disableWarnings: true,
      });
    }

    return auth;
  }

  private async initializeAuthState(): Promise<void> {
    if (!this.auth) {
      this.sessionStateSubject.next({
        isReady: true,
        user: null,
        isSignedIn: false,
        isEditor: false,
      });
      return;
    }

    await new Promise<void>((resolve) => {
      let resolved = false;

      onAuthStateChanged(this.auth!, (user) => {
        this.sessionStateSubject.next(this.buildSessionState(user));
        if (!resolved) {
          void this.navigateToPendingRedirectUrl();
          resolved = true;
          resolve();
        }
      });
    });
  }

  private buildSessionState(user: User | null): AdminSessionState {
    const email = user?.email?.trim().toLowerCase() ?? null;
    const editorEmails = environment.editorEmails.map((value) => value.trim().toLowerCase());
    const isEditor = !!email && editorEmails.includes(email);

    return {
      isReady: true,
      user,
      isSignedIn: !!user,
      isEditor,
    };
  }

  private shouldUseRedirectSignIn(): boolean {
    if (typeof window === 'undefined') {
      return false;
    }

    const userAgent = window.navigator.userAgent.toLowerCase();
    return /android|iphone|ipad|ipod|mobile/.test(userAgent);
  }

  private storePendingRedirectUrl(redirectUrl?: string | null): void {
    if (typeof window === 'undefined') {
      return;
    }

    const normalizedRedirectUrl = redirectUrl?.trim();
    if (!normalizedRedirectUrl) {
      sessionStorage.removeItem(AdminAuthService.REDIRECT_URL_STORAGE_KEY);
      return;
    }

    sessionStorage.setItem(AdminAuthService.REDIRECT_URL_STORAGE_KEY, normalizedRedirectUrl);
  }

  private async navigateToPendingRedirectUrl(): Promise<void> {
    if (typeof window === 'undefined') {
      return;
    }

    const redirectUrl = sessionStorage.getItem(AdminAuthService.REDIRECT_URL_STORAGE_KEY);
    if (!redirectUrl || !this.sessionStateSubject.value.isEditor) {
      return;
    }

    sessionStorage.removeItem(AdminAuthService.REDIRECT_URL_STORAGE_KEY);
    await this.router.navigateByUrl(redirectUrl);
  }
}
