import { Component } from '@angular/core';

@Component({
    selector: 'app-topnav',
    templateUrl: './topnav.component.html',
    styleUrls: ['./topnav.component.css'],
    standalone: false
})
export class TopnavComponent {
  isNavbarCollapsed = true;
  readonly routes = [
    { label: 'About', path: '/about' },
    { label: 'Boys', path: '/dogs/boys' },
    { label: 'Girls', path: '/dogs/girls' },
    { label: 'Puppies', path: '/dogs/puppies' },
    { label: 'Contact', path: '/contact' },
    { label: 'Resources', path: '/resources' },
  ];

  toggleMenu() {
    this.isNavbarCollapsed = !this.isNavbarCollapsed;
  }
}
