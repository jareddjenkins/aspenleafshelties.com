import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { AsyncPipe } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatToolbarModule } from '@angular/material/toolbar';
import { RouterLink, RouterOutlet } from '@angular/router';
import { Observable, Subscription, filter } from 'rxjs';

import { AdminAuthService, AdminSessionState } from '../../auth/admin-auth.service';
import { AdminHeaderService, AdminHeaderState } from './admin-header.service';
import { ListdogsComponent } from './listdogs/listdogs.component';

type AdminNavItem = 'dogs' | 'pages' | 'create';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css'],
  imports: [
    AsyncPipe,
    ListdogsComponent,
    MatButtonModule,
    MatCardModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatToolbarModule,
    RouterLink,
    RouterOutlet,
  ],
  standalone: true,
})
export class AdminComponent implements OnInit, OnDestroy {
  private readonly mobileNavMediaQueryString = '(max-width: 960px)';
  private mobileNavMediaQuery: MediaQueryList | null = null;
  private readonly mobileNavMediaQueryListener = (event: MediaQueryListEvent) => this.applyMobileNavViewport(event.matches);
  private routerEventsSubscription: Subscription | null = null;
  readonly sessionState$: Observable<AdminSessionState>;
  readonly headerState$: Observable<AdminHeaderState | null>;
  errorMessage = '';
  isMobileNavViewport = false;
  isMobileNavExpanded = false;

  constructor(
    private adminAuthService: AdminAuthService,
    private adminHeaderService: AdminHeaderService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
  ) {
    this.sessionState$ = this.adminAuthService.sessionState$;
    this.headerState$ = this.adminHeaderService.state$;
  }

  ngOnInit(): void {
    this.initializeMobileNavViewport();
    this.routerEventsSubscription = this.router.events
      .pipe(filter((event): event is NavigationEnd => event instanceof NavigationEnd))
      .subscribe(() => this.syncMobileNavExpansion());
    this.syncMobileNavExpansion();
  }

  ngOnDestroy(): void {
    this.destroyMobileNavViewport();
    this.routerEventsSubscription?.unsubscribe();
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

  toggleMobileNavPanel(): void {
    if (!this.isMobileNavViewport) {
      return;
    }

    this.isMobileNavExpanded = !this.isMobileNavExpanded;
  }

  closeMobileNavPanel(): void {
    if (!this.isMobileNavViewport) {
      return;
    }

    this.isMobileNavExpanded = false;
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

  get showMobileNavPanel(): boolean {
    return this.isMobileNavViewport && this.isMobileNavExpanded;
  }

  get currentSectionLabel(): string {
    const currentPath = this.currentPath;

    if (currentPath === '/admin/pages') {
      return 'Edit Pages';
    }

    if (currentPath === '/admin/editdog/new') {
      return 'Create Dog Record';
    }

    if (currentPath.startsWith('/admin/editdog/')) {
      return 'Edit Dog';
    }

    return 'Dog List';
  }

  isNavItemActive(navItem: AdminNavItem): boolean {
    const currentPath = this.currentPath;

    switch (navItem) {
      case 'dogs':
        return currentPath === '/admin' || (currentPath.startsWith('/admin/editdog/') && currentPath !== '/admin/editdog/new');
      case 'pages':
        return currentPath === '/admin/pages';
      case 'create':
        return currentPath === '/admin/editdog/new';
      default:
        return false;
    }
  }

  private hasChildRouteActive(): boolean {
    return this.currentPath !== '/admin';
  }

  private get currentPath(): string {
    return this.router.url.split('?')[0];
  }

  private initializeMobileNavViewport(): void {
    if (typeof window === 'undefined') {
      return;
    }

    this.mobileNavMediaQuery = window.matchMedia(this.mobileNavMediaQueryString);
    this.applyMobileNavViewport(this.mobileNavMediaQuery.matches);

    if (typeof this.mobileNavMediaQuery.addEventListener === 'function') {
      this.mobileNavMediaQuery.addEventListener('change', this.mobileNavMediaQueryListener);
      return;
    }

    this.mobileNavMediaQuery.addListener(this.mobileNavMediaQueryListener);
  }

  private destroyMobileNavViewport(): void {
    if (!this.mobileNavMediaQuery) {
      return;
    }

    if (typeof this.mobileNavMediaQuery.removeEventListener === 'function') {
      this.mobileNavMediaQuery.removeEventListener('change', this.mobileNavMediaQueryListener);
      return;
    }

    this.mobileNavMediaQuery.removeListener(this.mobileNavMediaQueryListener);
  }

  private applyMobileNavViewport(isMobileViewport: boolean): void {
    this.isMobileNavViewport = isMobileViewport;
    this.syncMobileNavExpansion();
  }

  private syncMobileNavExpansion(): void {
    if (!this.isMobileNavViewport) {
      this.isMobileNavExpanded = false;
      return;
    }

    this.isMobileNavExpanded = this.currentPath === '/admin';
  }
}
