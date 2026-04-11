import { Component, ElementRef, HostListener } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatSidenavModule } from '@angular/material/sidenav';

@Component({
  selector: 'app-topnav',
  templateUrl: './topnav.component.html',
  styleUrls: ['./topnav.component.css'],
  imports: [
    RouterLink,
    RouterLinkActive,
    MatButtonModule,
    MatDividerModule,
    MatIconModule,
    MatSidenavModule,
  ],
  standalone: true,
})
export class TopnavComponent {
  isMobileMenuOpen = false;
  isDogsMenuOpen = false;
  readonly primaryRoute = { label: 'Available', path: '/dogs/available' };
  readonly secondaryRoutes = [
    { label: 'Getting a Sheltie', path: '/dogs/getting-a-sheltie' },
    { label: 'FAQ', path: '/dogs/faq' },
    { label: 'About', path: '/about' },
    { label: 'Resources', path: '/resources' },
  ];
  readonly dogRoutes = [
    { label: 'Boys', path: '/dogs/boys' },
    { label: 'Girls', path: '/dogs/girls' },
  ];

  constructor(
    private router: Router,
    private elementRef: ElementRef<HTMLElement>,
  ) {}

  @HostListener('window:resize')
  onWindowResize(): void {
    if (typeof window !== 'undefined' && window.innerWidth > 900) {
      this.closeMenus();
    }
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    const target = event.target;
    if (!(target instanceof Node)) {
      return;
    }

    if (!this.elementRef.nativeElement.contains(target)) {
      this.closeMenus();
    }
  }

  @HostListener('document:keydown.escape')
  onEscapeKey(): void {
    this.closeMenus();
  }

  toggleMobileMenu(): void {
    this.isMobileMenuOpen = !this.isMobileMenuOpen;
    this.isDogsMenuOpen = false;
  }

  toggleDogsMenu(): void {
    this.isDogsMenuOpen = !this.isDogsMenuOpen;
  }

  closeMenus(): void {
    this.isMobileMenuOpen = false;
    this.isDogsMenuOpen = false;
  }

  get isDogsSectionActive(): boolean {
    const currentPath = this.router.url.split('?')[0];
    return currentPath === '/dogs/boys' || currentPath === '/dogs/girls';
  }
}
