import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';

import { AdminAuthService, AdminSessionState } from '../../auth/admin-auth.service';
import { AdminHeaderService, AdminHeaderState } from './admin-header.service';

@Component({
    selector: 'app-admin',
    templateUrl: './admin.component.html',
    styleUrls: ['./admin.component.css'],
    standalone: false
})
export class AdminComponent {
  readonly sessionState$: Observable<AdminSessionState>;
  readonly headerState$: Observable<AdminHeaderState | null>;
  errorMessage = '';

  constructor(
    private adminAuthService: AdminAuthService,
    private adminHeaderService: AdminHeaderService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
  ) {
    this.sessionState$ = this.adminAuthService.sessionState$;
    this.headerState$ = this.adminHeaderService.state$;
  }

  async signIn(): Promise<void> {
    this.errorMessage = '';

    try {
      const redirectUrl = this.activatedRoute.snapshot.queryParamMap.get('redirect');
      await this.adminAuthService.signInWithGoogle(redirectUrl);

      if (this.activatedRoute.snapshot.queryParamMap.has('redirect')) {
        await this.router.navigate([], {
          relativeTo: this.activatedRoute,
          queryParams: { redirect: null },
          queryParamsHandling: 'merge',
          replaceUrl: true,
        });
      }
    } catch (error) {
      this.errorMessage = error instanceof Error ? error.message : 'Unable to sign in.';
    }
  }

  async signOut(): Promise<void> {
    this.errorMessage = '';

    try {
      await this.adminAuthService.signOut();
    } catch (error) {
      this.errorMessage = error instanceof Error ? error.message : 'Unable to sign out.';
    }
  }

  async goToDogList(): Promise<void> {
    await this.router.navigate(['/admin']);
  }

  get showDogList(): boolean {
    return !this.hasChildRouteActive();
  }

  get showChildOutlet(): boolean {
    return this.hasChildRouteActive();
  }

  get hasActiveChildRoute(): boolean {
    return this.hasChildRouteActive();
  }

  private hasChildRouteActive(): boolean {
    return this.router.url.split('?')[0] !== '/admin';
  }
}
