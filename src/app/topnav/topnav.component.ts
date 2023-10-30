import { Component } from '@angular/core';

@Component({
  selector: 'app-topnav',
  templateUrl: './topnav.component.html',
  styleUrls: ['./topnav.component.css'],
})
export class TopnavComponent {
  isNavbarCollapsed = true;

  toggleMenu() {
    this.isNavbarCollapsed = !this.isNavbarCollapsed;
  }
}
