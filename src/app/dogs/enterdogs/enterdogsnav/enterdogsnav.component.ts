import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-enterdogsnav',
  templateUrl: './enterdogsnav.component.html',
  styleUrls: ['./enterdogsnav.component.css'],
})
export class EnterdogsnavComponent {
  isNavbarCollapsed = true;

  toggleMenu() {
    this.isNavbarCollapsed = !this.isNavbarCollapsed;
  }
}
