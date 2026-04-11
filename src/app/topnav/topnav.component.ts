import { Component, ElementRef, HostListener } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatToolbarModule } from '@angular/material/toolbar';

@Component({
  selector: 'app-topnav',
  templateUrl: './topnav.component.html',
  styleUrls: ['./topnav.component.css'],
  imports: [RouterLink, RouterLinkActive, MatButtonModule, MatIconModule, MatListModule, MatToolbarModule],
  standalone: true,
})
export class TopnavComponent {
  readonly primaryRoute = { label: 'Available', path: '/available' };
  readonly ourSheltiesRoute = { label: 'Our Shelties', path: '/our-shelties' };
  readonly secondaryRoutes = [
    { label: 'Puppy Process', path: '/getting-a-sheltie' },
    { label: 'FAQ', path: '/faq' },
    { label: 'About', path: '/about' },
  ];
  readonly navRoutes = [this.primaryRoute, this.ourSheltiesRoute, ...this.secondaryRoutes];

  isMobileMenuOpen = false;

  constructor(private elementRef: ElementRef<HTMLElement>) {}

  @HostListener('window:resize')
  onWindowResize(): void {
    if (typeof window !== 'undefined' && window.innerWidth > 900) {
      this.closeMobileMenu();
    }
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    const target = event.target;
    if (!(target instanceof Node)) {
      return;
    }

    if (!this.elementRef.nativeElement.contains(target)) {
      this.closeMobileMenu();
    }
  }

  @HostListener('document:keydown.escape')
  onEscapeKey(): void {
    this.closeMobileMenu();
  }

  toggleMobileMenu(): void {
    this.isMobileMenuOpen = !this.isMobileMenuOpen;
  }

  closeMobileMenu(): void {
    this.isMobileMenuOpen = false;
  }
}
